import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, Menu, MapPin, Mail, Clock, Send, Video } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MapView } from "@/components/Map";
import { useTikTokContact } from "@/hooks/useTikTokEvents";

export default function Contacts() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const fireTikTokContact = useTikTokContact();

  return (
    <div className="min-h-[100dvh] bg-[#111111] text-white font-roboto flex flex-col overflow-x-hidden">
      <SEO 
        title="Контакты" 
        description="Свяжитесь с нами для заказа ремонта гидравлики. Телефоны, адрес, карта проезда, форма обратной связи. Работаем по всему Казахстану."
        keywords="контакты ACA Hydraulic, адрес сервиса, телефон ремонта гидравлики, вызвать мастера, карта проезда"
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
            <Link href="/reviews" className="text-white/80 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors">Отзывы</Link>
            <Link href="/contacts" className="text-[#FFC000] font-roboto text-sm uppercase tracking-wider transition-colors border-b border-[#FFC000]">Контакты</Link>
          </nav>

          {/* Phone Number & Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* TikTok Button - Desktop */}
            <a href="https://www.tiktok.com/@acaservice01" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center justify-center w-10 h-10 bg-black rounded-full border border-white/10 hover:border-[#FF0050]/50 hover:bg-[#111] transition-all group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#25F4EE]/20 to-[#FE2C55]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <svg className="w-5 h-5 text-white group-hover:text-[#FF0050] transition-colors relative z-10" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
               </svg>
            </a>

            <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }} className="hidden md:flex items-center gap-2 bg-[#1a1a1a]/80 px-4 py-2 rounded border border-white/10 hover:border-[#FFC000]/50 transition-colors group">
              <Phone className="w-4 h-4 text-[#FFC000] fill-current group-hover:scale-110 transition-transform" />
              <span className="text-[#FFC000] font-bold font-bebas text-lg tracking-wide">+7 (771) 417-79-25</span>
            </a>
            
            {/* TikTok Button - Mobile (Header) */}
            <a href="https://www.tiktok.com/@acaservice01" target="_blank" rel="noopener noreferrer" className="md:hidden flex items-center justify-center w-9 h-9 bg-black rounded-full border border-white/10 active:scale-95 transition-transform">
               <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
               </svg>
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
                    <Link href="/reviews" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">Отзывы</Link>
                    <Link href="/contacts" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-[#FFC000] tracking-wide">Контакты</Link>
                  </nav>
                  <div className="mt-auto p-6 border-t border-white/10">
                    <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }} className="flex items-center gap-3 text-[#FFC000] mb-4">
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
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url(https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/jMbWjFZDpDgnMMck.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-transparent to-[#111111]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-bebas font-bold text-[42px] md:text-[72px] leading-[0.9] text-white mb-6 uppercase tracking-normal">
            Наши <span className="text-[#FFC000]">Контакты</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl font-roboto">
            Мы всегда на связи. Свяжитесь с нами любым удобным способом для консультации или вызова сервисной бригады.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-12 md:py-20 bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Details */}
            <div className="space-y-8">
              <div className="bg-[#1a1a1a] p-8 border border-white/10 rounded-sm">
                <h2 className="font-bebas text-3xl text-white mb-8 uppercase">Контактная информация</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bebas text-xl text-white mb-1">Телефон</h3>
                      <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }} className="text-gray-400 hover:text-[#FFC000] transition-colors block text-lg">+7 (771) 417-79-25</a>
                      
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bebas text-xl text-white mb-1">Адрес</h3>
                      <p className="text-gray-400">
                        Республика Казахстан, г. Астана,<br />
                        проспект Абая 24/1
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bebas text-xl text-white mb-1">Email</h3>
                      <a href="mailto:info@acahydraulic.kz" className="text-gray-400 hover:text-[#FFC000] transition-colors">info@acahydraulic.kz</a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black border border-white/10 flex items-center justify-center text-[#FFC000] shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bebas text-xl text-white mb-1">Режим работы</h3>
                      <p className="text-gray-400">Пн-Пт: 9:00 - 18:00</p>
                      <p className="text-gray-400">Сб: 9:00 - 14:00</p>
                      <p className="text-[#FFC000] mt-1 font-bold">Аварийный выезд: 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Legal Info */}
              <div className="bg-[#1a1a1a] p-8 border border-white/10 rounded-sm">
                <h2 className="font-bebas text-3xl text-white mb-6 uppercase">Реквизиты</h2>
                <div className="space-y-4 text-gray-400">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="font-bold text-white">Наименование:</span>
                    <span>ТОО "ACA Hydraulic"</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="font-bold text-white">БИН:</span>
                    <span>240540017992</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="font-bold text-white">Директор:</span>
                    <span>Тлеуғазы А.Б</span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-2 gap-4">
                <a href="https://wa.me/77714177925" target="_blank" rel="noopener noreferrer" className="col-span-1" onClick={() => { if((window as any).gtag_whatsapp_conversion) (window as any).gtag_whatsapp_conversion('https://wa.me/77714177925'); fireTikTokContact('whatsapp'); }}>
                  <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bebas text-lg h-14 uppercase tracking-wide">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                </a>
                <a href="https://t.me/+77714177925" target="_blank" rel="noopener noreferrer" className="col-span-1">
                  <Button className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bebas text-lg h-14 uppercase tracking-wide">
                    <Send className="w-5 h-5 mr-2" />
                    Telegram
                  </Button>
                </a>
                <a href="https://www.tiktok.com/@acaservice01" target="_blank" rel="noopener noreferrer" className="col-span-2">
                  <Button className="w-full bg-black hover:bg-[#111] text-white border border-white/20 font-bebas text-lg h-14 uppercase tracking-wide group">
                    <svg className="w-5 h-5 mr-2 group-hover:text-[#FF0050] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                    Смотрите нас в TikTok
                  </Button>
                </a>
              </div>
            </div>

            {/* Map */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-sm overflow-hidden h-[500px] lg:h-auto relative">
               <MapView 
                className="w-full h-full"
                onMapReady={(map: google.maps.Map) => {
                  // Initialize map centered on Astana, Abai Avenue 24/1
                  // Coordinates for Abai Avenue 24/1, Astana
                  const position = { lat: 51.167758, lng: 71.423135 };
                  map.setCenter(position);
                  map.setZoom(16);
                  
                  // Add marker for base location
                  new google.maps.Marker({
                    position: position,
                    map: map,
                    title: "ACA Hydraulic",
                    animation: google.maps.Animation.DROP
                  });
                }}
              />
              {/* Map Overlay Gradient */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#1a1a1a]/20"></div>
            </div>

            {/* 2GIS Link Button */}
            <div className="mt-6">
              <a href="https://2gis.kz/astana/geo/70000001111695391" target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-white/20 font-bebas text-lg h-14 uppercase tracking-wide group transition-all">
                  <MapPin className="w-5 h-5 mr-2 text-[#FFC000] group-hover:scale-110 transition-transform" />
                  Открыть в 2ГИС
                </Button>
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* Sticky Mobile Footer Action Bar */}
      <div className="md:hidden fixed bottom-12 left-2 right-2 p-3 bg-[#111111]/95 backdrop-blur border border-white/10 rounded-lg z-50 flex gap-2 shadow-2xl">
        <a href="tel:+77714177925" className="flex-1" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } fireTikTokContact('phone'); }}>
          <Button className="w-full bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold uppercase h-12 rounded-[4px] text-[16px] shadow-[0_0_15px_rgba(255,192,0,0.3)] tracking-wide">
            <Phone className="w-4 h-4 mr-2 fill-current" />
            Позвонить
          </Button>
        </a>
        <a href="https://wa.me/77714177925" target="_blank" rel="noopener noreferrer" className="flex-1" onClick={() => { if((window as any).gtag_whatsapp_conversion) (window as any).gtag_whatsapp_conversion('https://wa.me/77714177925'); fireTikTokContact('whatsapp'); }}>
          <Button className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white border border-white/20 font-bebas font-bold uppercase h-12 rounded-[4px] text-[16px] tracking-wide">
            <MessageCircle className="w-5 h-5 mr-2 text-[#25D366]" />
            WhatsApp
          </Button>
        </a>
        
      </div>
    </div>
  );
}
