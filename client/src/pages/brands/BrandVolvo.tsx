import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, CheckCircle, Wrench, Gauge, Shield } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import B2BLeadForm from "@/components/B2BLeadForm";

const WHATSAPP_NUMBER = "77714177925";
const PHONE_NUMBER = "+7 (771) 417-79-25";

const volvoModels = [
  { model: "Volvo EC140 / EC160 / EC180", desc: "Диагностика насосов, поворота, распределителей и цилиндров" },
  { model: "Volvo EC210 / EC240 / EC290", desc: "Главные насосы, ход, клапаны и гидроцилиндры" },
  { model: "Volvo EC360 / EC380 / EC460 / EC700", desc: "Диагностика гидросистем тяжёлых экскаваторов" },
  { model: "Volvo L60 / L70 / L90 / L110", desc: "Гидравлика колёсных погрузчиков" },
  { model: "Volvo A25 / A30 / A35 / A40", desc: "Гидравлика сочленённых самосвалов" },
];

const services = [
  "Выездная диагностика гидросистемы Volvo CE под нагрузкой",
  "Проверка рабочего и управляющего давления",
  "Диагностика главных гидронасосов",
  "Диагностика гидромоторов поворота и хода",
  "Проверка гидрораспределителей и клапанов",
  "Диагностика гидроцилиндров и внутренних утечек",
  "Проверка электрики, датчиков и соленоидов при гидравлических симптомах",
  "Выезд на объект по Казахстану",
];

