import evidence from "../../../shared/repair-evidence.json";

export default function RepairEvidence({ service, showProcess = true }: { service?: string; showProcess?: boolean }) {
  const cases = evidence.cases.filter(item => !service || item.services.includes(service));
  return (
    <section data-repair-evidence className="bg-[#f5f6f1] py-12 text-[#17242b] md:py-16">
      <div className="container mx-auto max-w-6xl px-4">
        {showProcess && <>
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">От диагностики до проверки после ремонта</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-[#465957]">База ACA Hydraulic — Астана, трасса Астана–Караганда, 81. Выезды на объекты по Казахстану согласуем по местоположению техники, доступу и занятости бригады.</p>
          <ol className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {evidence.process.map((step, index) => <li key={step.title} className="border-t-2 border-[#bc8b18] pt-4">
              <span className="text-sm font-bold text-[#795809]">0{index + 1}</span>
              <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#465957]">{step.text}</p>
            </li>)}
          </ol>
        </>}
        {cases.length > 0 && <div className={showProcess ? "mt-12" : ""}>
          <h2 className="text-2xl font-bold md:text-3xl">Что показано после выполненных работ</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-[#465957]">Это собственные кейсы ACA Hydraulic. В каждом отдельно указаны работы и то, что можно увидеть на видео. Поставка с установкой обозначена отдельно от ремонта узла.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {cases.map(item => <article key={item.id} data-repair-case={item.id} className="rounded-xl border border-[#d8e0d8] bg-white p-5 md:p-6">
              <p className="text-sm font-semibold text-[#795809]">{item.kind}</p>
              <h3 className="mt-2 text-xl font-bold">{item.model}</h3>
              <dl className="mt-4 space-y-3 text-sm leading-relaxed text-[#465957]">
                <div><dt className="font-bold text-[#17242b]">Исходная задача</dt><dd>{item.before}</dd></div>
                <div><dt className="font-bold text-[#17242b]">Выполненные работы</dt><dd>{item.work}</dd></div>
                <div><dt className="font-bold text-[#17242b]">Проверка на видео</dt><dd>{item.result}</dd></div>
              </dl>
              <a href={item.href} className="mt-4 inline-flex min-h-11 items-center font-semibold text-[#795809] underline underline-offset-4">Разбор кейса {item.model}</a>
              <a href={item.video} className="flex min-h-11 items-center text-sm font-semibold text-[#795809] underline underline-offset-4">{item.videoLabel}</a>
            </article>)}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-[#465957]">Эти ролики показывают конкретные операции. Числовые протоколы замеров до и после для этих подборок не опубликованы; видео не заменяет такой протокол. Независимые отзывы клиентов — отдельный вид источников.</p>
          <nav aria-label="Ремонт, кейсы и отзывы" className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-[#795809]">
            <a href="/services/mobile-repair/" className="inline-flex min-h-11 items-center underline underline-offset-4">Условия выездного ремонта</a>
            <a href="/cases/" className="inline-flex min-h-11 items-center underline underline-offset-4">Все кейсы и поставки</a>
            <a href="/reviews/" className="inline-flex min-h-11 items-center underline underline-offset-4">Об отзывах клиентов</a>
          </nav>
        </div>}
      </div>
    </section>
  );
}
