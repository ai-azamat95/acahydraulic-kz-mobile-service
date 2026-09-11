import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, CheckCircle, ArrowRight, Wrench, Gauge, Shield, PlayCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import B2BLeadForm from "@/components/B2BLeadForm";

const WHATSAPP_NUMBER = "77714177925";
const PHONE_NUMBER = "+7 (771) 417-79-25";

const hitachiModels = [
  { model: "Hitachi ZX200 / ZX210 / ZX240", desc: "Диагностика насосов, гидромоторов и управляющих контуров" },
  { model: "Hitachi ZX300 / ZX330 / ZX350 / ZX400", desc: "Главные насосы, распределители, клапаны, электрика" },
  { model: "Hitachi ZX470 / ZX520 / ZX870", desc: "Диагностика и ремонт гидросистем тяжёлых экскаваторов" },
  { model: "Hitachi EX200 / EX300 / EX400", desc: "Диагностика гидросистем старых серий" },
  { model: "Hitachi ZW150 / ZW180 / ZW220", desc: "Гидравлика колёсных погрузчиков" },
];

const services = [
  "Диагностика гидросистемы Hitachi под рабочей нагрузкой",
  "Проверка давления, управляющих контуров и распределения потока",
  "Диагностика и ремонт главных гидронасосов",
  "Диагностика гидромоторов хода и поворота",
  "Работа с гидрораспределителями и клапанами",
  "Поиск неисправностей электрики, датчиков и соленоидов",
  "Проверка гидроцилиндров и внутренних утечек",
  "Выезд на объект по Казахстану",
];

