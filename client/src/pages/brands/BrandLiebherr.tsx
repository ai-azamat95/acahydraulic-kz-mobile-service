import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, CheckCircle, ArrowRight, Wrench, Clock, Shield } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import B2BLeadForm from "@/components/B2BLeadForm";

const WHATSAPP_NUMBER = "77714177925";
const PHONE_NUMBER = "+7 (771) 417-79-25";

const liebherrModels = [
  { model: "Liebherr R906 / R914 / R924", desc: "Гидронасосы Rexroth, гидромоторы поворота, распределители, гидроцилиндры стрелы и рукояти" },
  { model: "Liebherr R934 / R944 / R954", desc: "Главные насосы, гидромоторы хода, клапаны давления, гидроцилиндры ковша" },
  { model: "Liebherr LR621 / LR631 / LR641", desc: "Гидравлика гусеничных кранов: насосы подъёма, гидромоторы хода, распределители" },
  { model: "Liebherr LTM 1060 / LTM 1100", desc: "Гидравлика автокранов: рулевые цилиндры, насосы выносных опор, гидромоторы" },
  { model: "Liebherr L526 / L538 / L550", desc: "Гидравлика колёсных погрузчиков: рулевое управление, ковш, подъём, трансмиссия" },
  { model: "Liebherr PR726 / PR736 / PR756", desc: "Гидравлика бульдозеров: насосы, гидромоторы хода, цилиндры отвала и рыхлителя" },
];

const services = [
  "Ремонт гидронасосов Liebherr (Rexroth, Bosch)",
  "Ремонт гидромоторов поворота и хода",
  "Диагностика и ремонт гидрораспределителей",
  "Замена уплотнений и ремкомплектов",
  "Выездная диагностика на объекте",
  "Ремонт гидроцилиндров стрелы, рукояти, ковша",
  "Промывка гидросистемы и замена масла",
  "Настройка давления и регулировка клапанов",
  "Ремонт системы охлаждения гидравлики",
  "Ремонт гидравлики кранов и погрузчиков Liebherr",
];

