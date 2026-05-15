import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, Wrench, HardHat, Truck, ShieldCheck, Scan, Microscope, Settings, Gauge, Zap, Cpu, Cog, Hammer, Menu, Drill, Mail, Loader, Loader2, Train, Factory, Mountain, Pickaxe, Tractor, TruckIcon } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import B2BLeadForm from "@/components/B2BLeadForm";

export default function Services() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  return (
    <div className="min-h-[100dvh] bg-[#111111] text-white font-roboto flex flex-col overflow-x-hidden">
      <SEO 
        title="Услуги по ремонту спецтехники" 
        description="Полный спектр услуг: выездной сервис, ремонт экскаваторов, ГНБ, бульдозеров, дорожной техники, гидравлики и электрики."
        keywords="выездной сервис, ремонт экскаваторов, ремонт ГНБ, ремонт бульдозеров, ремонт гидравлики, ремонт спецтехники"
      />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent pt-2 pb-2 px-4 md:pt-6 md:pb-8 backdrop-blur-sm border-b border-white/5">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              {/* Geometric Icon: Left bar + Two right blocks */}
              <div className="flex gap-[3px] h-[28px]">
                {/* Left tall bar */}
                <div className="w-[10px] h-full bg-[#FFC000]"></div>
                {/* Right column */}
                <div className="flex flex-col justify-between h-full">
                  {/* Top block */}
                  <div className="w-[10px] h-[12.5px] bg-[#FFC000]"></div>
                  {/* Bottom block */}
                  <div className="w-[10px] h-[12.5px] bg-[#FFC000]"></div>
                </div>
              </div>
              
              {/* Text Part */}
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
            <Link href="/contacts" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">Контакты</Link>
          </nav>

          {/* Phone Number & Mobile Menu */}
          <div className="flex items-center gap-4">
            <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }} className="hidden md:flex items-center gap-2 bg-[#1a1a1a]/80 px-4 py-2 rounded border border-white/10 hover:border-[#FFC000]/50 transition-colors group">
              <Phone className="w-4 h-4 text-[#FFC000] fill-current group-hover:scale-110 transition-transform" />
              <span className="text-[#FFC000] font-semibold font-bebas text-lg tracking-wide">+7 (771) 417-79-25</span>
            </a>
            
            {/* Mobile Menu Trigger */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-[#FFC000] hover:bg-transparent">
                  <Menu className="w-8 h-8" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#111111] border-l border-white/10 p-0 w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <span className="font-bebas text-2xl text-white">Меню</span>
                  </div>
                  <nav className="flex flex-col p-6 gap-6">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">Главная</Link>
                    <Link href="/services" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-[#FFC000] tracking-wide">Услуги</Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">О компании</Link>
                    <Link href="/projects" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">Проекты</Link>
                    <Link href="/reviews" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">Отзывы</Link>
                    <Link href="/contacts" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">Контакты</Link>
                  </nav>
                  <div className="mt-auto p-6 border-t border-white/10">
                    <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }} className="flex items-center gap-3 text-[#FFC000] mb-4">
                      <Phone className="w-5 h-5" />
                      <span className="font-bebas text-xl font-semibold">+7 (771) 417-79-25</span>
                    </a>
                    <p className="text-gray-500 text-xs font-roboto">
                      Ежедневно с 8:00 до 20:00<br/>
                      Выезд 24/7
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Page Title Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[#1a1a1a]">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>
          <div className="absolute inset-0 opacity-20 bg-[url('/images/hero-bg-v4.webp')] bg-cover bg-center"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <h1 className="font-bebas font-bold text-5xl md:text-7xl text-white mb-6 uppercase tracking-wider">
            Наши <span className="text-[#FFC000]">услуги</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl font-roboto">
            Полный спектр услуг по ремонту и обслуживанию спецтехники. Работаем по договору с НДС. Выездной сервис по всему Казахстану.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#111111]/90 to-[#111111]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Service 1: Mobile Service (Выездной сервис) */}
            <Link href="/services/mobile-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer md:col-span-2">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <Truck size={32} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Выездной сервис 24/7</h2>
                    <p className="text-gray-400 font-roboto mb-4">
                      Оперативный выезд сервисных бригад в любую точку Казахстана. Наши автомобили оснащены всем необходимым оборудованием для диагностики и ремонта в полевых условиях.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFC000] mt-1">▪</span>
                          <span>Плановое техническое обслуживание (ТО) на объекте</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFC000] mt-1">▪</span>
                          <span>Аварийный ремонт и устранение неисправностей</span>
                        </li>
                      </ul>
                      <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFC000] mt-1">▪</span>
                          <span>Компьютерная диагностика и сброс ошибок</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFC000] mt-1">▪</span>
                          <span>Запуск техники в эксплуатацию</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 2: Excavator Repair */}
            <Link href="/services/excavator-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <Loader2 size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт экскаваторов</h2>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт гидравлики стрелы, рукояти, ковша</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление гидронасосов и моторов</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт поворотной платформы</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Работаем с Caterpillar, Komatsu, Hitachi, Volvo</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 3: GNB Repair */}
            <Link href="/services/gnb-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <Drill size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт ГНБ (горизонтальное направленное бурение)</h2>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление гидросистемы буровых установок</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт насосов и моторов вращения</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Диагностика системы подачи бурового раствора</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Выездной ремонт на объектах прокладки коммуникаций</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 4: Bulldozer Repair */}
            <Link href="/services/bulldozer-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <HardHat size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт бульдозеров</h2>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт гидравлики отвала и рыхлителя</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление гидроцилиндров и распределителей</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт гидромоторов хода</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Работаем с Caterpillar, Komatsu, Shantui, Liebherr</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 5: Wirtgen Repair */}
            <Link href="/services/wirtgen-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer md:col-span-2">
                <div className="flex flex-col md:flex-row items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <Settings size={32} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт дорожной фрезы (Wirtgen)</h2>
                    <p className="text-gray-400 font-roboto mb-4">
                      Специализированный сервис по восстановлению гидравлики и электро-гидравлического управления дорожно-фрезерных машин. Работаем с Wirtgen, XCMG, Volvo, Caterpillar.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFC000] mt-1">▪</span>
                          <span>Ремонт гидросистемы фрезерного барабана</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFC000] mt-1">▪</span>
                          <span>Настройка системы подачи воды</span>
                        </li>
                      </ul>
                      <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFC000] mt-1">▪</span>
                          <span>Ремонт пропорциональных клапанов</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#FFC000] mt-1">▪</span>
                          <span>Калибровка электро-гидравлического управления</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 6: Loader Repair */}
            <Link href="/services/loader-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <Loader size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт погрузчиков</h2>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт гидравлики ковша и стрелы</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление гидроцилиндров подъёма</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт гидронасосов и распределителей</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Фронтальные и телескопические погрузчики</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 7: Manipulator Repair */}
            <Link href="/services/manipulator-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <Loader2 size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт манипуляторов</h2>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт гидравлики крана-манипулятора</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление телескопических секций</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт опорно-поворотных устройств</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Работаем с Palfinger, Fassi, Hiab, PM</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 8: Railway Equipment Repair */}
            <Link href="/services/railway-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <Train size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт железнодорожной техники</h2>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт путевых машин и механизмов</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление гидросистем подъёмников</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт дрезин и мотовозов</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Выездной ремонт на путевых участках</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 9: Industrial Press Repair */}
            <Link href="/services/press-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <Factory size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт промышленных прессов</h2>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт гидравлических прессов</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление гидроцилиндров высокого давления</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт насосных станций</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Модернизация систем управления</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 10: Vertical Drilling Rig Repair */}
            <Link href="/services/drilling-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <Mountain size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт буровых (вертикальных)</h2>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт гидравлики буровых установок</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление насосов подачи бурового раствора</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт ротора и вертлюга</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Работаем с Atlas Copco, Sandvik, Epiroc</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 11: Grader Repair */}
            <Link href="/services/grader-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <Tractor size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт грейдеров</h2>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт гидравлики отвала и рыхлителя</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление гидроцилиндров подъёма</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт системы управления отвалом</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Работаем с Caterpillar, Komatsu, John Deere</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 12: Pile Driver Repair */}
            <Link href="/services/piledriver-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <Pickaxe size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт сваебойных роторных</h2>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт гидравлики роторных буровых установок</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление гидромоторов вращения</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт системы подачи и зажима</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Работаем с Bauer, Soilmec, Casagrande</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 13: Mining Loader Repair */}
            <Link href="/services/mining-loader-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <Mountain size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт шахтных погрузчиков</h2>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт гидравлики подземных погрузчиков</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление гидросистем LHD</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт насосов и распределителей</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Работаем с Sandvik, Atlas Copco, Caterpillar</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 14: Mining Truck Repair */}
            <Link href="/services/mining-truck-repair">
              <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group cursor-pointer">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                    <TruckIcon size={32} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт карьерных самосвалов</h2>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт гидравлики подъёма кузова</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление телескопических гидроцилиндров</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт подвески и амортизаторов</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Работаем с Belaz, Caterpillar, Komatsu</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Link>

            {/* Service 15: Hydraulic Pump Repair */}
            <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                  <Wrench size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт гидронасосов</h2>
                  <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFC000] mt-1">▪</span>
                      <span>Ремонт аксиально-поршневых насосов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFC000] mt-1">▪</span>
                      <span>Восстановление шестеренчатых насосов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFC000] mt-1">▪</span>
                      <span>Ремонт радиально-поршневых насосов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFC000] mt-1">▪</span>
                      <span>Работаем с Bosch Rexroth, Kawasaki, Linde</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Service 16: Hydraulic Valve Repair */}
            <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                  <Settings size={32} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт распределителей</h2>
                  <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFC000] mt-1">▪</span>
                      <span>Ремонт секционных распределителей</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFC000] mt-1">▪</span>
                      <span>Восстановление пропорциональных клапанов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFC000] mt-1">▪</span>
                      <span>Ремонт электрогидравлических клапанов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FFC000] mt-1">▪</span>
                      <span>Работаем с Parker, Danfoss, Bosch Rexroth</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Service 17: Hydraulic Motor Repair */}
            <div className="bg-[#1a1a1a] border border-white/10 p-8 rounded-sm hover:border-[#FFC000]/50 transition-all duration-300 group md:col-span-2">
              <div className="flex flex-col md:flex-row items-start gap-6">
                <div className="w-16 h-16 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0 group-hover:scale-105 transition-transform">
                  <Cog size={32} strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h2 className="font-bebas text-3xl text-white mb-4 tracking-wide group-hover:text-[#FFC000] transition-colors">Ремонт гидромоторов</h2>
                  <p className="text-gray-400 font-roboto mb-4">
                    Профессиональный ремонт гидромоторов всех типов с полной диагностикой и тестированием на стенде.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт аксиально-поршневых гидромоторов</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Восстановление радиально-поршневых моторов</span>
                      </li>
                    </ul>
                    <ul className="space-y-2 text-gray-400 font-roboto text-sm font-bold">
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Ремонт орбитальных гидромоторов</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#FFC000] mt-1">▪</span>
                        <span>Работаем с Bosch Rexroth, Danfoss, Eaton</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* High-Conversion CTA Section */}
      <section className="py-20 bg-[#FFC000] text-black relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 bg-black text-[#FFC000] px-4 py-2 rounded-full font-bebas text-sm tracking-wide mb-6">
            <span className="w-2 h-2 bg-[#FFC000] rounded-full animate-pulse"></span>
            СРОЧНЫЙ ВЫЕЗД 24/7
          </div>
          
          <h2 className="font-bebas text-4xl md:text-6xl mb-4 uppercase tracking-wide leading-tight">
            Срочный выезд инженера<br/>в течение <span className="text-white bg-black px-3">2 часов</span>
          </h2>
          
          <p className="font-roboto text-lg md:text-xl mb-8 max-w-2xl mx-auto font-semibold">
            Работаем по договору с НДС. Собственный склад запчастей.
          </p>
          
          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm font-roboto font-semibold">
            <div className="flex items-center gap-2">
              <span className="text-black text-xl">✓</span>
              <span>Выезд по всему Казахстану</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-black text-xl">✓</span>
              <span>Диагностика на месте</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-black text-xl">✓</span>
              <span>Гарантия на работы</span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }} className="bg-black text-[#FFC000] px-10 py-5 rounded font-bebas text-2xl tracking-wide hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:scale-105">
              <Phone className="w-6 h-6" />
              ВЫЗВАТЬ СПЕЦИАЛИСТА
            </a>
            <button onClick={() => setIsLeadFormOpen(true)} className="bg-white text-black border-2 border-black px-10 py-5 rounded font-bebas text-2xl tracking-wide hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl hover:scale-105">
              ОСТАВИТЬ ЗАЯВКУ
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
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
              <p className="text-gray-500 text-sm font-roboto">
                Профессиональный ремонт и обслуживание гидравлических систем спецтехники в Казахстане.
              </p>
            </div>
            
            <div>
              <h3 className="font-bebas text-xl text-white mb-4 tracking-wide">Услуги</h3>
              <ul className="space-y-2 text-gray-500 text-sm font-roboto">
                <li><Link href="/services" className="hover:text-[#FFC000] transition-colors">Ремонт гидравлики</Link></li>
                <li><Link href="/services" className="hover:text-[#FFC000] transition-colors">Ремонт двигателей</Link></li>
                <li><Link href="/services" className="hover:text-[#FFC000] transition-colors">Токарные работы</Link></li>
                <li><Link href="/services" className="hover:text-[#FFC000] transition-colors">Выездной сервис</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bebas text-xl text-white mb-4 tracking-wide">Компания</h3>
              <ul className="space-y-2 text-gray-500 text-sm font-roboto">
                <li><Link href="/about" className="hover:text-[#FFC000] transition-colors">О нас</Link></li>
                <li><Link href="/projects" className="hover:text-[#FFC000] transition-colors">Проекты</Link></li>
                <li><Link href="/reviews" className="hover:text-[#FFC000] transition-colors">Отзывы</Link></li>
                <li><Link href="/contacts" className="hover:text-[#FFC000] transition-colors">Контакты</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bebas text-xl text-white mb-4 tracking-wide">Контакты</h3>
              <ul className="space-y-2 text-gray-500 text-sm font-roboto">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#FFC000]" />
                  <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }} className="hover:text-[#FFC000] transition-colors font-semibold">+7 (771) 417-79-25</a>
                </li>
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#FFC000]" />
                  <a href="https://wa.me/77714177925" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFC000] transition-colors">WhatsApp</a>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#FFC000]" />
                  <a href="mailto:info@acahydraulic.kz" className="hover:text-[#FFC000] transition-colors">info@acahydraulic.kz</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs font-roboto">
              © 2026 ACA Hydraulic. Все права защищены.
            </p>
            <p className="text-gray-600 text-xs font-roboto flex items-center gap-1">
              Made with <span className="text-[#FFC000]">Manus</span>
            </p>
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
