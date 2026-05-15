import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, CheckCircle, ArrowRight, Wrench, Clock, Shield, Mail } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import B2BLeadForm from "@/components/B2BLeadForm";

export default function ExcavatorRepair() {
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto">
      <SEO 
        title="Ремонт гидравлики экскаваторов в Астане | CAT, Komatsu, Hitachi | ACA Hydraulic"
        description="Ремонт гидравлики экскаваторов CAT, Komatsu, Hitachi, Hyundai в Астане и Казахстане. Выездная диагностика и ремонт на объекте. Гарантия 12 месяцев. Работаем 24/7."
        keywords="ремонт гидравлики экскаватора, ремонт экскаватора Астана, ремонт CAT экскаватор, ремонт Komatsu PC, ремонт Hitachi ZX, ремонт гидронасоса экскаватора, выездной ремонт экскаватора"
        canonical="/services/excavator-repair"
        breadcrumbs={[
          { name: 'Услуги', url: '/services' },
          { name: 'Ремонт экскаваторов', url: '/services/excavator-repair' },
        ]}
        serviceSchema={{
          serviceName: 'Ремонт гидравлики экскаваторов',
          serviceDescription: 'Ремонт гидравлики экскаваторов CAT, Komatsu, Hitachi, Hyundai в Астане и Казахстане. Выездная диагностика и ремонт на объекте.',
          serviceUrl: '/services/excavator-repair',
          areaServed: ['Астана', 'Казахстан'],
        }}
        faq={[
          {
            question: 'Сколько стоит ремонт гидравлики экскаватора?',
            answer: 'Стоимость ремонта гидравлики экскаватора зависит от марки, модели и характера неисправности. Диагностика бесплатна при последующем ремонте. Ремонт главного гидронасоса — от 80 000 тг, гидромотора хода — от 60 000 тг, гидрораспределителя — от 40 000 тг. Точную стоимость определяем после диагностики.'
          },
          {
            question: 'Какие марки экскаваторов вы ремонтируете?',
            answer: 'Ремонтируем гидравлику экскаваторов всех ведущих марок: Caterpillar (CAT), Komatsu, Hitachi, Hyundai, Volvo, Doosan, Liebherr, Kobelco, JCB, XCMG, SANY. Работаем с гусеничными и колёсными экскаваторами от 1 до 120 тонн.'
          },
          {
            question: 'Выезжаете ли на ремонт экскаватора на объект?',
            answer: 'Да, выезжаем на ремонт экскаватора прямо на строительный объект, карьер или производственную площадку. Оснащены мобильной мастерской с необходимым оборудованием. Работаем по всему Казахстану.'
          }
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
          <div className="flex items-center gap-4">
            <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }} className="hidden md:flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded border border-white/10 hover:border-[#FFC000]/50 transition-colors">
              <Phone className="w-4 h-4 text-[#FFC000]" />
              <span className="text-[#FFC000] font-bold font-bebas text-lg">+7 (771) 417-79-25</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#111111] to-[#111111]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-[#FFC000]/10 border border-[#FFC000]/20 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#FFC000] rounded-full animate-pulse"></span>
              <span className="text-[#FFC000] font-bebas text-sm tracking-wide">ВЫЕЗДНОЙ СЕРВИС 24/7</span>
            </div>
            <h1 className="font-bebas text-5xl md:text-7xl text-white mb-6 leading-none tracking-wide">
              Ремонт экскаваторов<br/>
              <span className="text-[#FFC000]">любой сложности</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl font-roboto">
              Профессиональный ремонт гусеничных и колесных экскаваторов всех марок. Восстановление гидравлики, двигателей, ходовой части.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }} className="bg-[#FFC000] text-black px-8 py-4 rounded font-bebas text-xl tracking-wide hover:bg-white transition-all duration-300 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                ВЫЗВАТЬ СПЕЦИАЛИСТА
              </a>
              <button onClick={() => setIsLeadFormOpen(true)} className="bg-transparent border-2 border-white/20 text-white px-8 py-4 rounded font-bebas text-xl tracking-wide hover:border-[#FFC000] hover:text-[#FFC000] transition-all duration-300">
                ОСТАВИТЬ ЗАЯВКУ
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-4xl md:text-5xl text-white mb-12 text-center">Виды работ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {[
              { title: "Ремонт гидравлики", items: ["Гидронасосы", "Гидромоторы", "Распределители", "Гидроцилиндры"] },
              { title: "Ремонт ходовой части", items: ["Гусеницы и траки", "Опорные катки", "Поддерживающие ролики", "Направляющие колеса"] },
              { title: "Ремонт двигателей", items: ["Капитальный ремонт", "Замена поршневой группы", "Ремонт топливной системы", "Турбокомпрессоры"] },
              { title: "Ремонт рабочего оборудования", items: ["Стрелы и рукояти", "Ковши всех типов", "Быстросъёмы", "Гидромолоты"] }
            ].map((service, idx) => (
              <div key={idx} className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all">
                <h3 className="font-bebas text-2xl text-white mb-4">{service.title}</h3>
                <ul className="space-y-2">
                  {service.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-400 text-sm">
                      <CheckCircle className="w-4 h-4 text-[#FFC000] mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#FFC000]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bebas text-4xl md:text-6xl text-black mb-6">
            Срочный выезд в течение <span className="bg-black text-[#FFC000] px-3">2 часов</span>
          </h2>
          <p className="text-lg text-black mb-8 font-semibold">
            Работаем по всему Казахстану. Собственный склад запчастей.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }} className="bg-black text-[#FFC000] px-10 py-5 rounded font-bebas text-2xl tracking-wide hover:bg-white hover:text-black transition-all duration-300 inline-flex items-center justify-center gap-3">
              <Phone className="w-6 h-6" />
              ВЫЗВАТЬ СПЕЦИАЛИСТА
            </a>
            <button onClick={() => setIsLeadFormOpen(true)} className="bg-white text-black border-2 border-black px-10 py-5 rounded font-bebas text-2xl tracking-wide hover:bg-black hover:text-white transition-all duration-300">
              ОСТАВИТЬ ЗАЯВКУ
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
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
              <p className="text-gray-500 text-sm">Профессиональный ремонт гидравлики спецтехники</p>
            </div>
            <div>
              <h3 className="font-bebas text-xl text-white mb-4">Контакты</h3>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#FFC000]" />
                  <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }} className="hover:text-[#FFC000] transition-colors">+7 (771) 417-79-25</a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#FFC000]" />
                  <a href="https://wa.me/77714177925" className="hover:text-[#FFC000] transition-colors" onClick={() => { if((window as any).gtag_whatsapp_conversion) (window as any).gtag_whatsapp_conversion("https://wa.me/77714177925"); }}>WhatsApp</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FFC000]" />
                  <a href="mailto:info@acahydraulic.kz" className="hover:text-[#FFC000] transition-colors">info@acahydraulic.kz</a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bebas text-xl text-white mb-4">Навигация</h3>
              <ul className="space-y-2 text-gray-500 text-sm">
                <li><Link href="/services" className="hover:text-[#FFC000] transition-colors">Услуги</Link></li>
                <li><Link href="/about" className="hover:text-[#FFC000] transition-colors">О компании</Link></li>
                <li><Link href="/projects" className="hover:text-[#FFC000] transition-colors">Проекты</Link></li>
                <li><Link href="/contacts" className="hover:text-[#FFC000] transition-colors">Контакты</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/5 mt-8 pt-8 text-center text-gray-600 text-xs">
            © 2026 ACA Hydraulic. Все права защищены.
          </div>
        </div>
      </footer>

      {/* Lead Form Dialog */}
      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
        <DialogContent className="bg-[#1a1a1a] border border-white/10 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bebas text-3xl text-[#FFC000] tracking-wide">Оставить заявку</DialogTitle>
          </DialogHeader>
          <B2BLeadForm onSuccess={() => setIsLeadFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
