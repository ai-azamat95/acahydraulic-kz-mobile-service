import React from "react";
import { SEO } from "@/components/SEO";
import { Link } from "wouter";
import { Calendar, Clock, ArrowLeft, Phone, MessageCircle } from "lucide-react";

declare global {
  interface Window {
    gtag_whatsapp_conversion?: () => void;
  }
}

export default function StoimostRemonGidromotora() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Сколько стоит ремонт гидромотора Komatsu в Казахстане",
    description:
      "Реальные цены на ремонт гидромоторов Komatsu PC200, PC300, PC400 в Астане. Что влияет на стоимость, когда выгоднее ремонт, а не замена.",
    datePublished: "2026-01-15",
    dateModified: "2026-01-15",
    author: { "@type": "Person", name: "Александр Иванов", jobTitle: "Главный инженер" },
    publisher: { "@id": "https://acahydraulic.kz/#business" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": "https://acahydraulic.kz/blog/stoimost-remonta-gidromotora-komatsu",
    },
    image: "https://acahydraulic.kz/images/hydraulic-repair-cinematic.webp",
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="Сколько стоит ремонт гидромотора Komatsu в Казахстане | Цены 2026"
        description="Реальные цены на ремонт гидромоторов Komatsu PC200, PC300, PC400 в Астане. От 60 000 тг. Что влияет на стоимость, когда выгоднее ремонт, а не замена. Прайс 2026."
        keywords="стоимость ремонта гидромотора Komatsu, цена ремонта гидромотора Komatsu, ремонт гидромотора Komatsu PC200, ремонт гидромотора Komatsu Астана"
        canonical="/blog/stoimost-remonta-gidromotora-komatsu"
        breadcrumbs={[
          { name: "Блог", url: "/blog" },
          { name: "Стоимость ремонта гидромотора Komatsu", url: "/blog/stoimost-remonta-gidromotora-komatsu" },
        ]}
        schema={articleSchema}
        faq={[
          {
            question: "Сколько стоит ремонт гидромотора Komatsu PC200?",
            answer: "Ремонт гидромотора хода Komatsu PC200 в Астане стоит от 60 000 тг. Точная стоимость зависит от степени износа. Диагностика бесплатна при последующем ремонте.",
          },
          {
            question: "Что выгоднее — ремонт или замена гидромотора Komatsu?",
            answer: "Ремонт гидромотора обычно в 3-5 раз дешевле нового. Новый гидромотор Komatsu PC200 стоит от 400 000 тг, ремонт — от 60 000 тг. Ремонт выгоден при износе до 70%.",
          },
        ]}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="flex gap-[3px] h-[28px]">
                <div className="w-[10px] h-full bg-[#FFC000]"></div>
                <div className="flex flex-col justify-between h-full">
                  <div className="w-[10px] h-[12.5px] bg-[#FFC000]"></div>
                  <div className="w-[10px] h-[12.5px] bg-[#FFC000]"></div>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-sans font-bold text-[18px] text-white leading-none tracking-wide">ACA</span>
                <span className="font-sans font-medium text-[11px] text-white leading-none tracking-wider mt-[2px]">HYDRAULIC</span>
              </div>
            </div>
          </Link>
          <a href="tel:+77714177925" className="hidden md:flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded border border-white/10 hover:border-[#FFC000]/50 transition-colors">
            <Phone className="w-4 h-4 text-[#FFC000]" />
            <span className="text-[#FFC000] font-bold font-bebas text-lg">+7 (771) 417-79-25</span>
          </a>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/blog">
          <span className="inline-flex items-center gap-2 text-gray-400 hover:text-[#FFC000] transition-colors mb-8 cursor-pointer text-sm">
            <ArrowLeft size={16} />
            Назад в блог
          </span>
        </Link>

        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="bg-[#FFC000]/10 border border-[#FFC000]/20 text-[#FFC000] px-3 py-1 rounded font-bold uppercase tracking-wider">Цены и стоимость</span>
          <span className="flex items-center gap-1"><Calendar size={12} />15.01.2026</span>
          <span className="flex items-center gap-1"><Clock size={12} />5 мин чтения</span>
        </div>

        <h1 className="font-bebas text-4xl md:text-5xl mb-6 leading-tight">
          Сколько стоит ремонт гидромотора Komatsu в Казахстане
        </h1>

        <p className="text-gray-300 text-lg mb-8 leading-relaxed">
          Вопрос стоимости ремонта гидромотора Komatsu — один из самых частых в нашей практике. Клиенты хотят понять: стоит ли ремонтировать или выгоднее купить новый? Отвечаем честно, с реальными цифрами из нашей практики в Астане.
        </p>

        <img src="/images/hydraulic-repair-cinematic.webp" alt="Ремонт гидромотора Komatsu" className="w-full rounded-lg mb-10 object-cover h-64" loading="lazy" />

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Прайс-лист на ремонт гидромоторов Komatsu (2026)</h2>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-lg overflow-hidden mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[#222]">
                <th className="text-left p-4 text-gray-400 font-normal">Модель экскаватора</th>
                <th className="text-left p-4 text-gray-400 font-normal">Тип мотора</th>
                <th className="text-right p-4 text-gray-400 font-normal">Стоимость ремонта</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Komatsu PC130 / PC138", "Гидромотор хода", "от 50 000 тг"],
                ["Komatsu PC200 / PC210", "Гидромотор хода", "от 60 000 тг"],
                ["Komatsu PC200 / PC210", "Гидромотор поворота", "от 50 000 тг"],
                ["Komatsu PC300 / PC360", "Гидромотор хода", "от 75 000 тг"],
                ["Komatsu PC300 / PC360", "Гидромотор поворота", "от 65 000 тг"],
                ["Komatsu PC400 / PC450", "Гидромотор хода", "от 90 000 тг"],
                ["Komatsu PC400 / PC450", "Гидромотор поворота", "от 80 000 тг"],
              ].map(([model, type, price]) => (
                <tr key={model + type} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 text-gray-300">{model}</td>
                  <td className="p-4 text-gray-400">{type}</td>
                  <td className="p-4 text-right text-[#FFC000] font-bold">{price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-[#FFC000]/10 border border-[#FFC000]/20 rounded-lg p-5 mb-8">
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-[#FFC000]">Для сравнения:</strong> Новый гидромотор хода Komatsu PC200 стоит от 350 000 до 600 000 тг. Ремонт в 5-8 раз дешевле при сохранении 100% ресурса.
          </p>
        </div>

        <h2 className="font-bebas text-3xl text-[#FFC000] mb-4">Что влияет на стоимость ремонта</h2>
        <div className="space-y-4 mb-8">
          {[
            { factor: "Степень износа", desc: "Замена только уплотнений — минимальная стоимость. Замена поршневой группы — выше. Замена вала или корпуса — максимальная." },
            { factor: "Модель гидромотора", desc: "Моторы PC200 — наиболее распространены, запчасти в наличии. PC400 и выше — запчасти под заказ, срок ремонта дольше." },
            { factor: "Наличие запчастей", desc: "Для популярных моделей держим запчасти на складе. Срок ремонта — 3-5 дней. Для редких моделей — 7-14 дней." },
            { factor: "Выезд на объект", desc: "Снятие и установка мотора на объекте — дополнительная услуга. Стоимость зависит от удалённости." },
          ].map((item) => (
            <div key={item.factor} className="bg-[#1a1a1a] border border-white/10 rounded-lg p-5">
              <h3 className="font-bebas text-lg text-[#FFC000] mb-1">{item.factor}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-8 mb-8">
          <h3 className="font-bebas text-2xl mb-4">Связанные услуги</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/services/hydraulic-motors">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">Ремонт гидромоторов</span>
            </Link>
            <Link href="/services/excavator-repair">
              <span className="inline-block px-4 py-2 bg-[#1a1a1a] border border-white/10 rounded text-sm text-gray-300 hover:border-[#FFC000]/50 hover:text-[#FFC000] transition-colors cursor-pointer">Ремонт экскаваторов Komatsu</span>
            </Link>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#FFC000]/30 rounded-xl p-8 text-center">
          <h3 className="font-bebas text-3xl mb-3">Узнайте точную стоимость <span className="text-[#FFC000]">бесплатно</span></h3>
          <p className="text-gray-400 mb-6 text-sm">Пришлите фото или опишите проблему — дадим предварительную оценку за 15 минут.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://wa.me/77714177925?text=Здравствуйте!%20Нужен%20ремонт%20гидромотора%20Komatsu" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-bebas text-lg px-6 py-3 rounded transition-colors">
              <MessageCircle className="w-5 h-5" />WhatsApp
            </a>
            <a href="tel:+77714177925" className="flex items-center justify-center gap-2 bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas text-lg px-6 py-3 rounded transition-colors">
              <Phone className="w-5 h-5" />+7 (771) 417-79-25
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
