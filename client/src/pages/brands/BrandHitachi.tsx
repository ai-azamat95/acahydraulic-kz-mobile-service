import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, CheckCircle, ArrowRight, Wrench, Clock, Shield } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import B2BLeadForm from "@/components/B2BLeadForm";

const WHATSAPP_NUMBER = "77714177925";
const PHONE_NUMBER = "+7 (771) 417-79-25";

const hitachiModels = [
  { model: "Hitachi ZX200 / ZX210 / ZX240", desc: "Гидронасосы, гидромоторы хода и поворота" },
  { model: "Hitachi ZX300 / ZX350 / ZX400", desc: "Главные насосы, распределители, гидроцилиндры" },
  { model: "Hitachi ZX470 / ZX520 / ZX870", desc: "Крупные карьерные экскаваторы" },
  { model: "Hitachi EX200 / EX300 / EX400", desc: "Старые серии — полный спектр ремонта" },
  { model: "Hitachi ZW150 / ZW180 / ZW220", desc: "Гидравлика колёсных погрузчиков" },
  { model: "Hitachi EH1100 / EH3500", desc: "Гидравлика карьерных самосвалов" },
];

const services = [
  "Ремонт и восстановление гидронасосов Hitachi",
  "Ремонт гидромоторов хода и поворота",
  "Ремонт гидрораспределителей и клапанов",
  "Замена гидравлических уплотнений",
  "Диагностика гидросистемы на объекте",
  "Ремонт гидроцилиндров стрелы и ковша",
  "Промывка и замена гидравлического масла",
  "Выездной ремонт на строительном объекте",
];

