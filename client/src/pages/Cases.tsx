import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Eye, ExternalLink, Filter, Phone, PlayCircle, Video } from "lucide-react";
import { SEO } from "@/components/SEO";

type RepairCase = {
  id: string;
  title: string;
  category: "excavators" | "hdd";
  categoryLabel: string;
  problem: string;
  work: string;
  result: string;
  videoUrl: string;
  videoLabel: string;
  views: string;
  note?: string;
};

const cases: RepairCase[] = [
  {
    id: "cat-330d2l-drowned",
    title: "Caterpillar 330D2L — восстановление после затопления",
    category: "excavators",
    categoryLabel: "Экскаваторы",
    problem:
      "Экскаватор был затоплен. До нашего выезда технику неоднократно пытались восстановить, но машина не возвращалась к нормальной работе.",
    work:
      "Провели выездную диагностику, последовательно проверили системы машины и выполнили восстановительные работы. Процесс ремонта снят по этапам — от первичного осмотра до финального запуска.",
    result:
      "Экскаватор запущен и возвращён в работу. На TikTok опубликована серия из нескольких частей с диагностикой, ремонтом и итоговой проверкой.",
    videoUrl: "https://www.tiktok.com/@acaservice01/video/7630110235562085650",
    videoLabel: "Смотреть CAT 330D2L в TikTok",
    views: "181 тыс.+",
    note: "Один из самых просматриваемых реальных ремонтов ACA Hydraulic",
  },
  {
    id: "cat-330dl-hot-power-loss",
    title: "Caterpillar 330DL — терял мощность после прогрева",
    category: "excavators",
    categoryLabel: "Экскаваторы",
    problem:
      "После прогрева гидравлической системы до рабочей температуры машина теряла мощность. Дополнительно возникала проблема с поворотом и был высокий расход топлива.",
    work:
      "Провели диагностику гидравлики и двигателя под рабочей нагрузкой. В процессе ремонта устранили выявленные неисправности, включая некорректную работу форсунки.",
    result:
      "После ремонта экскаватор работает исправно. Финальная часть ремонта получила десятки тысяч просмотров и реальные переходы к телефонному контакту.",
    videoUrl: "https://www.tiktok.com/@acaservice01/video/7648329720278289672",
    videoLabel: "Смотреть CAT 330DL в TikTok",
    views: "89 тыс.+",
    note: "30 кликов по телефону с этого ролика по данным TikTok",
  },
  {
    id: "sany-sy365h-hot-hydraulics",
    title: "SANY SY365H — потеря мощности и рывки гидравлики на горячую",
    category: "excavators",
    categoryLabel: "Экскаваторы",
    problem:
      "При достижении рабочей температуры экскаватор терял мощность, а подъём стрелы сопровождался рывками. Машина требовала комплексной проверки гидравлики и электрической части.",
    work:
      "Провели диагностику, ремонт гидравлики, работу с распределителем, устранение утечек, демонтаж насоса и восстановление электропроводки. Весь процесс опубликован серией видео.",
    result:
      "Гидравлическая и электрическая части восстановлены, показания приведены в норму, экскаватор запущен и готов к работе.",
    videoUrl: "https://www.tiktok.com/@acaservice01/video/7658206304082677000",
    videoLabel: "Смотреть SANY SY365H в TikTok",
    views: "21 тыс.+",
    note: "Есть полная серия: диагностика → ремонт → финальный запуск",
  },
  {
    id: "xcmg-xz360e-hydraulics",
    title: "XCMG XZ360E — гидравлика не работала, насос оказался исправен",
    category: "hdd",
    categoryLabel: "Буровые / ГНБ",
    problem:
      "Гидравлические функции установки не работали. Первоначально подозрение могло падать на насос, но диагностика показала, что насос исправен.",
    work:
      "Провели поиск причины непосредственно на объекте, проверили гидросистему и управление, нашли фактическую неисправность и восстановили систему без необоснованной замены исправного насоса.",
    result:
      "После ремонта проверили ход установки, работу опор и подъём стрелы. Гидравлическая система работает стабильно.",
    videoUrl: "https://www.tiktok.com/@acaservice01/video/7614139811183545607",
    videoLabel: "Смотреть XCMG XZ360E в TikTok",
    views: "51 тыс.+",
    note: "Реальный пример, почему точная диагностика важнее замены деталей наугад",
  },
];

const categories = [
  { id: "all", label: "Все реальные ремонты" },
  { id: "excavators", label: "Экскаваторы" },
  { id: "hdd", label: "Буровые / ГНБ" },
] as const;

