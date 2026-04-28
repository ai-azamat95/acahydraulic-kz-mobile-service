import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, Wrench, HardHat, Truck, ShieldCheck, Drill, Factory, Gauge, FileText, CheckCircle2, Building2, MapPin, Menu } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import B2BLeadForm from "@/components/B2BLeadForm";

export default function Services() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

  const serviceCategories = [
    {
      id: 1,
      title: "Выездной инженерный сервис 24/7",
      description: "Диагностика и ремонт гидравлических систем спецтехники на объекте заказчика",
      iconUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/KYQZdSsbHxcVQlIn.png",
      link: "/services/mobile-repair",
      subcategories: []
    },
    {
      id: 2,
      title: "Ремонт спецтехники",
      description: "Восстановление гидравлических систем дорожно-строительной и карьерной техники",
      iconUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/MZwFsdpoMEzfgQfw.png",
      subcategories: [
        { name: "Экскаваторы", link: "/services/excavator-repair" },
        { name: "Бульдозеры", link: "/services/bulldozer-repair" },
        { name: "Погрузчики", link: "/services/loader-repair" },
        { name: "Грейдеры", link: "/services/grader-repair" },
        { name: "Карьерная техника", link: "/services/dump-truck-repair" },
        { name: "Манипуляторы", link: "/services/manipulator-repair" }
      ]
    },
    {
      id: 3,
      title: "Ремонт буровых установок",
      description: "Специализированный сервис гидравлики буровых установок и сваебойной техники",
      iconUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/yQQPcVMMlQeepSEr.png",
      subcategories: [
        { name: "ГНБ (горизонтальное направленное бурение)", link: "/services/gnb-repair" },
        { name: "Вертикальные буровые установки", link: "/services/drilling-repair" },
        { name: "Сваебойные установки", link: "/services/piledriver-repair" }
      ]
    },
    {
      id: 4,
      title: "Ремонт гидравлических систем",
      description: "Профессиональное восстановление гидравлических компонентов промышленного класса",
      iconUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/MgdZLeLSZdvrjPGn.png",
      subcategories: [
        { name: "Гидронасосы", link: "/services/hydraulic-pumps" },
        { name: "Гидромоторы", link: "/services/hydraulic-motors" },
        { name: "Распределители", link: "/services/hydraulic-distributors" },
        { name: "Гидроцилиндры", link: "#" },
        { name: "Промывочные системы", link: "#" }
      ]
    },
    {
      id: 5,
      title: "Промышленная гидравлика",
      description: "Ремонт и модернизация гидравлических систем промышленного оборудования",
      iconUrl: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/VYnvlZsfMWkVlviD.png",
      subcategories: [
        { name: "Промышленные прессы", link: "/services/press-repair" },
        { name: "Промышленное оборудование", link: "#" }
      ]
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-background text-white font-roboto flex flex-col overflow-x-hidden">
      <SEO 
        title="Услуги по ремонту спецтехники и гидравлики | ACA Hydraulic" 
        description="Профессиональный ремонт гидравлических систем спецтехники: выездной сервис, экскаваторы, ГНБ, буровые установки, промышленная гидравлика. Работаем с юридическими лицами."
        keywords="выездной сервис гидравлики, ремонт экскаваторов, ремонт ГНБ, ремонт буровых установок, промышленная гидравлика, ремонт спецтехники"
      />
      
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent pt-2 pb-2 px-4 md:pt-6 md:pb-8">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">Главная</Link>
            <Link href="/services" className="text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors border-b border-[#FFC000]">Услуги</Link>
            <Link href="/about" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">О компании</Link>
            <Link href="/projects" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">Проекты</Link>
            <Link href="/reviews" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">Отзывы</Link>
            <Link href="/blog" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">Блог</Link>
            <Link href="/contacts" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">Контакты</Link>
          </nav>

          {/* Mobile Menu */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button className="text-white p-2">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#1a1a1a] border-l border-white/10 w-[280px]">
              <nav className="flex flex-col gap-6 mt-8">
                <Link href="/" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors" onClick={() => setIsMenuOpen(false)}>Главная</Link>
                <Link href="/services" className="text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors" onClick={() => setIsMenuOpen(false)}>Услуги</Link>
                <Link href="/about" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors" onClick={() => setIsMenuOpen(false)}>О компании</Link>
                <Link href="/projects" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors" onClick={() => setIsMenuOpen(false)}>Проекты</Link>
                <Link href="/reviews" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors" onClick={() => setIsMenuOpen(false)}>Отзывы</Link>
                <Link href="/blog" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors" onClick={() => setIsMenuOpen(false)}>Блог</Link>
                <Link href="/contacts" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors" onClick={() => setIsMenuOpen(false)}>Контакты</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-4 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/VdtuJNADOaHFcqkW.jpg')"}}>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/40"></div>
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl">
            <h1 className="font-sans font-bold text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 drop-shadow-lg">
              Инженерные решения<br />для промышленной<br />гидравлики
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl drop-shadow-md">
              Профессиональный ремонт и восстановление гидравлических систем спецтехники. Работаем с юридическими лицами по договору с НДС.
            </p>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 md:py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {serviceCategories.map((category) => {
              return (
                <div
                  key={category.id}
                  className="group relative bg-card border border-border hover:border-[#FFC000] rounded-lg p-8 md:p-10 transition-all duration-300 hover:shadow-xl hover:shadow-[#FFC000]/20"
                >
                  {/* Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center transition-transform group-hover:scale-105">
                      <img 
                        src={category.iconUrl} 
                        alt={category.title}
                        className="w-12 h-12 md:w-16 md:h-16 object-contain brightness-0 invert"
                        style={{ filter: 'brightness(0) saturate(100%) invert(77%) sepia(66%) saturate(604%) hue-rotate(358deg) brightness(102%) contrast(101%)' }}
                      />
                    </div>
                  </div>             {/* Title */}
                  <h2 className="font-sans font-bold text-2xl md:text-3xl text-white mb-4 leading-tight">
                    {category.title}
                  </h2>

                  {/* Description */}
                  <p className="text-white/70 text-base md:text-lg leading-relaxed mb-6">
                    {category.description}
                  </p>

                  {/* Subcategories or Link */}
                  {category.subcategories.length > 0 ? (
                    <div className="space-y-3">
                      {category.subcategories.map((sub, idx) => (
                        sub.link && sub.link !== "#" ? (
                          <Link key={idx} href={sub.link}>
                            <div className="flex items-center gap-3 text-white/70 hover:text-[#FFC000] transition-colors cursor-pointer group/sub">
                              <div className="w-1 h-1 bg-[#FFC000] group-hover/sub:w-2 transition-all"></div>
                              <span className="text-sm md:text-base font-roboto uppercase tracking-wide">{sub.name}</span>
                            </div>
                          </Link>
                        ) : (
                          <div key={idx} className="flex items-center gap-3 text-white/30 cursor-not-allowed">
                            <div className="w-1 h-1 bg-gray-300"></div>
                            <span className="text-sm md:text-base font-roboto uppercase tracking-wide">{sub.name}</span>
                          </div>
                        )
                      ))}
                    </div>
                  ) : (
                    category.link && category.link !== "#" ? (
                      <Link href={category.link}>
                        <Button
                          className="mt-4 bg-transparent border border-[#FFC000] text-[#FFC000] hover:bg-[#FFC000] hover:text-black font-roboto uppercase tracking-wider px-8 py-6 text-sm transition-all"
                        >
                          Подробнее
                        </Button>
                      </Link>
                    ) : null
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Block */}
      <section className="py-16 md:py-24 px-4 bg-card border-t border-border">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <h2 className="font-sans font-bold text-3xl md:text-4xl text-white text-center mb-12">
              Работаем с юридическими лицами
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Trust Item 1 */}
              <div className="flex items-start gap-4 p-6 bg-background border border-border rounded-lg">
                <div className="w-12 h-12 bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-[#FFC000]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-white mb-2">Договор</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Официальное оформление с юридическими лицами
                  </p>
                </div>
              </div>

              {/* Trust Item 2 */}
              <div className="flex items-start gap-4 p-6 bg-background border border-border rounded-lg">
                <div className="w-12 h-12 bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#FFC000]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-white mb-2">НДС</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Работаем с НДС для корпоративных клиентов
                  </p>
                </div>
              </div>

              {/* Trust Item 3 */}
              <div className="flex items-start gap-4 p-6 bg-background border border-border rounded-lg">
                <div className="w-12 h-12 bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-[#FFC000]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-white mb-2">Выезд по Казахстану</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Инженерный сервис на объектах заказчика
                  </p>
                </div>
              </div>

              {/* Trust Item 4 */}
              <div className="flex items-start gap-4 p-6 bg-background border border-border rounded-lg">
                <div className="w-12 h-12 bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                  <Wrench className="w-6 h-6 text-[#FFC000]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-white mb-2">Инженерная диагностика</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Профессиональная оценка состояния оборудования
                  </p>
                </div>
              </div>

              {/* Trust Item 5 */}
              <div className="flex items-start gap-4 p-6 bg-background border border-border rounded-lg">
                <div className="w-12 h-12 bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#FFC000]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-white mb-2">Гарантия качества</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Документированная гарантия на выполненные работы
                  </p>
                </div>
              </div>

              {/* Trust Item 6 */}
              <div className="flex items-start gap-4 p-6 bg-background border border-border rounded-lg">
                <div className="w-12 h-12 bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-[#FFC000]" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-lg text-white mb-2">Опыт с крупными проектами</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    Работа с промышленными предприятиями
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-sans font-bold text-3xl md:text-5xl text-white mb-6">
              Нужна консультация инженера?
            </h2>
            <p className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed">
              Оставьте заявку, и наш специалист свяжется с вами для обсуждения технических деталей
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setIsLeadFormOpen(true)}
                className="bg-[#FFC000] text-black hover:bg-[#FFD700] font-roboto uppercase tracking-wider px-8 py-6 text-base transition-all"
              >
                Оставить заявку
              </Button>
              <a href="tel:+77771417-78-25">
                <Button className="bg-transparent border border-[#FFC000] text-[#FFC000] hover:bg-[#FFC000] hover:text-black font-roboto uppercase tracking-wider px-8 py-6 text-base transition-all">
                  <Phone className="w-5 h-5 mr-2" />
                  +7 (771) 417-78-25
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-white/10 py-12 px-4 mt-auto">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Company Info */}
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
              <p className="text-white/60 text-sm leading-relaxed">
                Профессиональный ремонт гидравлических систем спецтехники
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-sans font-bold text-white text-lg mb-4">Навигация</h3>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-white/60 hover:text-[#FFC000] text-sm transition-colors">Главная</Link>
                <Link href="/services" className="text-white/60 hover:text-[#FFC000] text-sm transition-colors">Услуги</Link>
                <Link href="/about" className="text-white/60 hover:text-[#FFC000] text-sm transition-colors">О компании</Link>
                <Link href="/contacts" className="text-white/60 hover:text-[#FFC000] text-sm transition-colors">Контакты</Link>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-sans font-bold text-white text-lg mb-4">Контакты</h3>
              <div className="flex flex-col gap-3">
                <a href="tel:+77771417-78-25" className="flex items-center gap-2 text-white/60 hover:text-[#FFC000] text-sm transition-colors">
                  <Phone size={16} />
                  +7 (771) 417-78-25
                </a>
                <a href="https://wa.me/77771417-78-25" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/60 hover:text-[#FFC000] text-sm transition-colors">
                  <MessageCircle size={16} />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center text-white/40 text-sm">
            <p>&copy; {new Date().getFullYear()} ACA Hydraulic. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Lead Form Dialog */}
      <Dialog open={isLeadFormOpen} onOpenChange={setIsLeadFormOpen}>
        <DialogContent className="bg-[#1a1a1a] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-sans font-bold text-2xl text-white">Оставить заявку</DialogTitle>
          </DialogHeader>
          <B2BLeadForm onSuccess={() => setIsLeadFormOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