export default function BrandHitachi() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const handleWhatsApp = () => {
    if (typeof window !== "undefined" && (window as any).gtag_whatsapp_conversion) {
      (window as any).gtag_whatsapp_conversion();
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Здравствуйте! Нужен ремонт гидравлики Hitachi.`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto">
      <SEO
        title="Ремонт гидравлики Hitachi в Астане | ACA Hydraulic"
        description="Ремонт гидравлики Hitachi в Астане и Казахстане. Экскаваторы ZX200/ZX300/ZX470, погрузчики ZW. Выездной сервис 24/7. Гарантия качества. ☎ +7 (771) 417-79-25"
        keywords="ремонт гидравлики Hitachi, ремонт Hitachi Астана, ремонт гидронасоса Hitachi ZX200, ремонт Hitachi ZX300, сервис Hitachi Казахстан, ремонт экскаватора Hitachi"
        canonical="/brands/hitachi"
        breadcrumbs={[
          { name: "Бренды", url: "/services" },
          { name: "Hitachi", url: "/brands/hitachi" },
        ]}
        serviceSchema={{
          serviceName: "Ремонт гидравлики Hitachi",
          serviceDescription: "Ремонт гидравлики спецтехники Hitachi в Астане. Экскаваторы ZX, погрузчики ZW, карьерные самосвалы EH.",
          serviceUrl: "/brands/hitachi",
          areaServed: ["Астана", "Казахстан"],
        }}
        faq={[
          {
            question: "Сколько стоит ремонт гидронасоса Hitachi ZX200?",
            answer: "Ремонт главного гидронасоса Hitachi ZX200 стоит от 90 000 до 180 000 тенге в зависимости от характера неисправности. Диагностика бесплатна при последующем ремонте.",
          },
          {
            question: "Ремонтируете ли старые серии Hitachi EX?",
            answer: "Да, ремонтируем как современные серии ZX, так и старые серии EX. Имеем опыт работы с техникой Hitachi всех поколений.",
          },
          {
            question: "Выезжаете ли на ремонт Hitachi на объект?",
            answer: "Да, выезжаем на ремонт Hitachi прямо на строительный объект или карьер. Оснащены мобильной мастерской. Работаем по всему Казахстану 24/7.",
          },
        ]}
      />

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
          <div className="flex items-center gap-3">
            <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="hidden md:flex items-center gap-2 text-[#FFC000] font-medium">
              <Phone className="w-4 h-4" />
              {PHONE_NUMBER}
            </a>
            <button onClick={handleWhatsApp} className="bg-[#FFC000] text-black px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-400 transition-colors">
              WhatsApp
            </button>
          </div>
        </div>
      </header>

      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-[#111111]">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-[#FFC000] transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-[#FFC000] transition-colors">Услуги</Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">Hitachi</span>
          </nav>
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[#FFC000]/10 border border-[#FFC000]/30 rounded-full px-4 py-2 mb-6">
              <Wrench className="w-4 h-4 text-[#FFC000]" />
              <span className="text-[#FFC000] text-sm font-medium">Специализация: Hitachi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ремонт гидравлики<br />
              <span className="text-[#FFC000]">Hitachi</span><br />
              в Астане
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-2xl">
              Профессиональный ремонт гидравлических систем спецтехники Hitachi. Экскаваторы ZX/EX, погрузчики ZW, карьерные самосвалы EH. Выездной сервис 24/7 по Казахстану.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={handleWhatsApp} className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors">
                <MessageCircle className="w-5 h-5" />WhatsApp
              </button>
              <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="flex items-center gap-2 bg-[#FFC000] text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                <Phone className="w-5 h-5" />{PHONE_NUMBER}
              </a>
              <button onClick={() => setIsLeadFormOpen(true)} className="flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:border-[#FFC000] hover:text-[#FFC000] transition-colors">
                Оставить заявку
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Clock className="w-6 h-6 text-[#FFC000]" />, title: "Выезд за 2 часа", desc: "Бригада выезжает на объект в течение 2 часов после звонка" },
              { icon: <Shield className="w-6 h-6 text-[#FFC000]" />, title: "Гарантия 6 месяцев", desc: "Даём гарантию на все виды ремонта гидравлики Hitachi" },
              { icon: <Wrench className="w-6 h-6 text-[#FFC000]" />, title: "Опыт 10+ лет", desc: "Специализируемся на гидравлике Hitachi более 10 лет" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#222] rounded-xl p-5">
                <div className="shrink-0 mt-1">{item.icon}</div>
                <div><h3 className="font-bold text-white mb-1">{item.title}</h3><p className="text-white/60 text-sm">{item.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">Что мы <span className="text-[#FFC000]">ремонтируем</span> в Hitachi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#1a1a1a] rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-[#FFC000] shrink-0" />
                <span className="text-white/90">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">Модели <span className="text-[#FFC000]">Hitachi</span>, с которыми работаем</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hitachiModels.map((item, i) => (
              <div key={i} className="bg-[#222] rounded-xl p-5 border border-white/5 hover:border-[#FFC000]/30 transition-colors">
                <h3 className="font-bold text-[#FFC000] mb-2">{item.model}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#FFC000]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Нужен ремонт гидравлики Hitachi?</h2>
          <p className="text-black/70 mb-8 text-lg">Позвоните или напишите — выедем на объект в течение 2 часов</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleWhatsApp} className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition-colors">
              <MessageCircle className="w-6 h-6" />WhatsApp
            </button>
            <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              <Phone className="w-6 h-6" />{PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#111111]">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-6 text-white/80">Другие бренды</h2>
          <div className="flex flex-wrap gap-3">
            {[{ name: "Caterpillar (CAT)", href: "/brands/cat" }, { name: "Komatsu", href: "/brands/komatsu" }, { name: "Hyundai", href: "/brands/hyundai" }].map((brand) => (
              <Link key={brand.href} href={brand.href}>
                <span className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 hover:border-[#FFC000]/50 text-white/70 hover:text-[#FFC000] px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                  {brand.name}<ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-lg">
          <DialogHeader><DialogTitle className="text-white">Заявка на ремонт Hitachi</DialogTitle></DialogHeader>
          <B2BLeadForm onSuccess={() => setIsLeadFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
