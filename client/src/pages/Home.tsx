import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { seoConfig, localBusinessSchema } from "@/config/seo";
import { Phone, MessageCircle, Wrench, HardHat, Truck, ShieldCheck, Scan, Microscope, Settings, Gauge, Menu, X, Send, Video, MapPin, Building2, Calculator, ArrowRight, Mail } from "lucide-react";
import CostCalculator from "@/components/CostCalculator";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import B2BLeadForm from "@/components/B2BLeadForm";
import StickyMobileBar from "@/components/StickyMobileBar";
import { useTranslation } from "react-i18next";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useTikTokContact } from "@/hooks/useTikTokEvents";

export default function Home() {
  // The userAuth hooks provides authentication state
  // To implement login/logout functionality, simply call logout() or redirect to getLoginUrl()
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const { t } = useTranslation();
  const fireTikTokContact = useTikTokContact();
  return (
    <div className="min-h-[100dvh] bg-[#111111] text-white font-roboto flex flex-col overflow-x-hidden">
      <SEO 
        title={seoConfig.home.title}
        description={seoConfig.home.description}
        keywords={seoConfig.home.keywords}
        canonical={seoConfig.home.canonical}
        schema={localBusinessSchema}
      />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent pt-2 pb-2 px-4 md:pt-3 md:pb-3">
        <div className="container mx-auto flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* New Geometric Logo Design from IMG_9120.PNG */}
            <div className="flex items-center gap-3">
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
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-[#FFC000] font-roboto text-sm uppercase tracking-wide transition-colors hover:text-[#FFD700]">{t('nav.home')}</Link>
            <Link href="/services" className="text-white/90 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wide transition-colors">{t('nav.services')}</Link>
            <Link href="/about" className="text-white/90 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wide transition-colors">{t('nav.about')}</Link>
            <Link href="/projects" className="text-white/90 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wide transition-colors">Проекты</Link>
            {/* Brands dropdown */}
            <div className="relative group">
              <button className="text-white/90 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wide transition-colors flex items-center gap-1">
                Бренды
                <svg className="w-3 h-3 mt-0.5 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[#111111] border border-white/10 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  {[
                    { name: 'CAT', href: '/brands/cat' },
                    { name: 'KOMATSU', href: '/brands/komatsu' },
                    { name: 'HITACHI', href: '/brands/hitachi' },
                    { name: 'HYUNDAI', href: '/brands/hyundai' },
                    { name: 'WIRTGEN', href: '/brands/wirtgen' },
                    { name: 'SHANTUI', href: '/brands/shantui' },
                    { name: 'LIEBHERR', href: '/brands/liebherr' },
                    { name: 'VOLVO CE', href: '/brands/volvo' },
                  ].map((b) => (
                    <Link key={b.name} href={b.href} className="block px-4 py-2 text-sm text-gray-300 hover:text-[#FFC000] hover:bg-white/5 transition-colors font-roboto">{b.name}</Link>
                  ))}
                </div>
              </div>
            </div>
            <Link href="/reviews" className="text-white/90 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wide transition-colors">{t('nav.reviews')}</Link>
            <Link href="/blog" className="text-white/90 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wide transition-colors">{t('nav.blog')}</Link>
            <Link href="/contacts" className="text-white/90 hover:text-[#FFC000] font-roboto text-sm uppercase tracking-wide transition-colors">{t('nav.contacts')}</Link>
          </nav>

          {/* Phone Number & Mobile Menu */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>
            {/* TikTok Button - Desktop */}
            <a href="https://www.tiktok.com/@acaservice01" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center justify-center w-10 h-10 bg-black rounded-full border border-white/10 hover:border-[#FF0050]/50 hover:bg-[#111] transition-all group relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-[#25F4EE]/20 to-[#FE2C55]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <svg className="w-5 h-5 text-white group-hover:text-[#FF0050] transition-colors relative z-10" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
               </svg>
            </a>

            {/* YouTube Button - Desktop */}
            <a href="https://www.youtube.com/@acahydraulic" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center justify-center w-10 h-10 bg-black rounded-full border border-white/10 hover:border-[#FF0000]/50 hover:bg-[#111] transition-all group relative overflow-hidden">
               <div className="absolute inset-0 bg-[#FF0000]/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <svg className="w-5 h-5 text-white group-hover:text-[#FF0000] transition-colors relative z-10" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
               </svg>
            </a>

            <a href="tel:+77714177925" onClick={() => window.gtag('event', 'conversion', {'send_to': 'AW-17847190636/MNy9COmB06QcEOyImr5C'})} className="hidden md:flex items-center gap-2 bg-[#1a1a1a]/80 px-4 py-2 rounded border border-white/10 hover:border-[#FFC000]/50 transition-colors group">
              <Phone className="w-4 h-4 text-[#FFC000] fill-current group-hover:scale-110 transition-transform" />
              <span className="text-[#FFC000] font-bold font-bebas text-lg tracking-wide">+7 (771) 417-79-25</span>
            </a>
            
            {/* TikTok Button - Mobile (Header) */}
            <a href="https://www.tiktok.com/@acaservice01" target="_blank" rel="noopener noreferrer" className="md:hidden flex items-center justify-center w-9 h-9 bg-black rounded-full border border-white/10 active:scale-95 transition-transform">
               <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
               </svg>
            </a>

            {/* YouTube Button - Mobile (Header) */}
            <a href="https://www.youtube.com/@acahydraulic" target="_blank" rel="noopener noreferrer" className="md:hidden flex items-center justify-center w-9 h-9 bg-black rounded-full border border-white/10 active:scale-95 transition-transform">
               <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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
                    <span className="font-bebas text-2xl text-white">{t('nav.menu')}</span>
                    <LanguageSwitcher />
                  </div>
                  <nav className="flex flex-col p-6 gap-6">
                    <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-[#FFC000] tracking-wide">{t('nav.home')}</Link>
                    <Link href="/services" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">{t('nav.services')}</Link>
                    <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">{t('nav.about')}</Link>
                    {/* Brands section in mobile menu */}
                    <div>
                      <div className="text-xs font-roboto text-gray-500 uppercase tracking-widest mb-2">Бренды</div>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: 'CAT', href: '/brands/cat' },
                          { name: 'KOMATSU', href: '/brands/komatsu' },
                          { name: 'HITACHI', href: '/brands/hitachi' },
                          { name: 'HYUNDAI', href: '/brands/hyundai' },
                          { name: 'WIRTGEN', href: '/brands/wirtgen' },
                          { name: 'SHANTUI', href: '/brands/shantui' },
                          { name: 'LIEBHERR', href: '/brands/liebherr' },
                          { name: 'VOLVO CE', href: '/brands/volvo' },
                        ].map((b) => (
                          <Link key={b.name} href={b.href} onClick={() => setIsMenuOpen(false)}
                            className="text-sm font-bebas text-gray-300 hover:text-[#FFC000] bg-white/5 hover:bg-white/10 px-3 py-1 rounded transition-colors tracking-wide">
                            {b.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link href="/reviews" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">{t('nav.reviews')}</Link>
                    <Link href="/blog" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">{t('nav.blog')}</Link>
                    <Link href="/contacts" onClick={() => setIsMenuOpen(false)} className="text-xl font-bebas text-white hover:text-[#FFC000] transition-colors tracking-wide">{t('nav.contacts')}</Link>
                  </nav>
                  <div className="mt-auto p-6 border-t border-white/10">
                    <a href="tel:+77714177925" onClick={() => window.gtag('event', 'conversion', {'send_to': 'AW-17847190636/MNy9COmB06QcEOyImr5C'})} className="flex items-center gap-3 text-[#FFC000] mb-4">
                      <Phone className="w-5 h-5" />
                      <span className="font-bebas text-xl">+7 (771) 417-79-25</span>
                    </a>
                    <p className="text-gray-500 text-xs font-roboto">
                      {t('footer.schedule')}<br/>
                      {t('footer.emergencyCall')}
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero-bg-v4.webp" 
            alt="Excavator in mine" 
            className="w-full h-full object-cover object-[75%_center] md:object-center scale-100 origin-center brightness-90"
            fetchPriority="high"
            decoding="async"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/95"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent md:via-black/40 md:to-transparent"></div>
          {/* Bottom Gradient Fade for Smooth Transition */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#111111] to-transparent z-0"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex-grow flex flex-col pt-14 pb-[70px] md:pt-32 md:pb-12 min-h-[100dvh] justify-between md:justify-center">
          {/* Main Content */}
          <div className="max-w-xl mt-12 md:mt-0 md:max-w-2xl pl-4 md:pl-0">
            <h1 className="font-bebas font-bold text-[28px] md:text-[72px] leading-[1.1] md:leading-[0.95] text-white mb-4 md:mb-6 uppercase tracking-normal drop-shadow-2xl scale-y-110 origin-top-left">
              {t('hero.title')}
            </h1>
            
            <p className="text-[12px] md:text-[18px] text-[#d1d5db] mb-10 md:mb-10 max-w-[95%] md:max-w-[600px] font-roboto font-normal leading-[1.3] md:leading-[1.5] tracking-wide drop-shadow-md">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col md:flex-row gap-3 md:gap-4 w-full md:w-auto items-start">
              <a 
                href="tel:+77714177925" 
                onClick={() => window.gtag('event', 'conversion', {'send_to': 'AW-17847190636/MNy9COmB06QcEOyImr5C'})}
                className="inline-flex items-center justify-center bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-extrabold text-[14px] md:text-[18px] h-[38px] md:h-[56px] rounded-[4px] uppercase tracking-wide w-[220px] md:w-[260px] shadow-[0_4px_14px_rgba(255,192,0,0.4)] border-none transition-colors active:scale-95"
              >
                {t('hero.cta_primary')}
              </a>
              <Button 
                onClick={() => setIsFormDialogOpen(true)}
                className="bg-[#1a1a1a]/90 hover:bg-black text-white border border-white/10 font-bebas font-extrabold text-[14px] md:text-[18px] h-[38px] md:h-[56px] rounded-[4px] uppercase tracking-wide w-[220px] md:w-[260px] backdrop-blur-md shadow-lg"
              >
                {t('hero.cta_secondary')}
              </Button>
            </div>

            {/* Informational Text Block */}
            <div className="mt-5 md:mt-6 text-white/85 font-roboto font-medium text-[11px] md:text-[14px] leading-relaxed max-w-[95%] md:max-w-[600px]">
              <div className="flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-x-4 md:gap-y-2">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#FFC000]">✓</span>
                  Среднее время ответа — 5–10 минут
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#FFC000]">✓</span>
                  Выезд по всему Казахстану
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#FFC000]">✓</span>
                  Работаем по договору с НДС
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="text-[#FFC000]">✓</span>
                  Собственный склад запчастей
                </span>
              </div>
            </div>
          </div>



          {/* Bottom Section - Mobile Only */}
          <div className="mt-auto md:hidden">
            {/* Mobile Features Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-black/40 backdrop-blur-sm p-3 rounded border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <Truck className="w-4 h-4 text-[#FFC000]" />
                  <span className="font-bebas text-sm text-white">{t('hero.emergencyCall')}</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">{t('hero.emergencyCallDesc')}</p>
              </div>
              <div className="bg-black/40 backdrop-blur-sm p-3 rounded border border-white/5">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-[#FFC000]" />
                  <span className="font-bebas text-sm text-white">{t('hero.warranty')}</span>
                </div>
                <p className="text-[10px] text-gray-400 leading-tight">{t('hero.warrantyDesc')}</p>
              </div>
            </div>


          </div>

          {/* Desktop Benefits Row */}
          <div className="hidden md:grid grid-cols-3 gap-8 mt-12 border-t border-white/10 pt-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6 text-[#FFC000]" />
              </div>
              <div>
                <h3 className="font-bebas text-xl text-white mb-1">{t('benefits.mobileService')}</h3>
                <p className="text-sm text-gray-400">{t('benefits.mobileServiceDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#FFC000]" />
              </div>
              <div>
                <h3 className="font-bebas text-xl text-white mb-1">{t('benefits.qualityWarranty')}</h3>
                <p className="text-sm text-gray-400">{t('benefits.qualityWarrantyDesc')}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                <Wrench className="w-6 h-6 text-[#FFC000]" />
              </div>
              <div>
                <h3 className="font-bebas text-xl text-white mb-1">{t('benefits.complexRepair')}</h3>
                <p className="text-sm text-gray-400">{t('benefits.complexRepairDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Video Section */}
      <section className="py-14 md:py-20 bg-[#0a0a0a] border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block bg-[#FFC000]/10 text-[#FFC000] font-roboto text-sm uppercase tracking-widest px-4 py-1.5 rounded mb-3 border border-[#FFC000]/20">YouTube</span>
            <h2 className="font-bebas font-bold text-4xl md:text-5xl text-white uppercase tracking-wide mb-2">Наши работы в деле</h2>
            <p className="text-gray-400 font-roboto text-base md:text-lg max-w-xl mx-auto">Смотрите реальные примеры ремонта гидравлики спецтехники на нашем YouTube-канале</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* YouTube Shorts Embed */}
            <div className="relative w-full max-w-[300px] mx-auto md:mx-0" style={{aspectRatio: '9/16', maxHeight: '533px'}}>
              <div className="absolute inset-0 rounded-2xl overflow-hidden border-2 border-[#FFC000]/30 shadow-2xl shadow-[#FFC000]/10">
                <iframe
                  src="https://www.youtube.com/embed/spniTTX9ECI?rel=0&modestbranding=1&autoplay=0"
                  title="ACA Hydraulic - Ремонт гидравлики спецтехники"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
            {/* Channel Info */}
            <div className="flex flex-col items-center md:items-start gap-5 max-w-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-[#FF0000] flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-bebas text-2xl text-white tracking-wide">ACA Hydraulic</p>
                  <p className="text-gray-400 font-roboto text-sm">YouTube канал</p>
                </div>
              </div>
              <p className="text-gray-300 font-roboto text-base leading-relaxed text-center md:text-left">
                Публикуем видео реальных ремонтов — экскаваторы, буровые установки, гидронасосы. Подпишитесь, чтобы видеть нашу работу.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <a
                  href="https://www.youtube.com/@acahydraulic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#FF0000] hover:bg-[#cc0000] text-white font-bebas font-bold text-lg h-12 px-6 rounded uppercase tracking-wide transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  Подписаться
                </a>
                <a
                  href="https://youtube.com/shorts/spniTTX9ECI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-[#FFC000] text-white hover:text-[#FFC000] font-bebas font-bold text-lg h-12 px-6 rounded uppercase tracking-wide transition-colors"
                >
                  Смотреть видео
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Protocol Section (New) */}
      <section className="relative bg-[#1a202c] py-16 md:py-24 overflow-hidden border-t border-white/10">
        {/* Storm Excavator Background with Stormy Blue Tint */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'url(/images/storm-excavator-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#1a202c]/90 to-[#111111]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-bebas font-bold text-4xl md:text-5xl text-white mb-4 uppercase tracking-wide">
                {t('technicalProtocol.title')} <span className="text-[#FFC000]">{t('technicalProtocol.titleHighlight')}</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                {t('technicalProtocol.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Step 1 */}
              <div className="bg-[#111111]/80 backdrop-blur-sm p-8 rounded border border-white/5 hover:border-[#FFC000]/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFC000] transition-colors">
                    <Scan className="w-6 h-6 text-[#FFC000] group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bebas text-2xl text-white mb-2 group-hover:text-[#FFC000] transition-colors">{t('technicalProtocol.step1Title')}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {t('technicalProtocol.step1Desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-[#111111]/80 backdrop-blur-sm p-8 rounded border border-white/5 hover:border-[#FFC000]/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFC000] transition-colors">
                    <Microscope className="w-6 h-6 text-[#FFC000] group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bebas text-2xl text-white mb-2 group-hover:text-[#FFC000] transition-colors">{t('technicalProtocol.step2Title')}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {t('technicalProtocol.step2Desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-[#111111]/80 backdrop-blur-sm p-8 rounded border border-white/5 hover:border-[#FFC000]/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFC000] transition-colors">
                    <Settings className="w-6 h-6 text-[#FFC000] group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bebas text-2xl text-white mb-2 group-hover:text-[#FFC000] transition-colors">{t('technicalProtocol.step3Title')}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {t('technicalProtocol.step3Desc')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="bg-[#111111]/80 backdrop-blur-sm p-8 rounded border border-white/5 hover:border-[#FFC000]/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFC000] transition-colors">
                    <Gauge className="w-6 h-6 text-[#FFC000] group-hover:text-black transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bebas text-2xl text-white mb-2 group-hover:text-[#FFC000] transition-colors">{t('technicalProtocol.step4Title')}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {t('technicalProtocol.step4Desc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost Calculator Section */}
      <section className="py-16 md:py-24 bg-[#111111] border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-bebas font-bold text-3xl md:text-5xl text-white mb-4 uppercase">
                {t('costCalculator.title')} <span className="text-[#FFC000]">{t('costCalculator.titleHighlight')}</span>
              </h2>
              <p className="text-gray-400">
                {t('costCalculator.subtitle')}
              </p>
            </div>
            <CostCalculator />
          </div>
        </div>
      </section>

      {/* Services & Capabilities Section (New) */}
      <section className="relative bg-[#0a0a0a] py-16 md:py-24 overflow-hidden">
        {/* Storm Excavator Background */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'url(/images/storm-excavator-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#111111] via-[#111111]/80 to-[#111111]"></div>        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-stretch">
            
            {/* Left Column: Text Content */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFC000]/10 border border-[#FFC000]/20 rounded text-[#FFC000] text-xs font-bold uppercase tracking-widest mb-6 w-fit">
                <Wrench size={14} />
                {t('comprehensiveApproach.title')}
              </div>
              
              <h2 className="font-bebas font-bold text-4xl md:text-5xl text-white mb-6 uppercase leading-tight">
                {t('comprehensiveApproach.subtitle')} <br/>
                <span className="text-[#FFC000]">{t('comprehensiveApproach.subtitleHighlight')}</span>
              </h2>
              
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                {t('comprehensiveApproach.description')}
              </p>

              <div className="space-y-4 mb-10">
                <div className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded border border-white/5 hover:border-[#FFC000]/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#FFC000]/20 flex items-center justify-center text-[#FFC000]">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h4 className="font-bebas text-xl text-white">{t('comprehensiveApproach.pumpsMotors')}</h4>
                    <p className="text-sm text-gray-500">{t('comprehensiveApproach.pumpsMotorsDesc')}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-[#1a1a1a] rounded border border-white/5 hover:border-[#FFC000]/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-[#FFC000]/20 flex items-center justify-center text-[#FFC000]">
                    <Gauge size={20} />
                  </div>
                  <div>
                    <h4 className="font-bebas text-xl text-white">{t('comprehensiveApproach.distributors')}</h4>
                    <p className="text-sm text-gray-500">{t('comprehensiveApproach.distributorsDesc')}</p>
                  </div>
                </div>


              </div>

              <Link href="/services">
                <Button className="bg-transparent border border-[#FFC000] text-[#FFC000] hover:bg-[#FFC000] hover:text-black font-bebas font-bold text-lg h-14 px-8 rounded uppercase tracking-wide w-fit transition-all">
                  {t('comprehensiveApproach.allServices')}
                </Button>
              </Link>
            </div>

            {/* Right Column: Visuals */}
            <div className="flex-1 relative min-h-[400px] md:min-h-auto rounded-lg overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
              <img 
                src="/images/welding-repair.webp" 
                alt="Welding repair on excavator" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Floating Stats Card */}
              <div className="absolute bottom-8 left-8 right-8 bg-black/80 backdrop-blur-md p-6 rounded border border-white/10 z-20">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="block text-3xl font-bebas text-[#FFC000]">1500+</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">{t('comprehensiveApproach.repairedUnits')}</span>
                  </div>
                  <div className="h-10 w-px bg-white/20"></div>
                  <div>
                    <span className="block text-3xl font-bebas text-[#FFC000]">98%</span>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">{t('comprehensiveApproach.successfulRepairs')}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Equipment Brands Section */}
      <section className="py-16 bg-[#111111] border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <h3 className="font-bebas font-bold text-[#FFC000] text-center text-2xl md:text-3xl uppercase tracking-wide mb-4">СОВРЕМЕННОЕ ОБОРУДОВАНИЕ</h3>
            <p className="text-gray-400 text-center font-roboto text-base md:text-lg mb-10 max-w-2xl mx-auto">Диагностические стенды и инструменты</p>
            
            {/* Equipment brands - Mobile Only */}
            <div className="flex md:hidden flex-wrap justify-center items-center gap-8 px-4 w-full">
               <img src="/brands/cat-logo.png" alt="CAT ET" className="h-16 w-auto object-contain opacity-85" loading="lazy" />
               <img src="/brands/toughbuilt-logo.png" alt="ToughBuilt" className="h-12 w-auto object-contain opacity-85" loading="lazy" />
               <img src="/brands/milwaukee-logo.jpg" alt="Milwaukee" className="h-14 w-auto object-contain opacity-85" loading="lazy" />
               <img src="/brands/perkins-logo.png" alt="Perkins" className="h-16 w-auto object-contain opacity-85" loading="lazy" />
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Brands We Service Section */}
      <section className="py-16 bg-[#0a0a0a] border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="inline-block bg-[#FFC000]/10 text-[#FFC000] font-roboto text-xs uppercase tracking-widest px-4 py-1.5 rounded mb-3 border border-[#FFC000]/20">Марки техники</span>
            <h2 className="font-bebas font-bold text-3xl md:text-4xl text-white uppercase tracking-wide mb-2">Ремонтируем гидравлику <span className="text-[#FFC000]">ведущих брендов</span></h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">Опыт работы с оригинальными гидравлическими системами CAT, Komatsu, Hitachi, Hyundai, Wirtgen, SHANTUI, Liebherr, Volvo CE и других производителей</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[
              { name: 'CAT', href: '/brands/cat', desc: 'Caterpillar', color: '#FFCD11' },
              { name: 'KOMATSU', href: '/brands/komatsu', desc: 'Komatsu Ltd.', color: '#FFCD11' },
              { name: 'HITACHI', href: '/brands/hitachi', desc: 'Hitachi Construction', color: '#E60012' },
              { name: 'HYUNDAI', href: '/brands/hyundai', desc: 'Hyundai CE', color: '#003087' },
              { name: 'WIRTGEN', href: '/brands/wirtgen', desc: 'Wirtgen Group', color: '#FFFFFF' },
              { name: 'SHANTUI', href: '/brands/shantui', desc: 'Shantui Construction', color: '#E8A000' },
              { name: 'LIEBHERR', href: '/brands/liebherr', desc: 'Liebherr Group', color: '#FFC000' },
              { name: 'VOLVO CE', href: '/brands/volvo', desc: 'Volvo Construction', color: '#FFD700' },
            ].map((brand) => (
              <Link key={brand.name} href={brand.href}>
                <div className="group bg-[#1a1a1a] border border-white/10 hover:border-[#FFC000]/50 rounded-lg p-5 text-center cursor-pointer transition-all hover:bg-[#1f1f1f] hover:-translate-y-1">
                  <div className="font-bebas text-2xl mb-1 transition-colors" style={{ color: brand.color }}>{brand.name}</div>
                  <div className="text-gray-500 text-xs group-hover:text-gray-300 transition-colors">{brand.desc}</div>
                  <div className="mt-3 text-[#FFC000] text-xs opacity-0 group-hover:opacity-100 transition-opacity">Подробнее →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#FFC000] text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bebas font-bold text-4xl md:text-6xl mb-6 uppercase">
            {t('cta.title')}
          </h2>
          <p className="text-xl md:text-2xl font-medium mb-10 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <a 
              href="tel:+77714177925" 
              onClick={() => { window.gtag('event', 'conversion', {'send_to': 'AW-17847190636/MNy9COmB06QcEOyImr5C'}); fireTikTokContact('phone'); }}
              className="inline-flex items-center justify-center bg-black text-white hover:bg-gray-900 font-bebas font-bold text-xl h-16 px-10 rounded uppercase tracking-wide w-full md:w-auto shadow-xl transition-colors"
            >
              {t('cta.callNow')}
            </a>
            <a 
              href="https://wa.me/77714177925" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => { window.gtag_report_conversion('https://wa.me/77714177925'); fireTikTokContact('whatsapp'); }}
              className="inline-flex items-center justify-center border-2 border-black bg-transparent text-black hover:bg-black/10 font-bebas font-bold text-xl h-16 px-10 rounded uppercase tracking-wide w-full md:w-auto transition-colors"
            >
              {t('cta.whatsapp')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/10 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="flex gap-[3px] h-[24px]">
                  <div className="w-[8px] h-full bg-[#FFC000]"></div>
                  <div className="flex flex-col justify-between h-full">
                    <div className="w-[8px] h-[10.5px] bg-[#FFC000]"></div>
                    <div className="w-[8px] h-[10.5px] bg-[#FFC000]"></div>
                  </div>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-sans font-bold text-[16px] text-white leading-none tracking-wide">ACA</span>
                  <span className="font-sans font-medium text-[10px] text-white leading-none tracking-wider mt-[2px]">HYDRAULIC</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h4 className="font-bebas text-xl text-white mb-6 uppercase tracking-wide">{t('footer.servicesTitle')}</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/services/mobile-repair" className="hover:text-[#FFC000] transition-colors">{t('footer.mobileRepair')}</Link></li>
                <li><Link href="/services/hydraulic-pumps" className="hover:text-[#FFC000] transition-colors">{t('footer.pumpRepair')}</Link></li>
                <li><Link href="/services/hydraulic-motors" className="hover:text-[#FFC000] transition-colors">{t('footer.motorRepair')}</Link></li>

              </ul>
            </div>

            <div>
              <h4 className="font-bebas text-xl text-white mb-6 uppercase tracking-wide">{t('footer.companyTitle')}</h4>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-[#FFC000] transition-colors">{t('footer.about')}</Link></li>
                <li><Link href="/cases" className="hover:text-[#FFC000] transition-colors">{t('footer.ourWork')}</Link></li>
                <li><Link href="/reviews" className="hover:text-[#FFC000] transition-colors">{t('footer.clientReviews')}</Link></li>
                <li><Link href="/contacts" className="hover:text-[#FFC000] transition-colors">{t('footer.contacts')}</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bebas text-xl text-white mb-6 uppercase tracking-wide">{t('footer.contactsTitle')}</h4>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FFC000] flex-shrink-0" />
                  <span>Астана, Абая 24/1</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#FFC000] flex-shrink-0" />
                  <a href="tel:+77714177925" onClick={() => window.gtag('event', 'conversion', {'send_to': 'AW-17847190636/MNy9COmB06QcEOyImr5C'})} className="hover:text-[#FFC000] transition-colors">+7 (771) 417-79-25</a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-[#FFC000] flex-shrink-0" />
                  <a href="https://wa.me/77714177925" onClick={() => { window.gtag_report_conversion('https://wa.me/77714177925'); return false; }} target="_blank" rel="noopener noreferrer" className="hover:text-[#FFC000] transition-colors">WhatsApp</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#FFC000] flex-shrink-0" />
                  <a href="mailto:info@acahydraulic.kz" className="hover:text-[#FFC000] transition-colors">info@acahydraulic.kz</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-xs">
              &copy; {new Date().getFullYear()} ACA Hydraulic. {t('footer.rights')}
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-600 hover:text-[#FFC000] text-xs transition-colors">{t('footer.privacyPolicy')}</a>
              <a href="#" className="text-gray-600 hover:text-[#FFC000] text-xs transition-colors">{t('footer.termsOfUse')}</a>
            </div>
          </div>
        </div>
      </footer>

      {/* B2B Lead Form Dialog */}
      <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <DialogContent className="bg-white dark:bg-zinc-900 sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Заявка на ремонт</DialogTitle>
          <B2BLeadForm />
        </DialogContent>
      </Dialog>

      {/* Sticky Mobile Bar */}
      <StickyMobileBar />
    </div>
  );
}
