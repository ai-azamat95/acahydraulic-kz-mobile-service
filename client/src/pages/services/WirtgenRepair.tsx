import { Button } from "@/components/ui/button";
import { Phone, CheckCircle2, Wrench, Settings, Gauge, Droplet, Zap, Activity } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function WirtgenRepair() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#FFC000]">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/services" className="hover:text-[#FFC000]">Услуги</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Ремонт дорожных фрез</span>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[#1a1a1a]">
           <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent z-10"></div>
           <div className="absolute inset-0 opacity-20 bg-[url('/images/hero-bg-v4.webp')] bg-cover bg-center"></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFC000]/10 border border-[#FFC000]/20 rounded text-[#FFC000] text-xs font-bold uppercase tracking-widest mb-6">
              <Settings size={14} />
              Специализированный сервис
            </div>
            <h1 className="font-bebas font-bold text-4xl md:text-6xl leading-[0.95] mb-6 uppercase">
              Ремонт дорожных фрез <br/>
              <span className="text-[#FFC000]">Wirtgen и других марок</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Восстановление гидравлики, системы подачи и электро-гидравлического управления дорожно-фрезерных машин. Работаем с Wirtgen, XCMG, Volvo, Caterpillar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-lg h-14 px-8 rounded uppercase tracking-wide"
              >
                Заказать диагностику
              </Button>
              <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } window.gtag('event', 'conversion', {'send_to': 'AW-17847190636/MNy9COmB06QcEOyImr5C'}); }} className="flex items-center justify-center gap-3 px-8 h-14 border border-white/20 rounded hover:bg-white/5 transition-colors">
                <Phone className="text-[#FFC000]" />
                <span className="font-bebas text-lg tracking-wide">+7 (771) 417-79-25</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16 bg-[#0a0a0a] border-b border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase text-center">
            Работаем с <span className="text-[#FFC000]">ведущими производителями</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded text-center hover:border-[#FFC000]/30 transition-colors">
              <h3 className="font-bebas text-3xl text-[#FFC000]">Wirtgen</h3>
              <p className="text-gray-500 text-xs mt-2 uppercase tracking-wider">W серия</p>
            </div>
            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded text-center hover:border-[#FFC000]/30 transition-colors">
              <h3 className="font-bebas text-3xl text-[#FFC000]">XCMG</h3>
              <p className="text-gray-500 text-xs mt-2 uppercase tracking-wider">XM серия</p>
            </div>
            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded text-center hover:border-[#FFC000]/30 transition-colors">
              <h3 className="font-bebas text-3xl text-[#FFC000]">Volvo</h3>
              <p className="text-gray-500 text-xs mt-2 uppercase tracking-wider">MF серия</p>
            </div>
            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded text-center hover:border-[#FFC000]/30 transition-colors">
              <h3 className="font-bebas text-3xl text-[#FFC000]">Caterpillar</h3>
              <p className="text-gray-500 text-xs mt-2 uppercase tracking-wider">PM серия</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hydraulic Systems Focus */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase">
            Специализация: <span className="text-[#FFC000]">Гидравлика и управление</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <Droplet className="w-12 h-12 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-2xl mb-3">Гидравлическая система</h3>
              <p className="text-gray-400 mb-4">Диагностика и ремонт гидросистемы фрезерного барабана. Восстановление рабочего давления. Устранение утечек.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Ремонт гидронасосов
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Восстановление гидромоторов
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Замена гидроцилиндров подъёма
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Ремонт распределителей
                </li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <Activity className="w-12 h-12 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-2xl mb-3">Система подачи</h3>
              <p className="text-gray-400 mb-4">Настройка и ремонт системы подачи воды на фрезерный барабан. Восстановление работоспособности форсунок.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Диагностика насосов подачи
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Прочистка форсунок
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Замена шлангов и фитингов
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Регулировка давления
                </li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <Gauge className="w-12 h-12 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-2xl mb-3">Контроль давления</h3>
              <p className="text-gray-400 mb-4">Калибровка датчиков давления. Настройка предохранительных клапанов. Восстановление рабочих параметров.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Проверка манометров
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Замена датчиков
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Настройка клапанов
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Гидроиспытания
                </li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <Zap className="w-12 h-12 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-2xl mb-3">Электро-гидравлическое управление</h3>
              <p className="text-gray-400 mb-4">Диагностика и ремонт электронных блоков управления. Восстановление связи с гидравлическими исполнительными механизмами.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Диагностика ЭБУ
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Ремонт пропорциональных клапанов
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Замена соленоидов
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Калибровка системы
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Expertise */}
      <section className="py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase text-center">
              Инженерный подход <span className="text-[#FFC000]">к сложной технике</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFC000]/10 flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-[#FFC000]" />
                </div>
                <h3 className="font-bebas text-xl mb-2">Специализация</h3>
                <p className="text-gray-400 text-sm">Работаем исключительно с дорожно-строительной техникой. Знаем специфику фрезерных машин.</p>
              </div>

              <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFC000]/10 flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-[#FFC000]" />
                </div>
                <h3 className="font-bebas text-xl mb-2">Диагностическое оборудование</h3>
                <p className="text-gray-400 text-sm">Используем профессиональные приборы для точной диагностики гидросистем.</p>
              </div>

              <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded text-center">
                <div className="w-16 h-16 rounded-full bg-[#FFC000]/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-[#FFC000]" />
                </div>
                <h3 className="font-bebas text-xl mb-2">Оригинальные запчасти</h3>
                <p className="text-gray-400 text-sm">Работаем с проверенными поставщиками. Гарантия на установленные компоненты.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase text-center">
            Работаем <span className="text-[#FFC000]">на результат</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
              <CheckCircle2 className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Работаем по договору</h3>
              <p className="text-gray-400 text-sm">Официальное оформление с НДС. Полный пакет документов.</p>
            </div>

            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
              <CheckCircle2 className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Выездной сервис</h3>
              <p className="text-gray-400 text-sm">Ремонт на объекте. Минимизация простоев дорожно-строительных работ.</p>
            </div>

            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
              <CheckCircle2 className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Фотоотчёт</h3>
              <p className="text-gray-400 text-sm">Документирование всех этапов. Прозрачность выполненных работ.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bebas text-3xl md:text-5xl mb-6 uppercase">
              Требуется ремонт <span className="text-[#FFC000]">дорожной фрезы?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Оставьте заявку — инженер проведёт диагностику и предложит решение
            </p>
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-xl h-16 px-12 rounded uppercase tracking-wide"
            >
              Заказать диагностику
            </Button>
          </div>
        </div>
      </section>

      {/* Request Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-[#1a1a1a] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-[#FFC000]">Заявка на ремонт дорожной фрезы</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">Ваше имя</Label>
              <Input id="name" placeholder="Иван" className="bg-[#111] border-white/10 text-white" />
            </div>
            <div>
              <Label htmlFor="phone" className="text-gray-300">Телефон</Label>
              <Input id="phone" type="tel" placeholder="+7 (___) ___-__-__" className="bg-[#111] border-white/10 text-white" />
            </div>
            <div>
              <Label htmlFor="equipment" className="text-gray-300">Марка фрезы</Label>
              <Input id="equipment" placeholder="Wirtgen W200" className="bg-[#111] border-white/10 text-white" />
            </div>
            <div>
              <Label htmlFor="problem" className="text-gray-300">Описание проблемы</Label>
              <Textarea id="problem" placeholder="Опишите неисправность..." className="bg-[#111] border-white/10 text-white" rows={3} />
            </div>
            <Button type="submit" className="w-full bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas text-lg h-12">
              Отправить заявку
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
