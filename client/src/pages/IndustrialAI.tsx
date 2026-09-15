import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  AlertTriangle,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { FormEvent, useState } from "react";

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

export default function IndustrialAI() {
  const [form, setForm] = useState({ ...demoCase });

  const analysis = trpc.industrialAI.analyze.useMutation();

  const setField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
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
    analysis.reset();
  };

  const result = analysis.data;

  return (
    <div className="min-h-screen bg-[#090909] text-white pt-20">
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
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <BrainCircuit className="mb-3 h-5 w-5 text-[#FFC000]" />
                  <div className="font-semibold">Structured AI output</div>
                  <div className="mt-1 text-gray-500">Evidence → checks → parts</div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <ShieldCheck className="mb-3 h-5 w-5 text-[#FFC000]" />
                  <div className="font-semibold">Technician remains in control</div>
                  <div className="mt-1 text-gray-500">No autonomous repair claim</div>
                </div>
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
                <label className="text-sm text-gray-300">
                  Brand
                  <input
                    required
                    maxLength={80}
                    value={form.brand}
                    onChange={(event) => setField("brand", event.target.value)}
                    className={inputClass}
                    placeholder="Caterpillar"
                  />
                </label>
                <label className="text-sm text-gray-300">
                  Model
                  <input
                    required
                    maxLength={120}
                    value={form.model}
                    onChange={(event) => setField("model", event.target.value)}
                    className={inputClass}
                    placeholder="330D L"
                  />
                </label>
              </div>

              <label className="mt-4 block text-sm text-gray-300">
                Subsystem
                <input
                  maxLength={160}
                  value={form.subsystem}
                  onChange={(event) => setField("subsystem", event.target.value)}
                  className={inputClass}
                  placeholder="Main hydraulic circuit"
                />
              </label>

              <label className="mt-4 block text-sm text-gray-300">
                Symptoms
                <textarea
                  required
                  minLength={10}
                  maxLength={4000}
                  value={form.symptoms}
                  onChange={(event) => setField("symptoms", event.target.value)}
                  className={textareaClass}
                  placeholder="What changes under load or after warm-up?"
                />
              </label>

              <label className="mt-4 block text-sm text-gray-300">
                Fault codes
                <textarea
                  maxLength={1200}
                  value={form.faultCodes}
                  onChange={(event) => setField("faultCodes", event.target.value)}
                  className={`${inputClass} min-h-[72px] resize-y`}
                  placeholder="Codes or display warnings"
                />
              </label>

              <label className="mt-4 block text-sm text-gray-300">
                Measurements
                <textarea
                  maxLength={3000}
                  value={form.measurements}
                  onChange={(event) => setField("measurements", event.target.value)}
                  className={`${inputClass} min-h-[88px] resize-y`}
                  placeholder="Pressure, temperature, pilot signal, RPM..."
                />
              </label>

              <label className="mt-4 block text-sm text-gray-300">
                Previous repairs / interventions
                <textarea
                  maxLength={2500}
                  value={form.previousRepairs}
                  onChange={(event) => setField("previousRepairs", event.target.value)}
                  className={`${inputClass} min-h-[88px] resize-y`}
                  placeholder="What was already replaced or checked?"
                />
              </label>

              <Button
                type="submit"
                disabled={analysis.isPending || form.brand.trim().length === 0 || form.model.trim().length === 0 || form.symptoms.trim().length < 10}
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
                    Analyze with Industrial AI
                  </>
                )}
              </Button>

              <p className="mt-4 text-xs leading-relaxed text-gray-500">
                Demo endpoint is rate-limited. Output is decision support only; final diagnosis,
                safety decisions and repair authorization remain with a qualified technician.
              </p>
            </form>

            <div className="min-w-0">
              {!result && !analysis.isPending && !analysis.error && (
                <div className="flex min-h-[520px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFC000]/10">
                    <BrainCircuit className="h-8 w-8 text-[#FFC000]" />
                  </div>
                  <h2 className="mt-6 text-2xl font-semibold">Ready for a service case</h2>
                  <p className="mt-3 max-w-lg text-gray-400">
                    The prototype does not jump directly to a diagnosis. It separates facts from
                    missing evidence, ranks hypotheses and generates the next verification steps.
                  </p>
                </div>
              )}

              {analysis.isPending && (
                <div className="flex min-h-[520px] items-center justify-center rounded-2xl border border-white/10 bg-[#111]">
                  <div className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#FFC000]" />
                    <div className="mt-4 font-semibold">Building structured diagnostic workflow</div>
                    <div className="mt-2 text-sm text-gray-500">Facts, uncertainty, checks and parts-search brief</div>
                  </div>
                </div>
              )}

              {analysis.error && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
                    <div>
                      <div className="font-semibold text-red-300">Analysis unavailable</div>
                      <p className="mt-2 text-sm text-red-200/70">{analysis.error.message}</p>
                    </div>
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-5">
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
                    <SectionTitle icon={<BrainCircuit className="h-5 w-5 text-[#FFC000]" />} title="Ranked hypotheses" />
                    <div className="mt-5 space-y-3">
                      {result.probableCauses.map((item) => (
                        <div key={`${item.rank}-${item.cause}`} className="rounded-xl border border-white/10 bg-black/20 p-4">
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
                    <SectionTitle icon={<ClipboardList className="h-5 w-5 text-[#FFC000]" />} title="Verification checklist" />
                    <div className="mt-5 space-y-3">
                      {result.diagnosticChecks.map((item) => (
                        <div key={`${item.priority}-${item.check}`} className="grid gap-2 rounded-xl border border-white/10 bg-black/20 p-4 md:grid-cols-[44px_1fr]">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFC000]/10 font-bold text-[#FFC000]">
                            {item.priority}
                          </div>
                          <div>
                            <div className="font-medium text-gray-100">{item.check}</div>
                            <div className="mt-1 text-sm text-gray-500">Expected signal: {item.expectedSignal}</div>
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
                    <p className="mt-3 leading-relaxed text-gray-300">{result.technicianDecisionRequired}</p>
                  </section>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#111] py-10">
          <div className="container mx-auto grid max-w-6xl gap-5 px-4 md:grid-cols-3">
            <FlowStep number="01" title="Capture" text="Machine, symptoms, codes, measurements and intervention history." />
            <FlowStep number="02" title="Reason" text="Separate evidence from uncertainty and rank what should be verified next." />
            <FlowStep number="03" title="Execute" text="Technician confirms the fault; the workflow then supports parts and quotation preparation." />
          </div>
        </section>
      </main>
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