export default function BrandVolvo() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const handleWhatsApp = () => {
    if (typeof window !== "undefined" && (window as any).gtag_whatsapp_conversion) {
      (window as any).gtag_whatsapp_conversion();
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Здравствуйте! Нужна выездная диагностика Volvo CE. Понимаю, что комплексная диагностика начинается от 200 000 ₸. Могу отправить модель, местонахождение и видео неисправности.")}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto">
      <SEO
        title="Диагностика и ремонт гидравлики Volvo CE | ACA Hydraulic"
        description="Выездная диагностика гидравлики Volvo CE: экскаваторы, погрузчики и самосвалы. Давление, насосы, гидромоторы, распределители, клапаны и электрика. Диагностика от 200 000 ₸."
        keywords="ремонт гидравлики Volvo, диагностика Volvo EC380, ремонт экскаватора Volvo, ремонт гидронасоса Volvo, Volvo не едет Казахстан"
        canonical="/brands/volvo"
        breadcrumbs={[{ name: "Бренды", url: "/services" }, { name: "Volvo CE", url: "/brands/volvo" }]}
        serviceSchema={{
          serviceName: "Выездная диагностика и ремонт гидравлики Volvo CE",
          serviceDescription: "Диагностика и ремонт гидравлических систем техники Volvo CE на объекте по Казахстану.",
          serviceUrl: "/brands/volvo",
          areaServed: ["Астана", "Казахстан"],
        }}
        faq={[
          {
            question: "Сколько стоит диагностика гидравлики Volvo CE?",
            answer: "Выездная комплексная диагностика начинается от 200 000 ₸. Итоговая стоимость зависит от местонахождения техники, модели и характера неисправности. Ремонт и запчасти рассчитываются отдельно после диагностики.",
          },
          {
            question: "Что проверяете, если Volvo теряет ход или мощность?",
            answer: "Проверяем систему под нагрузкой: рабочее и управляющее давление, насосы, гидромоторы, распределитель, клапаны, внутренние утечки и электрическое управление по фактическим симптомам.",
          },
          {
            question: "Выезжаете ли на объект за пределы Астаны?",
            answer: "Да. Выполняем выездную диагностику техники Volvo CE по Казахстану. Условия и стоимость выезда согласуются по местонахождению техники.",
          },
        ]}
      />

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10"><div className="container mx-auto px-4 py-4 flex items-center justify-between"><Link href="/"><div className="flex items-center gap-3 cursor-pointer"><div className="flex gap-[3px] h-[28px]"><div className="w-[10px] h-full bg-[#FFC000]"/><div className="flex flex-col justify-between h-full"><div className="w-[10px] h-[12.5px] bg-[#FFC000]"/><div className="w-[10px] h-[12.5px] bg-[#FFC000]"/></div></div><div className="flex flex-col justify-center"><span className="font-sans font-bold text-[18px] leading-none tracking-wide">ACA</span><span className="font-sans font-medium text-[11px] leading-none tracking-wider mt-[2px]">HYDRAULIC</span></div></div></Link><div className="flex items-center gap-3"><a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="hidden md:flex items-center gap-2 text-[#FFC000] font-medium"><Phone className="w-4 h-4"/>{PHONE_NUMBER}</a><button onClick={handleWhatsApp} className="bg-[#FFC000] text-black px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-400">WhatsApp</button></div></div></header>

      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-[#111111]"><div className="container mx-auto px-4"><nav className="text-sm text-white/50 mb-6"><Link href="/" className="hover:text-[#FFC000]">Главная</Link><span className="mx-2">/</span><Link href="/services" className="hover:text-[#FFC000]">Услуги</Link><span className="mx-2">/</span><span className="text-white/80">Volvo CE</span></nav><div className="max-w-4xl"><div className="inline-flex items-center gap-2 bg-[#FFC000]/10 border border-[#FFC000]/30 rounded-full px-4 py-2 mb-6"><Wrench className="w-4 h-4 text-[#FFC000]"/><span className="text-[#FFC000] text-sm font-medium">Выездная диагностика Volvo CE</span></div><h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Диагностика и ремонт гидравлики <span className="text-[#FFC000]">Volvo CE</span></h1><p className="text-xl text-white/70 mb-5 max-w-3xl">Если техника теряет ход, мощность, давление или отдельные операции работают медленно — проверяем гидросистему на объекте под рабочей нагрузкой и только после этого формируем ремонт.</p><div className="inline-flex items-center gap-3 bg-[#FFC000]/10 border border-[#FFC000]/30 px-5 py-3 rounded-lg mb-8"><span className="text-white/80">Выездная комплексная диагностика</span><strong className="text-[#FFC000] text-xl">от 200 000 ₸</strong></div><div className="flex flex-wrap gap-4"><button onClick={handleWhatsApp} className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500"><MessageCircle className="w-5 h-5"/>Отправить данные</button><button onClick={() => setIsLeadFormOpen(true)} className="border border-white/30 px-6 py-3 rounded-lg font-semibold hover:border-[#FFC000] hover:text-[#FFC000]">Оставить заявку</button></div></div></div></section>

      <section className="py-12 bg-[#1a1a1a]"><div className="container mx-auto px-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[{icon:<Gauge className="w-6 h-6 text-[#FFC000]"/>,title:"Диагностика под нагрузкой",desc:"Измеряем параметры в момент проявления дефекта"},{icon:<Shield className="w-6 h-6 text-[#FFC000]"/>,title:"Гарантия по условиям работ",desc:"До 6 месяцев при соблюдении согласованных рекомендаций и условий эксплуатации"},{icon:<Wrench className="w-6 h-6 text-[#FFC000]"/>,title:"Без необоснованной замены",desc:"Сначала подтверждаем неисправный узел, затем согласуем ремонт и запчасти"}].map((item,i)=><div key={i} className="flex items-start gap-4 bg-[#222] rounded-xl p-5"><div className="shrink-0 mt-1">{item.icon}</div><div><h3 className="font-bold mb-1">{item.title}</h3><p className="text-white/60 text-sm">{item.desc}</p></div></div>)}</div></div></section>

      <section className="py-16"><div className="container mx-auto px-4"><h2 className="text-3xl font-bold mb-10">Что проверяем и <span className="text-[#FFC000]">ремонтируем</span></h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{services.map((service,i)=><div key={i} className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-4"><CheckCircle className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-white/90">{service}</span></div>)}</div></div></section>

      <section className="py-16 bg-[#111] border-y border-white/10"><div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8"><div><h2 className="text-3xl md:text-4xl font-bold mb-4">Стоимость ремонта — после подтверждения причины</h2><p className="text-white/65 leading-relaxed">Не фиксируем стоимость насоса или гидромотора только по модели машины. До разборки и измерений одинаковая жалоба может быть связана с другим узлом или управлением. Диагностика нужна, чтобы не менять исправный дорогостоящий агрегат.</p></div><div className="bg-[#1a1a1a] border border-[#FFC000]/25 rounded-xl p-6"><div className="text-white/50 text-sm uppercase tracking-wider mb-2">Перед выездом подготовьте</div><ul className="space-y-3 text-white/80"><li>• модель и фото шильдика;</li><li>• местонахождение техники;</li><li>• видео проявления неисправности;</li><li>• информацию о предыдущих ремонтах.</li></ul></div></div></section>

      <section className="py-16 bg-[#1a1a1a]"><div className="container mx-auto px-4"><h2 className="text-3xl font-bold mb-10">Модели <span className="text-[#FFC000]">Volvo CE</span>, с которыми работаем</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{volvoModels.map((item,i)=><div key={i} className="bg-[#222] rounded-xl p-5 border border-white/5 hover:border-[#FFC000]/30"><h3 className="font-bold text-[#FFC000] mb-2">{item.model}</h3><p className="text-white/60 text-sm">{item.desc}</p></div>)}</div></div></section>

      <section className="py-16 bg-[#FFC000]"><div className="container mx-auto px-4 text-center max-w-3xl"><h2 className="text-3xl font-bold text-black mb-4">Проблема с гидравликой Volvo CE?</h2><p className="text-black/70 mb-3 text-lg">Сначала подтверждаем фактическую причину неисправности. Ремонт и запчасти рассчитываем отдельно.</p><p className="text-black font-bold text-xl mb-8">Комплексная диагностика — от 200 000 ₸.</p><div className="flex flex-wrap justify-center gap-4"><button onClick={handleWhatsApp} className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900"><MessageCircle className="w-6 h-6"/>WhatsApp</button><a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100"><Phone className="w-6 h-6"/>{PHONE_NUMBER}</a></div></div></section>

      <section className="py-12 bg-[#111111]"><div className="container mx-auto px-4"><h2 className="text-xl font-bold mb-6 text-white/80">Другие бренды</h2><div className="flex flex-wrap gap-3">{[{name:"CAT",href:"/brands/cat"},{name:"Komatsu",href:"/brands/komatsu"},{name:"Hitachi",href:"/brands/hitachi"},{name:"Hyundai",href:"/brands/hyundai"},{name:"Wirtgen",href:"/brands/wirtgen"},{name:"SHANTUI",href:"/brands/shantui"},{name:"Liebherr",href:"/brands/liebherr"}].map((brand)=><Link key={brand.href} href={brand.href}><span className="inline-block bg-[#1a1a1a] border border-white/20 hover:border-[#FFC000] text-white/70 hover:text-[#FFC000] px-5 py-2 rounded-full text-sm font-medium">{brand.name}</span></Link>)}</div></div></section>

      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}><DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-lg"><DialogHeader><DialogTitle className="text-white">Заявка на диагностику Volvo CE</DialogTitle></DialogHeader><B2BLeadForm onSuccess={() => setIsLeadFormOpen(false)}/></DialogContent></Dialog>
    </div>
  );
}
