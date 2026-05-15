import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Phone, Calendar, MapPin, Wrench, CheckCircle2, ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

import { publicAsset } from "@/lib/assets";
const WIRTGEN_PHOTOS = [
  {
    url: publicAsset("webdev-static-assets/wirtgen-1500-1.png"),
    caption: "Специалисты ACA Hydraulic проводят диагностику гидравлики фрезы Wirtgen 1500 на объекте"
  },
  {
    url: publicAsset("webdev-static-assets/wirtgen-1500-2.png"),
    caption: "Диагностика гидравлического блока с применением манометров давления"
  },
  {
    url: publicAsset("webdev-static-assets/wirtgen-1500-4.png"),
    caption: "Система управления Wirtgen 1500 — панель оператора и гидравлические регуляторы"
  },
  {
    url: publicAsset("webdev-static-assets/wirtgen-1500-3.png"),
    caption: "Диагностика электронного блока управления и гидравлических клапанов"
  },
  {
    url: publicAsset("webdev-static-assets/wirtgen-1500-5.png"),
    caption: "Панель управления фрезы Wirtgen 1500 после восстановления гидравлики"
  },
  {
    url: publicAsset("webdev-static-assets/wirtgen-1500-6.png"),
    caption: "Инженер ACA Hydraulic диагностирует гидромотор ходовой части — причина потери хода при нагреве"
  },
  {
    url: publicAsset("webdev-static-assets/wirtgen-1500-7.png"),
    caption: "Фреза Wirtgen 1500 на площадке перед выездной диагностикой — специалист готовится к работе"
  }
];

const SHANTUI_PHOTOS = [
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-6.png"),
    caption: "Демонтаж двигателя с применением автокрана — подготовка к капитальному ремонту"
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-4.png"),
    caption: "Разборка двигателя: вид сверху на гидравлическую систему управления"
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-5.png"),
    caption: "Установка двигателя обратно на раму бульдозера"
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-1.jpeg"),
    caption: "Ремонт трансмиссии: сборка маховика двигателя"
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-7.png"),
    caption: "Снятый гидронасос бульдозера до ремонта — видны следы износа"
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-9.png"),
    caption: "Блок цилиндров двигателя после капитального ремонта — новые уплотнения и коленвал"
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-8.png"),
    caption: "Гидронасос после восстановления — замена пар трения и распределительного диска"
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-3.png"),
    caption: "Специалист ACA Hydraulic на фоне восстановленного бульдозера SHANTUI SD32"
  },
  {
    url: publicAsset("webdev-static-assets/shantui-sd32-2.png"),
    caption: "Бульдозер SHANTUI SD32 после полного восстановления — готов к работе"
  }
];

