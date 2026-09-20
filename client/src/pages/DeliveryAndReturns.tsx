import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import policy from "../../../shared/delivery-and-returns.json";

export default function DeliveryAndReturns() {
  return <main className="min-h-screen bg-[#111111] px-5 py-10 text-gray-200">
    <SEO title={policy.title} description={policy.description} canonical="/delivery-and-returns/" />
    <div className="mx-auto max-w-3xl space-y-7 leading-relaxed">
      <Link href="/catalog" className="inline-flex min-h-11 items-center text-[#FFC000] underline">← Каталог запчастей</Link>
      <h1 className="text-3xl font-bold text-white sm:text-4xl">{policy.title}</h1>
      <p>{policy.description}</p>
      {policy.sections.map(section => <section key={section.title}>
        <h2 className="mb-3 text-xl font-bold text-white">{section.title}</h2>
        <p>{section.text}</p>
      </section>)}
      <div className="flex flex-wrap gap-4 border-t border-white/15 pt-5">
        <a href="tel:+77714177925" className="inline-flex min-h-11 items-center text-[#FFC000] underline">+7 771 417 79 25</a>
        <a href="mailto:info@acahydraulic.kz" className="inline-flex min-h-11 items-center text-[#FFC000] underline">info@acahydraulic.kz</a>
      </div>
    </div>
  </main>;
}
