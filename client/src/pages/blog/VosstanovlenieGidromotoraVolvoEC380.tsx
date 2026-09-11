import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { ArrowLeft, Phone, MessageCircle, CheckCircle, AlertTriangle, Gauge, Wrench } from "lucide-react";

const PHONE = "+77714177925";
const WHATSAPP = "77714177925";

export default function VosstanovlenieGidromotoraVolvoEC380() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Volvo EC380 не едет: как диагностировать гидромотор хода и гидросистему",
    description: "Практическое руководство ACA Hydraulic: что проверять, если Volvo EC380 потерял ход, одна гусеница слабее или проблема усиливается после прогрева.",
    dateModified: "2026-09-12",
    author: { "@type": "Organization", name: "ACA Hydraulic" },
    publisher: { "@id": "https://acahydraulic.kz/#business" },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://acahydraulic.kz/blog/vosstanovlenie-gidromotora-volvo-ec380" },
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Volvo EC380 не едет: диагностика гидромотора хода | ACA Hydraulic"
        description="Что проверять, если Volvo EC380 потерял ход, одна гусеница слабее или неисправность проявляется после прогрева. Гидромотор, давление, клапаны, насос и управление."
        keywords="Volvo EC380 не едет, гидромотор хода Volvo EC380, ремонт гидравлики Volvo, диагностика хода экскаватора Volvo"
        canonical="/blog/vosstanovlenie-gidromotora-volvo-ec380"
        breadcrumbs={[{ name: "Блог", url: "/blog" }, { name: "Volvo EC380 — диагностика хода", url: "/blog/vosstanovlenie-gidromotora-volvo-ec380" }]}
        schema={articleSchema}
        faq={[
          {
            question: "Почему Volvo EC380 может потерять ход?",
            answer: "Причина может быть в гидромоторе хода, тормозном и клапанном блоке, управляющем давлении, главном насосе, внутренних утечках или механической части привода. Точный вывод делают после сравнительных измерений под нагрузкой.",
          },
          {
            question: "Если одна гусеница слабее, обязательно менять гидромотор?",
            answer: "Нет. Сначала сравнивают давление и реакцию обеих сторон, проверяют управляющий контур, клапаны, утечки и подачу насоса. Замена гидромотора без подтверждения причины может не устранить неисправность.",
          },
          {
            question: "Сколько стоит выездная диагностика?",
            answer: "Выездная комплексная диагностика ACA Hydraulic начинается от 200 000 ₸. Ремонт, запчасти и дополнительные расходы рассчитываются отдельно после диагностики.",
          },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#FFC000]">Главная</Link><span className="mx-2">/</span><Link href="/blog" className="hover:text-[#FFC000]">Блог</Link><span className="mx-2">/</span><span className="text-white">Volvo EC380</span>
      </div>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FFC000] mb-8"><ArrowLeft size={16}/>Назад к блогу</Link>

        <div className="flex flex-wrap gap-2 mb-6">{["Volvo CE","Экскаваторы","Гидромотор хода","Диагностика"].map(tag => <span key={tag} className="px-3 py-1 bg-[#FFC000]/10 border border-[#FFC000]/20 rounded text-[#FFC000] text-xs font-bold uppercase tracking-wider">{tag}</span>)}</div>

        <h1 className="font-bebas text-4xl md:text-6xl uppercase leading-tight mb-6">Volvo EC380 <span className="text-[#FFC000]">не едет</span>: что проверять до замены гидромотора</h1>
        <p className="text-xl text-gray-300 leading-relaxed mb-10">Полная или частичная потеря хода не означает автоматически неисправность гидромотора. На тяжёлом экскаваторе нужно сравнить работу обеих сторон и понять, где именно теряется давление, расход или управляющий сигнал.</p>

        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-5 flex items-center gap-3"><AlertTriangle className="text-[#FFC000]"/>Типичные симптомы</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Одна гусеница не движется или заметно слабее второй","Машина уходит в сторону при прямолинейном ходе","Ход ухудшается после прогрева гидравлического масла","Под нагрузкой двигатель проседает, но машина почти не двигается","Появились рывки, задержка включения или нестабильный ход","После ремонта одного узла проблема осталась"].map(item => <div key={item} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 flex gap-3"><CheckCircle className="w-5 h-5 text-[#FFC000] shrink-0 mt-0.5"/><span className="text-gray-300">{item}</span></div>)}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Что может быть причиной</h2>
          <p className="text-gray-300 leading-relaxed mb-5">У похожих симптомов несколько возможных источников. Поэтому диагноз «гидромотор» без измерений — риск дорогой замены исправного агрегата.</p>
          <div className="space-y-3">
            {[
              ["Гидромотор хода", "Внутренние утечки, износ вращающей группы, проблемы тормозного или клапанного блока."],
              ["Управляющий контур", "Недостаточное пилотное давление или неправильная работа управляющего клапана не дают мотору полноценно включиться."],
              ["Главный насос", "Секция насоса может не обеспечивать требуемые параметры именно на контуре хода."],
              ["Распределитель и клапаны", "Подклинивание золотника, утечки или неисправность предохранительного/перепускного клапана меняют поток и давление."],
              ["Механический привод", "Редуктор, тормоз или соединение после гидромотора также могут ограничивать движение."],
            ].map(([title,desc]) => <div key={title} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-5"><h3 className="font-bold text-[#FFC000] mb-2">{title}</h3><p className="text-gray-400 leading-relaxed">{desc}</p></div>)}
          </div>
        </section>

        <section className="mb-10 bg-[#181818] border border-[#FFC000]/25 rounded-xl p-6 md:p-8">
          <h2 className="font-bebas text-3xl uppercase mb-5 flex items-center gap-3"><Gauge className="text-[#FFC000]"/>Как строится диагностика</h2>
          <ol className="space-y-4 text-gray-300">
            <li><strong className="text-white">1. Сравниваем левую и правую стороны.</strong> Фиксируем, одинаково ли проявляется дефект и при каких режимах.</li>
            <li><strong className="text-white">2. Измеряем давление под нагрузкой.</strong> Не только на холостом ходу, а в момент, когда ход реально проседает.</li>
            <li><strong className="text-white">3. Проверяем управляющее давление и клапаны.</strong> Убеждаемся, что команда доходит до исполнительного узла.</li>
            <li><strong className="text-white">4. Оцениваем внутренние утечки.</strong> Это помогает отделить гидромотор от проблем подачи и управления.</li>
            <li><strong className="text-white">5. Только после этого принимаем решение о демонтаже.</strong> Разборка и ремонт должны опираться на подтверждённую неисправность.</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Чего не стоит делать</h2>
          <div className="bg-red-950/15 border border-red-500/20 rounded-xl p-6 text-gray-300 leading-relaxed">Не заказывать гидромотор только потому, что «не едет гусеница». Не регулировать давление вслепую. Не менять насос и мотор одновременно без замеров. Это может увеличить стоимость ремонта и затруднить поиск первоначальной причины.</div>
        </section>

        <section className="mb-12 bg-[#FFC000] text-black rounded-xl p-6 md:p-8">
          <h2 className="font-bebas text-3xl uppercase mb-3">Выездная диагностика Volvo CE</h2>
          <p className="text-black/75 mb-3">ACA Hydraulic проверяет гидросистему непосредственно на объекте. Перед выездом желательно отправить модель, фото шильдика, местонахождение и короткое видео неисправности.</p>
          <p className="font-bold text-xl mb-6">Комплексная диагностика — от 200 000 ₸. Ремонт и запчасти отдельно.</p>
          <div className="flex flex-wrap gap-3"><a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Здравствуйте! Volvo EC380: проблема с ходом. Стоимость диагностики от 200 000 ₸ понимаю. Могу отправить видео и шильдик.")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold"><MessageCircle className="w-5 h-5"/>WhatsApp</a><a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold"><Phone className="w-5 h-5"/>Позвонить</a></div>
        </section>

        <div className="border-t border-white/10 pt-8 flex flex-wrap gap-4"><Link href="/brands/volvo" className="text-[#FFC000] hover:underline">Диагностика Volvo CE</Link><Link href="/services/hydraulic-motors" className="text-[#FFC000] hover:underline">Диагностика гидромоторов</Link><Link href="/projects" className="text-[#FFC000] hover:underline">Реальные видеокейсы ACA Hydraulic</Link></div>
      </article>
    </div>
  );
}
