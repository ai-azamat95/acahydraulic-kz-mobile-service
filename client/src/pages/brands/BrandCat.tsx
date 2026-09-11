import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, CheckCircle, ArrowRight, Wrench, Gauge, Shield, PlayCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import B2BLeadForm from "@/components/B2BLeadForm";

const WHATSAPP_NUMBER = "77714177925";
const PHONE_NUMBER = "+7 (771) 417-79-25";

const catModels = [
  { model: "CAT 320 / 323 / 325 / 330", desc: "Диагностика насосов, гидромоторов, клапанов и управления" },
  { model: "CAT 336 / 340 / 349", desc: "Главные насосы, распределители, гидроцилиндры, электрика" },
  { model: "CAT D6 / D7 / D8 / D9", desc: "Гидравлика бульдозеров" },
  { model: "CAT 966 / 972 / 980", desc: "Гидравлика колёсных погрузчиков" },
  { model: "CAT 140 / 160 / 16M", desc: "Гидравлика автогрейдеров" },
  { model: "CAT 740 / 745 / 777", desc: "Гидравлические системы тяжёлой техники" },
];

const services = [
  "Диагностика гидросистемы CAT под рабочей нагрузкой",
  "Проверка давления и управляющих контуров",
  "Диагностика и ремонт главных гидронасосов",
  "Диагностика гидромоторов хода и поворота",
  "Работа с гидрораспределителями и клапанами",
  "Поиск неисправностей датчиков, соленоидов и электропроводки",
  "Проверка гидроцилиндров и внутренних утечек",
  "Выезд на объект по Казахстану",
];

