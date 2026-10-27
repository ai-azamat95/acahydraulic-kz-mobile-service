import { seoConfig } from "@/config/seo";
import SiteHomeLink from "@/components/SiteHomeLink";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, Mail } from "lucide-react";
import { Link } from "wouter";
import MobileSiteMenu from "@/components/MobileSiteMenu";

export default function Reviews() {

  return (
    <div className="min-h-[100dvh] bg-[#111111] text-white font-roboto flex flex-col overflow-x-hidden">
      <SEO 
        title={seoConfig.reviews.title}
        description={seoConfig.reviews.description}
        canonical="/reviews"
      />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent pt-2 pb-2 px-4 md:pt-6 md:pb-8 backdrop-blur-sm border-b border-white/5">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <SiteHomeLink aria-label="ACA Hydraulic — главная">
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
          </SiteHomeLink>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-6">
            <Link href="/" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">Главная</Link>
            <Link href="/services" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">Услуги</Link>
            <Link href="/catalog" className="text-white/80 hover:text-[#FFC000] text-sm uppercase tracking-wider">Запчасти</Link>
            <Link href="/about" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">О компании</Link>
            <Link href="/reviews" className="text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors border-b border-[#FFC000]">Отзывы</Link>
            <Link href="/contacts" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">Контакты</Link>
          </nav>

          {/* Phone Number & Mobile Menu */}
          <div className="flex items-center gap-4">
            <a href="tel:+77714177925" className="hidden xl:flex items-center gap-2 bg-[#1a1a1a]/80 px-4 py-2 rounded border border-white/10 hover:border-[#FFC000]/50 transition-colors group">
              <Phone className="w-4 h-4 text-[#FFC000] fill-current group-hover:scale-110 transition-transform" />
              <span className="text-[#FFC000] font-bold font-bebas text-lg tracking-wide">+7 (771) 417-79-25</span>
            </a>
            
            {/* Mobile Menu Trigger */}
            <MobileSiteMenu />
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
            Отзывы и <span className="text-[#FFC000]">источники</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl font-roboto">
            Отзывы клиентов и собственные описания ремонта — разные источники. Для оценки выполненных работ доступны кейсы с фотографиями и видео.
          </p>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="relative py-12 md:py-20 bg-[#111111] overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          
          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <section className="bg-[#1a1a1a] border border-white/10 p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">Отзывы с источником</h2>
              <p className="text-gray-300 leading-relaxed">Отзыв — мнение заказчика. Для его публикации нужна ссылка на первоисточник или разрешение автора. Именованные цитаты и оценки без такого подтверждения на этой странице не размещаем.</p>
              <p className="mt-4 text-gray-400 leading-relaxed">Это не означает, что внешних отзывов нет. Их содержание, дату и принадлежность организации следует проверять в исходной карточке.</p>
            </section>
            <section className="bg-[#1a1a1a] border border-white/10 p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-4">Кейсы компании</h2>
              <p className="text-gray-300 leading-relaxed">В кейсах ACA Hydraulic описывает исходную задачу, выполненные работы и доступную проверку после ремонта или установки. Эти материалы показывают нашу практику и не являются независимыми отзывами клиентов.</p>
              <a href="/cases/" className="mt-4 inline-flex min-h-11 items-center text-[#FFC000] underline underline-offset-4">Посмотреть работы и видео проверки</a>
            </section>
          </div>
          <section className="mb-12 border border-white/10 p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Внешнее отраслевое упоминание</h2>
            <p className="text-gray-300 leading-relaxed">В каталоге партнёров СТАНЭКСПЕРТ указаны ТОО «АСА Гидравлик Сервис», наш телефон, ПИОНЕР-2 ЦПУ и 2024 год. Это упоминание в каталоге партнёров, а не клиентский отзыв или подтверждение конкретного ремонта.</p>
            <a href="https://stanki-stanexpert.ru/partnery/partnery-v-kazahstane/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center text-[#FFC000] underline underline-offset-4">Открыть первоисточник СТАНЭКСПЕРТ</a>
          </section>

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
