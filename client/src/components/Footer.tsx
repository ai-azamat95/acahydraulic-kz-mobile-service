import { Phone, MessageCircle, Mail } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
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
              {t('footer.description')}
            </p>
          </div>
          
          <div>
            <h3 className="font-bebas text-xl text-white mb-4 tracking-wide">{t('footer.servicesTitle')}</h3>
            <ul className="space-y-2 text-gray-500 text-sm font-roboto">
              <li><Link href="/services" className="hover:text-[#FFC000] transition-colors">{t('nav.services')}</Link></li>
              <li><Link href="/services" className="hover:text-[#FFC000] transition-colors">{t('servicesPage.engine.title')}</Link></li>
              <li><Link href="/services" className="hover:text-[#FFC000] transition-colors">{t('servicesPage.metalwork.title')}</Link></li>
              <li><Link href="/services" className="hover:text-[#FFC000] transition-colors">{t('servicesPage.mobile.title')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bebas text-xl text-white mb-4 tracking-wide">{t('footer.companyTitle')}</h3>
            <ul className="space-y-2 text-gray-500 text-sm font-roboto">
              <li><Link href="/about" className="hover:text-[#FFC000] transition-colors">{t('footer.about')}</Link></li>
              <li><Link href="/cases" className="hover:text-[#FFC000] transition-colors">{t('footer.ourWork')}</Link></li>
              <li><Link href="/reviews" className="hover:text-[#FFC000] transition-colors">{t('footer.clientReviews')}</Link></li>
              <li><Link href="/contacts" className="hover:text-[#FFC000] transition-colors">{t('footer.contacts')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bebas text-xl text-white mb-4 tracking-wide">{t('footer.contactsTitle')}</h3>
            <ul className="space-y-2 text-gray-500 text-sm font-roboto">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FFC000]" />
                <a href="tel:+77714177925" onClick={() => window.gtag('event', 'conversion', {'send_to': 'AW-17847190636/gJzYCKDa2vgbEOyImr5C'})} className="hover:text-[#FFC000] transition-colors">{t('header.phone')}</a>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#FFC000]" />
                <a href="https://wa.me/77714177925" onClick={() => { window.gtag_report_conversion('https://wa.me/77714177925'); return false; }} target="_blank" rel="noopener noreferrer" className="hover:text-[#FFC000] transition-colors">WhatsApp</a>
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
            © 2026 ACA Hydraulic. {t('footer.rights')}
          </p>
          <p className="text-gray-600 text-xs font-roboto flex items-center gap-1">
            Made with <span className="text-[#FFC000]">Manus</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
