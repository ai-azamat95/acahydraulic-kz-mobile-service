import { Button } from "@/components/ui/button";
import { Phone, CheckCircle2, Wrench, Settings } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function GraderRepair() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#FFC000]">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/services" className="hover:text-[#FFC000]">Услуги</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Ремонт грейдеров</span>
      </div>

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
              Профессиональный ремонт <br/>
              <span className="text-[#FFC000]">грейдеров</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Восстановление гидравлических систем. Работаем по договору с НДС. Выездной сервис на объекты по всему Казахстану.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-lg h-14 px-8 rounded uppercase tracking-wide"
              >
                Заказать диагностику
              </Button>
              <a href="tel:+77714177925" onClick={() => { if (typeof window.gtag === 'function') { window.gtag('event', 'acahydraulic_phone_click', { event_category: 'phone', event_label: 'tel:+77714177925', link_url: 'tel:+77714177925', transport_type: 'beacon' }); } }}>
                <Button variant="outline" className="h-14 px-8 rounded font-bebas font-bold text-lg uppercase tracking-wide border-white/20 hover:border-[#FFC000] hover:text-[#FFC000]">
                  <Phone className="mr-2" size={20} />
                  +7 (771) 417-79-25
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 border-b border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas font-bold text-3xl md:text-5xl uppercase mb-12">
            Что мы <span className="text-[#FFC000]">ремонтируем</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[#1a1a1a] p-6 rounded border border-white/10 hover:border-[#FFC000]/30 transition-colors">
              <Wrench className="text-[#FFC000] mb-4" size={32} />
              <h3 className="font-bebas text-2xl uppercase mb-3">Гидравлическая система</h3>
              <p className="text-gray-400 leading-relaxed">
                Насосы, распределители, гидроцилиндры. Устранение утечек, восстановление рабочих параметров.
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded border border-white/10 hover:border-[#FFC000]/30 transition-colors">
              <Settings className="text-[#FFC000] mb-4" size={32} />
              <h3 className="font-bebas text-2xl uppercase mb-3">Системы управления</h3>
              <p className="text-gray-400 leading-relaxed">
                Гидромоторы, клапаны, датчики. Диагностика и капитальный ремонт гидрокомпонентов.
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded border border-white/10 hover:border-[#FFC000]/30 transition-colors">
              <CheckCircle2 className="text-[#FFC000] mb-4" size={32} />
              <h3 className="font-bebas text-2xl uppercase mb-3">Работа по договору</h3>
              <p className="text-gray-400 leading-relaxed">
                Официальное оформление с НДС. Полный пакет документов для юридических лиц.
              </p>
            </div>

            <div className="bg-[#1a1a1a] p-6 rounded border border-white/10 hover:border-[#FFC000]/30 transition-colors">
              <Wrench className="text-[#FFC000] mb-4" size={32} />
              <h3 className="font-bebas text-2xl uppercase mb-3">Выездной сервис</h3>
              <p className="text-gray-400 leading-relaxed">
                Мобильные бригады выезжают на объекты. Ремонт на месте. Минимизация простоев техники.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bebas font-bold text-3xl md:text-5xl uppercase mb-6">
            Готовы начать <span className="text-[#FFC000]">сотрудничество?</span>
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-lg h-14 px-8 rounded uppercase tracking-wide"
            >
              Заказать диагностику
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-[#1a1a1a] text-white border-white/10">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl uppercase">Заказать диагностику</DialogTitle>
          </DialogHeader>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Ваше имя</Label>
              <Input id="name" className="bg-[#111111] border-white/10" />
            </div>
            <div>
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" type="tel" className="bg-[#111111] border-white/10" />
            </div>
            <div>
              <Label htmlFor="equipment">Модель техники</Label>
              <Input id="equipment" className="bg-[#111111] border-white/10" />
            </div>
            <div>
              <Label htmlFor="issue">Описание проблемы</Label>
              <Textarea id="issue" className="bg-[#111111] border-white/10" rows={4} />
            </div>
            <Button type="submit" className="w-full bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-lg h-12 uppercase">
              Отправить заявку
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
