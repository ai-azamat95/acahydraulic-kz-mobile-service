import serviceContent from "../../../shared/service-content.json";

export type ServiceContent = (typeof serviceContent)[keyof typeof serviceContent];

export function ServiceFAQ({ items, light = false }: { items: { question: string; answer: string }[]; light?: boolean }) {
  return (
    <section className={`py-12 border-t ${light ? "border-[#d6dfd8]" : "border-white/10"}`}>
      <div className="container px-4 md:px-6 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Вопросы перед ремонтом</h2>
        {items.map(({ question, answer }) => (
          <details key={question} className={`border-b py-4 ${light ? "border-[#d6dfd8]" : "border-white/10"}`}>
            <summary className="cursor-pointer text-lg font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FFB800]">{question}</summary>
            <p className={`mt-3 text-base leading-relaxed ${light ? "text-[#52635b]" : "text-muted-foreground"}`}>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default function ServiceDetails({ content, light = false }: { content: ServiceContent; light?: boolean }) {
  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6 max-w-4xl space-y-8">
        {content.sections.map(({ title, text }) => (
          <div key={title}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{title}</h2>
            <p className={`text-base md:text-lg leading-relaxed ${light ? "text-[#52635b]" : "text-muted-foreground"}`}>{text}</p>
          </div>
        ))}
        <nav aria-label="Связанные услуги и материалы">
          <h2 className="text-2xl font-bold mb-4">Полезные страницы</h2>
          <ul className="space-y-2">
            {content.related.map(({ href, label }) => (
              <li key={href}><a href={href} className={`inline-block py-2 font-medium underline underline-offset-4 ${light ? "text-[#795809] hover:text-[#17242b]" : "text-[#FFB800] hover:text-white"}`}>{label}</a></li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
