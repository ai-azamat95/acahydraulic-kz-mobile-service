import { useRef, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, MapPin, Play, ShieldCheck, Wrench, Truck, Settings, Package, Building2, MessageSquare, Star } from 'lucide-react';
import BrandIcon from './BrandIcon';
import { SEO } from '@/components/SEO';
import { seoConfig } from '@/config/seo';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import B2BLeadForm from '@/components/B2BLeadForm';
import CostCalculator from '@/components/CostCalculator';
import StickyMobileBar from '@/components/StickyMobileBar';
import MobileSiteMenu from '@/components/MobileSiteMenu';
import LocalRepairInfo from '@/components/LocalRepairInfo';
import { PumpBrandNavigation } from '@/components/catalog/PumpBrandNavigation';
import { ServiceMap, SupplyGlobe } from './Geography';
import HomeFooter from './HomeFooter';
import { popularCatalogCategories } from './categories';

const phone = 'tel:+77714177925';
const partsWhatsApp = 'https://wa.me/77714177925?text=' + encodeURIComponent('Здравствуйте! Нужен подбор запчасти. Отправлю номер детали, модель и серийный номер техники, фото детали и шильдика.');
const stats = [['150+', 'выездных и аварийных ремонтов', Truck], ['50+', 'капитальных ремонтов', Wrench], ['1000+', 'запчастей поставлено', Package], ['300+', 'единиц техники отремонтировано', Settings]] as const;
const Arrow = () => <ArrowRight aria-hidden="true"/>;

