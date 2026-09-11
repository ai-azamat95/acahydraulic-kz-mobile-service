import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, CheckCircle, ArrowRight, Wrench, Gauge, Shield, PlayCircle, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import B2BLeadForm from "@/components/B2BLeadForm";

const WHATSAPP_NUMBER = "77714177925";
const PHONE_NUMBER = "+7 (771) 417-79-25";
const WIRTGEN_VIDEO = "https://www.tiktok.com/@acaservice01/video/7530533236984876344";

const wirtgenModels = [
  { model: "Wirtgen W 100 / W 120 / W 150", desc: "Диагностика хода, насосов и гидроцилиндров" },
  { model: "Wirtgen W 200 / W 210 / W 220", desc: "Главные насосы, распределители и управление" },
  { model: "Wirtgen W 1500 / W 1900 / W 2000", desc: "Гидравлика хода, фрезерного барабана и конвейера" },
  { model: "Wirtgen W 2100 / W 2200", desc: "Гидромоторы и насосы высокого давления" },
  { model: "Wirtgen WR 200 / WR 240 / WR 250", desc: "Гидравлика ресайклеров" },
];

const services = [
  "Диагностика ходовой и гидросистемы Wirtgen под нагрузкой",
  "Проверка рабочего давления и управляющих контуров",
  "Диагностика гидромоторов ходовой части",
  "Диагностика и ремонт главных гидронасосов",
  "Проверка распределителей, клапанов и электроклапанов",
  "Проверка датчиков скорости и электрического управления",
  "Диагностика гидроцилиндров подъёма и нивелирования",
  "Выезд на объект по Казахстану",
];

