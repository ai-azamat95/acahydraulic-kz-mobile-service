import { Link, useLocation } from "wouter";
import { SEO } from "@/components/SEO";
import { CommerceLinks, MerchantDetails } from "@/components/CommerceInfo";
import policies from "../../../shared/commerce-policies.json";

export default function CommercePolicy() {
  const [location] = useLocation();
  const slug = location.startsWith("/offer") ? "offer" : "payment";
  const policy = policies[slug];
  return <main className="min-h-screen bg-[#111111] px-5 py-12 text-gray-200">
    <SEO title={policy.title} description={policy.description} canonical={`/${slug}/`} schema={{ "@context": "https://schema.org", "@type": "WebPage", name: policy.title, url: `https://acahydraulic.kz/${slug}/` }} />
    <div className="mx-auto max-w-3xl space-y-7 leading-relaxed">
      <Link href="/" className="inline-flex min-h-11 items-center text-[#FFC000] underline">← На главную</Link>
      <h1 className="text-3xl font-bold text-white sm:text-4xl">{policy.title}</h1>
      <p>{policy.description}</p>
      {policy.sections.map(section => <section key={section.title}>
        <h2 className="mb-3 text-xl font-bold text-white">{section.title}</h2><p>{section.text}</p>
      </section>)}
      <section><h2 className="mb-4 text-xl font-bold text-white">Реквизиты получателя</h2><MerchantDetails /></section>
      <p className="flex flex-wrap gap-4"><a href="tel:+77714177925" className="inline-flex min-h-11 items-center text-[#FFC000] underline">+7 771 417 79 25</a><a href="mailto:info@acahydraulic.kz" className="inline-flex min-h-11 items-center text-[#FFC000] underline">info@acahydraulic.kz</a></p>
      <CommerceLinks />
    </div>
  </main>;
}
