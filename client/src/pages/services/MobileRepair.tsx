import { Button } from "@/components/ui/button";
import { Phone, CheckCircle2, Wrench, Truck, Clock, FileText, ShieldCheck, HardHat, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SEO } from "@/components/SEO";
import B2BLeadForm from "@/components/B2BLeadForm";

export default function MobileRepair() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <>
      <SEO
        title="Выездной ремонт гидравлики спецтехники в Казахстане 24/7"
        description="Выездной ремонт гидравлики экскаваторов, буровых, кранов и спецтехники на объекте. Диагностика на объекте, работа по договору с НДС, гарантия по договору."
        keywords="выездной ремонт гидравлики, мобильный сервис спецтехники, ремонт гидравлики на объекте, ремонт экскаватора на объекте, аварийный ремонт гидравлики"
        canonical="/services/mobile-repair"
        breadcrumbs={[
          { name: "Услуги", url: "/services" },
          { name: "Выездной ремонт гидравлики", url: "/services/mobile-repair" },
        ]}
        serviceSchema={{
          serviceName: "Выездной ремонт гидравлики спецтехники",
          serviceDescription: "Мобильный сервис ACA Hydraulic для диагностики и ремонта гидравлики спецтехники на объекте по Казахстану.",
          serviceUrl: "/services/mobile-repair",
          areaServed: ["Астана", "Алматы", "Казахстан"],
        }}
      />
      <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#FFC000]">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/services" className="hover:text-[#FFC000]">Услуги</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Выездной ремонт гидравлики</span>
      </div>

      {/* Hero Section - B2B Focused */}
      <section className="relative py-16 md:py-24 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[#1a1a1a]">
           <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/70 z-10"></div>
           {/* Placeholder for industrial background */}
           <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{backgroundImage: "url('https://private-us-east-1.manuscdn.com/sessionFile/qTqqkhQQWHtkSbR4kERHSj/sandbox/E5cf2giz0crfm3TbfcErdU-img-2_1771348812000_na1fn_YmctbW9iaWxlLXNlcnZpY2U.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcVRxcWtoUVFXSHRrU2JSNGtFUkhTai9zYW5kYm94L0U1Y2YyZ2l6MGNyZm0zVGJmY0VyZFUtaW1nLTJfMTc3MTM0ODgxMjAwMF9uYTFmbl9ZbWN0Ylc5aWFXeGxMWE5sY25acFkyVS5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=veU6CSJTvgYEabEFBghJvAD8AjwdFTGvIWvEbulzzhzHBnrcndTt1y8-yj4RS3z-mhCQYXTie~Jp3fIgww4XfZ9viG4SwMWeWZ3h~arcy1VvXDYJIfdE2SW1ugExwXbF285VclDh1VvgHjxABX32ZIFel2wNPZA1PDmFatuQEP2gHoWR1cpFmoWZHV-QVBkrX28yNgX9DofXBpurcTlRTWSKMwCDFrKX42SukO3nC8HZebv~q~mMF~VhAZ-DXLI78WqJxg-AWMAyuM8hIg74kHZBQUZ6CFBbwXSNmIW5xusEa6xwHKhHKMUu2ZGDK2Mzc6~Hy~OKcj92Y3E-sXalXQ__')"}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFC000]/10 border border-[#FFC000]/20 rounded text-[#FFC000] text-xs font-bold uppercase tracking-widest mb-6">
              <Truck size={14} />
              Для юридических лиц
            </div>
            <h1 className="font-bebas font-bold text-4xl md:text-6xl leading-[0.95] mb-6 uppercase">
              Выездной ремонт гидравлики <br/>
              <span className="text-[#FFC000]">спецтехники на объекте</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Восстановление работоспособности экскаваторов, буровых и кранов после диагностики и согласования работ.
              Работаем по договору с НДС. Выезд в любую точку Казахстана.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-lg h-14 px-8 rounded uppercase tracking-wide"
              >
                Оставить заявку на выезд
              </Button>
              <a href="tel:+77714177925" className="flex items-center justify-center gap-3 px-8 h-14 border border-white/20 rounded hover:bg-white/5 transition-colors">
                <Phone className="text-[#FFC000]" />
                <span className="font-bebas text-lg tracking-wide">+7 (771) 417-79-25</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience - Who is this for? */}
      <section className="py-16 bg-[#111]">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase">
            Услуга для <span className="text-[#FFC000]">промышленных предприятий</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded hover:border-[#FFC000]/30 transition-colors">
              <HardHat className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Строительные компании</h3>
              <p className="text-gray-400 text-sm">Минимизация простоя техники на объектах. Срочный выезд при аварийных остановках.</p>
            </div>
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded hover:border-[#FFC000]/30 transition-colors">
              <Wrench className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Горнодобывающий сектор</h3>
              <p className="text-gray-400 text-sm">Обслуживание карьерных экскаваторов и буровых установок в удаленных локациях.</p>
            </div>
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded hover:border-[#FFC000]/30 transition-colors">
              <Truck className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Дорожно-строительные управления</h3>
              <p className="text-gray-400 text-sm">Плановое ТО и капитальный ремонт гидравлики автогрейдеров, катков и асфальтоукладчиков.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Process - Engineering Logic */}
      <section className="py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <h2 className="font-bebas text-3xl md:text-4xl mb-6 uppercase sticky top-24">
                Как мы работаем: <br/>
                <span className="text-[#FFC000]">Инженерный подход</span>
              </h2>
            </div>
            <div className="md:w-2/3 space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#1a1a1a] border border-[#FFC000]/20 rounded-full flex items-center justify-center text-[#FFC000] font-bebas text-xl">01</div>
                <div>
                  <h3 className="font-bebas text-2xl mb-2">Входная диагностика</h3>
                  <p className="text-gray-400">Инженер проводит замеры давления, потока (Flow-test) и температуры. Используем цифровые гидротестеры Parker. Локализуем неисправность без "гадания".</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#1a1a1a] border border-[#FFC000]/20 rounded-full flex items-center justify-center text-[#FFC000] font-bebas text-xl">02</div>
                <div>
                  <h3 className="font-bebas text-2xl mb-2">Дефектовка и согласование</h3>
                  <p className="text-gray-400">Разбираем узел, составляем дефектовочную ведомость с фотоотчетом. Предоставляем смету с артикулами запчастей. Работаем только после подписания договора.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#1a1a1a] border border-[#FFC000]/20 rounded-full flex items-center justify-center text-[#FFC000] font-bebas text-xl">03</div>
                <div>
                  <h3 className="font-bebas text-2xl mb-2">Ремонт и монтаж</h3>
                  <p className="text-gray-400">Замена уплотнений, шлифовка, притирка или замена качающих узлов. Сборка с соблюдением моментов затяжки.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#1a1a1a] border border-[#FFC000]/20 rounded-full flex items-center justify-center text-[#FFC000] font-bebas text-xl">04</div>
                <div>
                  <h3 className="font-bebas text-2xl mb-2">Пусконаладка и испытания</h3>
                  <p className="text-gray-400">Настройка клапанов под рабочие параметры. Испытание под нагрузкой в реальных условиях. Сдача техники главному механику.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us - B2B Benefits */}
      <section className="py-16 bg-[#111]">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase text-center">
            Почему с нами работают <span className="text-[#FFC000]">крупные заказчики</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-[#1a1a1a] rounded border-l-2 border-[#FFC000]">
              <FileText className="w-8 h-8 text-[#FFC000] mb-4" />
              <h4 className="font-bold mb-2">Полный пакет документов</h4>
              <p className="text-sm text-gray-400">Договор, АВР, ЭСФ, НДС. Прозрачная бухгалтерия.</p>
            </div>
            <div className="p-6 bg-[#1a1a1a] rounded border-l-2 border-[#FFC000]">
              <Clock className="w-8 h-8 text-[#FFC000] mb-4" />
              <h4 className="font-bold mb-2">Скорость реакции</h4>
              <p className="text-sm text-gray-400">Время прибытия согласуем с учётом местонахождения техники.</p>
            </div>
            <div className="p-6 bg-[#1a1a1a] rounded border-l-2 border-[#FFC000]">
              <ShieldCheck className="w-8 h-8 text-[#FFC000] mb-4" />
              <h4 className="font-bold mb-2">Гарантия на работы</h4>
              <p className="text-sm text-gray-400">Срок и условия гарантии указываем в договоре.</p>
            </div>
            <div className="p-6 bg-[#1a1a1a] rounded border-l-2 border-[#FFC000]">
              <Truck className="w-8 h-8 text-[#FFC000] mb-4" />
              <h4 className="font-bold mb-2">Мобильная мастерская</h4>
              <p className="text-sm text-gray-400">Все необходимое оборудование всегда с собой в сервисном авто.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Placeholder */}
      <section className="py-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-bebas text-3xl md:text-4xl uppercase">
              Выполненные <span className="text-[#FFC000]">проекты</span>
            </h2>
            <Link href="/cases" className="hidden md:flex items-center text-[#FFC000] hover:text-white transition-colors">
              Все кейсы <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {/* Case 2 - Caterpillar 336 D2 */}
            <div className="group bg-[#1a1a1a] border border-white/5 hover:border-[#FFC000]/50 transition-all overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Gallery */}
                <div className="h-64 md:h-auto bg-gray-800 relative overflow-hidden">
                  <img src="/images/cases/cat-336/main.webp" alt="Caterpillar 336 D2" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-[#FFC000] text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">Кейс</div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="font-bebas text-3xl mb-4 group-hover:text-[#FFC000] transition-colors">
                    Ремонт экскаватора Caterpillar 336 D2
                  </h3>

                  <div className="grid grid-cols-4 gap-2 mb-6">
                    <div className="aspect-square overflow-hidden rounded border border-white/10 cursor-pointer hover:border-[#FFC000] transition-colors">
                      <img src="/images/cases/cat-336/hydraulics.webp" alt="Гидравлика" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="aspect-square overflow-hidden rounded border border-white/10 cursor-pointer hover:border-[#FFC000] transition-colors">
                      <img src="/images/cases/cat-336/repair.webp" alt="Ремонт" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="aspect-square overflow-hidden rounded border border-white/10 cursor-pointer hover:border-[#FFC000] transition-colors">
                      <img src="/images/cases/cat-336/rear.webp" alt="Вид сзади" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="aspect-square overflow-hidden rounded border border-white/10 cursor-pointer hover:border-[#FFC000] transition-colors">
                      <img src="/images/cases/cat-336/side.webp" alt="Вид сбоку" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-gray-300">
                    <div>
                      <span className="text-[#FFC000] font-bold uppercase text-xs tracking-wider block mb-1">Симптомы:</span>
                      <p>Потеря мощности, глохнет под нагрузкой. Запаздывание одной гусеницы. Отсутствие давления одного насоса.</p>
                    </div>

                    <div>
                      <span className="text-[#FFC000] font-bold uppercase text-xs tracking-wider block mb-1">Диагностика выявила:</span>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        <li>Проблемы в электроцепи и датчиках (давления, вентилятора, температуры, коленвала).</li>
                        <li>Неисправность серворегулятора (открутился поршень).</li>
                        <li>Разбито посадочное место в насосе.</li>
                      </ul>
                    </div>

                    <div>
                      <span className="text-[#FFC000] font-bold uppercase text-xs tracking-wider block mb-1">Выполненные работы:</span>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        <li>Восстановление электропроводки и замена датчиков.</li>
                        <li>Ремонт серворегуляторов.</li>
                        <li>Токарные работы по восстановлению посадочного места насоса (замена втулки).</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case 1 - Hitachi 330 5G */}
            <div className="group bg-[#1a1a1a] border border-white/5 hover:border-[#FFC000]/50 transition-all overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Gallery */}
                <div className="h-64 md:h-auto bg-gray-800 relative overflow-hidden">
                  <img src="/images/cases/hitachi-330/main-new.webp" alt="Hitachi 330 5G" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute top-4 left-4 bg-[#FFC000] text-black px-3 py-1 text-xs font-bold uppercase tracking-wider">Кейс</div>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <h3 className="font-bebas text-3xl mb-4 group-hover:text-[#FFC000] transition-colors">
                    Ремонт гидросистемы Hitachi 330 5G
                  </h3>

                  <div className="grid grid-cols-4 gap-2 mb-6">
                    <div className="aspect-square overflow-hidden rounded border border-white/10 cursor-pointer hover:border-[#FFC000] transition-colors">
                      <img src="/images/cases/hitachi-330/display.webp" alt="Диагностика" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="aspect-square overflow-hidden rounded border border-white/10 cursor-pointer hover:border-[#FFC000] transition-colors">
                      <img src="/images/cases/hitachi-330/repair1.webp" alt="Ремонт насоса" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="aspect-square overflow-hidden rounded border border-white/10 cursor-pointer hover:border-[#FFC000] transition-colors">
                      <img src="/images/cases/hitachi-330/parts.webp" alt="Запчасти" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="aspect-square overflow-hidden rounded border border-white/10 cursor-pointer hover:border-[#FFC000] transition-colors">
                      <img src="/images/cases/hitachi-330/repair1.webp" alt="Процесс" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>

                  <div className="space-y-4 text-sm text-gray-300">
                    <div>
                      <span className="text-[#FFC000] font-bold uppercase text-xs tracking-wider block mb-1">Симптомы:</span>
                      <p>При нагрузке глохнет двигатель. Одна гусеница забегает вперед. Стрела поднимается рывками.</p>
                    </div>

                    <div>
                      <span className="text-[#FFC000] font-bold uppercase text-xs tracking-wider block mb-1">Диагностика выявила:</span>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        <li>Выход из строя пилотного распределителя.</li>
                        <li>Поломка клапана сумматора потоков.</li>
                        <li>Разрушение основного насоса (оторвало шкив на планшайбе).</li>
                        <li>Стружка во всей гидравлической системе.</li>
                      </ul>
                    </div>

                    <div>
                      <span className="text-[#FFC000] font-bold uppercase text-xs tracking-wider block mb-1">Выполненные работы:</span>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        <li>Замена пилотного распределителя и клапана сумматора.</li>
                        <li>Полная промывка гидравлической системы.</li>
                        <li>Капитальный ремонт основного насоса (замена качающего узла и планшайбы).</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#FFC000] text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bebas font-bold text-4xl md:text-5xl mb-6 uppercase">
            Нужен профессиональный ремонт гидравлики?
          </h2>
          <p className="text-xl font-medium mb-8 max-w-2xl mx-auto">
            Оставьте заявку сейчас. Инженер свяжется с вами для уточнения деталей и расчета стоимости выезда.
          </p>
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-black text-white hover:bg-gray-900 font-bebas font-bold text-xl h-16 px-12 rounded uppercase tracking-wide shadow-xl"
          >
            Оставить заявку
          </Button>
        </div>
      </section>

      {/* B2B Lead Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-[#1a1a1a] border border-white/10 text-white sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-[#FFC000] uppercase tracking-wide">
              Заявка на сервисное обслуживание
            </DialogTitle>
          </DialogHeader>

          <B2BLeadForm />
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}
