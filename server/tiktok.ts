import crypto from "crypto";

const TIKTOK_PIXEL_ID = process.env.TIKTOK_PIXEL_ID || "D6M5H3JC77U9JTU04Q60";
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || "";
const TIKTOK_API_URL = `https://business-api.tiktok.com/open_api/v1.3/event/track/`;

export type TikTokEventType =
  | "PageView"
  | "Contact"
  | "SubmitForm"
  | "ViewContent"
  | "Search";

interface TikTokEventParams {
  eventType: TikTokEventType;
  eventId?: string;
  pageUrl?: string;
  userAgent?: string;
  ip?: string;
  email?: string;
  phone?: string;
  ttclid?: string;
}

function hashValue(value: string): string {
  return crypto.createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export async function sendTikTokEvent(params: TikTokEventParams): Promise<boolean> {
  try {
    const eventId = params.eventId || crypto.randomUUID();
    const timestamp = Math.floor(Date.now() / 1000);

    // Build user properties (hashed for privacy)
    const userProperties: Record<string, string> = {};
    if (params.ip) userProperties.ip = params.ip;
    if (params.userAgent) userProperties.user_agent = params.userAgent;
    if (params.email) userProperties.email = hashValue(params.email);
    if (params.phone) {
      // Normalize phone: remove spaces, dashes, parentheses
      const normalizedPhone = params.phone.replace(/[\s\-\(\)]/g, "");
      userProperties.phone_number = hashValue(normalizedPhone);
    }
    if (params.ttclid) userProperties.ttclid = params.ttclid;

    const payload = {
      pixel_code: TIKTOK_PIXEL_ID,
      event_source: "web",
      event_source_id: TIKTOK_PIXEL_ID,
      data: [
        {
          event: params.eventType,
          event_id: eventId,
          event_time: timestamp,
          user: userProperties,
          page: {
            url: params.pageUrl || "https://acahydraulic.kz/",
          },
          properties: {
            currency: "KZT",
          },
        },
      ],
    };

    const response = await fetch(TIKTOK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Token": TIKTOK_ACCESS_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json() as { code: number; message: string };
    
    if (result.code === 0) {
      console.log(`[TikTok Events API] ${params.eventType} sent successfully`);
      return true;
    } else {
      console.error(`[TikTok Events API] Error:`, result);
      return false;
    }
  } catch (error) {
    console.error("[TikTok Events API] Request failed:", error);
    return false;
  }
}
