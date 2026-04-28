import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import { leads } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { analyzeLead } from "./leadAnalysis";
import { sendLeadEmail, sendAutoReply } from "./email";
import { TRPCError } from "@trpc/server";
import { sendTikTokEvent } from "./tiktok";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Lead submission router
  leads: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(255),
          phone: z.string().min(10, "Введите корректный номер телефона").max(50),
          whatsapp: z.string().max(50).optional(),
          email: z.string().email("Введите корректный email").max(320).optional(),
          equipmentType: z.string().max(100).optional(),
          component: z.string().max(100).optional(),
          symptoms: z.string().max(5000).optional(),
          comment: z.string().max(5000).optional(),
          formType: z.enum(["b2b", "call_specialist", "calculator"]),
          sourcePage: z.string().max(500),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          // Get client IP and user agent
          const ipAddress =
            (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
            ctx.req.socket.remoteAddress ||
            "unknown";
          const userAgent = ctx.req.headers["user-agent"] || "unknown";

          // Sanitize input (basic XSS prevention)
          const sanitize = (str: string | undefined) =>
            str
              ?.replace(/<script[^>]*>.*?<\/script>/gi, "")
              .replace(/<[^>]+>/g, "")
              .trim();

          const sanitizedData = {
            name: sanitize(input.name) || "",
            phone: sanitize(input.phone) || "",
            whatsapp: input.whatsapp ? sanitize(input.whatsapp) : undefined,
            email: input.email ? sanitize(input.email) : undefined,
            equipmentType: input.equipmentType
              ? sanitize(input.equipmentType)
              : undefined,
            component: input.component ? sanitize(input.component) : undefined,
            symptoms: input.symptoms ? sanitize(input.symptoms) : undefined,
            comment: input.comment ? sanitize(input.comment) : undefined,
            formType: input.formType,
            sourcePage: sanitize(input.sourcePage) || "",
            ipAddress,
            userAgent,
          };

          // AI analysis for priority and summary
          console.log("[Lead] Analyzing lead with AI...");
          const analysis = await analyzeLead(sanitizedData);
          console.log("[Lead] AI Analysis result:", analysis);

          // Get database connection
          const db = await getDb();
          if (!db) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "База данных недоступна",
            });
          }

          // Save to database
          console.log("[Lead] Saving to database...");
          const [lead] = await db
            .insert(leads)
            .values({
              ...sanitizedData,
              priority: analysis.priority,
              status: analysis.status,
              aiSummary: analysis.aiSummary,
              emailSent: 0,
            })
            .$returningId();

          console.log("[Lead] Saved to database with ID:", lead.id);

          // Get full lead data for emails
          const [fullLead] = await db
            .select()
            .from(leads)
            .where(eq(leads.id, lead.id))
            .limit(1);

          // Send notification email
          console.log("[Lead] Sending notification email...");
          const emailSent = await sendLeadEmail(fullLead);

          // Send auto-reply if email provided
          if (fullLead.email) {
            console.log("[Lead] Sending auto-reply...");
            await sendAutoReply(fullLead);
          }

          // Update emailSent status
          if (emailSent) {
            await db
              .update(leads)
              .set({ emailSent: 1 })
              .where(eq(leads.id, lead.id));
            console.log("[Lead] Email status updated");
          }

          console.log("[Lead] Processing complete!");

          // Fire TikTok Events API: SubmitForm
          sendTikTokEvent({
            eventType: "SubmitForm",
            pageUrl: sanitizedData.sourcePage,
            userAgent: sanitizedData.userAgent,
            ip: sanitizedData.ipAddress,
            email: sanitizedData.email,
            phone: sanitizedData.phone,
          }).catch((err) => console.error("[TikTok] SubmitForm event failed:", err));

          return {
            success: true,
            leadId: lead.id,
            priority: analysis.priority,
            status: analysis.status,
          };
        } catch (error) {
          console.error("[Lead] Error processing lead:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Не удалось обработать заявку. Пожалуйста, попробуйте позже.",
          });
        }
      }),
  }),

  // TikTok Events API router
  tiktok: router({
    pageView: publicProcedure
      .input(
        z.object({
          pageUrl: z.string().max(500),
          ttclid: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const ip =
          (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
          ctx.req.socket.remoteAddress ||
          undefined;
        const userAgent = ctx.req.headers["user-agent"] || undefined;
        await sendTikTokEvent({
          eventType: "PageView",
          pageUrl: input.pageUrl,
          userAgent,
          ip,
          ttclid: input.ttclid,
        });
        return { success: true };
      }),

    contact: publicProcedure
      .input(
        z.object({
          pageUrl: z.string().max(500),
          contactType: z.enum(["whatsapp", "phone", "telegram"]),
          ttclid: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const ip =
          (ctx.req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
          ctx.req.socket.remoteAddress ||
          undefined;
        const userAgent = ctx.req.headers["user-agent"] || undefined;
        await sendTikTokEvent({
          eventType: "Contact",
          pageUrl: input.pageUrl,
          userAgent,
          ip,
          ttclid: input.ttclid,
        });
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
