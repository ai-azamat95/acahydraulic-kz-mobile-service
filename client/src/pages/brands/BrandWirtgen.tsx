import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, CheckCircle, ArrowRight, Wrench, Clock, Shield } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import B2BLeadForm from "@/components/B2BLeadForm";

const WHATSAPP_NUMBER = "77714177925";
const PHONE_NUMBER = "+7 (771) 417-79-25";

const wirtgenModels = [
  { model: "Wirtgen W 100 / W 120 / W 150", desc: "Гидромоторы хода, насосы, гидроцилиндры подъёма" },
  { model: "Wirtgen W 200 / W 210 / W 220", desc: "Главные гидронасосы, распределители, гидробаки" },
  { model: "Wirtgen W 1500 / W 1900 / W 2000", desc: "Гидравлика хода, привода фрезерного барабана, конвейера" },
  { model: "Wirtgen W 2100 / W 2200", desc: "Крупногабаритные гидромоторы и насосы высокого давления" },
  { model: "Wirtgen WR 200 / WR 240 / WR 250", desc: "Гидравлика ресайклеров: насосы, клапаны, цилиндры" },
  { model: "Wirtgen SP 15 / SP 25 / SP 500", desc: "Гидравлика бетоноукладчиков и профилировщиков" },
];

const services = [
  "Ремонт гидромоторов ходовой части Wirtgen",
  "Ремонт главных гидронасосов Wirtgen",
  "Диагностика и ремонт гидрораспределителей",
  "Замена уплотнений и ремкомплектов",
  "Выездная диагностика на объекте",
  "Ремонт гидроцилиндров подъёма и нивелирования",
  "Промывка гидросистемы и замена масла",
  "Настройка давления и регулировка клапанов",
];

