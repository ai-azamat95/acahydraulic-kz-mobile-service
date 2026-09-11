import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { ArrowLeft, Phone, MessageCircle, CheckCircle, AlertTriangle, Gauge } from "lucide-react";

const PHONE = "+77714177925";
const WHATSAPP = "77714177925";

export default function RemonGidravlikiLiebherrR950() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Liebherr R950 теряет мощность: как диагностировать гидросистему и главный насос",
    description: "Практическое руководство ACA Hydraulic: что проверять, если Liebherr R950 медленно работает, теряет усилие ковша или давление гидросистемы нестабильно.",
    dateModified: "2026-09-12",
    author: { "@type": "Organization", name: "ACA Hydraulic" },
    publisher: { "@id": "https://acahydraulic.kz/#business" },
    mainEntityOfPage: { "@type": "WebPage", "@id": "https://acahydraulic.kz/blog/remont-gidravliki-liebherr-r950" },
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Liebherr R950 теряет мощность: диагностика гидравлики | ACA Hydraulic"
        description="Что проверять, если Liebherr R950 потерял усилие ковша, медленно работает или не держит давление. Насос, регулятор, клапаны, распределитель и управляющий контур."
        keywords="Liebherr R950 теряет мощность, ремонт гидравлики Liebherr R950, диагностика гидронасоса Liebherr, низкое давление Liebherr"
        canonical="/blog/remont-gidravliki-liebherr-r950"
        breadcrumbs={[{ name: "Блог", url: "/blog" }, { name: "Liebherr R950 — диагностика гидравлики", url: "/blog/remont-gidravliki-liebherr-r950" }]}
        schema={articleSchema}
        faq={[
          {
            question: "Почему Liebherr R950 может потерять усилие ковша и стрелы?",
            answer: "Причина может быть в главном насосе, его регуляторе, предохранительных и управляющих клапанах, распределителе, пилотном контуре или внутренних утечках. Диагноз подтверждают замерами под нагрузкой.",
          },
          {
            question: "Низкое давление означает неисправный насос?",
            answer: "Не обязательно. Низкое давление может возникать из-за регулирования, клапанов, утечек или управляющего сигнала. Перед демонтажем насоса нужно локализовать источник просадки.",
          },
          {
            question: "Сколько стоит выездная диагностика Liebherr?",
            answer: "Выездная комплексная диагностика ACA Hydraulic начинается от 200 000 ₸. Ремонт, запчасти и дополнительные расходы рассчитываются отдельно после диагностики.",
          },
        ]}
      />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#FFC000]">Главная</Link><span className="mx-2">/</span><Link href="/blog" className="hover:text-[#FFC000]">Блог</Link><span className="mx-2">/</span><span className="text-white">Liebherr R950</span>
      </div>

      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FFC000] mb-8"><ArrowLeft size={16}/>Назад к блогу</Link>

        <div className="flex flex-wrap gap-2 mb-6">{["Liebherr","Экскаваторы","Гидронасос","Диагностика"].map(tag => <span key={tag} className="px-3 py-1 bg-[#FFC000]/10 border border-[#FFC000]/20 rounded text-[#FFC000] text-xs font-bold uppercase tracking-wider">{tag}</span>)}</div>

        <h1 className="font-bebas text-4xl md:text-6xl uppercase leading-tight mb-6">Liebherr R950 <span className="text-[#FFC000]">теряет мощность</span>: как искать причину</h1>
        <p className="text-xl text-gray-300 leading-relaxed mb-10">Когда ковш и стрела становятся медленными или не развивают привычное усилие, замена главного насоса не должна быть первым действием. Сначала нужно понять, где именно система теряет давление или управление.</p>

        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-5 flex items-center gap-3"><AlertTriangle className="text-[#FFC000]"/>Симптомы, которые требуют комплексной проверки</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {["Ковш или стрела заметно слабее под нагрузкой","Все операции стали медленнее","Неисправность усиливается после прогрева","Двигатель загружается, а гидравлика не развивает усилие","Давление нестабильно или отличается по операциям","После регулировки или замены деталей проблема возвращается"].map(item => <div key={item} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 flex gap-3"><CheckCircle className="w-5 h-5 text-[#FFC000] shrink-0 mt-0.5"/><span className="text-gray-300">{item}</span></div>)}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Основные направления поиска</h2>
          <div className="space-y-3">
            {[
              ["Главный насос", "Износ или внутренние утечки могут снижать доступный расход и давление, особенно после нагрева."],
              ["Регулятор насоса", "Неправильное управление производительностью насоса может имитировать механический износ самого насоса."],
              ["Предохранительные и управляющие клапаны", "Неправильная настройка, подклинивание или утечки могут сбрасывать давление раньше времени."],
              ["Основной распределитель", "Проблемы золотников и внутренних утечек влияют на отдельные операции или совмещение движений."],
              ["Пилотный контур и электрика", "Недостаточный управляющий сигнал, датчики или соленоиды могут ограничивать работу гидросистемы."],
              ["Гидроцилиндры", "Внутренний перепуск в цилиндре может давать слабое усилие даже при исправном насосе."],
            ].map(([title,desc]) => <div key={title} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-5"><h3 className="font-bold text-[#FFC000] mb-2">{title}</h3><p className="text-gray-400 leading-relaxed">{desc}</p></div>)}
          </div>
        </section>

        <section className="mb-10 bg-[#181818] border border-[#FFC000]/25 rounded-xl p-6 md:p-8">
          <h2 className="font-bebas text-3xl uppercase mb-5 flex items-center gap-3"><Gauge className="text-[#FFC000]"/>Правильная последовательность диагностики</h2>
          <ol className="space-y-4 text-gray-300">
            <li><strong className="text-white">1. Фиксируем жалобу по операциям.</strong> Важно понять, проблема общая или локальная.</li>
            <li><strong className="text-white">2. Измеряем давление под нагрузкой.</strong> Сравниваем контуры и проверяем систему в холодном и прогретом состоянии, если дефект зависит от температуры.</li>
            <li><strong className="text-white">3. Проверяем управляющий контур.</strong> Насос должен получать правильную команду на изменение производительности.</li>
            <li><strong className="text-white">4. Локализуем внутренние утечки.</strong> Проверяем клапаны, распределитель и исполнительные механизмы.</li>
            <li><strong className="text-white">5. Только затем принимаем решение о демонтаже насоса.</strong> Это снижает риск дорогой ненужной замены.</li>
          </ol>
        </section>

        <section className="mb-10">
          <h2 className="font-bebas text-3xl uppercase mb-4">Почему опасно регулировать давление без диагноза</h2>
          <div className="bg-red-950/15 border border-red-500/20 rounded-xl p-6 text-gray-300 leading-relaxed">Попытка просто «поднять давление» может скрыть исходную неисправность и увеличить нагрузку на насос, шланги, цилиндры и клапаны. Если система не держит параметр из-за утечки или износа, регулировочный винт не устраняет причину.</div>
        </section>

        <section className="mb-12 bg-[#FFC000] text-black rounded-xl p-6 md:p-8">
          <h2 className="font-bebas text-3xl uppercase mb-3">Выездная диагностика Liebherr</h2>
          <p className="text-black/75 mb-3">Перед выездом отправьте модель, фото шильдика, местонахождение и видео работы техники. Если ранее меняли насос, регулятор или клапаны — сообщите это заранее.</p>
          <p className="font-bold text-xl mb-6">Комплексная диагностика — от 200 000 ₸. Ремонт и запчасти отдельно.</p>
          <div className="flex flex-wrap gap-3"><a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Здравствуйте! Liebherr R950: проблема с мощностью/давлением. Стоимость диагностики от 200 000 ₸ понимаю. Могу отправить видео и шильдик.")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-bold"><MessageCircle className="w-5 h-5"/>WhatsApp</a><a href={`tel:${PHONE}`} className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg font-bold"><Phone className="w-5 h-5"/>Позвонить</a></div>
        </section>

        <div className="border-t border-white/10 pt-8 flex flex-wrap gap-4"><Link href="/brands/liebherr" className="text-[#FFC000] hover:underline">Диагностика Liebherr</Link><Link href="/services/hydraulic-pumps" className="text-[#FFC000] hover:underline">Диагностика гидронасосов</Link><Link href="/projects" className="text-[#FFC000] hover:underline">Реальные видеокейсы ACA Hydraulic</Link></div>
      </article>
    </div>
  );
}
