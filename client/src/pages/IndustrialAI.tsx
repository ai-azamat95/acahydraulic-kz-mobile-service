import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { FormEvent, useState } from "react";

type DiagnosticResult = {
  caseSummary: string;
  knownFacts: string[];
  missingInformation: string[];
  probableCauses: Array<{
    rank: number;
    cause: string;
    confidence: "high" | "medium" | "low";
    rationale: string;
  }>;
  diagnosticChecks: Array<{
    priority: number;
    check: string;
    expectedSignal: string;
  }>;
  partsSearchBrief: string[];
  safetyNotes: string[];
  technicianDecisionRequired: string;
};

const inputClass =
  "mt-2 w-full rounded-lg border border-white/10 bg-[#0d0d0d] px-4 py-3 text-sm text-white outline-none transition focus:border-[#FFC000]/70 focus:ring-1 focus:ring-[#FFC000]/30";

const textareaClass = `${inputClass} min-h-[112px] resize-y`;

const demoCase = {
  brand: "SANY",
  model: "SY365H",
  subsystem: "Hydraulic system + electrical control",
  symptoms:
    "After warm-up the machine loses hydraulic performance and boom lift becomes jerky. The issue becomes more pronounced at operating temperature. Electrical wiring faults are also suspected.",
  faultCodes: "No verified fault codes provided yet.",
  measurements: "No verified pressure measurements attached yet.",
  previousRepairs:
    "Field team inspected hydraulic control components and electrical wiring; further root-cause verification is required before parts replacement.",
};

const reviewerDemoResult: DiagnosticResult = {
  caseSummary:
    "The SANY SY365H shows a temperature-dependent hydraulic performance loss with jerky boom movement and possible electrical-control faults. The evidence is not sufficient to confirm one failed component, so the next step is a controlled verification sequence rather than immediate parts replacement.",
  knownFacts: [
    "Hydraulic performance deteriorates after warm-up.",
    "Boom lift becomes jerky at operating temperature.",
    "Electrical wiring or control faults are suspected from field inspection.",
    "No verified fault-code set or pressure-test record is attached to this demo case.",
  ],
  missingInformation: [
    "Main-pump and pilot pressure readings cold versus hot, taken under an OEM-approved test procedure.",
    "Verified engine RPM and load response when the hydraulic symptom appears.",
    "Controller fault codes, sensor values and connector/wiring continuity results.",
    "Hydraulic oil temperature and condition at the exact point where the symptom becomes repeatable.",
  ],
  probableCauses: [
    {
      rank: 1,
      cause: "Hydraulic pump regulation or control instability when hot",
      confidence: "medium",
      rationale:
        "The symptom is temperature-dependent and affects hydraulic performance, but pressure and control-signal measurements are still required before the pump or regulator can be condemned.",
    },
    {
      rank: 2,
      cause: "Electrical control / sensor / wiring fault affecting hydraulic command",
      confidence: "medium",
      rationale:
        "Field inspection already raised electrical concerns, and an unstable command signal can create hydraulic symptoms that resemble a mechanical pump fault.",
    },
    {
      rank: 3,
      cause: "Internal leakage or valve-control issue that increases with oil temperature",
      confidence: "low",
      rationale:
        "Hot oil can make leakage-related losses more visible, but the available case data does not yet isolate the affected circuit or component.",
    },
  ],
  diagnosticChecks: [
    {
      priority: 1,
      check: "Capture cold-versus-hot hydraulic pressures and pilot/control signals under the OEM service procedure.",
      expectedSignal:
        "A repeatable change that correlates with the onset of the boom-jerk and power-loss symptom.",
    },
    {
      priority: 2,
      check: "Read controller diagnostics and verify relevant sensors, connectors and wiring while reproducing the fault.",
      expectedSignal:
        "Stable supply/ground and plausible sensor/control values without intermittent dropouts.",
    },
    {
      priority: 3,
      check: "Compare engine RPM/load response with hydraulic demand before and after warm-up.",
      expectedSignal:
        "Evidence that separates an engine-load limitation from a hydraulic-control limitation.",
    },
    {
      priority: 4,
      check: "Inspect filtration/oil condition and verify whether contamination evidence supports internal component wear.",
      expectedSignal:
        "Documented contamination or wear evidence before any major component replacement is authorized.",
    },
  ],
  partsSearchBrief: [
    "Machine identity: SANY SY365H; confirm serial number before ordering.",
    "If pump/regulator replacement becomes justified, capture full nameplate, regulator configuration, ports, flange, shaft and rotation.",
    "For electrical parts, capture controller/sensor part numbers and connector pinout from the machine documentation.",
    "Do not source a major component from symptom description alone; attach verified measurements and technician conclusion.",
  ],
  safetyNotes: [
    "Do not open or loosen a pressurized hydraulic circuit.",
    "Use OEM pressure-release, lockout/tagout and machine-support procedures before inspection or service.",
    "Keep personnel clear of unsupported or unexpectedly moving implements during fault reproduction.",
  ],
  technicianDecisionRequired:
    "A qualified technician must review the measurements, confirm the root cause and authorize any repair or parts replacement. The AI output is a decision-support workflow, not a final diagnosis.",
};