export default function BrandHitachi() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const handleWhatsApp = () => {
    if (typeof window !== "undefined" && (window as any).gtag_whatsapp_conversion) {
      (window as any).gtag_whatsapp_conversion();
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Здравствуйте! Нужна выездная диагностика Hitachi. Понимаю, что комплексная диагностика начинается от 200 000 ₸. Могу отправить модель, город и видео неисправности.")}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto">
      <SEO
        title="Диагностика и ремонт гидравлики Hitachi | Выезд по Казахстану — ACA Hydraulic"
        description="Выездная диагностика гидравлики Hitachi ZX и другой спецтехники. Давление, насосы, распределители, клапаны, электрика. Реальный кейс Hitachi 330-5G с видео. Диагностика от 200 000 ₸."
        keywords="ремонт гидравлики Hitachi, диагностика Hitachi ZX330, Hitachi плавает давление, Hitachi стрела рывками, ремонт экскаватора Hitachi Казахстан"
        canonical="/brands/hitachi"
        breadcrumbs={[
          { name: "Бренды", url: "/services" },
          { name: "Hitachi", url: "/brands/hitachi" },
        ]}
        serviceSchema={{
          serviceName: "Выездная диагностика и ремонт гидравлики Hitachi",
          serviceDescription: "Диагностика и ремонт гидравлических систем техники Hitachi на объекте по Казахстану.",
          serviceUrl: "/brands/hitachi",
          areaServed: ["Астана", "Казахстан"],
        }}
        faq={[
          {
            question: "Сколько стоит диагностика гидравлики Hitachi?",
            answer: "Выездная комплексная диагностика начинается от 200 000 ₸. Итоговая стоимость зависит от местоположения техники, модели и характера неисправности. Ремонт и запчасти рассчитываются отдельно после диагностики.",
          },
          {
            question: "Что проверяете, если Hitachi теряет мощность или работает рывками?",
            answer: "Проверяем гидросистему под нагрузкой: давление, управляющие контуры, насосы, клапаны, распределитель, внутренние утечки, а при необходимости датчики, соленоиды и электропроводку.",
          },
          {
            question: "Выезжаете ли на объект за пределы Астаны?",
            answer: "Да. ACA Hydraulic выполняет выездную диагностику и ремонт спецтехники на объектах по Казахстану. Условия и стоимость выезда согласуются по местонахождению техники.",
          },
        ]}
      />

      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="flex gap-[3px] h-[28px]">
                <div className="w-[10px] h-full bg-[#FFC000]" />
                <div className="flex flex-col justify-between h-full">
                  <div className="w-[10px] h-[12.5px] bg-[#FFC000]" />
                  <div className="w-[10px] h-[12.5px] bg-[#FFC000]" />
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-sans font-bold text-[18px] leading-none tracking-wide">ACA</span>
                <span className="font-sans font-medium text-[11px] leading-none tracking-wider mt-[2px]">HYDRAULIC</span>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="hidden md:flex items-center gap-2 text-[#FFC000] font-medium">
              <Phone className="w-4 h-4" />{PHONE_NUMBER}
            </a>
            <button onClick={handleWhatsApp} className="bg-[#FFC000] text-black px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-400 transition-colors">WhatsApp</button>
          </div>
        </div>
      </header>

      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-[#111111]">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-[#FFC000]">Главная</Link><span className="mx-2">/</span>
            <Link href="/services" className="hover:text-[#FFC000]">Услуги</Link><span className="mx-2">/</span>
            <span className="text-white/80">Hitachi</span>
          </nav>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[#FFC000]/10 border border-[#FFC000]/30 rounded-full px-4 py-2 mb-6">
              <Wrench className="w-4 h-4 text-[#FFC000]" /><span className="text-[#FFC000] text-sm font-medium">Выездная диагностика Hitachi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Диагностика и ремонт гидравлики <span className="text-[#FFC000]">Hitachi</span></h1>
            <p className="text-xl text-white/70 mb-5 max-w-3xl">Если экскаватор теряет мощность, давление нестабильно, стрела идёт рывками или операции работают медленно — ищем фактическую причину на объекте под нагрузкой.</p>
            <div className="inline-flex items-center gap-3 bg-[#FFC000]/10 border border-[#FFC000]/30 px-5 py-3 rounded-lg mb-8">
              <span className="text-white/80">Выездная комплексная диагностика</span><strong className="text-[#FFC000] text-xl">от 200 000 ₸</strong>
            </div>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleWhatsApp} className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500"><MessageCircle className="w-5 h-5" />Отправить данные в WhatsApp</button>
              <Link href="/cases/hitachi-330-5g-plavaet-davlenie-strela-ryvkami" className="flex items-center gap-2 border border-[#FFC000] text-[#FFC000] px-6 py-3 rounded-lg font-semibold hover:bg-[#FFC000] hover:text-black"><PlayCircle className="w-5 h-5" />Реальный Hitachi 330-5G</Link>
              <button onClick={() => setIsLeadFormOpen(true)} className="border border-white/30 px-6 py-3 rounded-lg font-semibold hover:border-[#FFC000] hover:text-[#FFC000]">Оставить заявку</button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Gauge className="w-6 h-6 text-[#FFC000]" />, title: "Диагностика под нагрузкой", desc: "Измеряем параметры в условиях, когда проявляется неисправность" },
              { icon: <Shield className="w-6 h-6 text-[#FFC000]" />, title: "Гарантия по условиям работ", desc: "До 6 месяцев при соблюдении согласованных рекомендаций и условий эксплуатации" },
              { icon: <PlayCircle className="w-6 h-6 text-[#FFC000]" />, title: "Реальные работы на видео", desc: "Hitachi 330-5G и другие ремонты опубликованы в наших каналах" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#222] rounded-xl p-5"><div className="shrink-0 mt-1">{item.icon}</div><div><h3 className="font-bold mb-1">{item.title}</h3><p className="text-white/60 text-sm">{item.desc}</p></div></div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">Что проверяем и <span className="text-[#FFC000]">ремонтируем</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, i) => <div key={i} className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-4"><CheckCircle className="w-5 h-5 text-[#FFC000] shrink-0" /><span className="text-white/90">{service}</span></div>)}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#111] border-y border-white/10">
        <div className="container mx-auto px-4 grid lg:grid-cols-[1.2fr_.8fr] gap-8 items-center">
          <div>
            <div className="text-[#FFC000] text-sm uppercase tracking-widest font-bold mb-3">Реальный кейс</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Hitachi 330-5G: плавает давление, стрела поднимается рывками</h2>
            <p className="text-white/65 leading-relaxed mb-5">Машина работала медленно, не развивала нормальную мощность, давление было нестабильным. Видео этого выезда набрало более 111 тыс. просмотров и привело реальные переходы к контакту.</p>
            <Link href="/cases/hitachi-330-5g-plavaet-davlenie-strela-ryvkami"><span className="inline-flex items-center gap-2 text-[#FFC000] font-semibold">Посмотреть разбор кейса <ArrowRight className="w-4 h-4" /></span></Link>
          </div>
          <div className="bg-[#1a1a1a] border border-[#FFC000]/25 rounded-xl p-6">
            <div className="text-white/50 text-sm uppercase tracking-wider mb-2">Перед выездом подготовьте</div>
            <ul className="space-y-3 text-white/80">
              <li>• модель и фото шильдика техники;</li>
              <li>• город или точку нахождения объекта;</li>
              <li>• короткое видео проявления неисправности;</li>
              <li>• что уже ремонтировали или меняли до нас.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">Модели <span className="text-[#FFC000]">Hitachi</span>, с которыми работаем</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hitachiModels.map((item, i) => <div key={i} className="bg-[#222] rounded-xl p-5 border border-white/5 hover:border-[#FFC000]/30"><h3 className="font-bold text-[#FFC000] mb-2">{item.model}</h3><p className="text-white/60 text-sm">{item.desc}</p></div>)}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#FFC000]">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold text-black mb-4">Похожая проблема на Hitachi?</h2>
          <p className="text-black/70 mb-3 text-lg">Выездную диагностику начинаем с определения фактической причины неисправности, а не с замены деталей наугад.</p>
          <p className="text-black font-bold text-xl mb-8">Комплексная диагностика — от 200 000 ₸. Ремонт и запчасти отдельно.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleWhatsApp} className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900"><MessageCircle className="w-6 h-6" />WhatsApp</button>
            <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100"><Phone className="w-6 h-6" />{PHONE_NUMBER}</a>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#111111]">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-6 text-white/80">Другие бренды</h2>
          <div className="flex flex-wrap gap-3">
            {[{ name: "Caterpillar (CAT)", href: "/brands/cat" }, { name: "Komatsu", href: "/brands/komatsu" }, { name: "Hyundai", href: "/brands/hyundai" }].map((brand) => <Link key={brand.href} href={brand.href}><span className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 hover:border-[#FFC000]/50 text-white/70 hover:text-[#FFC000] px-4 py-2 rounded-lg text-sm">{brand.name}<ArrowRight className="w-3 h-3" /></span></Link>)}
          </div>
        </div>
      </section>

      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Заявка на диагностику Hitachi</DialogTitle></DialogHeader>
          <B2BLeadForm onSuccess={() => setIsLeadFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