export default function BrandCat() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const handleWhatsApp = () => {
    if (typeof window !== "undefined" && (window as any).gtag_whatsapp_conversion) {
      (window as any).gtag_whatsapp_conversion();
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Здравствуйте! Нужна выездная диагностика Caterpillar. Понимаю, что комплексная диагностика начинается от 200 000 ₸. Могу отправить модель, город и видео неисправности.")}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto">
      <SEO
        title="Диагностика и ремонт гидравлики Caterpillar CAT | ACA Hydraulic"
        description="Выездная диагностика гидравлики Caterpillar: экскаваторы CAT 320/325/330/336 и другая спецтехника. Реальные видеокейсы CAT 330DL и 330D2L. Диагностика от 200 000 ₸."
        keywords="ремонт гидравлики CAT, диагностика Caterpillar, CAT 330 теряет мощность, ремонт гидронасоса CAT, ремонт экскаватора CAT Казахстан"
        canonical="/brands/cat"
        breadcrumbs={[{ name: "Бренды", url: "/services" }, { name: "Caterpillar (CAT)", url: "/brands/cat" }]}
        serviceSchema={{
          serviceName: "Выездная диагностика и ремонт гидравлики Caterpillar",
          serviceDescription: "Диагностика и ремонт гидравлических систем техники Caterpillar на объекте по Казахстану.",
          serviceUrl: "/brands/cat",
          areaServed: ["Астана", "Казахстан"],
        }}
        faq={[
          {
            question: "Сколько стоит диагностика гидравлики Caterpillar?",
            answer: "Выездная комплексная диагностика начинается от 200 000 ₸. Итог зависит от местоположения, модели и характера неисправности. Ремонт и запчасти рассчитываются отдельно после диагностики.",
          },
          {
            question: "Что проверяете, если CAT теряет мощность после прогрева?",
            answer: "Проверяем гидросистему и двигатель в момент проявления дефекта: рабочее давление, управляющие контуры, насосы, клапаны, распределитель, датчики и электрику по фактическим симптомам.",
          },
          {
            question: "Выезжаете ли на объект за пределы Астаны?",
            answer: "Да. Выезжаем на объекты по Казахстану. Условия и стоимость выезда согласуются по местонахождению техники.",
          },
        ]}
      />

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/"><div className="flex items-center gap-3 cursor-pointer"><div className="flex gap-[3px] h-[28px]"><div className="w-[10px] h-full bg-[#FFC000]"/><div className="flex flex-col justify-between h-full"><div className="w-[10px] h-[12.5px] bg-[#FFC000]"/><div className="w-[10px] h-[12.5px] bg-[#FFC000]"/></div></div><div className="flex flex-col justify-center"><span className="font-sans font-bold text-[18px] leading-none tracking-wide">ACA</span><span className="font-sans font-medium text-[11px] leading-none tracking-wider mt-[2px]">HYDRAULIC</span></div></div></Link>
          <div className="flex items-center gap-3"><a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="hidden md:flex items-center gap-2 text-[#FFC000] font-medium"><Phone className="w-4 h-4" />{PHONE_NUMBER}</a><button onClick={handleWhatsApp} className="bg-[#FFC000] text-black px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-400">WhatsApp</button></div>
        </div>
      </header>

      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-[#111111]">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/50 mb-6"><Link href="/" className="hover:text-[#FFC000]">Главная</Link><span className="mx-2">/</span><Link href="/services" className="hover:text-[#FFC000]">Услуги</Link><span className="mx-2">/</span><span className="text-white/80">Caterpillar</span></nav>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[#FFC000]/10 border border-[#FFC000]/30 rounded-full px-4 py-2 mb-6"><Wrench className="w-4 h-4 text-[#FFC000]" /><span className="text-[#FFC000] text-sm font-medium">Выездная диагностика Caterpillar</span></div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Диагностика и ремонт гидравлики <span className="text-[#FFC000]">Caterpillar (CAT)</span></h1>
            <p className="text-xl text-white/70 mb-5 max-w-3xl">Если CAT теряет мощность, глохнет под нагрузкой, плохо работает после прогрева или есть проблемы с давлением — диагностируем машину на объекте в условиях проявления дефекта.</p>
            <div className="inline-flex items-center gap-3 bg-[#FFC000]/10 border border-[#FFC000]/30 px-5 py-3 rounded-lg mb-8"><span className="text-white/80">Выездная комплексная диагностика</span><strong className="text-[#FFC000] text-xl">от 200 000 ₸</strong></div>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleWhatsApp} className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500"><MessageCircle className="w-5 h-5" />Отправить данные</button>
              <Link href="/cases/cat-330dl-teryaet-moshchnost-na-goryachuyu" className="flex items-center gap-2 border border-[#FFC000] text-[#FFC000] px-6 py-3 rounded-lg font-semibold hover:bg-[#FFC000] hover:text-black"><PlayCircle className="w-5 h-5" />Реальный CAT 330DL</Link>
              <button onClick={() => setIsLeadFormOpen(true)} className="border border-white/30 px-6 py-3 rounded-lg font-semibold hover:border-[#FFC000] hover:text-[#FFC000]">Оставить заявку</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#1a1a1a]"><div className="container mx-auto px-4"><div className="grid grid-cols-1 md:grid-cols-3 gap-6">{[
        { icon: <Gauge className="w-6 h-6 text-[#FFC000]" />, title: "Проверка под нагрузкой", desc: "Снимаем параметры тогда, когда реально проявляется неисправность" },
        { icon: <Shield className="w-6 h-6 text-[#FFC000]" />, title: "Гарантия по условиям работ", desc: "До 6 месяцев при соблюдении согласованных рекомендаций и условий эксплуатации" },
        { icon: <PlayCircle className="w-6 h-6 text-[#FFC000]" />, title: "Реальные CAT на видео", desc: "Показываем диагностику, ремонт и результат на настоящей технике" },
      ].map((item,i)=><div key={i} className="flex items-start gap-4 bg-[#222] rounded-xl p-5"><div className="shrink-0 mt-1">{item.icon}</div><div><h3 className="font-bold mb-1">{item.title}</h3><p className="text-white/60 text-sm">{item.desc}</p></div></div>)}</div></div></section>

      <section className="py-16"><div className="container mx-auto px-4"><h2 className="text-3xl font-bold mb-10">Что проверяем и <span className="text-[#FFC000]">ремонтируем</span></h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{services.map((service,i)=><div key={i} className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-4"><CheckCircle className="w-5 h-5 text-[#FFC000] shrink-0"/><span className="text-white/90">{service}</span></div>)}</div></div></section>

      <section className="py-16 bg-[#111] border-y border-white/10"><div className="container mx-auto px-4"><div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6"><div className="text-[#FFC000] text-sm uppercase font-bold tracking-wider mb-2">Реальный кейс</div><h2 className="text-2xl md:text-3xl font-bold mb-3">CAT 330DL — терял мощность после прогрева</h2><p className="text-white/65 leading-relaxed mb-5">Диагностировали машину в рабочем температурном режиме и устранили выявленные причины. Финальный ролик получил десятки тысяч просмотров и реальные телефонные переходы.</p><Link href="/cases/cat-330dl-teryaet-moshchnost-na-goryachuyu"><span className="inline-flex items-center gap-2 text-[#FFC000] font-semibold">Разбор кейса <ArrowRight className="w-4 h-4"/></span></Link></div>
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6"><div className="text-[#FFC000] text-sm uppercase font-bold tracking-wider mb-2">Видео ремонта</div><h2 className="text-2xl md:text-3xl font-bold mb-3">CAT 330D2L — восстановление после затопления</h2><p className="text-white/65 leading-relaxed mb-5">Один из самых просматриваемых ремонтов ACA Hydraulic: диагностика и восстановление машины после затопления показаны серией видео.</p><Link href="/projects"><span className="inline-flex items-center gap-2 text-[#FFC000] font-semibold">Все реальные CAT-кейсы <ArrowRight className="w-4 h-4"/></span></Link></div>
      </div></div></section>

      <section className="py-16 bg-[#1a1a1a]"><div className="container mx-auto px-4"><h2 className="text-3xl font-bold mb-10">Модели <span className="text-[#FFC000]">Caterpillar</span>, с которыми работаем</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{catModels.map((item,i)=><div key={i} className="bg-[#222] rounded-xl p-5 border border-white/5 hover:border-[#FFC000]/30"><h3 className="font-bold text-[#FFC000] mb-2">{item.model}</h3><p className="text-white/60 text-sm">{item.desc}</p></div>)}</div></div></section>

      <section className="py-16 bg-[#FFC000]"><div className="container mx-auto px-4 text-center max-w-3xl"><h2 className="text-3xl font-bold text-black mb-4">Похожая проблема на CAT?</h2><p className="text-black/70 mb-3 text-lg">Сначала определяем фактическую причину неисправности. После диагностики отдельно рассчитываем ремонт и необходимые запчасти.</p><p className="text-black font-bold text-xl mb-8">Комплексная диагностика — от 200 000 ₸.</p><div className="flex flex-wrap justify-center gap-4"><button onClick={handleWhatsApp} className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900"><MessageCircle className="w-6 h-6"/>WhatsApp</button><a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100"><Phone className="w-6 h-6"/>{PHONE_NUMBER}</a></div></div></section>

      <section className="py-12 bg-[#111111]"><div className="container mx-auto px-4"><h2 className="text-xl font-bold mb-6 text-white/80">Другие бренды</h2><div className="flex flex-wrap gap-3">{[{name:"Komatsu",href:"/brands/komatsu"},{name:"Hitachi",href:"/brands/hitachi"},{name:"Hyundai",href:"/brands/hyundai"}].map((brand)=><Link key={brand.href} href={brand.href}><span className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 hover:border-[#FFC000]/50 text-white/70 hover:text-[#FFC000] px-4 py-2 rounded-lg text-sm">{brand.name}<ArrowRight className="w-3 h-3"/></span></Link>)}</div></div></section>

      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}><DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-lg"><DialogHeader><DialogTitle className="text-white">Заявка на диагностику CAT</DialogTitle></DialogHeader><B2BLeadForm onSuccess={() => setIsLeadFormOpen(false)} /></DialogContent></Dialog>
    </div>
  );
}
