import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { ArrowLeft, Phone, MessageCircle, CheckCircle, AlertTriangle, Wrench } from "lucide-react";
import { publicAsset } from "@/lib/assets";

const WHATSAPP = "77714177925";
const ENGINE_CASE_PATH = "/cases/shantui-sd32-postavka-dvigatelya-cummins-nta855";
const ENGINE_PRODUCT_PATH = "/parts/engines-complete/shantui-sd32-cummins-nta855-c360s10";
const SHANTUI_PHOTOS = [
  { url: publicAsset("webdev-static-assets/shantui-sd32-6.webp"), alt: "Работы с бульдозером SHANTUI SD32" },
  { url: publicAsset("webdev-static-assets/shantui-sd32-1.webp"), alt: "Разборка узлов SHANTUI SD32" },
  { url: publicAsset("webdev-static-assets/shantui-sd32-2.webp"), alt: "Работы по гидравлической системе SHANTUI SD32" },
  { url: publicAsset("webdev-static-assets/shantui-sd32-3.webp"), alt: "Проверка гидравлики SHANTUI SD32" },
];

export default function KapitalnyiRemonShantuiSD32() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Ремонт SHANTUI SD32: диагностика гидравлики перед капитальным ремонтом",
    description: "Что проверить перед ремонтом SHANTUI SD32: давление, насосы, гидромоторы, цилиндры, распределитель и загрязнение гидросистемы.",
    datePublished: "2026-03-18",
    dateModified: "2026-09-26",
    author: { "@type": "Organization", name: "ACA Hydraulic" },
    publisher: { "@id": "https://acahydraulic.kz/#business" },
    mainEntityOfPage: "https://acahydraulic.kz/blog/kapitalnyy-remont-shantui-sd32/",
    image: SHANTUI_PHOTOS[0].url,
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Ремонт SHANTUI SD32: диагностика гидравлики | ACA Hydraulic"
        description="Ремонт SHANTUI SD32: что проверить до заказа деталей — давление, насосы, гидромоторы, распределитель, цилиндры и загрязнение гидросистемы."
        keywords="ремонт SHANTUI SD32, капитальный ремонт SHANTUI, диагностика гидравлики SD32, ремонт бульдозера SHANTUI, гидронасос SHANTUI SD32"
        canonical="/blog/kapitalnyy-remont-shantui-sd32"
        breadcrumbs={[{ name: "Блог", url: "/blog" }, { name: "SHANTUI SD32 — диагностика и капремонт", url: "/blog/kapitalnyy-remont-shantui-sd32" }]}
        schema={articleSchema}
        faq={[
          {
            question: "Можно ли заранее назвать цену капитального ремонта SHANTUI SD32?",
            answer: "Точную стоимость до диагностики и дефектовки назвать нельзя. Объём зависит от состояния насосов, гидромоторов, цилиндров, распределителя, загрязнения системы и необходимости замены деталей.",
          },
          {
            question: "Что проверяют перед ремонтом гидравлики SD32?",
            answer: "Измеряют рабочее и управляющее давление, оценивают работу насосов и гидромоторов, проверяют клапаны, распределитель, цилиндры, фильтры, масло и наличие продуктов износа.",
          },
          {
            question: "Сколько стоит выездная диагностика?",
            answer: "Комплексная выездная диагностика ACA Hydraulic начинается от 200 000 ₸. Ремонт, запчасти и дополнительные расходы рассчитываются отдельно после диагностики.",
          },
        ]}
      />

      <div className="container mx-auto px-4 py-4 text-sm text-gray-500"><Link href="/" className="hover:text-[#FFC000]">Главная</Link><span className="mx-2">/</span><Link href="/blog" className="hover:text-[#FFC000]">Блог</Link><span className="mx-2">/</span><span className="text-white">SHANTUI SD32</span></div>

      <article className="max-w-4xl mx-auto px-4 py-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FFC000] mb-8"><ArrowLeft size={16}/>Назад в блог</Link>
        <div className="flex flex-wrap gap-2 mb-6"><span className="bg-[#FFC000]/10 border border-[#FFC000]/20 text-[#FFC000] px-3 py-1 rounded text-xs font-bold uppercase">SHANTUI SD32</span><span className="bg-white/5 border border-white/10 text-white/60 px-3 py-1 rounded text-xs font-bold uppercase">Технический разбор</span></div>
        <h1 className="font-bebas text-4xl md:text-6xl leading-tight mb-6">Ремонт SHANTUI SD32: <span className="text-[#FFC000]">как определить реальный объём работ</span></h1>
        <p className="text-xl text-gray-300 leading-relaxed mb-8">Капитальный ремонт тяжёлого бульдозера нельзя корректно оценить только по модели или жалобе оператора. До заказа деталей нужно понять состояние гидросистемы и разделить неисправности по узлам.</p>

        <img src={SHANTUI_PHOTOS[0].url} alt={SHANTUI_PHOTOS[0].alt} className="w-full rounded-xl mb-10 object-cover max-h-[500px]" loading="lazy" />

        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-5 flex items-center gap-3"><AlertTriangle className="text-[#FFC000]"/>Когда нужна глубокая диагностика</h2>
          <div className="grid md:grid-cols-2 gap-4">{["Бульдозер теряет тягу или скорость","Гидравлика становится слабее после прогрева","Отвал или рыхлитель работают медленно","Давление нестабильно или не достигает рабочего уровня","В масле или фильтрах есть продукты износа","После предыдущего ремонта проблема возвращается"].map(item => <div key={item} className="flex gap-3 bg-[#1a1a1a] border border-white/10 rounded-lg p-4"><CheckCircle className="w-5 h-5 text-[#FFC000] shrink-0 mt-0.5"/><span className="text-gray-300">{item}</span></div>)}</div>
        </section>

        <section className="mb-10 bg-[#181818] border border-[#FFC000]/25 rounded-xl p-6 md:p-8">
          <h2 className="font-bebas text-3xl uppercase mb-5 flex items-center gap-3"><Wrench className="text-[#FFC000]"/>Что входит в дефектовку гидросистемы</h2>
          <div className="space-y-4 text-gray-300">
            <p><strong className="text-white">Главный насос.</strong> Проверяется способность создавать требуемые параметры под нагрузкой, реакция регулирования и признаки внутренних утечек.</p>
            <p><strong className="text-white">Гидромоторы и ход.</strong> Сравнивается работа сторон, управляющее давление, утечки и состояние клапанных блоков.</p>
            <p><strong className="text-white">Распределитель и клапаны.</strong> Проверяются золотники, предохранительные и регулирующие элементы, возможные внутренние перепуски.</p>
            <p><strong className="text-white">Гидроцилиндры.</strong> Оцениваются наружные и внутренние утечки, состояние штоков и способность удерживать нагрузку.</p>
            <p><strong className="text-white">Масло и фильтрация.</strong> Наличие стружки или продуктов износа меняет весь план ремонта: систему нужно очищать, а источник загрязнения — локализовать.</p>
          </div>
        </section>

        <div className="grid md:grid-cols-3 gap-4 mb-10">{SHANTUI_PHOTOS.slice(1).map(photo => <img key={photo.url} src={photo.url} alt={photo.alt} className="w-full rounded-xl object-cover h-56" loading="lazy" />)}</div>

        <section className="mb-10 rounded-xl border border-[#FFC000]/30 bg-[#181818] p-6 md:p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-[#FFC000]">Двигатель SHANTUI SD32</p>
          <h2 className="mt-2 font-bebas text-3xl uppercase">Если неисправность связана с ДВС</h2>
          <p className="mt-4 leading-relaxed text-gray-300">
            Когда дефект относится не к гидросистеме, а к двигателю, решение выбирают после проверки шильдика, полного индекса и комплектации. Для серии Cummins NTA855 одного названия серии недостаточно, чтобы подтвердить совместимость.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link href={ENGINE_CASE_PATH} className="rounded-lg border border-white/10 bg-black/30 p-4 text-gray-200 transition-colors hover:border-[#FFC000]/60 hover:text-[#FFC000]">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#FFC000]">Выполненный заказ</span>
              <span className="mt-2 block font-bold">Поставка и установка Cummins NTA855 на SHANTUI SD32</span>
            </Link>
            <Link href={ENGINE_PRODUCT_PATH} className="rounded-lg border border-white/10 bg-black/30 p-4 text-gray-200 transition-colors hover:border-[#FFC000]/60 hover:text-[#FFC000]">
              <span className="block text-xs font-bold uppercase tracking-wider text-[#FFC000]">Карточка двигателя</span>
              <span className="mt-2 block font-bold">Cummins NTA855-C360S10 в сборе</span>
            </Link>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Почему нельзя обещать срок до дефектовки</h2>
          <p className="text-gray-300 leading-relaxed">Срок зависит от того, какие узлы реально повреждены, есть ли загрязнение системы, требуется ли восстановление деталей и какие запчасти доступны. Поэтому корректный порядок — диагностика → дефектовка → перечень работ и деталей → согласование срока и бюджета.</p>
        </section>

        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Что подготовить владельцу техники</h2>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6"><ul className="space-y-3 text-gray-300"><li>• фото шильдика и точную модель;</li><li>• видео работы техники под нагрузкой;</li><li>• описание, на холодную или на горячую проявляется неисправность;</li><li>• перечень узлов, которые уже меняли или регулировали;</li><li>• местонахождение объекта.</li></ul></div>
        </section>

        <section className="bg-[#FFC000] text-black rounded-xl p-6 md:p-8 mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-3">Выездная диагностика SHANTUI</h2>
          <p className="text-black/75 mb-3">После диагностики формируем фактический перечень неисправностей и отдельно согласуем ремонт и запчасти.</p>
          <p className="font-bold text-xl mb-6">Комплексная диагностика — от 200 000 ₸.</p>
          <div className="flex flex-wrap gap-3"><a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Здравствуйте! SHANTUI SD32: нужна диагностика. Стоимость от 200 000 ₸ понимаю. Могу отправить видео и шильдик.")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold"><MessageCircle className="w-5 h-5"/>WhatsApp</a><a href="tel:+77714177925" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold"><Phone className="w-5 h-5"/>Позвонить</a></div>
        </section>

        <div className="border-t border-white/10 pt-8 flex flex-wrap gap-4"><Link href="/brands/shantui" className="text-[#FFC000] hover:underline">Диагностика SHANTUI</Link><Link href="/services/bulldozer-repair" className="text-[#FFC000] hover:underline">Ремонт бульдозеров</Link><Link href="/parts/engines-complete" className="text-[#FFC000] hover:underline">Двигатели в сборе</Link><Link href="/projects" className="text-[#FFC000] hover:underline">Реальные видеокейсы</Link></div>
      </article>
    </div>
  );
}
