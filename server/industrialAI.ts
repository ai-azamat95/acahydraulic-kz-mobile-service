import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const industrialCaseInputSchema = z.object({
  brand: z.string().min(1).max(80),
  model: z.string().min(1).max(120),
  subsystem: z.string().max(160).optional(),
  symptoms: z.string().min(10).max(4000),
  faultCodes: z.string().max(1200).optional(),
  measurements: z.string().max(3000).optional(),
  previousRepairs: z.string().max(2500).optional(),
});

const diagnosticResultSchema = z.object({
  caseSummary: z.string(),
  knownFacts: z.array(z.string()),
  missingInformation: z.array(z.string()),
  probableCauses: z.array(
    z.object({
      rank: z.number().int(),
      cause: z.string(),
      confidence: z.enum(["high", "medium", "low"]),
      rationale: z.string(),
    })
  ),
  diagnosticChecks: z.array(
    z.object({
      priority: z.number().int(),
      check: z.string(),
      expectedSignal: z.string(),
    })
  ),
  partsSearchBrief: z.array(z.string()),
  safetyNotes: z.array(z.string()),
  technicianDecisionRequired: z.string(),
});

export type IndustrialCaseInput = z.infer<typeof industrialCaseInputSchema>;
export type IndustrialDiagnosticResult = z.infer<typeof diagnosticResultSchema>;

export async function analyzeIndustrialCase(
  input: IndustrialCaseInput
): Promise<IndustrialDiagnosticResult> {
  const prompt = `You are reviewing a heavy-equipment field-service case for an independent multi-brand service company.

Machine
- Brand: ${input.brand}
- Model: ${input.model}
- Subsystem: ${input.subsystem || "not provided"}

Observed symptoms
${input.symptoms}

Fault codes
${input.faultCodes || "not provided"}

Measurements
${input.measurements || "not provided"}

Previous repairs / interventions
${input.previousRepairs || "not provided"}

Produce a concise technician-facing decision-support report in English.

Rules:
- Never present an uncertain hypothesis as a confirmed diagnosis.
- Separate known facts from assumptions and missing data.
- Rank only plausible causes that are supported by the case information.
- Prefer verification steps and measurements over parts replacement.
- Do not give instructions that bypass guards, interlocks, lockout/tagout, pressure-release procedures, or OEM safety requirements.
- Do not recommend opening a pressurized hydraulic circuit or working under unsupported equipment.
- If data is insufficient, say exactly what must be measured or inspected next.
- The final diagnosis and repair authorization must remain with a qualified technician.
- Keep the report useful for mixed-brand field service and parts sourcing.
`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are ACA Industrial AI, a conservative diagnostic copilot for heavy-equipment service. You structure evidence, uncertainty, verification checks and parts-search requirements. You do not replace a qualified technician.",
      },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "industrial_diagnostic_report",
        strict: true,
        schema: {
          type: "object",
          properties: {
            caseSummary: { type: "string" },
            knownFacts: {
              type: "array",
              items: { type: "string" },
            },
            missingInformation: {
              type: "array",
              items: { type: "string" },
            },
            probableCauses: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  rank: { type: "integer" },
                  cause: { type: "string" },
                  confidence: {
                    type: "string",
                    enum: ["high", "medium", "low"],
                  },
                  rationale: { type: "string" },
                },
                required: ["rank", "cause", "confidence", "rationale"],
                additionalProperties: false,
              },
            },
            diagnosticChecks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  priority: { type: "integer" },
                  check: { type: "string" },
                  expectedSignal: { type: "string" },
                },
                required: ["priority", "check", "expectedSignal"],
                additionalProperties: false,
              },
            },
            partsSearchBrief: {
              type: "array",
              items: { type: "string" },
            },
            safetyNotes: {
              type: "array",
              items: { type: "string" },
            },
            technicianDecisionRequired: { type: "string" },
          },
          required: [
            "caseSummary",
            "knownFacts",
            "missingInformation",
            "probableCauses",
            "diagnosticChecks",
            "partsSearchBrief",
            "safetyNotes",
            "technicianDecisionRequired"
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0]?.message?.content;
  const raw = typeof content === "string" ? content : JSON.stringify(content ?? {});
  const parsed = JSON.parse(raw);

  return diagnosticResultSchema.parse(parsed);
}
