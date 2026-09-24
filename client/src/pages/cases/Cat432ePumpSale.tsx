import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import Cat432eSaleMedia from "@/components/Cat432eSaleMedia";
import { trackCatalogEvent } from "@/lib/catalogAnalytics";
import sale from "../../../../shared/cat-432e-sale.json";

const productPath = `/catalog/${sale.handle}/`;
const message = `Здравствуйте! Интересует новый основной гидронасос 267-2755 для CAT 432E за 1 230 000 ₸. Прошу проверить совместимость и условия поставки.\nМодель и серийный номер: \nГород: \nКоличество: \nНужен к дате: \nПришлю фото шильдика и подключений.\nhttps://acahydraulic.kz${sale.casePath}/`;
const faq = [
  { question: "Какой насос продали в этом заказе?", answer: "Новый основной гидронасос с маркировкой 267-2755 для экскаватора-погрузчика CAT 432E. Модель машины и номер насоса видны на фотографиях из заказа." },
  { question: "Что входит в цену 1 230 000 ₸?", answer: "Это цена насоса. Комплектацию, наличие, доставку, срок и гарантийные условия согласуем до оплаты. Работы по замене обсуждаются отдельно." },
  { question: "Подойдёт ли этот насос к CAT 428?", answer: "Этот кейс относится к CAT 432E. Для CAT 428 и других модификаций нужна отдельная проверка по серийному номеру машины, номеру насоса, валу, фланцу, портам и регулятору." },
];

export default function Cat432ePumpSale() {
  return <main className="min-h-screen bg-[#101010] py-10 text-white md:py-16">
    <SEO title={sale.caseTitle} description={sale.caseDescription} canonical={sale.casePath}
      ogImage={sale.machineImage} pageType="article" publishedDate="2026-09-22" modifiedDate="2026-09-22"
      breadcrumbs={[{ name: "Кейсы", url: "/cases/" }, { name: "Продажа насоса для CAT 432E", url: sale.casePath }]}
      faq={faq} />
    <div className="container mx-auto max-w-6xl px-4">
      <Link href="/cases/" className="inline-flex min-h-11 items-center text-[#FFC000] underline">Все кейсы ACA Hydraulic</Link>
      <div className="mt-6 grid items-start gap-8 lg:grid-cols-[1.25fr_1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-[#FFC000]">Запчасти · выполненная продажа</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">{sale.caseTitle}</h1>
          <p className="mt-6 text-lg leading-relaxed text-gray-300">Клиент приобрёл в ACA Hydraulic новый основной гидронасос для экскаватора-погрузчика CAT 432E. По обратной связи клиента, он остался доволен покупкой.</p>
          <div className="mt-7 rounded-lg border border-white/15 bg-[#181818] p-6">
            <p className="text-sm text-gray-400">Стоимость насоса</p>
            <p className="mt-2 text-4xl font-bold text-[#FFC000]">1 230 000 ₸</p>
            <p className="mt-3 leading-relaxed text-gray-300">Новый · номер на шильдике 267-2755 · CAT 432E</p>
            <p className="mt-3 text-sm leading-6 text-gray-400">Цена подтверждена 22 сентября 2026 года. Для нового заказа согласуем исполнение, наличие и условия поставки.</p>
            <Link href={productPath} className="mt-5 inline-flex min-h-12 items-center rounded bg-[#FFC000] px-5 py-3 font-bold text-black hover:bg-[#eab000]">Карточка насоса и подбор</Link>
          </div>
        </div>
        <figure><img src={sale.machineImage} alt="Экскаватор-погрузчик CAT 432E из заказа на основной гидронасос" width={562} height={1280} fetchPriority="high" className="max-h-[620px] w-full rounded-lg bg-[#181818] object-contain" /><figcaption className="mt-3 text-sm leading-6 text-gray-400">CAT 432E из материалов заказа. Модель подтверждена по шильдику машины.</figcaption></figure>
      </div>
      <section className="mt-14 grid gap-8 md:grid-cols-2">
        <div><h2 className="text-3xl font-bold">Насос и маркировка</h2><p className="my-5 leading-relaxed text-gray-300">На фотографии насоса читается каталожный номер 267-2755. В официальном каталоге CAT для этого номера указана модель 432E. Для следующего заказа сверяем конкретное исполнение по данным вашей машины.</p><a href="https://parts.cat.com/en/catcorp/product/267-2755" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-[#FFC000] underline">Номер 267-2755 в каталоге CAT</a><img src={sale.nameplateImage} alt="Шильдик проданного насоса: каталожный номер 267-2755" width={864} height={1152} loading="lazy" className="mt-5 max-h-[520px] w-full rounded-lg bg-[#181818] object-contain" /></div>
        <div><h2 className="mb-5 text-3xl font-bold">Видео насоса</h2><Cat432eSaleMedia /><h2 className="mt-8 text-2xl font-bold">Результат заказа</h2><p className="mt-4 leading-relaxed text-gray-300">Новый насос продан клиенту для CAT 432E. Клиент сообщил, что доволен покупкой. Здесь зафиксирована продажа запчасти; установка и замеры после замены в этот кейс не включены.</p></div>
      </section>
      <section className="mt-14 border-y border-white/15 py-8"><h2 className="text-3xl font-bold">Как заказать насос для своей машины</h2><ol className="mt-5 list-decimal space-y-3 pl-5 leading-relaxed text-gray-300"><li>Пришлите модель и серийный номер техники, фото шильдика и общий вид насоса.</li><li>Покажите вал, фланец, порты, регулятор и электрические подключения. Укажите город и нужную дату.</li><li>До оплаты согласуем совместимость, комплектацию, наличие, стоимость, доставку и гарантийные условия.</li></ol><p className="mt-5 leading-relaxed text-gray-400">Если причина неисправности ещё не подтверждена, сначала обсудим диагностику. Одних симптомов или внешнего сходства недостаточно для покупки дорогостоящего узла.</p></section>
      <section className="mt-12"><h2 className="text-3xl font-bold">Вопросы перед заказом</h2><div className="mt-5 divide-y divide-white/15">{faq.map(item => <details key={item.question} className="py-5"><summary className="cursor-pointer text-lg font-bold">{item.question}</summary><p className="mt-4 leading-relaxed text-gray-300">{item.answer}</p></details>)}</div></section>
      <section className="mt-10 rounded-lg bg-[#1a1a1a] p-6 md:p-8"><h2 className="text-3xl font-bold">Нужен основной гидронасос?</h2><p className="my-5 max-w-3xl leading-relaxed text-gray-300">Отправьте шильдик и модель техники. Проверим подходящее исполнение и подготовим расчёт поставки.</p><a href={`https://wa.me/77714177925?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" onClick={() => trackCatalogEvent("case_whatsapp_click", { case_id: "cat-432e-pump-sale", request_type: "pump-267-2755" })} className="inline-flex min-h-12 items-center rounded bg-[#FFC000] px-5 py-3 font-bold text-black hover:bg-[#eab000]">Проверить насос по шильдику в WhatsApp</a><div className="mt-5 flex flex-wrap gap-x-6 gap-y-3"><Link href="/catalog/category/hydraulic-pumps/" className="text-[#FFC000] underline">Каталог гидронасосов</Link><Link href="/blog/zapchasti-po-nomeru-i-shildiku/" className="text-[#FFC000] underline">Что сфотографировать для подбора</Link></div></section>
    </div>
  </main>;
}
