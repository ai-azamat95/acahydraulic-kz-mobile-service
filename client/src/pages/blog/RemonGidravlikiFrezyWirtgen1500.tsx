import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { ArrowLeft, Phone, MessageCircle, CheckCircle, AlertTriangle, PlayCircle, ExternalLink, Gauge } from "lucide-react";
import { publicAsset } from "@/lib/assets";

const WIRTGEN_VIDEO = "https://www.tiktok.com/@acaservice01/video/7530533236984876344";
const WHATSAPP = "77714177925";

const WIRTGEN_PHOTOS = [
  { url: publicAsset("webdev-static-assets/wirtgen-1500-1.webp"), alt: "Диагностика дорожной фрезы Wirtgen 1500 на объекте" },
  { url: publicAsset("webdev-static-assets/wirtgen-1500-2.webp"), alt: "Проверка гидравлики Wirtgen 1500 с измерением давления" },
  { url: publicAsset("webdev-static-assets/wirtgen-1500-6.webp"), alt: "Проверка узлов гидросистемы Wirtgen 1500" },
];

export default function RemonGidravlikiFrezyWirtgen1500() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Wirtgen 1500 не едет: выездная диагностика хода и гидросистемы",
    description: "Реальный выезд ACA Hydraulic на Wirtgen 1500: отсутствие нормального хода, проверка давления, электроклапанов, датчиков скорости и гидросистемы.",
    dateModified: "2026-09-12",
    author: { "@type": "Organization", name: "ACA Hydraulic" },
    publisher: { "@id": "https://acahydraulic.kz/#business" },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://acahydraulic.kz/blog/remont-gidravliki-frezy-wirtgen-1500" },
    image: WIRTGEN_PHOTOS[0].url,
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Wirtgen 1500 не едет: диагностика хода и гидравлики | ACA Hydraulic"
        description="Реальный выезд на Wirtgen 1500: некорректная работа хода. Проверка гидросистемы, давления, электроклапанов и датчиков скорости. Видео и фото диагностики."
        keywords="Wirtgen 1500 не едет, диагностика Wirtgen W1500, ремонт гидравлики Wirtgen, дорожная фреза нет хода, ремонт дорожной фрезы Казахстан"
        canonical="/blog/remont-gidravliki-frezy-wirtgen-1500"
        breadcrumbs={[{ name: "Блог", url: "/blog" }, { name: "Wirtgen 1500 — диагностика хода", url: "/blog/remont-gidravliki-frezy-wirtgen-1500" }]}
        schema={articleSchema}
        faq={[
          {
            question: "Почему Wirtgen 1500 может потерять ход?",
            answer: "Причина может быть в гидромоторе, насосе, клапанах, управляющем давлении, электроклапанах, датчиках скорости или электрическом управлении. Определять неисправный узел только по одному симптому нельзя.",
          },
          {
            question: "Что проверять, если проблема усиливается после прогрева?",
            answer: "Нужно сравнить параметры в холодном и прогретом состоянии, измерить рабочее и управляющее давление, оценить внутренние утечки и работу управляющих элементов.",
          },
          {
            question: "Сколько стоит выездная диагностика Wirtgen?",
            answer: "Комплексная выездная диагностика начинается от 200 000 ₸. Ремонт, запчасти и дополнительные расходы рассчитываются отдельно после подтверждения причины неисправности.",
          },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="container mx-auto px-4 py-4 text-sm text-gray-500"><Link href="/" className="hover:text-[#FFC000]">Главная</Link><span className="mx-2">/</span><Link href="/blog" className="hover:text-[#FFC000]">Блог</Link><span className="mx-2">/</span><span className="text-white">Wirtgen 1500</span></div>

      <article className="max-w-4xl mx-auto px-4 py-10">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FFC000] mb-8"><ArrowLeft size={16}/>Назад в блог</Link>
        <div className="flex flex-wrap gap-2 mb-6"><span className="bg-[#FFC000]/10 border border-[#FFC000]/20 text-[#FFC000] px-3 py-1 rounded text-xs font-bold uppercase">Реальный выезд</span><span className="bg-white/5 border border-white/10 text-white/60 px-3 py-1 rounded text-xs font-bold uppercase">Wirtgen 1500</span></div>
        <h1 className="font-bebas text-4xl md:text-6xl leading-tight mb-6">Wirtgen 1500: <span className="text-[#FFC000]">нет нормального хода</span> — что проверяли на объекте</h1>
        <p className="text-xl text-gray-300 leading-relaxed mb-8">Клиент обратился с неисправностью движения дорожной фрезы. На объекте команда ACA Hydraulic проверяла ходовую и гидросистему, рабочее давление, электроклапаны и датчики скорости. Этот выезд опубликован в нашем TikTok.</p>

        <a href={WIRTGEN_VIDEO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#FFC000] text-black px-6 py-3 rounded-lg font-bold mb-10"><PlayCircle className="w-5 h-5"/>Смотреть реальную диагностику <ExternalLink className="w-4 h-4"/></a>

        <img src={WIRTGEN_PHOTOS[0].url} alt={WIRTGEN_PHOTOS[0].alt} className="w-full rounded-xl mb-10 object-cover max-h-[500px]" loading="lazy" />

        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4 flex items-center gap-3"><AlertTriangle className="text-[#FFC000]"/>Почему нельзя сразу обвинять гидромотор</h2>
          <p className="text-gray-300 leading-relaxed mb-4">Отсутствие хода — конечный симптом. До гидромотора команда проходит через электрическое управление, электроклапаны, управляющее давление и распределение потока. Кроме того, нужный расход должен обеспечить насос.</p>
          <p className="text-gray-300 leading-relaxed">Поэтому замена гидромотора или «регулировка давления» без сравнительных измерений может не решить проблему и добавить лишние расходы.</p>
        </section>

        <section className="mb-10 bg-[#181818] border border-[#FFC000]/25 rounded-xl p-6 md:p-8">
          <h2 className="font-bebas text-3xl uppercase mb-5 flex items-center gap-3"><Gauge className="text-[#FFC000]"/>Что проверяем при неисправности хода</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Рабочее давление контура хода","Управляющее давление и команду на включение","Работу электроклапанов","Сигналы датчиков скорости и электрические цепи","Подачу и реакцию гидронасоса","Внутренние утечки гидромотора и клапанного блока","Поведение системы после прогрева","Механическую часть привода после гидромотора"].map(item => <div key={item} className="flex gap-3 bg-[#111] border border-white/10 rounded-lg p-4"><CheckCircle className="w-5 h-5 text-[#FFC000] shrink-0 mt-0.5"/><span className="text-gray-300">{item}</span></div>)}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-4 mb-10">{WIRTGEN_PHOTOS.slice(1).map(photo => <img key={photo.url} src={photo.url} alt={photo.alt} className="w-full rounded-xl object-cover h-64" loading="lazy" />)}</div>

        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Если ход пропадает только на горячую</h2>
          <p className="text-gray-300 leading-relaxed">Температурная зависимость действительно может указывать на рост внутренних утечек, но сама по себе не показывает, в каком именно узле они находятся. Нужно повторить измерения после прогрева и сравнить параметры с холодной машиной.</p>
        </section>

        <section className="bg-[#FFC000] text-black rounded-xl p-6 md:p-8 mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-3">Выездная диагностика Wirtgen</h2>
          <p className="text-black/75 mb-3">Перед выездом отправьте модель, местонахождение, фото шильдика и видео неисправности.</p>
          <p className="font-bold text-xl mb-6">Комплексная диагностика — от 200 000 ₸. Ремонт и запчасти отдельно.</p>
          <div className="flex flex-wrap gap-3"><a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Здравствуйте! Wirtgen: проблема с ходом. Стоимость диагностики от 200 000 ₸ понимаю. Могу отправить видео и шильдик.")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold"><MessageCircle className="w-5 h-5"/>WhatsApp</a><a href="tel:+77714177925" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold"><Phone className="w-5 h-5"/>Позвонить</a></div>
        </section>

        <div className="border-t border-white/10 pt-8 flex flex-wrap gap-4"><Link href="/brands/wirtgen" className="text-[#FFC000] hover:underline">Диагностика Wirtgen</Link><Link href="/projects" className="text-[#FFC000] hover:underline">Реальные видеокейсы</Link></div>
      </article>
    </div>
  );
}
