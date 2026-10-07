import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, CheckCircle, ArrowRight, Wrench, Gauge, Shield, PlayCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import B2BLeadForm from "@/components/B2BLeadForm";

const WHATSAPP_NUMBER = "77714177925";
const PHONE_NUMBER = "+7 (771) 417-79-25";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Здравствуйте! Нужна диагностика Caterpillar. Понимаю, что диагностика платная. Прошу согласовать стоимость до выезда. Отправлю модель, серийный номер, город и видео неисправности.")}`;

const catFaq = [
  {
    question: "Сколько стоит диагностика гидравлики Caterpillar?",
    answer: "Выездная диагностика платная; стоимость согласуем до выезда. Итог зависит от местоположения, модели и характера неисправности. Ремонт и запчасти рассчитываются отдельно после диагностики.",
  },
  {
    question: "Что проверяете, если CAT теряет мощность после прогрева?",
    answer: "Проверяем гидросистему и двигатель в момент проявления дефекта: рабочее давление, управляющие контуры, насосы, клапаны, распределитель, датчики и электрику по фактическим симптомам. Один симптом не подтверждает необходимость замены насоса.",
  },
  {
    question: "Выезжаете ли на объект за пределы Астаны?",
    answer: "Да. Выезжаем на объекты по Казахстану. Условия и стоимость выезда согласуются по местонахождению техники.",
  },
  {
    question: "Что отправить для подбора гидронасоса или другой запчасти CAT?",
    answer: "Нужны модель и серийный номер техники, каталожный номер детали и фото шильдика. Для гидронасоса также нужны фото вала, фланца, портов и регулятора. Совместимость, комплектацию, цену и срок поставки подтверждаем до заказа.",
  },
];

const catCases = [
  {
    title: "CAT 325C глохнет под нагрузкой",
    description: "В реальном ремонте проверили гидравлику и проводку, восстановили повреждённый жгут, выполнили настройку и показали работу экскаватора после ремонта. На странице — видео диагностики и результата.",
    href: "/cases/cat-325c-glokhnet-pod-nagruzkoy/",
    link: "Диагностика и ремонт CAT 325C — видео",
  },
  {
    title: "CAT 330DL теряет мощность на горячую",
    description: "Проверяли машину после прогрева, когда проявлялась потеря мощности. В этом случае выявили в том числе неправильную работу форсунок. Причины и результат разобраны в отдельном видеокейсе.",
    href: "/cases/cat-330dl-teryaet-moshchnost-na-goryachuyu/",
    link: "Причины потери мощности CAT 330DL",
  },
  {
    title: "CAT 432E: продали новый гидронасос 267-2755",
    description: "Реальная продажа главного гидронасоса: фото маркировки, корпуса и видео поставленного узла. Этот кейс подтверждает продажу, а не установку или испытание насоса на машине.",
    href: "/cases/cat-432e-postavka-gidronasosa-267-2755/",
    link: "Продажа гидронасоса 267-2755 для CAT 432E",
  },
];

const catModels = [
  { model: "CAT 320 / 323 / 325 / 330", desc: "Диагностика насосов, гидромоторов, клапанов и управления" },
  { model: "CAT 336 / 340 / 349", desc: "Главные насосы, распределители, гидроцилиндры, электрика" },
  { model: "CAT D6 / D7 / D8 / D9", desc: "Гидравлика бульдозеров" },
  { model: "CAT 966 / 972 / 980", desc: "Гидравлика колёсных погрузчиков" },
  { model: "CAT 140 / 160 / 16M", desc: "Гидравлика автогрейдеров" },
  { model: "CAT 740 / 745 / 777", desc: "Гидравлические системы тяжёлой техники" },
];

const services = [
  "Диагностика гидросистемы CAT под рабочей нагрузкой",
  "Проверка давления и управляющих контуров",
  "Диагностика и ремонт главных гидронасосов",
  "Диагностика гидромоторов хода и поворота",
  "Работа с гидрораспределителями и клапанами",
  "Поиск неисправностей датчиков, соленоидов и электропроводки",
  "Проверка гидроцилиндров и внутренних утечек",
  "Выезд на объект по Казахстану",
];