export default function Home() {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const formTriggerRef = useRef<HTMLButtonElement>(null);
  return <div className="home-v2">
    <SEO title={seoConfig.home.title} description={seoConfig.home.description} keywords={seoConfig.home.keywords} canonical={seoConfig.home.canonical}/>
    <header className="home-header"><div className="home-header-inner">
      <Link href="/" aria-label="ACA Hydraulic" className="home-brand"><img src="/images/home/aca-hydraulic-reference.svg" width="124" height="32" alt="" className="home-brand-logo"/></Link>
      <nav className="home-desktop-nav" aria-label="Основные разделы главной"><Link href="/services/">Услуги</Link><Link href="/catalog/">Каталог</Link><Link href="/cases/">Наши работы</Link><a href={phone}>+7 (771) 417-79-25</a></nav>
      <div className="home-social"><a href="https://www.tiktok.com/@acaservice01" target="_blank" rel="noopener noreferrer" aria-label="TikTok ACA Hydraulic"><BrandIcon brand="tiktok"/></a><a href="https://www.youtube.com/@acahydraulic" target="_blank" rel="noopener noreferrer" aria-label="YouTube ACA Hydraulic"><BrandIcon brand="youtube"/></a><MobileSiteMenu/></div>
    </div></header>
    <main id="home-main">
      <section className="home-screen home-hero" id="home-brand" aria-labelledby="home-title">
        <picture className="home-hero-image"><source media="(max-width: 767px)" srcSet="/images/hero-bg-v4-mobile.webp"/><img src="/images/hero-bg-v4.webp" width="1536" height="2752" alt="Экскаватор на объекте — ремонт спецтехники ACA Hydraulic" fetchPriority="high" decoding="async"/></picture>
        <div className="home-screen-inner">
          <div className="home-copy"><h1 id="home-title">ACA HYDRAULIC</h1><p className="home-lead">Полный комплекс услуг<br/>по ремонту вашей спецтехники</p><p className="home-subtitle">Аварийный, плановый<br/>и капитальный ремонт</p></div>
          <dl className="home-stats">{stats.map(([value,label,Icon])=><div key={value}><dt><Icon aria-hidden="true"/><strong>{value}</strong></dt><dd>{label}</dd></div>)}</dl>
          <div className="home-hero-actions"><p>Выезд на объект заказчика по Казахстану</p><a className="home-button" href={phone}>Вызвать специалиста <Arrow/></a><button ref={formTriggerRef} className="home-text-action" onClick={()=>setIsFormDialogOpen(true)}>Описать поломку <Arrow/></button><p className="home-note">Работаем по договору. Стоимость согласуем заранее. Диагностика платная.</p><p className="home-note">Диагностика и ремонт гидравлики спецтехники. Астана, Казахстан.</p></div>
        </div>
      </section>
      <section className="home-screen home-repair" id="home-repair" aria-labelledby="repair-title"><div className="home-screen-inner home-split">
        <div className="home-copy"><p className="home-eyebrow">УСЛУГИ</p><h2 id="repair-title">ВЫЕЗДНОЙ РЕМОНТ</h2><p className="home-lead">Эффективное решение<br/>на объекте заказчика</p><p className="home-origin"><MapPin aria-hidden="true"/> Выезд из Астаны</p></div>
        <ServiceMap/>
        <div className="home-actions"><p>Выезд по Казахстану и в Бишкек</p><Link className="home-button" href="/services/mobile-repair/">Подробнее <Arrow/></Link><a className="home-button home-button-secondary" href={phone}>Вызвать специалиста <Arrow/></a></div>
      </div></section>
      <section className="home-screen home-parts" id="home-parts" aria-labelledby="parts-title"><div className="home-screen-inner home-split">
        <div className="home-copy"><p className="home-eyebrow">КАТАЛОГ</p><h2 id="parts-title">ЗАПАСНЫЕ ЧАСТИ</h2><p className="home-lead">Профессиональный подбор и поставка.</p><p className="home-subtitle">Монтаж и запуск — по согласованию.</p><p className="home-warranty"><ShieldCheck aria-hidden="true"/> Гарантийные условия — в предложении</p></div>
        <SupplyGlobe/>
        <div className="home-actions"><p>Поставки в Казахстан</p><Link className="home-button" href="/catalog/">Открыть каталог <Arrow/></Link><a className="home-button home-button-secondary" href={partsWhatsApp} target="_blank" rel="noopener noreferrer">Подобрать запчасть <Arrow/></a></div>
      </div></section>
      <section className="home-screen home-work" id="home-work" aria-labelledby="work-title"><div className="home-screen-inner home-split">
        <div className="home-copy"><p className="home-eyebrow">ВИДЕО И ОТЗЫВЫ</p><h2 id="work-title">НАШИ РАБОТЫ</h2><p className="home-lead">Диагностика, ремонт, поставка<br/>{' '}и установка запасных частей —<br/>{' '}в наших видео</p></div>
        <figure className="home-video"><a href="https://www.youtube.com/watch?v=spniTTX9ECI" target="_blank" rel="noopener noreferrer" aria-label="Смотреть видео CAT M318 не едет на YouTube"><img src="/images/home/cat-m318.jpg" alt="Реальный кадр видео диагностики CAT M318" width="480" height="360" loading="lazy" decoding="async"/><span className="home-play"><Play aria-hidden="true"/></span></a><figcaption><strong>CAT M318 не едет</strong><span>Диагностика гидравлики</span></figcaption></figure>
        <div className="home-actions"><Link className="home-button" href="/cases/">Смотреть все работы <Arrow/></Link><div className="home-channel-links"><a href="https://www.tiktok.com/@acaservice01" target="_blank" rel="noopener noreferrer"><BrandIcon brand="tiktok"/><b>TikTok <span>@acaservice01</span></b></a><a href="https://www.youtube.com/@acahydraulic" target="_blank" rel="noopener noreferrer"><BrandIcon brand="youtube"/><b>YouTube <span>@acahydraulic</span></b></a></div><nav className="home-company-links" aria-label="Компания и отзывы"><Link href="/about/"><Building2 aria-hidden="true"/>О компании</Link><Link href="/contacts/"><MapPin aria-hidden="true"/>Мы на карте</Link><Link href="/reviews/"><MessageSquare aria-hidden="true"/>Отзывы клиентов</Link><a href={'https://wa.me/77714177925?text='+encodeURIComponent('Здравствуйте! Хочу оставить отзыв о работе вашей компании.')} target="_blank" rel="noopener noreferrer"><Star aria-hidden="true"/><span>Оставить отзыв <small>(сообщение компании)</small></span></a></nav></div>
      </div></section>
      <section className="home-resources" aria-labelledby="home-details-title"><div className="home-container">
        <h2 id="home-details-title">Подробности ремонта и подбора</h2><p>Техника теряет мощность, глохнет под нагрузкой или не работает ход? Определим причину и согласуем ремонт. Собственная ремонтная база в Астане. Гарантия на работы — 6 месяцев при соблюдении рекомендаций.</p><a href="#calculator" className="home-text-action">Подготовить запрос на оценку ремонта <Arrow/></a>
        <details><summary>Как мы работаем и что ремонтируем</summary><p>Диагностика гидравлики с измерением давления и проверкой узлов. План ремонта согласуем до начала работ. Восстанавливаем насосы, гидромоторы и распределители, проверяем результат на стенде и технике. Используем диагностические стенды и инструменты CAT ET, ToughBuilt, Milwaukee и Perkins.</p><nav className="home-link-list"><Link href="/services/hydraulic-pumps/">Ремонт гидронасосов</Link><Link href="/services/hydraulic-motors/">Ремонт гидромоторов</Link><Link href="/services/hydraulic-valves/">Ремонт распределителей</Link><Link href="/services/">Все услуги</Link></nav><LocalRepairInfo route="/"/></details>
        <details><summary>Категории запчастей и бренды техники</summary><PumpBrandNavigation source="home"/><nav className="home-link-list" aria-label="Популярные категории запчастей">{popularCatalogCategories.map(item=><Link key={item.id} href={`/catalog/category/${item.id}`}><strong>{item.title}</strong><span>{item.text}</span></Link>)}</nav><nav className="home-link-list" aria-label="Ремонт по брендам">{['cat','komatsu','hitachi','hyundai','wirtgen','shantui','liebherr','volvo'].map(brand=><Link key={brand} href={`/brands/${brand}/`}>{brand.toUpperCase()}</Link>)}</nav></details>
        <details><summary>Видео и примеры выполненных ремонтов</summary><nav className="home-link-list"><Link href="/cases/cat-325c-glokhnet-pod-nagruzkoy/">CAT 325C — ремонт двигателя и гидравлики</Link><Link href="/cases/cat-330dl-teryaet-moshchnost-na-goryachuyu/">CAT 330DL — потеря мощности после прогрева</Link><Link href="/cases/sany-sy365h-gidravlika-na-goryachuyu/">SANY SY365H — восстановление гидравлики и электрической части</Link><Link href="/blog/zapchasti-po-nomeru-i-shildiku/">Подбор запчастей по номеру и шильдику</Link><Link href="/blog/remont-ili-zamena-gidronasosa/">Ремонт или замена гидронасоса</Link><Link href="/cases/sany-sy365h-zamena-gidronasosa-video/">SANY SY365H — видео замены гидронасоса</Link><Link href="/cases/postavka-zamena-gidronasosa/">Поставка и замена гидронасосов</Link></nav></details>
      </div></section>
      <section id="calculator" className="home-calculator"><div className="home-container"><h2>Предварительная оценка ремонта</h2><p>Диагностика платная. Стоимость диагностики и выезда согласуем заранее. Ремонт и запчасти — отдельно.</p><CostCalculator/></div></section>
    </main>
    <HomeFooter/>
    <Dialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}><DialogContent onCloseAutoFocus={event => { event.preventDefault(); formTriggerRef.current?.focus(); }} className="home-form-dialog bg-zinc-900 sm:max-w-[600px] max-h-[85dvh] overflow-y-auto"><DialogTitle className="sr-only">Заявка на ремонт</DialogTitle><DialogDescription className="sr-only">Укажите технику, место работ и контакты, чтобы подготовить сообщение для WhatsApp.</DialogDescription><B2BLeadForm/></DialogContent></Dialog>
    <StickyMobileBar variant="home"/>
  </div>;
}