export default function BrandWirtgen() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const handleWhatsApp = () => {
    if (typeof window !== "undefined" && (window as any).gtag_whatsapp_conversion) {
      (window as any).gtag_whatsapp_conversion();
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Здравствуйте! Нужен ремонт гидравлики Wirtgen.`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto">
      <SEO
        title="Ремонт гидравлики Wirtgen в Астане | ACA Hydraulic"
        description="Ремонт гидравлики дорожных фрез Wirtgen в Астане и Казахстане. W 150/W 200/W 1500/W 2200, ресайклеры WR. Выездной сервис 24/7. Гарантия. ☎ +7 (771) 417-79-25"
        keywords="ремонт гидравлики Wirtgen, ремонт дорожной фрезы Wirtgen, ремонт Wirtgen Астана, ремонт гидромотора Wirtgen, сервис Wirtgen Казахстан, ремонт дорожной фрезы Казахстан"
        canonical="/brands/wirtgen"
        breadcrumbs={[
          { name: "Бренды", url: "/services" },
          { name: "Wirtgen", url: "/brands/wirtgen" },
        ]}
        serviceSchema={{
          serviceName: "Ремонт гидравлики Wirtgen",
          serviceDescription: "Ремонт гидравлики дорожных фрез и ресайклеров Wirtgen в Астане. Гидромоторы хода, насосы, распределители, цилиндры.",
          serviceUrl: "/brands/wirtgen",
          areaServed: ["Астана", "Казахстан"],
        }}
        faq={[
          {
            question: "Сколько стоит ремонт гидромотора хода Wirtgen?",
            answer: "Ремонт гидромотора ходовой части Wirtgen стоит от 80 000 до 180 000 тенге в зависимости от модели и характера неисправности. Диагностика бесплатна при последующем ремонте. Точную стоимость определяем после дефектовки.",
          },
          {
            question: "Почему дорожная фреза Wirtgen теряет ход при нагреве?",
            answer: "Потеря хода при нагреве — классический симптом износа уплотнений в гидромоторах ходовой части. При нагреве масла вязкость снижается, и изношенные уплотнения начинают пропускать масло, падает давление. Решение: замена уплотнительных комплектов и регулировка давления в системе.",
          },
          {
            question: "Выезжаете ли на ремонт Wirtgen на объект?",
            answer: "Да, выезжаем на ремонт Wirtgen прямо на строительный объект или дорожный участок. Оснащены мобильной мастерской с диагностическим оборудованием. Работаем по всему Казахстану 24/7.",
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

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-black to-[#111111]">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-white/50 mb-6">
            <Link href="/" className="hover:text-[#FFC000] transition-colors">Главная</Link>
            <span className="mx-2">/</span>
            <Link href="/services" className="hover:text-[#FFC000] transition-colors">Услуги</Link>
            <span className="mx-2">/</span>
            <span className="text-white/80">Wirtgen</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[#FFC000]/10 border border-[#FFC000]/30 rounded-full px-4 py-2 mb-6">
              <Wrench className="w-4 h-4 text-[#FFC000]" />
              <span className="text-[#FFC000] text-sm font-medium">Специализация: Wirtgen</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ремонт гидравлики<br />
              <span className="text-[#FFC000]">Wirtgen</span><br />
              в Астане
            </h1>

            <p className="text-xl text-white/70 mb-8 max-w-2xl">
              Профессиональный ремонт гидравлических систем дорожных фрез и ресайклеров Wirtgen. Выездная диагностика, замена гидромоторов и насосов. Сервис 24/7 по всему Казахстану.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={handleWhatsApp} className="flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-500 transition-colors">
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </button>
              <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="flex items-center gap-2 bg-[#FFC000] text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
                <Phone className="w-5 h-5" />
                {PHONE_NUMBER}
              </a>
              <button onClick={() => setIsLeadFormOpen(true)} className="flex items-center gap-2 border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:border-[#FFC000] hover:text-[#FFC000] transition-colors">
                Оставить заявку
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-12 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: <Clock className="w-6 h-6 text-[#FFC000]" />, title: "Выезд за 2 часа", desc: "Бригада выезжает на объект в течение 2 часов после звонка" },
              { icon: <Shield className="w-6 h-6 text-[#FFC000]" />, title: "Гарантия 6 месяцев", desc: "Даём гарантию на все виды ремонта гидравлики Wirtgen" },
              { icon: <Wrench className="w-6 h-6 text-[#FFC000]" />, title: "Реальный опыт", desc: "Выполнили ремонт гидравлики Wirtgen 1500 — потеря хода при нагреве устранена за 2 дня" },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-[#222] rounded-xl p-5">
                <div className="shrink-0 mt-1">{item.icon}</div>
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-white/60 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typical problem block */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Частая проблема: <span className="text-[#FFC000]">потеря хода при нагреве</span></h2>
          <p className="text-white/70 mb-8 max-w-2xl">
            Одна из самых распространённых неисправностей дорожных фрез Wirtgen — машина нормально едет в холодном состоянии, но после прогрева гидравлического масла полностью теряет ход. Причина — износ уплотнений в гидромоторах ходовой части.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { step: "01", title: "Симптом", desc: "Фреза перестаёт двигаться после 30–60 минут работы, когда масло прогревается до рабочей температуры" },
              { step: "02", title: "Причина", desc: "Изношенные уплотнения гидромоторов при нагреве теряют герметичность — внутренние утечки сбрасывают давление" },
              { step: "03", title: "Решение", desc: "Замена уплотнительных комплектов гидромоторов хода, регулировка давления в системе — восстановление за 1–2 дня" },
            ].map((item) => (
              <div key={item.step} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5">
                <span className="text-[#FFC000] font-bold text-2xl">{item.step}</span>
                <h3 className="font-bold text-white mt-2 mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link href="/projects">
            <span className="inline-flex items-center gap-2 text-[#FFC000] hover:underline cursor-pointer font-medium">
              Смотреть кейс: ремонт Wirtgen 1500
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">Что мы <span className="text-[#FFC000]">ремонтируем</span> в Wirtgen</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#222] rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-[#FFC000] shrink-0" />
                <span className="text-white/90">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Models */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">Модели <span className="text-[#FFC000]">Wirtgen</span>, с которыми работаем</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wirtgenModels.map((item, i) => (
              <div key={i} className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 hover:border-[#FFC000]/30 transition-colors">
                <h3 className="font-bold text-[#FFC000] mb-2">{item.model}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#FFC000]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Нужен ремонт гидравлики Wirtgen?</h2>
          <p className="text-black/70 mb-8 text-lg">Позвоните или напишите — выедем на объект в течение 2 часов</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={handleWhatsApp} className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition-colors">
              <MessageCircle className="w-6 h-6" />
              WhatsApp
            </button>
            <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              <Phone className="w-6 h-6" />
              {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-12 bg-[#111111]">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-bold mb-6 text-white/80">Другие бренды</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "Caterpillar (CAT)", href: "/brands/cat" },
              { name: "Komatsu", href: "/brands/komatsu" },
              { name: "Hitachi", href: "/brands/hitachi" },
              { name: "Hyundai", href: "/brands/hyundai" },
            ].map((brand) => (
              <Link key={brand.href} href={brand.href}>
                <span className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 hover:border-[#FFC000]/50 text-white/70 hover:text-[#FFC000] px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
                  {brand.name}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Заявка на ремонт Wirtgen</DialogTitle>
          </DialogHeader>
          <B2BLeadForm onSuccess={() => setIsLeadFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
