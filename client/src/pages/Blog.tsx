import React from "react";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight, Tag, Clock } from "lucide-react";
import { Link } from "wouter";

import { publicAsset } from "@/lib/assets";
const articles = [
  {
    id: 1,
    title: "Ремонт гидронасоса CAT: пошаговое руководство и стоимость",
    excerpt:
      "Разбираем ремонт гидронасоса экскаватора Caterpillar (CAT 320, 330, 336). Признаки неисправности, диагностика, стоимость ремонта в Казахстане. Реальный кейс из нашей практики.",
    date: "2026-02-10",
    displayDate: "10.02.2026",
    author: "Александр Иванов, Главный инженер",
    category: "Ремонт CAT",
    image: "/images/hydraulic-pump-repair.webp",
    slug: "remont-gidronasosa-cat",
    readTime: "8 мин",
  },
  {
    id: 2,
    title: "Почему падает давление гидравлики экскаватора: 7 причин",
    excerpt:
      "Низкое давление в гидросистеме — одна из самых частых проблем. Разбираем 7 причин: от износа насоса до настройки предохранительного клапана. Как диагностировать самостоятельно?",
    date: "2026-01-25",
    displayDate: "25.01.2026",
    author: "Сергей Петров, Сервисный инженер",
    category: "Диагностика",
    image: "/images/excavator-tech-repair.webp",
    slug: "padaet-davlenie-gidravliki-ekskavatora",
    readTime: "6 мин",
  },
  {
    id: 3,
    title: "Сколько стоит ремонт гидромотора Komatsu в Казахстане",
    excerpt:
      "Реальные цены на ремонт гидромоторов Komatsu PC200, PC300, PC400 в Астане и Казахстане. Что влияет на стоимость, когда выгоднее ремонт, а не замена. Прайс-лист 2026.",
    date: "2026-01-15",
    displayDate: "15.01.2026",
    author: "Александр Иванов, Главный инженер",
    category: "Цены и стоимость",
    image: "/images/hydraulic-motor-repair.jpg",
    slug: "stoimost-remonta-gidromotora-komatsu",
    readTime: "5 мин",
  },
  {
    id: 4,
    title: "Как определить неисправность гидравлики: 10 признаков",
    excerpt:
      "Практическое руководство: как самостоятельно определить неисправность гидравлической системы спецтехники. Шумы, утечки, медленная работа — что означает каждый симптом.",
    date: "2025-12-20",
    displayDate: "20.12.2025",
    author: "Сергей Петров, Сервисный инженер",
    category: "Диагностика",
    image: "/images/hydraulic-schematic-overlay.webp",
    slug: "kak-opredelit-neispravnost-gidravliki",
    readTime: "7 мин",
  },
  {
    id: 5,
    title: "Ремонт гидравлики дорожной фрезы Wirtgen 1500: потеря хода при нагреве",
    excerpt:
      "Реальный кейс ACA Hydraulic: фреза Wirtgen 1500 теряла ход после прогрева. Диагностика выявила износ уплотнений гидромоторов. Ремонт за 2 дня. Фото с объекта.",
    date: "2026-03-18",
    displayDate: "18.03.2026",
    author: "Инженер ACA Hydraulic",
    category: "Ремонт Wirtgen",
    image: publicAsset("webdev-static-assets/wirtgen-1500-1.png"),
    slug: "remont-gidravliki-frezy-wirtgen-1500",
    readTime: "6 мин",
  },
  {
    id: 6,
    title: "Капитальный ремонт бульдозера SHANTUI SD32: ДВС и гидравлика",
    excerpt:
      "Реальный кейс: полное восстановление бульдозера SHANTUI SD32 — капремонт двигателя и гидравлической системы за 18 рабочих дней. Фото с объекта, гарантия 6 месяцев.",
    date: "2026-03-18",
    displayDate: "18.03.2026",
    author: "Инженер ACA Hydraulic",
    category: "Ремонт бульдозеров",
    image: publicAsset("webdev-static-assets/shantui-sd32-6.png"),
    slug: "kapitalnyy-remont-shantui-sd32",
    readTime: "7 мин",
  },
  {
    id: 7,
    title: "Ремонт гидравлики Liebherr R950: потеря мощности ковша",
    excerpt:
      "Реальный кейс: экскаватор Liebherr R950 потерял 60% мощности ковша из-за износа аксиально-поршневого насоса Linde HPV-02. Ремонт за 72 часа, экономия 2,1 млн тенге.",
    date: "2026-03-22",
    displayDate: "22.03.2026",
    author: "Инженер ACA Hydraulic",
    category: "Ремонт Liebherr",
    image: publicAsset("webdev-static-assets/shantui-sd32-6.png"),
    slug: "remont-gidravliki-liebherr-r950",
    readTime: "6 мин",
  },
  {
    id: 8,
    title: "Восстановление гидромотора хода Volvo EC380: машина не двигалась",
    excerpt:
      "Реальный кейс: экскаватор Volvo EC380 полностью потерял ход — разрушение вала гидромотора. Ремонт за 48 часов вместо 6 недель ожидания у дилера. Экономия 3,3 млн тенге.",
    date: "2026-03-25",
    displayDate: "25.03.2026",
    author: "Инженер ACA Hydraulic",
    category: "Ремонт Volvo",
    image: publicAsset("webdev-static-assets/shantui-sd32-6.png"),
    slug: "vosstanovlenie-gidromotora-volvo-ec380",
    readTime: "6 мин",
  },
];

