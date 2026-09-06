import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, Menu, Star, Quote, FileText, Mail } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Reviews() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] bg-[#111111] text-white font-roboto flex flex-col overflow-x-hidden">
      <SEO 
        title="Отзывы клиентов" 
        description="Отзывы о работе ACA Hydraulic. Благодарственные письма от ведущих строительных и горнодобывающих компаний Казахстана."
        keywords="отзывы ACA Hydraulic, рекомендации клиентов, благодарственные письма, качество ремонта гидравлики"
      />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent pt-2 pb-2 px-4 md:pt-6 md:pb-8 backdrop-blur-sm border-b border-white/5">
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
            <Link href="/services" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">Услуги</Link>
            <Link href="/about" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">О компании</Link>
            <Link href="/reviews" className="text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors border-b border-[#FFC000]">Отзывы</Link>
            <Link href="/contacts" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">Контакты</Link>
          </nav>

          {/* Phone Number & Mobile Menu */}
          <div className="flex items-center gap-4">
            <a href="tel:+77714177925" className="hidden md:flex items-center gap-2 bg-[#1a1a1a]/80 px-4 py-2 rounded border border-white/10 hover:border-[#FFC000]/50 transition-colors group">
              <Phone className="w-4 h-4 text-[#FFC000] fill-current group-hover:scale-110 transition-transform" />
              <span className="text-[#FFC000] font-bold font-bebas text-lg tracking-wide">+7 (771) 417-79-25</span>
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
                    <Link href="/services" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">Услуги</Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">О компании</Link>
                    <Link href="/reviews" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-[#FFC000] tracking-wide">Отзывы</Link>
                    <Link href="/contacts" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">Контакты</Link>
                  </nav>
                  <div className="mt-auto p-6 border-t border-white/10">
                    <a href="tel:+77714177925" className="flex items-center gap-3 text-[#FFC000] mb-4">
                      <Phone className="w-5 h-5" />
                      <span className="font-bebas text-xl">+7 (771) 417-79-25</span>
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[#111111]"></div>
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(/images/storm-excavator-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-transparent to-[#111111]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-bebas font-bold text-[42px] md:text-[72px] leading-[0.9] text-white mb-6 uppercase tracking-normal">
            Отзывы <span className="text-[#FFC000]">Клиентов</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl font-roboto">
            Доверие клиентов — наш главный актив. Узнайте, что говорят о сотрудничестве с ACA Hydraulic ведущие компании Казахстана.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="relative py-12 md:py-20 bg-[#111111] overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            
            {/* Review 1 */}
            <div className="bg-[#1a1a1a] p-8 border border-white/10 rounded-sm hover:border-[#FFC000]/50 transition-colors group relative">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#FFC000]/20 group-hover:text-[#FFC000]/40 transition-colors" />
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-4 h-4 text-[#FFC000] fill-current" />
                <Star className="w-4 h-4 text-[#FFC000] fill-current" />
                <Star className="w-4 h-4 text-[#FFC000] fill-current" />
                <Star className="w-4 h-4 text-[#FFC000] fill-current" />
                <Star className="w-4 h-4 text-[#FFC000] fill-current" />
              </div>
              <p className="text-gray-300 italic mb-6 leading-relaxed">
                "Сотрудничаем с ACA Hydraulic уже более 3 лет. Ребята всегда оперативно реагируют на заявки, что критически важно для нашего карьера. Качество ремонта гидронасосов на высоте, ни одного возврата по гарантии."
              </p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-white">
                  KZ
                </div>
                <div>
                  <div className="font-bold text-white">ТОО "KazMinerals"</div>
                  <div className="text-xs text-gray-500 uppercase">Главный механик</div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-[#1a1a1a] p-8 border border-white/10 rounded-sm hover:border-[#FFC000]/50 transition-colors group relative">
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[#FFC000]/20 group-hover:text-[#FFC000]/40 transition-colors" />
              <div className="flex items-center gap-1 mb-4">
                <Star className="w-4 h-4 text-[#FFC000] fill-current" />
                <Star className="w-4 h-4 text-[#FFC000] fill-current" />
                <Star className="w-4 h-4 text-[#FFC000] fill-current" />
                <Star className="w-4 h-4 text-[#FFC000] fill-current" />
                <Star className="w-4 h-4 text-[#FFC000] fill-current" />
              </div>
              <p className="text-gray-300 italic mb-6 leading-relaxed">
                "Вызывали мобильную бригаду для ремонта экскаватора Hitachi в степи. Приехали быстро, с собой было все необходимое оборудование. Запустили технику в тот же день. Профессионалы своего дела."
              </p>
              <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-white">
                  BI
                </div>
                <div>
                  <div className="font-bold text-white">BI Group</div>
                  <div className="text-xs text-gray-500 uppercase">Начальник участка</div>
                </div>
              </div>
            </div>



          </div>

          {/* CTA Section */}
          <div className="bg-[#1a1a1a] border border-white/10 p-8 md:p-12 rounded-sm text-center">
            <h2 className="font-bebas text-3xl md:text-4xl text-white mb-4 tracking-wide">Оставьте свой отзыв</h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Ваше мнение помогает нам становиться лучше. Если вы уже воспользовались нашими услугами, пожалуйста, поделитесь впечатлениями.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="https://wa.me/77714177925" target="_blank" rel="noopener noreferrer">
                <Button className="bg-[#FFC000] text-black hover:bg-white font-bebas text-xl py-6 px-8 tracking-wide w-full sm:w-auto">
                  Написать в WhatsApp <MessageCircle className="ml-2 w-5 h-5" />
                </Button>
              </a>
              <Link href="/contacts">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black font-bebas text-xl py-6 px-8 tracking-wide w-full sm:w-auto">
                  Связаться с менеджером
                </Button>
              </Link>
            </div>
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
                <li><Link href="/cases" className="hover:text-[#FFC000] transition-colors">Наши работы</Link></li>
                <li><Link href="/reviews" className="hover:text-[#FFC000] transition-colors">Отзывы</Link></li>
                <li><Link href="/contacts" className="hover:text-[#FFC000] transition-colors">Контакты</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bebas text-xl text-white mb-4 tracking-wide">Контакты</h3>
              <ul className="space-y-2 text-gray-500 text-sm font-roboto">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#FFC000]" />
                  <a href="tel:+77714177925" className="hover:text-[#FFC000] transition-colors">+7 (771) 417-79-25</a>
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
    </div>
  );
}
