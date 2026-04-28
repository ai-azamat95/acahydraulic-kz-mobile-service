import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Wrench, Calendar, MapPin, Filter, Phone } from "lucide-react";
import { SEO } from "@/components/SEO";

// Case Study Data
const cases = [
  {
    id: "hitachi-330",
    title: "Ремонт гидросистемы Hitachi ZX330-5G",
    category: "excavators",
    categoryLabel: "Экскаваторы",
    image: "/images/cases/hitachi-330/main-new.webp", // Placeholder, will use real image if available
    location: "Карагандинская область",
    duration: "3 дня",
    problem: "Медленная работа гидравлики, перегрев масла при нагрузке.",
    solution: "Диагностика гидронасоса, замена качающего узла, настройка клапанов.",
    result: "Производительность восстановлена на 100%, температура в норме."
  },
  {
    id: "cat-336",
    title: "Восстановление Caterpillar 336D2",
    category: "excavators",
    categoryLabel: "Экскаваторы",
    image: "/images/cases/cat-336/main.webp", // Placeholder
    location: "Астана, строительный объект",
    duration: "4 дня",
    problem: "Потеря мощности, глохнет под нагрузкой, запаздывание гусеницы.",
    solution: "Ремонт электроцепи, замена датчиков, восстановление серворегулятора.",
    result: "Экскаватор полностью исправен, мощность соответствует заводским параметрам."
  },
  {
    id: "shantui-sd32",
    title: "Ремонт КПП бульдозера Shantui SD32",
    category: "bulldozers",
    categoryLabel: "Бульдозеры",
    image: "/images/shantui-sd32.webp", // Placeholder
    location: "Экибастуз, угольный разрез",
    duration: "5 дней",
    problem: "Пропала тяга на 2-й передаче, посторонний шум в трансмиссии.",
    solution: "Капитальный ремонт ГТР и коробки передач, замена фрикционов.",
    result: "Тяговое усилие восстановлено, техника вернулась в карьер."
  },
  {
    id: "sany-sr280",
    title: "Диагностика буровой SANY SR280",
    category: "drilling",
    categoryLabel: "Буровые",
    image: "/images/sany-sr280.webp", // Placeholder
    location: "Атырау",
    duration: "2 дня",
    problem: "Нестабильное вращение ротора, падение давления в главном контуре.",
    solution: "Настройка предохранительных клапанов, замена РВД, калибровка насосов.",
    result: "Буровая установка работает в штатном режиме."
  }
];

const categories = [
  { id: "all", label: "Все проекты" },
  { id: "excavators", label: "Экскаваторы" },
  { id: "mining_loaders", label: "Шахтные погрузчики" },
  { id: "bulldozers", label: "Бульдозеры" },
  { id: "milling", label: "Фрезы" },
  { id: "hdd", label: "ГНБ" },
  { id: "piling", label: "Сваебойные" },
  { id: "graders", label: "Грейдеры" },
  { id: "loaders", label: "Погрузчики" }
];

export default function Cases() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredCases = activeCategory === "all" 
    ? cases 
    : cases.filter(c => c.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-roboto">
      <SEO 
        title="Кейсы и примеры работ | ACA Hydraulic" 
        description="Примеры ремонта гидравлики спецтехники: экскаваторы, бульдозеры, краны. Фото и описание выполненных работ по всему Казахстану."
        keywords="кейсы ремонта гидравлики, примеры работ, ремонт экскаваторов фото, портфолио гидравликов"
      />

      {/* Hero Section */}
      <section className="relative py-20 bg-[#111] border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-bebas text-5xl md:text-7xl text-white mb-6">
            Наши <span className="text-[#FFC000]">проекты</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Реальные примеры восстановления техники. Мы не просто меняем запчасти — мы решаем инженерные задачи любой сложности.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 border-b border-white/5 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 text-gray-400 mr-4">
              <Filter className="w-5 h-5" />
              <span className="text-sm uppercase font-bold tracking-wider">Фильтр:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${
                  activeCategory === cat.id
                    ? "bg-[#FFC000] text-black shadow-[0_0_15px_rgba(255,192,0,0.3)]"
                    : "bg-[#1a1a1a] text-gray-400 hover:bg-[#222] hover:text-white border border-white/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCases.map((item) => (
              <div key={item.id} className="group bg-[#1a1a1a] border border-white/10 rounded-sm overflow-hidden hover:border-[#FFC000]/50 transition-all duration-300">
                {/* Image Area */}
                <div className="relative h-64 overflow-hidden bg-[#111]">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                    {/* Placeholder fallback if image missing */}
                    <Wrench className="w-12 h-12 opacity-20" />
                  </div>
                  {/* Ideally use real images here */}
                  {/* <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" /> */}
                  
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur px-3 py-1 rounded text-[#FFC000] text-xs font-bold uppercase tracking-wider border border-[#FFC000]/20">
                    {item.categoryLabel}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8">
                  <h3 className="font-bebas text-3xl text-white mb-4 group-hover:text-[#FFC000] transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-400 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#FFC000]" />
                      {item.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#FFC000]" />
                      Срок: {item.duration}
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Проблема:</h4>
                      <p className="text-gray-300 leading-relaxed">{item.problem}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Решение:</h4>
                      <p className="text-gray-300 leading-relaxed">{item.solution}</p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Результат:</h4>
                      <div className="flex items-start gap-2 text-white">
                        <CheckCircle2 className="w-5 h-5 text-[#FFC000] shrink-0 mt-0.5" />
                        <span>{item.result}</span>
                      </div>
                    </div>
                  </div>

                  <Link href="/contacts">
                    <Button className="w-full bg-transparent border border-[#FFC000] text-[#FFC000] hover:bg-[#FFC000] hover:text-black uppercase font-bebas tracking-wider h-12">
                      Хочу такой же результат
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-xl">В данной категории пока нет кейсов.</p>
              <Button 
                variant="link" 
                onClick={() => setActiveCategory("all")}
                className="text-[#FFC000] mt-4"
              >
                Показать все проекты
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#FFC000]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bebas text-4xl md:text-6xl text-black mb-6 uppercase">
            У вас похожая проблема?
          </h2>
          <p className="text-black/80 text-xl max-w-2xl mx-auto mb-10 font-medium">
            Не теряйте деньги на простое техники. Наши инженеры готовы выехать на диагностику уже сегодня.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/contacts">
              <Button className="bg-black text-white hover:bg-gray-900 px-10 py-6 text-lg font-bebas uppercase tracking-wider">
                Вызвать инженера
              </Button>
            </Link>
            <a href="tel:+77714177925" onClick={() => window.gtag('event', 'conversion', {'send_to': 'AW-17847190636/gJzYCKDa2vgbEOyImr5C'})}>
              <Button variant="outline" className="border-black text-black hover:bg-black/10 px-10 py-6 text-lg font-bebas uppercase tracking-wider">
                <Phone className="w-5 h-5 mr-2" />
                Позвонить сейчас
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