export default function BrandWirtgen() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const handleWhatsApp = () => {
    if (typeof window !== "undefined" && (window as any).gtag_whatsapp_conversion) {
      (window as any).gtag_whatsapp_conversion();
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Здравствуйте! Нужна выездная диагностика Wirtgen. Понимаю, что комплексная диагностика начинается от 200 000 ₸. Могу отправить модель, местонахождение и видео неисправности.")}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto">
      <SEO
        title="Диагностика и ремонт гидравлики Wirtgen | ACA Hydraulic"
        description="Выездная диагностика дорожных фрез Wirtgen: ход, давление, гидромоторы, насосы, электроклапаны и датчики. Реальный Wirtgen W1500 на видео. Диагностика от 200 000 ₸."
        keywords="ремонт Wirtgen W1500, Wirtgen не едет, ремонт гидравлики Wirtgen, диагностика дорожной фрезы, ремонт Wirtgen Казахстан"
        canonical="/brands/wirtgen"
        breadcrumbs={[{ name: "Бренды", url: "/services" }, { name: "Wirtgen", url: "/brands/wirtgen" }]}
        serviceSchema={{
          serviceName: "Выездная диагностика и ремонт гидравлики Wirtgen",
          serviceDescription: "Диагностика и ремонт гидравлических систем дорожных фрез и ресайклеров Wirtgen на объекте.",
          serviceUrl: "/brands/wirtgen",
          areaServed: ["Астана", "Казахстан"],
        }}
        faq={[
          {
            question: "Сколько стоит диагностика гидравлики Wirtgen?",
            answer: "Выездная комплексная диагностика начинается от 200 000 ₸. Точная стоимость зависит от местонахождения, модели и характера неисправности. Ремонт и запчасти рассчитываются отдельно после диагностики.",
          },
          {
            question: "Почему Wirtgen может терять ход после прогрева?",
            answer: "Причин может быть несколько: внутренние утечки, гидромоторы, насосы, клапаны, управляющее давление, датчики или электроклапаны. Причину определяем измерениями под рабочей нагрузкой, а не по одному симптому.",
          },
          {
            question: "Выезжаете ли на дорожный объект?",
            answer: "Да. Выполняем выездную диагностику на объектах по Казахстану. Условия и стоимость выезда согласуются по местонахождению техники.",
          },
        ]}
      />

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10"><div className="container mx-auto px-4 py-4 flex items-center justify-between"><Link href="/"><div className="flex items-center gap-3 cursor-pointer"><div className="flex gap-[3px] h-[28px]"><div className="w-[10px] h-full bg-[#FFC000]"/><div className="flex flex-col justify-between h-full"><div className="w-[10px] h-[12.5px] bg-[#FFC000]"/><div className="w-[10px] h-[12.5px] bg-[#FFC000]"/></div></div><div className="flex flex-col justify-center"><span className="font-sans font-bold text-[18px] leading-none tracking-wide">ACA</span><span className="font-sans font-medium text-[11px] leading-none tracking-wider mt-[2px]">HYDRAULIC</span></div></div></Link><div className="flex items-center gap-3"><a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="hidden md:flex items-center gap-2 text-[#FFC000] font-medium"><Phone className="w-4 h-4"/>{PHONE_NUMBER}</a><button onClick={handleWhatsApp} className="bg-[#FFC000] text-black px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-400">WhatsApp</button></div></div></header>

      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-[#111111]"><div className="container mx-auto px-4"><nav className="text-sm text-white/50 mb-6"><Link href="/" className="hover:text-[#FFC000]">Главная</Link><span className="mx-2">/</span><Link href="/services" className="hover:text-[#FFC000]">Услуги</Link><span className="mx-2">/</span><span className="text-white/80">Wirtgen</span></nav><div className="max-w-4xl"><div className="inline-flex items-center gap-2 bg-[#FFC000]/10 border border-[#FFC000]/30 rounded-full px-4 py-2 mb-6"><Wrench className="w-4 h-4 text-[#FFC000]"/><span className="text-[#FFC000] text-sm font-medium">Выездная диагностика Wirtgen</span></div><h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Диагностика и ремонт гидравлики <span className="text-[#FFC000]">Wirtgen</span></h1><p className="text-xl text-white/70 mb-5 max-w-3xl">Если дорожная фреза не едет, ход работает нестабильно, проблема проявляется после прогрева или появляются ошибки управления — проверяем гидравлику и электрическую часть непосредственно на объекте.</p><div className="inline-flex items-center gap-3 bg-[#FFC000]/10 border border-[#FFC000]/30 px-5 py-3 rounded-lg mb-8"><span className="text-white/80">Выездная комплексная диагностика</span><strong className="text-[#FFC000] text-xl">от 200 000 ₸</strong></div><div className="flex flex-wrap gap-4"><button onClick={handleWhatsApp} className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500"><MessageCircle className="w-5 h-5"/>Отправить данные</button><a href={WIRTGEN_VIDEO} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-[#FFC000] text-[#FFC000] px-6 py-3 rounded-lg font-semibold hover:bg-[#FFC000] hover:text-black"><PlayCircle className="w-5 h-5"/>Реальный W1500 <ExternalLink className="w-4 h-4"/></a><button onClick={() => setIsLeadFormOpen(true)} className="border border-white/30 px-6 py-3 rounded-lg font-semibold hover:border-[#FFC000] hover:text-[#FFC000]">Оставить заявку</button></div></div></div></section>

      <section className="py-12 bg-[#1a1a1a]"><div className="container mx-auto px-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[{icon:<Gauge className="w-6 h-6 text-[#FFC000]"/>,title:"Диагностика под нагрузкой",desc:"Проверяем ход и давление в момент проявления дефекта"},{icon:<Shield className="w-6 h-6 text-[#FFC000]"/>,title:"Гарантия по условиям работ",desc:"До 6 месяцев при соблюдении согласованных рекомендаций и условий эксплуатации"},{icon:<PlayCircle className="w-6 h-6 text-[#FFC000]"/>,title:"Реальный W1500 на видео",desc:"Диагностика хода и гидросистемы опубликована в TikTok"}].map((item,i)=><div key={i} className="flex items-start gap-4 bg-[#222] rounded-xl p-5"><div className="shrink-0 mt-1">{item.icon}</div><div><h3 className="font-bold mb-1">{item.title}</h3><p className="text-white/60 text-sm">{item.desc}</p></div></div>)}</div></div></section>

      <section className="py-16"><div className="container mx-auto px-4 grid lg:grid-cols-[1.2fr_.8fr] gap-8 items-center"><div><div className="text-[#FFC000] text-sm uppercase font-bold tracking-wider mb-3">Реальная работа</div><h2 className="text-3xl md:text-4xl font-bold mb-4">Wirtgen W1500 — отсутствовал нормальный ход</h2><p className="text-white/65 leading-relaxed mb-5">На объекте проверяли ходовую и гидросистему, давление, электроклапаны и датчики скорости. Ролик набрал более 12 тыс. просмотров и 161 переход в профиль.</p><a href={WIRTGEN_VIDEO} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#FFC000] font-semibold">Смотреть диагностику <ArrowRight className="w-4 h-4"/></a></div><div className="bg-[#1a1a1a] border border-[#FFC000]/25 rounded-xl p-6"><div className="text-white/50 text-sm uppercase tracking-wider mb-2">Важно</div><p className="text-white/75 leading-relaxed">Не определяем причину потери хода только по нагреву масла. Сначала измеряем давление и проверяем гидромоторы, насосы, клапаны и управление — только после этого формируем ремонт.</p></div></div></section>

      <section className="py-16 bg-[#1a1a1a]"><div className="container mx-auto px-4"><h2 className="text-3xl font-bold mb-10">Что проверяем и <span className="text-[#FFC000]">ремонтируем</span></h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{services.map((service,i)=><div key={i} className="flex items-center gap-3 bg-[#222] rounded-lg p-4"><CheckCircle className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-white/90">{service}</span></div>)}</div></div></section>

      <section className="py-16"><div className="container mx-auto px-4"><h2 className="text-3xl font-bold mb-10">Модели <span className="text-[#FFC000]">Wirtgen</span>, с которыми работаем</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{wirtgenModels.map((item,i)=><div key={i} className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 hover:border-[#FFC000]/30"><h3 className="font-bold text-[#FFC000] mb-2">{item.model}</h3><p className="text-white/60 text-sm">{item.desc}</p></div>)}</div></div></section>

      <section className="py-16 bg-[#FFC000]"><div className="container mx-auto px-4 text-center max-w-3xl"><h2 className="text-3xl font-bold text-black mb-4">Проблема с ходом или гидравликой Wirtgen?</h2><p className="text-black/70 mb-3 text-lg">Сначала измеряем систему на объекте. После диагностики отдельно рассчитываем ремонт и необходимые запчасти.</p><p className="text-black font-bold text-xl mb-8">Комплексная диагностика — от 200 000 ₸.</p><div className="flex flex-wrap justify-center gap-4"><button onClick={handleWhatsApp} className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900"><MessageCircle className="w-6 h-6"/>WhatsApp</button><a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100"><Phone className="w-6 h-6"/>{PHONE_NUMBER}</a></div></div></section>

      <section className="py-12 bg-[#111111]"><div className="container mx-auto px-4"><h2 className="text-xl font-bold mb-6 text-white/80">Другие бренды</h2><div className="flex flex-wrap gap-3">{[{name:"Caterpillar (CAT)",href:"/brands/cat"},{name:"Komatsu",href:"/brands/komatsu"},{name:"Hitachi",href:"/brands/hitachi"},{name:"Hyundai",href:"/brands/hyundai"}].map((brand)=><Link key={brand.href} href={brand.href}><span className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 hover:border-[#FFC000]/50 text-white/70 hover:text-[#FFC000] px-4 py-2 rounded-lg text-sm">{brand.name}<ArrowRight className="w-3 h-3"/></span></Link>)}</div></div></section>

      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}><DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-lg"><DialogHeader><DialogTitle className="text-white">Заявка на диагностику Wirtgen</DialogTitle></DialogHeader><B2BLeadForm onSuccess={() => setIsLeadFormOpen(false)}/></DialogContent></Dialog>
    </div>
  );
}