export default function BrandLiebherr() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const handleWhatsApp = () => {
    if (typeof window !== "undefined" && (window as any).gtag_whatsapp_conversion) {
      (window as any).gtag_whatsapp_conversion();
    }
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=Здравствуйте! Нужен ремонт гидравлики Liebherr.`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto">
      <SEO
        title="Ремонт гидравлики Liebherr в Астане | ACA Hydraulic"
        description="Ремонт гидравлики экскаваторов, кранов и погрузчиков Liebherr в Астане и Казахстане. R906/R914/R924/R934/R944, LTM, LR, L526. Выездной сервис 24/7. Гарантия. ☎ +7 (771) 417-79-25"
        keywords="ремонт гидравлики Liebherr, ремонт экскаватора Liebherr, ремонт Liebherr Астана, сервис Liebherr Казахстан, ремонт гидронасоса Liebherr, ремонт крана Liebherr"
        canonical="/brands/liebherr"
        breadcrumbs={[
          { name: "Бренды", url: "/services" },
          { name: "Liebherr", url: "/brands/liebherr" },
        ]}
        serviceSchema={{
          serviceName: "Ремонт гидравлики Liebherr",
          serviceDescription: "Ремонт гидравлики экскаваторов, кранов, погрузчиков и бульдозеров Liebherr в Астане. Гидронасосы, гидромоторы, распределители, цилиндры.",
          serviceUrl: "/brands/liebherr",
          areaServed: ["Астана", "Казахстан"],
        }}
        faq={[
          {
            question: "Сколько стоит ремонт гидронасоса Liebherr?",
            answer: "Ремонт гидронасоса Liebherr стоит от 350 000 тенге в зависимости от модели и степени износа. Диагностика бесплатна при последующем ремонте. Точную стоимость определяем после дефектовки.",
          },
          {
            question: "Как долго длится ремонт гидравлики Liebherr?",
            answer: "Ремонт гидравлики Liebherr занимает от 3 до 14 рабочих дней в зависимости от объёма работ и наличия запчастей. Выездная диагностика — в день обращения.",
          },
          {
            question: "Выезжаете ли на ремонт Liebherr на объект?",
            answer: "Да, выезжаем на ремонт Liebherr прямо на строительный объект, карьер или порт. Оснащены мобильной мастерской с диагностическим оборудованием. Работаем по всему Казахстану 24/7.",
          },
          {
            question: "Ремонтируете ли краны Liebherr LTM?",
            answer: "Да, ремонтируем гидравлику автокранов Liebherr серии LTM: рулевые цилиндры, насосы выносных опор, гидромоторы поворота стрелы. Работаем с LTM 1060, LTM 1100 и другими моделями.",
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
            <span className="text-white/80">Liebherr</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[#FFC000]/10 border border-[#FFC000]/30 rounded-full px-4 py-2 mb-6">
              <Wrench className="w-4 h-4 text-[#FFC000]" />
              <span className="text-[#FFC000] text-sm font-medium">Специализация: Liebherr</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Ремонт гидравлики<br />
              <span className="text-[#FFC000]">Liebherr</span><br />
              в Астане
            </h1>

            <p className="text-xl text-white/70 mb-8 max-w-2xl">
              Профессиональный ремонт гидравлических систем экскаваторов, кранов, погрузчиков и бульдозеров Liebherr. Выездная диагностика, замена гидромоторов и насосов Rexroth/Bosch. Сервис 24/7 по всему Казахстану.
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
              { icon: <Clock className="w-6 h-6 text-[#FFC000]" />, title: "Выезд за 2 часа", desc: "Бригада выезжает на объект в течение 2 часов после звонка по всему Казахстану" },
              { icon: <Shield className="w-6 h-6 text-[#FFC000]" />, title: "Гарантия 6 месяцев", desc: "Даём гарантию на все виды ремонта гидравлики Liebherr" },
              { icon: <Wrench className="w-6 h-6 text-[#FFC000]" />, title: "Опыт с Rexroth", desc: "Работаем с насосами и моторами Rexroth/Bosch, установленными на технике Liebherr" },
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

      {/* Models */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">Модели <span className="text-[#FFC000]">Liebherr</span>, с которыми работаем</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liebherrModels.map((item, i) => (
              <div key={i} className="bg-[#1a1a1a] border border-white/10 rounded-xl p-5">
                <h3 className="font-bold text-[#FFC000] mb-2">{item.model}</h3>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-[#1a1a1a]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10">Что мы <span className="text-[#FFC000]">ремонтируем</span> в Liebherr</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#222] rounded-lg p-4">
                <CheckCircle className="w-5 h-5 text-[#FFC000] shrink-0" />
                <span className="text-white/80 text-sm">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal links to other brands */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Также ремонтируем технику других <span className="text-[#FFC000]">брендов</span></h2>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "CAT", href: "/brands/cat" },
              { name: "Komatsu", href: "/brands/komatsu" },
              { name: "Hitachi", href: "/brands/hitachi" },
              { name: "Hyundai", href: "/brands/hyundai" },
              { name: "Wirtgen", href: "/brands/wirtgen" },
              { name: "SHANTUI", href: "/brands/shantui" },
              { name: "Volvo CE", href: "/brands/volvo" },
            ].map((brand) => (
              <Link key={brand.name} href={brand.href}>
                <span className="inline-block bg-[#1a1a1a] border border-white/20 hover:border-[#FFC000] text-white hover:text-[#FFC000] px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer">
                  {brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#FFC000]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-black mb-4">Нужен ремонт гидравлики Liebherr?</h2>
          <p className="text-black/70 mb-8 max-w-xl mx-auto">Позвоните или напишите в WhatsApp — выедем на диагностику в течение 2 часов</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button onClick={handleWhatsApp} className="flex items-center gap-2 bg-black text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-900 transition-colors">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </button>
            <a href={`tel:${PHONE_NUMBER.replace(/\s/g, "")}`} className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              <Phone className="w-5 h-5" />
              {PHONE_NUMBER}
            </a>
          </div>
        </div>
      </section>

      {/* Related links */}
      <section className="py-12 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h3 className="text-lg font-bold text-white/70 mb-4">Полезные ссылки</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <Link href="/services"><span className="text-[#FFC000] hover:underline cursor-pointer">Все услуги</span></Link>
            <Link href="/projects"><span className="text-[#FFC000] hover:underline cursor-pointer">Наши проекты</span></Link>
            <Link href="/blog"><span className="text-[#FFC000] hover:underline cursor-pointer">Блог</span></Link>
            <Link href="/blog/remont-gidravliki-frezy-wirtgen-1500"><span className="text-[#FFC000] hover:underline cursor-pointer">Кейс: ремонт Wirtgen 1500</span></Link>
            <Link href="/blog/kapitalnyy-remont-shantui-sd32"><span className="text-[#FFC000] hover:underline cursor-pointer">Кейс: капремонт SHANTUI SD32</span></Link>
          </div>
        </div>
      </section>

      {/* Lead Form Dialog */}
      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Заявка на ремонт Liebherr</DialogTitle>
          </DialogHeader>
          <B2BLeadForm onSuccess={() => setIsLeadFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