// Article schema for blog list page
const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://acahydraulic.kz/blog#blog",
  name: "Блог ACA Hydraulic",
  description:
    "Полезные статьи о ремонте и обслуживании гидравлических систем спецтехники в Казахстане",
  url: "https://acahydraulic.kz/blog",
  publisher: {
    "@id": "https://acahydraulic.kz/#business",
  },
  blogPost: articles.map((a) => ({
    "@type": "BlogPosting",
    headline: a.title,
    description: a.excerpt,
    url: `https://acahydraulic.kz/blog/${a.slug}`,
    datePublished: a.date,
    author: {
      "@type": "Person",
      name: a.author.split(",")[0],
    },
  })),
};

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Блог о ремонте гидравлики спецтехники | ACA Hydraulic"
        description="Полезные статьи о ремонте гидравлики экскаваторов CAT, Komatsu, Hitachi. Цены, диагностика, советы экспертов. Реальные кейсы из практики ACA Hydraulic в Казахстане."
        keywords="блог ремонт гидравлики, ремонт гидронасоса CAT, ремонт гидромотора Komatsu, диагностика гидравлики экскаватора, давление гидравлики"
        canonical="/blog"
        breadcrumbs={[{ name: "Блог", url: "/blog" }]}
        schema={blogListSchema}
      />

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[#1a1a1a]">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>
          <div className="absolute inset-0 opacity-20 bg-[url('/images/hero-bg-v4.webp')] bg-cover bg-center"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFC000]/10 border border-[#FFC000]/20 rounded text-[#FFC000] text-xs font-bold uppercase tracking-widest mb-6">
              <Tag size={14} />
              База знаний
            </div>
            <h1 className="font-bebas font-bold text-4xl md:text-6xl leading-[0.95] mb-6 uppercase">
              Блог экспертов <br />
              <span className="text-[#FFC000]">ACA Hydraulic</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Делимся опытом ремонта, даём советы по эксплуатации и рассказываем
              о нюансах обслуживания спецтехники в условиях Казахстана.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 bg-[#111]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group bg-[#1a1a1a] border border-white/5 rounded-lg overflow-hidden hover:border-[#FFC000]/50 transition-all duration-300 flex flex-col h-full"
              >
                {/* Image */}
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-[#FFC000] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                    {article.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{article.displayDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={12} />
                      <span>{article.readTime}</span>
                    </div>
                  </div>

                  <h2 className="font-bebas text-2xl mb-3 group-hover:text-[#FFC000] transition-colors leading-tight">
                    {article.title}
                  </h2>

                  <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-grow">
                    {article.excerpt}
                  </p>

                  <Link href={`/blog/${article.slug}`}>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-[#FFC000] hover:text-white justify-start group/btn"
                    >
                      Читать статью{" "}
                      <ArrowRight
                        size={16}
                        className="ml-2 transition-transform group-hover/btn:translate-x-1"
                      />
                    </Button>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links to services */}
      <section className="py-12 bg-[#0f0f0f] border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-2xl md:text-3xl text-center mb-8 uppercase">
            Популярные <span className="text-[#FFC000]">услуги</span>
          </h2>
          <div className="flex flex-wrap gap-3 justify-center max-w-3xl mx-auto">
            {[
              { label: "Ремонт гидронасосов", href: "/services/hydraulic-pumps" },
              { label: "Ремонт гидромоторов", href: "/services/hydraulic-motors" },
              { label: "Ремонт экскаваторов", href: "/services/excavator-repair" },
              { label: "Ремонт гидрораспределителей", href: "/services/hydraulic-valves" },
              { label: "Выездной ремонт", href: "/services/mobile-repair" },
              { label: "Промышленный сервис", href: "/services/industrial" },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bebas text-3xl md:text-4xl mb-4 uppercase">
            Нужна консультация <span className="text-[#FFC000]">эксперта?</span>
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Если у вас возникли вопросы по работе гидравлики или требуется
            срочный ремонт, свяжитесь с нами напрямую.
          </p>
          <Link href="/contacts">
            <Button className="bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-lg h-14 px-8 rounded uppercase tracking-wide">
              Связаться с нами
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