function PhotoGallery({ photos }: { photos: typeof SHANTUI_PHOTOS }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const prev = () => setActiveIdx(i => (i - 1 + photos.length) % photos.length);
  const next = () => setActiveIdx(i => (i + 1) % photos.length);
  const prevLb = () => setLightbox(i => i !== null ? (i - 1 + photos.length) % photos.length : null);
  const nextLb = () => setLightbox(i => i !== null ? (i + 1) % photos.length : null);

  return (
    <>
      {/* Main photo */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden cursor-pointer group" onClick={() => setLightbox(activeIdx)}>
        <img
          src={photos[activeIdx].url}
          alt={photos[activeIdx].caption}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <p className="absolute bottom-4 left-4 right-4 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">{photos[activeIdx].caption}</p>
        <button onClick={e => { e.stopPropagation(); prev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#FFC000] text-white hover:text-black rounded-full p-2 transition-colors">
          <ChevronLeft size={20} />
        </button>
        <button onClick={e => { e.stopPropagation(); next(); }} className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#FFC000] text-white hover:text-black rounded-full p-2 transition-colors">
          <ChevronRight size={20} />
        </button>
        <span className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">{activeIdx + 1} / {photos.length}</span>
      </div>
      {/* Thumbnails */}
      <div className="grid grid-cols-5 gap-2 mt-3">
        {photos.map((p, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`aspect-square rounded overflow-hidden border-2 transition-colors ${
              i === activeIdx ? 'border-[#FFC000]' : 'border-transparent hover:border-white/30'
            }`}
          >
            <img src={p.url} alt={p.caption} className="w-full h-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>
      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white hover:text-[#FFC000] transition-colors" onClick={() => setLightbox(null)}>
            <X size={32} />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#FFC000] text-white hover:text-black rounded-full p-3 transition-colors" onClick={e => { e.stopPropagation(); prevLb(); }}>
            <ChevronLeft size={24} />
          </button>
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <img src={photos[lightbox].url} alt={photos[lightbox].caption} className="w-full max-h-[80vh] object-contain rounded-lg" />
            <p className="text-gray-300 text-center mt-4 text-sm">{photos[lightbox].caption}</p>
            <p className="text-gray-500 text-center text-xs mt-1">{lightbox + 1} / {photos.length}</p>
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-[#FFC000] text-white hover:text-black rounded-full p-3 transition-colors" onClick={e => { e.stopPropagation(); nextLb(); }}>
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </>
  );
}

export default function Projects() {
  const projects = [
    {
      id: -1,
      title: "Ремонт гидравлики дорожной фрезы Wirtgen 1500 — потеря хода при нагреве",
      client: "Дорожно-строительная компания",
      location: "Казахстан",
      duration: "2 дня",
      equipment: "Wirtgen 1500 (дорожная фреза)",
      problem: "Фреза Wirtgen 1500 переставала двигаться после прогрева гидравлической системы: при достижении рабочей температуры машина полностью теряла ход. Техника встала прямо на объекте в разгар работ по фрезерованию асфальта. Стандартные сервисы не смогли быстро решить проблему — заказчик обратился в ACA Hydraulic.",
      solution: [
        "Выездная диагностика на объекте в день обращения",
        "Измерение давления в гидромоторах ходовой части манометрами",
        "Диагностика электронного блока управления и гидравлических клапанов",
        "Выявлена причина: износ уплотнений в гидромоторах ходовой части — внутренние утечки при нагреве сбрасывали давление",
        "Замена уплотнительных комплектов и регулировка давления в системе",
        "Проверка работы ходовой части в холодном и горячем режиме"
      ],
      result: "Фреза Wirtgen 1500 восстановлена за 2 дня. Ход работает стабильно при любой температуре гидравлического масла. Техника вернулась на объект в срок, заказчик продолжил работы по графику.",
      tags: ["Дорожные фрезы", "Wirtgen", "Гидромоторы", "Выездной ремонт"],
      photos: WIRTGEN_PHOTOS,
      highlight: true
    },
    {
      id: 0,
      title: "Капитальный ремонт бульдозера SHANTUI SD32 — ДВС и гидравлика",
      client: "Горнодобывающее предприятие",
      location: "Казахстан",
      duration: "18 рабочих дней",
      equipment: "SHANTUI SD32 (320 л.с., 32 тонны)",
      problem: "Бульдозер SHANTUI SD32 поступил в критическом состоянии: двигатель не запускался из-за износа поршневой группы и задиров на гильзах цилиндров, гидравлическая система полностью потеряла давление — насос вышел из строя вследствие разрушения пар трения. Техника простаивала на объекте, срывая производственный план.",
      solution: [
        "Выездная диагностика: полная дефектовка ДВС и гидросистемы",
        "Демонтаж двигателя с применением автокрана",
        "Капитальный ремонт ДВС: расточка блока, замена поршневой группы, коленвала, вкладышей",
        "Полная разборка и восстановление гидронасоса: замена блока цилиндров, распределительного диска, уплотнений",
        "Ремонт трансмиссии и маховика",
        "Сборка, установка двигателя, монтаж гидросистемы",
        "Пуско-наладка, регулировка давления, ходовые испытания"
      ],
      result: "Бульдозер SHANTUI SD32 полностью восстановлен и введён в эксплуатацию. Двигатель запускается с первого раза, рабочее давление гидравлики приведено к заводским параметрам. Техника вернулась на объект в срок.",
      tags: ["Бульдозеры", "SHANTUI", "Капитальный ремонт ДВС", "Гидравлика"],
      photos: SHANTUI_PHOTOS,
      highlight: true
    },
    {
      id: 1,
      title: "Восстановление гидросистемы ГНБ установки",
      client: "Инфраструктурный подрядчик",
      location: "Астана",
      duration: "48 часов",
      equipment: "Vermeer D24x40",
      problem: "Критическая потеря давления в гидросистеме. Утечка масла из основного насоса. Невозможность продолжения буровых работ на объекте прокладки коммуникаций.",
      solution: [
        "Выездная диагностика на объекте в течение 4 часов",
        "Демонтаж и дефектовка гидронасоса",
        "Замена изношенных пар трения и уплотнений",
        "Восстановление рабочих параметров давления",
        "Гидроиспытания и сдача в эксплуатацию"
      ],
      result: "Установка восстановлена и введена в эксплуатацию за 48 часов. Простой оборудования минимизирован. Заказчик продолжил работы по графику.",
      tags: ["ГНБ", "Гидронасосы", "Срочный ремонт"]
    },
    {
      id: 2,
      title: "Ремонт распределителя экскаватора Caterpillar",
      client: "Горнодобывающая компания",
      location: "Караганда",
      duration: "72 часа",
      equipment: "Caterpillar 336D",
      problem: "Заклинивание секций гидрораспределителя. Медленная реакция стрелы на команды оператора. Снижение производительности работ в карьере.",
      solution: [
        "Транспортировка распределителя в сервисный центр",
        "Полная разборка и дефектовка",
        "Замена золотников и уплотнительных элементов",
        "Промывка и сборка блока",
        "Стендовые испытания и регулировка"
      ],
      result: "Распределитель восстановлен с заводскими параметрами. Время реакции гидравлики сокращено до нормативных значений. Производительность экскаватора восстановлена на 100%.",
      tags: ["Экскаваторы", "Распределители", "Caterpillar"]
    },
    {
      id: 3,
      title: "Восстановление гидронасоса бульдозера Shantui",
      client: "Дорожно-строительное управление",
      location: "Алматы",
      duration: "96 часов",
      equipment: "Shantui SD22",
      problem: "Перегрев гидронасоса. Падение давления в системе управления отвалом. Невозможность выполнения планировочных работ на объекте строительства магистрали.",
      solution: [
        "Демонтаж насоса на объекте",
        "Капитальный ремонт в мастерской",
        "Замена блока цилиндров и распределительного диска",
        "Балансировка вращающихся элементов",
        "Монтаж и пуско-наладка на объекте"
      ],
      result: "Насос восстановлен. Рабочее давление приведено к номинальным значениям. Температурный режим в норме. Бульдозер вернулся на объект через 4 дня.",
      tags: ["Бульдозеры", "Гидронасосы", "Shantui"]
    },
    {
      id: 4,
      title: "Ремонт гидравлики экскаватора Liebherr R950 — потеря мощности ковша",
      client: "Горнодобывающая компания",
      location: "Карагандинская область",
      duration: "72 часа",
      equipment: "Liebherr R950 SME",
      highlight: true,
      problem: "Экскаватор Liebherr R950 потерял мощность ковша и стрелы: рабочее давление в гидросистеме упало с 350 до 180 бар. Машина не справлялась с плотным грунтом в карьере, производительность снизилась на 60%. Заказчик обратился в ACA Hydraulic после того, как официальный дилер назначил срок ремонта 3 недели.",
      solution: [
        "Выезд на объект, подключение диагностического оборудования Bosch ESI[tronic]",
        "Замер давлений во всех контурах гидросистемы, выявление просадки в главном насосном блоке",
        "Демонтаж сдвоенного аксиально-поршневого насоса Linde HPV-02",
        "Дефектовка: износ поршневой группы, задиры на блоке цилиндров, разрушение сепаратора подшипника",
        "Восстановление насоса: замена поршней, блока цилиндров, подшипников, уплотнений",
        "Регулировка регулятора давления и расхода по заводским параметрам Liebherr",
        "Монтаж, промывка системы, пуско-наладка и проверка под нагрузкой"
      ],
      result: "Давление в гидросистеме восстановлено до 350 бар. Производительность экскаватора вернулась к 100%. Ремонт выполнен за 72 часа — в 10 раз быстрее, чем предложил официальный дилер. Техника продолжила работу в карьере без простоя.",
      tags: ["Экскаваторы", "Liebherr", "Гидронасосы", "Карьерная техника"]
    },
    {
      id: 5,
      title: "Восстановление гидромотора хода Volvo EC380 — машина не двигалась",
      client: "Строительная компания",
      location: "Астана",
      duration: "48 часов",
      equipment: "Volvo EC380DL",
      highlight: true,
      problem: "Экскаватор Volvo EC380 полностью потерял ход: гидромотор правой гусеницы вышел из строя из-за разрушения вала и пакета дисков тормоза. Машина встала на строительном объекте в центре Астаны, срывая сроки нулевого цикла. Замена нового гидромотора у официального дилера — 6 недель ожидания и цена от 4 500 000 тенге.",
      solution: [
        "Выезд на объект, диагностика и демонтаж гидромотора Volvo Travel Motor",
        "Дефектовка в мастерской: разрушение вала ротора, износ дисков тормоза, повреждение уплотнений",
        "Восстановление вала методом наплавки и шлифовки до заводских допусков",
        "Замена пакета тормозных дисков, подшипников и полного комплекта уплотнений",
        "Сборка, стендовые испытания при давлении 420 бар",
        "Монтаж на технику, регулировка давления подпитки",
        "Ходовые испытания: проверка хода вперёд/назад, разворота, нагрузочные тесты"
      ],
      result: "Гидромотор восстановлен за 48 часов. Стоимость ремонта составила 1 200 000 тенге — в 3,7 раза дешевле нового агрегата. Экскаватор вернулся в работу, заказчик выдержал сроки сдачи объекта.",
      tags: ["Экскаваторы", "Volvo", "Гидромоторы", "Ходовая часть"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20" id="projects-page">
      <SEO
        title="Наши работы — Кейсы ремонта гидравлики спецтехники | ACA Hydraulic"
        description="Реальные кейсы ремонта гидравлики спецтехники с фото. Wirtgen 1500, SHANTUI SD32, экскаваторы CAT, Komatsu, Hitachi. Выездной ремонт по всему Казахстану."
        keywords="кейсы ремонта гидравлики, ремонт спецтехники Казахстан, наши работы ACA Hydraulic"
        canonical="/projects"
        pageType="website"
        breadcrumbs={[
          { name: "Главная", url: "/" },
          { name: "Проекты", url: "/projects" }
        ]}
      />
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#FFC000]">Главная</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Проекты</span>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-20 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-bebas font-bold text-4xl md:text-6xl leading-[0.95] mb-6 uppercase">
              Выполненные <span className="text-[#FFC000]">проекты</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Примеры восстановления гидравлических систем спецтехники. Инженерный подход к решению сложных задач.
            </p>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="space-y-12">
            {projects.map((project: any, index) => (
              <div 
                key={project.id}
                className={`bg-[#1a1a1a] border rounded-lg overflow-hidden transition-colors ${
                  project.highlight
                    ? 'border-[#FFC000]/40 hover:border-[#FFC000]/70 ring-1 ring-[#FFC000]/10'
                    : 'border-white/5 hover:border-[#FFC000]/30'
                }`}
              >
                {project.highlight && (
                  <div className="bg-[#FFC000] px-8 py-2 flex items-center gap-2">
                    <span className="text-black font-bebas text-sm uppercase tracking-widest font-bold">★ Реальный кейс ACA Hydraulic</span>
                  </div>
                )}
                <div className="p-8 md:p-12">
                  {/* Project Header */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag: string) => (
                      <span 
                        key={tag}
                        className="px-3 py-1 bg-[#FFC000]/10 border border-[#FFC000]/20 rounded text-[#FFC000] text-xs font-bold uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="font-bebas text-3xl md:text-4xl mb-6 uppercase">
                    {project.title}
                  </h2>

                  {/* Project Meta */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 pb-8 border-b border-white/5">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[#FFC000] flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Локация</p>
                        <p className="text-white font-medium">{project.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-[#FFC000] flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Срок выполнения</p>
                        <p className="text-white font-medium">{project.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Wrench className="w-5 h-5 text-[#FFC000] flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Оборудование</p>
                        <p className="text-white font-medium">{project.equipment}</p>
                      </div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-bebas text-xl mb-3 text-[#FFC000] uppercase">Проблема</h3>
                      <p className="text-gray-400 leading-relaxed">{project.problem}</p>
                    </div>

                    <div>
                      <h3 className="font-bebas text-xl mb-3 text-[#FFC000] uppercase">Решение</h3>
                      <ul className="space-y-2">
                        {project.solution.map((step: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-400 text-sm">
                            <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="mt-8 pt-8 border-t border-white/5">
                    <h3 className="font-bebas text-xl mb-3 text-[#FFC000] uppercase">Результат</h3>
                    <p className="text-gray-300 leading-relaxed">{project.result}</p>
                  </div>

                  {/* Photo Gallery */}
                  {project.photos && (
                    <div className="mt-8 pt-8 border-t border-white/5">
                      <h3 className="font-bebas text-xl mb-4 text-[#FFC000] uppercase">Фотографии с объекта</h3>
                      <PhotoGallery photos={project.photos} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bebas text-3xl md:text-5xl mb-6 uppercase">
              Нужен ремонт <span className="text-[#FFC000]">гидравлики?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Оставьте заявку — инженер проведёт диагностику и предложит решение
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button className="bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-xl h-16 px-12 rounded uppercase tracking-wide">
                  Наши услуги
                </Button>
              </Link>
              <a 
                href="tel:+77714177925" 
                onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } window.gtag('event', 'conversion', {'send_to': 'AW-17847190636/MNy9COmB06QcEOyImr5C'}); }}
                className="flex items-center justify-center gap-3 px-12 h-16 border border-white/20 rounded hover:bg-white/5 transition-colors"
              >
                <Phone className="text-[#FFC000]" />
                <span className="font-bebas text-xl tracking-wide">+7 (771) 417-79-25</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