function isPublicStaticDemoHost() {
  if (typeof window === "undefined") return false;
  return window.location.hostname === "acahydraulic.kz" || window.location.hostname.endsWith("github.io");
}

export default function IndustrialAI() {
  const [form, setForm] = useState({ ...demoCase });
  const [localResult, setLocalResult] = useState<DiagnosticResult | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const analysis = trpc.industrialAI.analyze.useMutation();
  const publicStaticDemo = isPublicStaticDemoHost();

  const setField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setLocalResult(null);
    setLocalError(null);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLocalResult(null);
    setLocalError(null);

    if (publicStaticDemo) {
      const isBundledDemo =
        form.brand.trim().toLowerCase() === "sany" &&
        form.model.trim().toLowerCase() === "sy365h";

      if (!isBundledDemo) {
        setLocalError(
          "The public GitHub Pages build exposes the bundled SANY reviewer demo without an API key. Custom live LLM analysis runs from the server implementation in this repository. Load the SANY demo to review the complete workflow."
        );
        return;
      }

      setLocalResult(reviewerDemoResult);
      return;
    }

    analysis.mutate({
      brand: form.brand.trim(),
      model: form.model.trim(),
      subsystem: form.subsystem.trim() || undefined,
      symptoms: form.symptoms.trim(),
      faultCodes: form.faultCodes.trim() || undefined,
      measurements: form.measurements.trim() || undefined,
      previousRepairs: form.previousRepairs.trim() || undefined,
    });
  };

  const loadDemo = () => {
    setForm({ ...demoCase });
    setLocalResult(null);
    setLocalError(null);
    analysis.reset();
  };

  const result = localResult ?? (analysis.data as DiagnosticResult | undefined);
  const displayError = localError ?? analysis.error?.message ?? null;

  return (
    <div className="min-h-screen bg-[#090909] pt-20 text-white">
      <SEO
        title="ACA Industrial AI — Heavy Equipment Diagnostic Copilot"
        description="HackAlem prototype: AI-assisted multi-brand heavy-equipment diagnostics, verification checklist and parts-search workflow by ACA Hydraulic."
        keywords="industrial AI, heavy equipment diagnostics, hydraulic diagnostics AI, HackAlem, ACA Hydraulic"
        canonical="/industrial-ai"
      />

      <main>
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(255,192,0,0.12),transparent_35%)] py-14 md:py-20">
          <div className="container mx-auto max-w-6xl px-4">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#FFC000]/30 bg-[#FFC000]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#FFC000]">
                HackAlem AI prototype
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                Human-in-the-loop decision support
              </span>
              {publicStaticDemo && (
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1 text-xs text-emerald-300">
                  Public reviewer demo
                </span>
              )}
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <h1 className="font-bebas text-5xl leading-none md:text-7xl">
                  ACA <span className="text-[#FFC000]">Industrial AI</span>
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-gray-300 md:text-xl">
                  A multi-brand heavy-equipment diagnostic copilot that turns symptoms,
                  measurements and service history into a structured verification workflow,
                  ranked hypotheses and a parts-search brief.
                </p>
                <a
                  href="https://github.com/ai-azamat95/acahydraulic-kz-mobile-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#FFC000] hover:underline"
                >
                  Review source code on GitHub <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <InfoCard
                  icon={<BrainCircuit className="mb-3 h-5 w-5 text-[#FFC000]" />}
                  title="Structured AI output"
                  text="Evidence → checks → parts"
                />
                <InfoCard
                  icon={<ShieldCheck className="mb-3 h-5 w-5 text-[#FFC000]" />}
                  title="Technician in control"
                  text="No autonomous repair claim"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-14">
          <div className="container mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[420px_1fr]">
            <form
              onSubmit={handleSubmit}
              className="h-fit rounded-2xl border border-white/10 bg-[#121212] p-5 md:p-6 lg:sticky lg:top-24"
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-[#FFC000]">
                    Service case input
                  </div>
                  <h2 className="mt-2 text-2xl font-semibold">Describe the machine</h2>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={loadDemo}
                  className="border-white/15 bg-transparent text-xs hover:border-[#FFC000] hover:bg-[#FFC000]/10"
                >
                  Load demo
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Brand">
                  <input
                    required
                    maxLength={80}
                    value={form.brand}
                    onChange={(event) => setField("brand", event.target.value)}
                    className={inputClass}
                    placeholder="Caterpillar"
                  />
                </Field>
                <Field label="Model">
                  <input
                    required
                    maxLength={120}
                    value={form.model}
                    onChange={(event) => setField("model", event.target.value)}
                    className={inputClass}
                    placeholder="330D L"
                  />
                </Field>
              </div>

              <Field label="Subsystem" className="mt-4 block">
                <input
                  maxLength={160}
                  value={form.subsystem}
                  onChange={(event) => setField("subsystem", event.target.value)}
                  className={inputClass}
                  placeholder="Main hydraulic circuit"
                />
              </Field>

              <Field label="Symptoms" className="mt-4 block">
                <textarea
                  required
                  minLength={10}
                  maxLength={4000}
                  value={form.symptoms}
                  onChange={(event) => setField("symptoms", event.target.value)}
                  className={textareaClass}
                  placeholder="What changes under load or after warm-up?"
                />
              </Field>

              <Field label="Fault codes" className="mt-4 block">
                <textarea
                  maxLength={1200}
                  value={form.faultCodes}
                  onChange={(event) => setField("faultCodes", event.target.value)}
                  className={`${inputClass} min-h-[72px] resize-y`}
                  placeholder="Codes or display warnings"
                />
              </Field>

              <Field label="Measurements" className="mt-4 block">
                <textarea
                  maxLength={3000}
                  value={form.measurements}
                  onChange={(event) => setField("measurements", event.target.value)}
                  className={`${inputClass} min-h-[88px] resize-y`}
                  placeholder="Pressure, temperature, pilot signal, RPM..."
                />
              </Field>

              <Field label="Previous repairs / interventions" className="mt-4 block">
                <textarea
                  maxLength={2500}
                  value={form.previousRepairs}
                  onChange={(event) => setField("previousRepairs", event.target.value)}
                  className={`${inputClass} min-h-[88px] resize-y`}
                  placeholder="What was already replaced or checked?"
                />
              </Field>

              <Button
                type="submit"
                disabled={
                  analysis.isPending ||
                  form.brand.trim().length === 0 ||
                  form.model.trim().length === 0 ||
                  form.symptoms.trim().length < 10
                }
                className="mt-6 h-12 w-full bg-[#FFC000] font-bold text-black hover:bg-[#e5ad00]"
              >
                {analysis.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Structuring diagnostic case...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    {publicStaticDemo ? "Run reviewer demo" : "Analyze with Industrial AI"}
                  </>
                )}
              </Button>

              <p className="mt-4 text-xs leading-relaxed text-gray-500">
                {publicStaticDemo
                  ? "The public static build replays the bundled SANY case so reviewers can inspect the full UX without exposing an API key. The live LLM backend, schema validation and rate limiting are implemented in the repository."
                  : "The live endpoint is rate-limited. Output is decision support only; final diagnosis, safety decisions and repair authorization remain with a qualified technician."}
              </p>
            </form>

            <div className="min-w-0">
              {!result && !analysis.isPending && !displayError && (
                <div className="flex min-h-[520px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFC000]/10">
                    <BrainCircuit className="h-8 w-8 text-[#FFC000]" />
                  </div>
                  <h2 className="mt-6 text-2xl font-semibold">Ready for a service case</h2>
                  <p className="mt-3 max-w-lg text-gray-400">
                    The prototype separates known facts from missing evidence, ranks hypotheses and
                    generates the next verification steps before parts are replaced.
                  </p>
                </div>
              )}

              {analysis.isPending && (
                <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-white/10 bg-[#111]">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#FFC000]" />
                    <div className="mt-4 font-semibold">Building structured diagnostic workflow</div>
                    <div className="mt-2 text-sm text-gray-500">
                      Facts, uncertainty, checks and parts-search brief
                    </div>
                  </div>
                </div>
              )}

              {displayError && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                    <div>
                      <div className="font-semibold text-red-300">Analysis unavailable</div>
                      <p className="mt-2 text-sm text-red-200/70">{displayError}</p>
                      {publicStaticDemo && (
                        <Button
                          type="button"
                          onClick={loadDemo}
                          className="mt-4 bg-[#FFC000] text-black hover:bg-[#e5ad00]"
                        >
                          Load SANY reviewer demo
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {result && <DiagnosticReport result={result} publicStaticDemo={publicStaticDemo} />}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#111] py-10">
          <div className="container mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-3">
            <FlowStep
              number="01"
              title="Capture"
              text="Machine, symptoms, codes, measurements and intervention history."
            />
            <FlowStep
              number="02"
              title="Reason"
              text="Separate evidence from uncertainty and rank what should be verified next."
            />
            <FlowStep
              number="03"
              title="Execute"
              text="Technician confirms the fault; the workflow then supports parts and quotation preparation."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function DiagnosticReport({
  result,
  publicStaticDemo,
}: {
  result: DiagnosticResult;
  publicStaticDemo: boolean;
}) {
  return (
    <div className="space-y-5">
      {publicStaticDemo && (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-200">
          Reviewer replay loaded. The same output contract is produced by the repository&apos;s
          JSON-Schema-constrained LLM backend.
        </div>
      )}

      <section className="rounded-2xl border border-[#FFC000]/25 bg-[#FFC000]/[0.05] p-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FFC000]">
          <Sparkles className="h-4 w-4" /> AI case summary
        </div>
        <p className="mt-4 text-lg leading-relaxed text-gray-200">{result.caseSummary}</p>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <ResultList
          title="Known facts"
          icon={<CheckCircle2 className="h-5 w-5 text-emerald-400" />}
          items={result.knownFacts}
        />
        <ResultList
          title="Missing information"
          icon={<Search className="h-5 w-5 text-[#FFC000]" />}
          items={result.missingInformation}
        />
      </div>

      <section className="rounded-2xl border border-white/10 bg-[#121212] p-6">
        <SectionTitle
          icon={<BrainCircuit className="h-5 w-5 text-[#FFC000]" />}
          title="Ranked hypotheses"
        />
        <div className="mt-5 space-y-3">
          {result.probableCauses.map((item) => (
            <div
              key={`${item.rank}-${item.cause}`}
              className="rounded-xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="font-semibold">
                  #{item.rank} {item.cause}
                </div>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs uppercase tracking-wider text-gray-400">
                  {item.confidence} confidence
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{item.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-[#121212] p-6">
        <SectionTitle
          icon={<ClipboardList className="h-5 w-5 text-[#FFC000]" />}
          title="Verification checklist"
        />
        <div className="mt-5 space-y-3">
          {result.diagnosticChecks.map((item) => (
            <div
              key={`${item.priority}-${item.check}`}
              className="grid gap-2 rounded-xl border border-white/10 bg-black/20 p-4 md:grid-cols-[44px_1fr]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFC000]/10 font-bold text-[#FFC000]">
                {item.priority}
              </div>
              <div>
                <div className="font-medium text-gray-100">{item.check}</div>
                <div className="mt-1 text-sm text-gray-500">
                  Expected signal: {item.expectedSignal}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <ResultList
          title="Parts-search brief"
          icon={<Wrench className="h-5 w-5 text-[#FFC000]" />}
          items={result.partsSearchBrief}
        />
        <ResultList
          title="Safety gates"
          icon={<ShieldCheck className="h-5 w-5 text-[#FFC000]" />}
          items={result.safetyNotes}
        />
      </div>

      <section className="rounded-2xl border border-white/10 bg-[#121212] p-6">
        <div className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
          Human decision gate
        </div>
        <p className="mt-3 leading-relaxed text-gray-300">
          {result.technicianDecisionRequired}
        </p>
      </section>
    </div>
  );
}

function Field({
  label,
  className = "text-sm text-gray-300",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`${className} text-sm text-gray-300`}>
      {label}
      {children}
    </label>
  );
}

function InfoCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
      {icon}
      <div className="font-semibold">{title}</div>
      <div className="mt-1 text-gray-500">{text}</div>
    </div>
  );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}

function ResultList({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#121212] p-6">
      <SectionTitle icon={icon} title={title} />
      {items.length > 0 ? (
        <ul className="mt-5 space-y-3 text-sm leading-relaxed text-gray-400">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFC000]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-gray-500">None returned for this case.</p>
      )}
    </section>
  );
}

function FlowStep({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-5">
      <div className="text-sm font-bold text-[#FFC000]">{number}</div>
      <div className="mt-3 text-lg font-semibold">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-gray-500">{text}</p>
    </div>
  );
}