export default function BrandCat() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto">
      <SEO
        title="Ремонт гидравлики CAT Caterpillar в Казахстане | ACA Hydraulic"
        description="Диагностика и ремонт гидравлики Caterpillar в Астане и с выездом по Казахстану. Кейсы CAT 325C, 330DL и 432E, подбор запчастей по серийному номеру."
        keywords="ремонт гидравлики CAT, диагностика Caterpillar, CAT 330 теряет мощность, ремонт гидронасоса CAT, ремонт экскаватора CAT Казахстан"
        canonical="/brands/cat/"
        breadcrumbs={[{ name: "Услуги", url: "/services/" }, { name: "Caterpillar (CAT)", url: "/brands/cat/" }]}
        pageType="service"
        serviceSchema={{
          serviceName: "Выездная диагностика и ремонт гидравлики Caterpillar",
          serviceDescription: "Диагностика и ремонт гидравлических систем техники Caterpillar на объекте по Казахстану.",
          serviceUrl: "/brands/cat/",
          areaServed: ["Астана", "Казахстан"],
        }}
        faq={catFaq}
      />

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/"><div className="flex items-center gap-3 cursor-pointer"><div className="flex gap-[3px] h-[28px]"><div className="w-[10px] h-full bg-[#FFC000]"/><div className="flex flex-col justify-between h-full"><div className="w-[10px] h-[12.5px] bg-[#FFC000]"/><div className="w-[10px] h-[12.5px] bg-[#FFC000]"/></div></div><div className="flex flex-col justify-center"><span className="font-sans font-bold text-[18px] leading-none tracking-wide">ACA</span><span className="font-sans font-medium text-[11px] leading-none tracking-wider mt-[2px]">HYDRAULIC</span></div></div></Link>
          <div className="flex items-center gap-3"><a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="hidden md:flex items-center gap-2 text-[#FFC000] font-medium"><Phone className="w-4 h-4" />{PHONE_NUMBER}</a><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="bg-[#FFC000] text-black px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-400">WhatsApp</a></div>
        </div>
      </header>

      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-[#111111]">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/50 mb-6"><Link href="/" className="hover:text-[#FFC000]">Главная</Link><span className="mx-2">/</span><Link href="/services" className="hover:text-[#FFC000]">Услуги</Link><span className="mx-2">/</span><span className="text-white/80">Caterpillar</span></nav>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[#FFC000]/10 border border-[#FFC000]/30 rounded-full px-4 py-2 mb-6"><Wrench className="w-4 h-4 text-[#FFC000]" /><span className="text-[#FFC000] text-sm font-medium">Выездная диагностика Caterpillar</span></div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Диагностика и ремонт гидравлики <span className="text-[#FFC000]">Caterpillar (CAT)</span> в Казахстане</h1>
            <p className="text-xl text-white/70 mb-5 max-w-3xl">Если CAT теряет мощность, глохнет под нагрузкой, плохо работает после прогрева или есть проблемы с давлением — диагностируем машину на объекте в условиях проявления дефекта.</p>
            <p className="text-white/70 leading-relaxed mb-6 max-w-3xl">Ремонтная база ACA Hydraulic находится в Астане. Выезд по Казахстану согласуем по местонахождению техники и задаче. Для владельцев машин и предприятий: сначала диагностика, затем согласование ремонта и подбор необходимых запчастей Caterpillar.</p>
            <div className="inline-flex flex-wrap items-center gap-3 bg-[#FFC000]/10 border border-[#FFC000]/30 px-5 py-3 rounded-lg mb-8"><span className="text-white/80">Выездная комплексная диагностика</span><strong className="text-[#FFC000] text-xl">Стоимость согласуем до выезда</strong></div>
            <div className="flex flex-wrap gap-4">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500"><MessageCircle className="w-5 h-5" />Отправить данные CAT в WhatsApp</a>
              <Link href="/cases/cat-330dl-teryaet-moshchnost-na-goryachuyu" className="flex items-center gap-2 border border-[#FFC000] text-[#FFC000] px-6 py-3 rounded-lg font-semibold hover:bg-[#FFC000] hover:text-black"><PlayCircle className="w-5 h-5" />Реальный CAT 330DL</Link>
              <button onClick={() => setIsLeadFormOpen(true)} className="border border-white/30 px-6 py-3 rounded-lg font-semibold hover:border-[#FFC000] hover:text-[#FFC000]">Оставить заявку</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#1a1a1a]"><div className="container mx-auto px-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[
        { icon: <Gauge className="w-6 h-6 text-[#FFC000]" />, title: "Проверка под нагрузкой", desc: "Снимаем параметры тогда, когда реально проявляется неисправность" },
        { icon: <Shield className="w-6 h-6 text-[#FFC000]" />, title: "Гарантия по условиям работ", desc: "До 6 месяцев при соблюдении согласованных рекомендаций и условий эксплуатации" },
        { icon: <PlayCircle className="w-6 h-6 text-[#FFC000]" />, title: "Реальные CAT на видео", desc: "Показываем диагностику, ремонт и результат на настоящей технике" },
      ].map((item,i)=><div key={i} className="flex items-start gap-4 bg-[#222] rounded-xl p-5"><div className="shrink-0 mt-1">{item.icon}</div><div><h3 className="font-bold mb-1">{item.title}</h3><p className="text-white/60 text-sm">{item.desc}</p></div></div>)}</div></div></section>

      <section className="py-16"><div className="container mx-auto px-4"><h2 className="text-3xl font-bold mb-10">Что проверяем и <span className="text-[#FFC000]">ремонтируем</span></h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{services.map((service,i)=><div key={i} className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-4"><CheckCircle className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-white/90">{service}</span></div>)}</div></div></section>

      <section className="py-16 bg-[#111] border-y border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Реальные кейсы Caterpillar: ремонт и продажа запчастей</h2>
          <p className="text-white/70 leading-relaxed max-w-3xl mb-8">Смотрите выполненные работы, а не только перечень услуг. Результат конкретного кейса не заменяет диагностику вашей машины.</p>
          <div className="grid lg:grid-cols-3 gap-6">
            {catCases.map((item) => (
              <article key={item.href} data-cat-case className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/70 leading-relaxed mb-5">{item.description}</p>
                <Link href={item.href} className="inline-flex items-center gap-2 text-[#FFC000] font-semibold">{item.link}<ArrowRight className="w-4 h-4 shrink-0" /></Link>
              </article>
            ))}
          </div>
          <Link href="/projects" className="inline-block text-[#FFC000] underline underline-offset-4 mt-6">Другие работы, включая восстановление CAT 330D2L после затопления</Link>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Как согласуем диагностику и ремонт CAT</h2>
          <ol className="grid md:grid-cols-3 gap-6 list-none">
            {[
              { title: "1. Данные техники и симптом", text: "Отправьте модель, PIN или серийный номер, город и видео неисправности. Уточните: проблема возникает на холодную, после прогрева или при конкретной операции; приложите коды ошибок, если они есть." },
              { title: "2. Проверка причины", text: "Согласуем стоимость диагностики и выезда. Проверяем машину в условиях проявления неисправности. Параметры оцениваем по документации конкретной модификации, а не по универсальным цифрам для всех CAT." },
              { title: "3. Согласованное решение", text: "После диагностики отдельно рассчитываем ремонт и необходимые детали. Замену дорогостоящего узла обосновываем результатами проверки; цену, комплектацию и срок поставки согласуем до заказа." },
            ].map((step) => (
              <li key={step.title} className="bg-[#1a1a1a] rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#FFC000] mb-3">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-6 text-[#FFC000] underline underline-offset-4">
            <Link href="/services/mobile-repair/">Выездной ремонт спецтехники</Link>
            <Link href="/services/hydraulic-pumps/">Диагностика и ремонт гидронасосов</Link>
            <Link href="/services/hydraulic-motors/">Диагностика и ремонт гидромоторов</Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-bold mb-5">Гидронасосы, гидромоторы и запчасти Caterpillar</h2>
          <p className="text-white/70 leading-relaxed mb-5">Если нужна покупка, начните с каталога запчастей CAT. Модель машины — ориентир, но не подтверждение совместимости. Для подбора отправьте серийный номер техники, артикул и фото детали; для насоса — вал, фланец, порты и регулятор.</p>
          <p className="text-white/70 leading-relaxed mb-6">Наличие, цену, исполнение и срок поставки подтверждаем по конкретной позиции. Не переносим условия выполненной продажи на все детали Caterpillar.</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/catalog/brand/caterpillar/" className="bg-[#FFC000] text-black px-5 py-3 rounded-lg font-semibold">Каталог запчастей Caterpillar</Link>
            <Link href="/catalog/hydraulic-pump-267-2755-10r-8708-fits-for-caterpillar-cat-420e-430e-432e-434e-442e-444e/" className="border border-[#FFC000] text-[#FFC000] px-5 py-3 rounded-lg font-semibold">Гидронасос 267-2755 для CAT 432E</Link>
          </div>
          <Link href="/blog/remont-gidronasosa-cat/" className="inline-block text-[#FFC000] underline underline-offset-4 mt-6">Ремонт гидронасоса CAT: порядок работ и расчёт стоимости</Link>
        </div>
      </section>

      <section className="py-16 bg-[#1a1a1a]"><div className="container mx-auto px-4"><h2 className="text-3xl font-bold mb-10">Модели <span className="text-[#FFC000]">Caterpillar</span>, с которыми работаем</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{catModels.map((item,i)=><div key={i} className="bg-[#222] rounded-xl p-5 border border-white/5 hover:border-[#FFC000]/30"><h3 className="font-bold text-[#FFC000] mb-2">{item.model}</h3><p className="text-white/60 text-sm">{item.desc}</p></div>)}</div></div></section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8">Вопросы о ремонте и запчастях CAT</h2>
          <div data-cat-faq className="space-y-6">
            {catFaq.map((item) => (
              <div key={item.question} className="border-b border-white/10 pb-6">
                <h3 className="text-xl font-bold mb-3">{item.question}</h3>
                <p className="text-white/70 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#FFC000]"><div className="container mx-auto px-4 text-center max-w-3xl"><h2 className="text-3xl font-bold text-black mb-4">Похожая проблема на CAT?</h2><p className="text-black/70 mb-3 text-lg">Сначала определяем фактическую причину неисправности. После диагностики отдельно рассчитываем ремонт и необходимые запчасти.</p><p className="text-black font-bold text-xl mb-8">Диагностика платная — стоимость согласуем до выезда.</p><div className="flex flex-wrap justify-center gap-4"><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900"><MessageCircle className="w-6 h-6"/>WhatsApp</a><a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100"><Phone className="w-6 h-6"/>{PHONE_NUMBER}</a></div></div></section>

      <section className="py-12 bg-[#111111]"><div className="container mx-auto px-4"><h2 className="text-xl font-bold mb-6 text-white/80">Другие бренды</h2><div className="flex flex-wrap gap-3">{[{name:"Komatsu",href:"/brands/komatsu"},{name:"Hitachi",href:"/brands/hitachi"},{name:"Hyundai",href:"/brands/hyundai"}].map((brand)=><Link key={brand.href} href={brand.href}><span className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 hover:border-[#FFC000]/50 text-white/70 hover:text-[#FFC000] px-4 py-2 rounded-lg text-sm">{brand.name}<ArrowRight className="w-3 h-3"/></span></Link>)}</div></div></section>

      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}><DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-lg"><DialogHeader><DialogTitle className="text-white">Заявка на диагностику CAT</DialogTitle></DialogHeader><B2BLeadForm onSuccess={() => setIsLeadFormOpen(false)} /></DialogContent></Dialog>
    </div>
  );
}
