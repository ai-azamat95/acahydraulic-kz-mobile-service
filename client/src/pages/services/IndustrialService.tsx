import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Phone, MessageCircle, ArrowLeft, CheckCircle, Clock, Shield, FileText, Wrench, Building2, Factory, Truck, HardHat, Settings, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function IndustrialService() {
  const { user, loading, error, isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto">
      <SEO 
        title="Сервис гидравлики для строительных и промышленных компаний | ACA Hydraulic"
        description="Комплексное обслуживание гидравлического оборудования для строительных, горнодобывающих и промышленных предприятий. Договор, гарантии, техподдержка 24/7."
        keywords="обслуживание гидравлики, сервис для компаний, договор на обслуживание, техподдержка гидравлики, промышленное оборудование"
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent pt-6 pb-8 px-4">
        <div className="container mx-auto flex items-center justify-between">
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
            <LanguageSwitcher />
            <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }} className="hidden md:flex items-center gap-2 bg-[#1a1a1a]/80 px-4 py-2 rounded border border-white/10 hover:border-[#FFC000]/50 transition-colors group">
              <Phone className="w-4 h-4 text-[#FFC000] fill-current group-hover:scale-110 transition-transform" />
              <span className="text-[#FFC000] font-bold font-bebas text-lg tracking-wide">+7 (771) 417-79-25</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-[#111111]"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#FFC000] to-transparent"></div>
        
        <div className="container mx-auto relative z-10">
          <Link href="/services">
            <Button variant="ghost" className="text-white/60 hover:text-[#FFC000] mb-6 -ml-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад к услугам
            </Button>
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-block px-4 py-1 bg-[#FFC000]/10 border border-[#FFC000]/30 rounded-full mb-6">
                <span className="text-[#FFC000] text-sm font-bold uppercase tracking-wider">Для юридических лиц</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Сервис гидравлики для <span className="text-[#FFC000]">строительных и промышленных</span> компаний
              </h1>
              
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Комплексное обслуживание гидравлического оборудования по договору. Минимизируем простои техники, обеспечиваем бесперебойную работу вашего парка.
              </p>

              <div className="flex flex-wrap gap-4">
                <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }}>
                  <Button className="bg-[#FFC000] text-black hover:bg-[#FFD700] font-bold px-8 py-6 text-lg">
                    <Phone className="w-5 h-5 mr-2" />
                    Обсудить договор
                  </Button>
                </a>
                <a href="https://wa.me/77714177925" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/20 hover:border-[#FFC000] hover:bg-[#FFC000]/10 px-8 py-6 text-lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    WhatsApp
                  </Button>
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFC000]/20 to-transparent rounded-2xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-8 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold mb-6 text-[#FFC000]">Для кого эта услуга?</h3>
                <ul className="space-y-4">
                  {[
                    { icon: Building2, text: "Строительные компании с парком спецтехники" },
                    { icon: Factory, text: "Горнодобывающие предприятия" },
                    { icon: Truck, text: "Логистические компании" },
                    { icon: HardHat, text: "Промышленные производства" },
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <item.icon className="w-6 h-6 text-[#FFC000] flex-shrink-0 mt-1" />
                      <span className="text-white/90">{item.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#111111] to-[#1a1a1a]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Какие <span className="text-[#FFC000]">проблемы</span> мы решаем?
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Типичные боли руководителей и технических директоров при эксплуатации спецтехники
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Простои техники",
                description: "Каждый день простоя — это убытки. Техника стоит, проект срывается, штрафы растут.",
                impact: "До 500 000 ₸ убытков в день"
              },
              {
                title: "Непредсказуемые поломки",
                description: "Гидравлика выходит из строя в самый неподходящий момент. Нет системы профилактики.",
                impact: "Аварийный ремонт дороже в 2-3 раза"
              },
              {
                title: "Отсутствие контроля",
                description: "Не знаете реальное состояние гидравлики. Нет истории обслуживания и прогноза износа.",
                impact: "Риск критических поломок"
              },
              {
                title: "Сложности с гарантией",
                description: "Разовые ремонты без документов. При повторной поломке — новые расходы.",
                impact: "Дополнительные затраты 30-40%"
              },
              {
                title: "Поиск исполнителей",
                description: "Каждый раз ищете мастера, договариваетесь о цене, контролируете качество.",
                impact: "Потеря времени и нервов"
              },
              {
                title: "Нет приоритета",
                description: "При аварии ждёте в общей очереди. Срочный выезд стоит как космос.",
                impact: "Простой до 3-5 дней"
              },
            ].map((problem, index) => (
              <div key={index} className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 rounded-xl border border-red-500/20 hover:border-red-500/40 transition-all">
                <h3 className="text-xl font-bold mb-3 text-red-400">{problem.title}</h3>
                <p className="text-white/70 mb-4">{problem.description}</p>
                <div className="pt-4 border-t border-white/10">
                  <span className="text-sm text-[#FFC000] font-bold">{problem.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Наше <span className="text-[#FFC000]">решение</span>
            </h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Договор комплексного обслуживания — это предсказуемость, контроль и экономия
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-[#FFC000]/10 to-transparent p-8 rounded-2xl border border-[#FFC000]/30">
              <CheckCircle className="w-12 h-12 text-[#FFC000] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Плановое обслуживание</h3>
              <p className="text-white/80 mb-4">
                Регулярная диагностика и профилактика гидравлики по графику. Выявляем износ до поломки, заменяем детали планово.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• Осмотр каждые 500 моточасов</li>
                <li>• Замена масла и фильтров</li>
                <li>• Диагностика давления и температуры</li>
                <li>• Проверка уплотнений и шлангов</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#FFC000]/10 to-transparent p-8 rounded-2xl border border-[#FFC000]/30">
              <Clock className="w-12 h-12 text-[#FFC000] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Приоритетный выезд</h3>
              <p className="text-white/80 mb-4">
                При аварии выезжаем к вам вне очереди. Гарантированное время прибытия — до 4 часов в Астане, до 12 часов по Казахстану.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• Выезд 24/7 без доплат</li>
                <li>• Мобильная мастерская на объекте</li>
                <li>• Запчасти со склада</li>
                <li>• Ремонт на месте или эвакуация</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#FFC000]/10 to-transparent p-8 rounded-2xl border border-[#FFC000]/30">
              <Shield className="w-12 h-12 text-[#FFC000] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Гарантия и ответственность</h3>
              <p className="text-white/80 mb-4">
                Гарантия на все работы — до 12 месяцев. Если поломка повторится — ремонтируем бесплатно. Прописано в договоре.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• Гарантия на работы до 12 мес.</li>
                <li>• Гарантия на запчасти до 24 мес.</li>
                <li>• Страхование ответственности</li>
                <li>• Компенсация простоя (опция)</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#FFC000]/10 to-transparent p-8 rounded-2xl border border-[#FFC000]/30">
              <FileText className="w-12 h-12 text-[#FFC000] mb-4" />
              <h3 className="text-2xl font-bold mb-4">Полный пакет документов</h3>
              <p className="text-white/80 mb-4">
                Все работы документируем: акты, дефектные ведомости, отчёты. История обслуживания каждой единицы техники в личном кабинете.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• Договор с SLA</li>
                <li>• Акты выполненных работ</li>
                <li>• Дефектные ведомости</li>
                <li>• Отчёты по парку техники</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-8 rounded-2xl border border-[#FFC000]/30 text-center">
            <TrendingUp className="w-16 h-16 text-[#FFC000] mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4">Экономия до 40% в год</h3>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Плановое обслуживание дешевле аварийных ремонтов. Фиксированная стоимость в договоре — никаких сюрпризов с ценами.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#111111]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Как мы <span className="text-[#FFC000]">работаем</span>?
            </h2>
            <p className="text-xl text-white/70">
              Простой и прозрачный процесс от заявки до подписания договора
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Заявка и аудит",
                description: "Вы оставляете заявку. Наш инженер выезжает к вам, осматривает технику, составляет дефектную ведомость и план обслуживания.",
                duration: "1-2 дня"
              },
              {
                step: "02",
                title: "Коммерческое предложение",
                description: "Готовим КП с фиксированной стоимостью обслуживания на год. Указываем перечень работ, график, условия гарантии и SLA.",
                duration: "1 день"
              },
              {
                step: "03",
                title: "Согласование и договор",
                description: "Согласовываем условия, вносим правки. Подписываем договор (можно электронно через ЭЦП). Вносите предоплату или работаем по постоплате.",
                duration: "2-3 дня"
              },
              {
                step: "04",
                title: "Старт обслуживания",
                description: "Закрепляем за вами персонального менеджера и бригаду. Начинаем плановое обслуживание по графику. Доступ в личный кабинет с историей работ.",
                duration: "С первого дня"
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FFC000] to-[#FF8C00] rounded-full flex items-center justify-center text-black font-bold text-xl">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6 rounded-xl border border-white/10">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <span className="text-[#FFC000] text-sm font-bold">{item.duration}</span>
                  </div>
                  <p className="text-white/70">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Тарифы <span className="text-[#FFC000]">обслуживания</span>
            </h2>
            <p className="text-xl text-white/70">
              Выберите оптимальный формат сотрудничества
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Базовый",
                price: "от 150 000 ₸/мес",
                description: "Для парка до 5 единиц техники",
                features: [
                  "Плановое ТО раз в квартал",
                  "Диагностика гидравлики",
                  "Приоритетный выезд (до 12 часов)",
                  "Скидка 10% на запчасти",
                  "Гарантия 6 месяцев",
                ],
                popular: false
              },
              {
                name: "Оптимальный",
                price: "от 400 000 ₸/мес",
                description: "Для парка 5-20 единиц техники",
                features: [
                  "Плановое ТО раз в 2 месяца",
                  "Диагностика + мониторинг 24/7",
                  "Приоритетный выезд (до 4 часов)",
                  "Скидка 20% на запчасти",
                  "Гарантия 12 месяцев",
                  "Личный кабинет с отчётами",
                ],
                popular: true
              },
              {
                name: "Премиум",
                price: "от 800 000 ₸/мес",
                description: "Для парка 20+ единиц техники",
                features: [
                  "Плановое ТО ежемесячно",
                  "Диагностика + IoT-мониторинг",
                  "Выезд по первому звонку (до 2 часов)",
                  "Скидка 30% на запчасти",
                  "Гарантия 24 месяца",
                  "Личный кабинет + API",
                  "Закреплённая бригада на объекте",
                ],
                popular: false
              },
            ].map((tariff, index) => (
              <div key={index} className={`relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-8 rounded-2xl border ${tariff.popular ? 'border-[#FFC000]' : 'border-white/10'} hover:border-[#FFC000]/50 transition-all`}>
                {tariff.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FFC000] text-black px-4 py-1 rounded-full text-sm font-bold">
                    Популярный
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{tariff.name}</h3>
                <div className="text-3xl font-bold text-[#FFC000] mb-2">{tariff.price}</div>
                <p className="text-white/60 text-sm mb-6">{tariff.description}</p>
                <ul className="space-y-3 mb-8">
                  {tariff.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-[#FFC000] flex-shrink-0 mt-0.5" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }}>
                  <Button className={`w-full ${tariff.popular ? 'bg-[#FFC000] text-black hover:bg-[#FFD700]' : 'bg-white/10 hover:bg-white/20'} font-bold`}>
                    Обсудить условия
                  </Button>
                </a>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-white/60 mb-4">
              * Итоговая стоимость зависит от типа техники, объёма работ и региона. Точный расчёт — после аудита.
            </p>
            <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }}>
              <Button className="bg-[#FFC000] text-black hover:bg-[#FFD700] font-bold px-8 py-6 text-lg">
                <Phone className="w-5 h-5 mr-2" />
                Получить расчёт для вашего парка
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#1a1a1a] to-[#111111]">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Готовы обсудить <span className="text-[#FFC000]">сотрудничество</span>?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Оставьте заявку — наш менеджер свяжется с вами в течение 30 минут и ответит на все вопросы
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }}>
              <Button className="bg-[#FFC000] text-black hover:bg-[#FFD700] font-bold px-8 py-6 text-lg">
                <Phone className="w-5 h-5 mr-2" />
                Позвонить сейчас
              </Button>
            </a>
            <a href="https://wa.me/77714177925" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-white/20 hover:border-[#FFC000] hover:bg-[#FFC000]/10 px-8 py-6 text-lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Написать в WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-12 px-4 border-t border-white/10">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
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
          <p className="text-white/60 text-sm">
            © 2024 ACA Hydraulic. Все права защищены.
          </p>
        </div>
      </footer>
    </div>
  );
}
