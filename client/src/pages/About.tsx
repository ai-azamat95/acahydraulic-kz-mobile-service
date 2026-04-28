import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle2, MapPin, Users, Wrench, FileText, Truck, ShieldCheck, Award, Target } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <SEO
        title="О компании ACA Hydraulic — Выездной сервис гидравлики в Казахстане"
        description="ACA Hydraulic — специализированный сервисный центр по ремонту гидравлики спецтехники. Работаем с 2024 года, 1500+ отремонтированных машин, гарантия на все виды работ. Астана, Казахстан."
        keywords="ACA Hydraulic о компании, ремонт гидравлики Астана, сервисный центр спецтехника Казахстан"
        canonical="/about"
        pageType="website"
        breadcrumbs={[
          { name: "Главная", url: "/" },
          { name: "О компании", url: "/about" }
        ]}
      />
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#FFC000]">Главная</Link>
        <span className="mx-2">/</span>
        <span className="text-white">О компании</span>
      </div>

      {/* Hero Section */}
      <section className="py-16 md:py-20 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-bebas font-bold text-4xl md:text-6xl leading-[0.95] mb-6 uppercase">
              ACA Hydraulic — <br/>
              <span className="text-[#FFC000]">Инженерный подход</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              Специализированный сервисный центр по восстановлению гидравлических систем промышленной и дорожно-строительной техники. Работаем с крупными подрядчиками, горнодобывающими и строительными компаниями по всему Казахстану.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase text-center">
            Наши <span className="text-[#FFC000]">принципы</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFC000]/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-[#FFC000]" />
              </div>
              <h3 className="font-bebas text-2xl mb-3">Системность</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Не просто меняем детали — диагностируем причину неисправности и устраняем её комплексно.
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFC000]/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-[#FFC000]" />
              </div>
              <h3 className="font-bebas text-2xl mb-3">Надёжность</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Работаем по договору с НДС. Полный пакет документов. Прозрачные условия сотрудничества.
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded text-center">
              <div className="w-16 h-16 rounded-full bg-[#FFC000]/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#FFC000]" />
              </div>
              <h3 className="font-bebas text-2xl mb-3">Экспертность</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Специализация на гидравлике. Инженеры с опытом работы на промышленных объектах.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase">
              Опыт работы <span className="text-[#FFC000]">с крупными заказчиками</span>
            </h2>
            
            <div className="space-y-6">
              <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#FFC000] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bebas text-xl mb-2">Горнодобывающие компании</h3>
                    <p className="text-gray-400 text-sm">
                      Обслуживание карьерных экскаваторов и буровых установок в удалённых локациях. Минимизация простоев критически важного оборудования.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#FFC000] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bebas text-xl mb-2">Инфраструктурные подрядчики</h3>
                    <p className="text-gray-400 text-sm">
                      Ремонт ГНБ установок и дорожно-строительной техники на объектах прокладки коммуникаций и строительства магистралей.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-6 h-6 text-[#FFC000] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bebas text-xl mb-2">Строительные компании</h3>
                    <p className="text-gray-400 text-sm">
                      Плановое ТО и срочный ремонт гидравлики экскаваторов, бульдозеров, погрузчиков на строительных площадках.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Geography */}
      <section className="py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase text-center">
            Работаем <span className="text-[#FFC000]">по всему Казахстану</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <MapPin className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-2xl mb-3">Выездные бригады</h3>
              <p className="text-gray-400 mb-4">
                Мобильные сервисные бригады выезжают на объекты в любой точке Казахстана. Ремонт на месте без транспортировки техники.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Астана и Акмолинская область
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Караганда и Карагандинская область
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Алматы и Алматинская область
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Другие регионы по запросу
                </li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <Truck className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-2xl mb-3">Сервисный центр</h3>
              <p className="text-gray-400 mb-4">
                Собственная мастерская с профессиональным оборудованием для капитального ремонта гидрокомпонентов.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Стенды для испытаний насосов
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Оборудование для хромирования
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Склад запасных частей
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Логистика по Казахстану
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase text-center">
            Как мы <span className="text-[#FFC000]">работаем</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
              <div className="w-12 h-12 rounded-full bg-[#FFC000] flex items-center justify-center font-bebas text-2xl text-black mb-4">1</div>
              <h3 className="font-bebas text-xl mb-2">Договор с НДС</h3>
              <p className="text-gray-400 text-sm">Официальное оформление. Прозрачные условия. Полный пакет документов для юридических лиц.</p>
            </div>

            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
              <div className="w-12 h-12 rounded-full bg-[#FFC000] flex items-center justify-center font-bebas text-2xl text-black mb-4">2</div>
              <h3 className="font-bebas text-xl mb-2">Выездная диагностика</h3>
              <p className="text-gray-400 text-sm">Инженер выезжает на объект с диагностическим оборудованием. Определение причины неисправности.</p>
            </div>

            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
              <div className="w-12 h-12 rounded-full bg-[#FFC000] flex items-center justify-center font-bebas text-2xl text-black mb-4">3</div>
              <h3 className="font-bebas text-xl mb-2">Технический аудит</h3>
              <p className="text-gray-400 text-sm">Составление плана работ. Согласование объёма и сроков. Фиксация состояния оборудования.</p>
            </div>

            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
              <div className="w-12 h-12 rounded-full bg-[#FFC000] flex items-center justify-center font-bebas text-2xl text-black mb-4">4</div>
              <h3 className="font-bebas text-xl mb-2">Фотоотчёт</h3>
              <p className="text-gray-400 text-sm">Документирование всех этапов работ. Отчёт о выполненных работах с фотографиями.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase text-center">
            Наши <span className="text-[#FFC000]">возможности</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded hover:border-[#FFC000]/30 transition-colors">
              <Wrench className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Ремонт гидрокомпонентов</h3>
              <p className="text-gray-400 text-sm">Насосы, моторы, распределители, гидроцилиндры. Капитальный ремонт с восстановлением заводских параметров.</p>
            </div>

            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded hover:border-[#FFC000]/30 transition-colors">
              <Truck className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Выездной сервис 24/7</h3>
              <p className="text-gray-400 text-sm">Срочный выезд на объекты. Ремонт на месте. Минимизация простоев критически важного оборудования.</p>
            </div>

            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded hover:border-[#FFC000]/30 transition-colors">
              <FileText className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Техническое консультирование</h3>
              <p className="text-gray-400 text-sm">Помощь в выборе решений. Рекомендации по эксплуатации. Планирование профилактических работ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#111111] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bebas text-3xl md:text-5xl mb-6 uppercase">
              Готовы <span className="text-[#FFC000]">начать сотрудничество?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Свяжитесь с нами для обсуждения вашего проекта
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacts">
                <Button className="bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-xl h-16 px-12 rounded uppercase tracking-wide">
                  Контакты
                </Button>
              </Link>
              <a 
                href="tel:+77714177925" 
                onClick={() => window.gtag('event', 'conversion', {'send_to': 'AW-17847190636/gJzYCKDa2vgbEOyImr5C'})}
                className="flex items-center justify-center gap-3 px-12 h-16 border border-white/20 rounded hover:bg-white/5 transition-colors"
              >
                <Phone className="text-[#FFC000]" />
                <span className="font-bebas text-xl tracking-wide">+7 (771) 417-79-25</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