export default function Cases() {
  const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]["id"]>("all");

  const filteredCases =
    activeCategory === "all" ? cases : cases.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-roboto">
      <SEO
        title="Реальные кейсы ремонта спецтехники с видео | ACA Hydraulic"
        description="Реальные выездные ремонты ACA Hydraulic: Caterpillar 330D2L, CAT 330DL, SANY SY365H, XCMG XZ360E. Диагностика, ремонт и результат на видео. Выезд по Казахстану."
        keywords="реальный ремонт экскаватора, выездной ремонт спецтехники, Caterpillar 330D2L ремонт, SANY SY365H ремонт, диагностика гидравлики экскаватора"
        canonical="/cases"
      />

      <section className="relative py-20 bg-[#111] border-b border-white/10 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFC000]/30 bg-[#FFC000]/10 text-[#FFC000] text-xs font-bold uppercase tracking-wider mb-5">
            <Video className="w-4 h-4" />
            Только реальные работы
          </div>
          <h1 className="font-bebas text-5xl md:text-7xl text-white mb-6 leading-none">
            Реальные ремонты <span className="text-[#FFC000]">на видео</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl leading-relaxed">
            Здесь нет шаблонных «кейсов». Каждая работа ниже подтверждена опубликованным видео: неисправность, диагностика, процесс ремонта и результат на реальной технике.
          </p>
        </div>
      </section>

      <section className="py-7 border-b border-white/5 bg-[#0d0d0d]">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-gray-500 mr-2">
              <Filter className="w-4 h-4" />
              <span className="text-xs uppercase font-bold tracking-wider">Фильтр</span>
            </div>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  activeCategory === category.id
                    ? "bg-[#FFC000] text-black"
                    : "bg-[#171717] text-gray-400 border border-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {filteredCases.map((item) => (
              <article
                key={item.id}
                className="bg-[#141414] border border-white/10 rounded-xl overflow-hidden hover:border-[#FFC000]/40 transition-colors"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                    <span className="text-[#FFC000] text-xs font-bold uppercase tracking-wider border border-[#FFC000]/20 bg-[#FFC000]/5 px-3 py-1 rounded-full">
                      {item.categoryLabel}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Eye className="w-4 h-4 text-[#FFC000]" />
                      <span>{item.views} просмотров</span>
                    </div>
                  </div>

                  <h2 className="font-bebas text-3xl md:text-4xl leading-tight mb-6">{item.title}</h2>

                  <div className="space-y-5">
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1.5">Проблема</div>
                      <p className="text-gray-300 leading-relaxed">{item.problem}</p>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1.5">Что сделали</div>
                      <p className="text-gray-300 leading-relaxed">{item.work}</p>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1.5">Результат</div>
                      <div className="flex gap-2.5 text-white leading-relaxed">
                        <CheckCircle2 className="w-5 h-5 text-[#FFC000] shrink-0 mt-0.5" />
                        <span>{item.result}</span>
                      </div>
                    </div>
                  </div>

                  {item.note && (
                    <div className="mt-6 p-4 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-gray-400">
                      {item.note}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-7">
                    <a href={item.videoUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full h-12 bg-[#FFC000] hover:bg-[#eab000] text-black font-bold">
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Смотреть ремонт
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </a>
                    <Link href="/contacts">
                      <Button className="w-full h-12 bg-transparent border border-white/20 text-white hover:border-[#FFC000] hover:text-[#FFC000]">
                        Рассчитать выезд
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#111] border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-bebas text-4xl md:text-5xl mb-4">
              Похожая неисправность на вашей технике?
            </h2>
            <p className="text-gray-400 text-lg mb-3">
              Выездная диагностика сложных неисправностей спецтехники — <strong className="text-white">от 200 000 ₸</strong>.
            </p>
            <p className="text-gray-500 mb-8">
              Точная стоимость зависит от местоположения, модели техники и характера неисправности. Ремонт и запчасти рассчитываются отдельно после диагностики.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/contacts">
                <Button className="bg-[#FFC000] hover:bg-[#eab000] text-black px-8 h-12 font-bold">
                  Отправить данные техники
                </Button>
              </Link>
              <a href="tel:+77714177925">
                <Button className="bg-transparent border border-white/20 hover:border-[#FFC000] text-white px-8 h-12">
                  <Phone className="w-5 h-5 mr-2 text-[#FFC000]" />
                  +7 (771) 417-79-25
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
