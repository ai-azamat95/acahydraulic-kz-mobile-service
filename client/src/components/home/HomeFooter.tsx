import {CommerceLinks} from '@/components/CommerceInfo';
import {Link} from 'wouter';
import {useTranslation} from 'react-i18next';
import {Phone,MessageCircle,Mail,MapPin} from 'lucide-react';
export default function HomeFooter(){const {t}=useTranslation();return (<>      <footer className="bg-[#0a0a0a] border-t border-white/10 pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src="/images/home/aca-hydraulic-reference.svg" width="124" height="32" alt="ACA Hydraulic" className="home-brand-logo" loading="lazy"/>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h2 className="font-bebas text-xl text-white mb-6 uppercase tracking-wide">{t('footer.servicesTitle')}</h2>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/services/mobile-repair" className="hover:text-[#FFC000] transition-colors">{t('footer.mobileRepair')}</Link></li>
                <li><Link href="/services/hydraulic-pumps" className="hover:text-[#FFC000] transition-colors">{t('footer.pumpRepair')}</Link></li>
                <li><Link href="/services/hydraulic-motors" className="hover:text-[#FFC000] transition-colors">{t('footer.motorRepair')}</Link></li>
                <li><Link href="/catalog/category/hydraulic-pumps" className="hover:text-[#FFC000] transition-colors">Каталог гидронасосов</Link></li>
                <li><Link href="/catalog/category/pump-parts" className="hover:text-[#FFC000] transition-colors">Запчасти гидронасосов</Link></li>
                <li><Link href="/catalog/category/fuel-pumps" className="hover:text-[#FFC000] transition-colors">Топливные насосы</Link></li>
                <li><Link href="/catalog/category/fuel-common-rails" className="hover:text-[#FFC000] transition-colors">Рампы Common Rail</Link></li>
              </ul>
            </div>

            <div>
              <h2 className="font-bebas text-xl text-white mb-6 uppercase tracking-wide">{t('footer.companyTitle')}</h2>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-[#FFC000] transition-colors">{t('footer.about')}</Link></li>
                <li><Link href="/cases" className="hover:text-[#FFC000] transition-colors">{t('footer.ourWork')}</Link></li>
                <li><Link href="/reviews" className="hover:text-[#FFC000] transition-colors">{t('footer.clientReviews')}</Link></li>
                <li><Link href="/contacts" className="hover:text-[#FFC000] transition-colors">{t('footer.contacts')}</Link></li>
              </ul>
            </div>

            <div>
              <h2 className="font-bebas text-xl text-white mb-6 uppercase tracking-wide">{t('footer.contactsTitle')}</h2>
              <ul className="space-y-4 text-gray-400 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FFC000] flex-shrink-0" />
                  <span>г. Астана, трасса Астана–Караганда, 81</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#FFC000] flex-shrink-0" />
                  <a href="tel:+77714177925" className="hover:text-[#FFC000] transition-colors">+7 (771) 417-79-25</a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-[#FFC000] flex-shrink-0" />
                  <a href="https://wa.me/77714177925" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFC000] transition-colors">WhatsApp</a>
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
            <div className="max-w-full"><p className="text-sm text-gray-500">Продавец и получатель оплаты: <Link href="/offer/" className="underline underline-offset-4 hover:text-[#FFC000]">ТОО «ACA ГИДРАВЛИК СЕРВИС» · БИН 240540017992</Link></p><CommerceLinks /></div>
          </div>
        </div>
      </footer>

</>);}
