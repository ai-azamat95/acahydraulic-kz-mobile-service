import { Button } from "@/components/ui/button";
import { Phone, CheckCircle2, Wrench, HardHat, Settings, Gauge, Droplet, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function BulldozerRepair() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#FFC000]">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/services" className="hover:text-[#FFC000]">Услуги</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Ремонт бульдозеров</span>
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
              <HardHat size={14} />
              Тяжелая техника
            </div>
            <h1 className="font-bebas font-bold text-4xl md:text-6xl leading-[0.95] mb-6 uppercase">
              Ремонт гидравлики <br/>
              <span className="text-[#FFC000]">бульдозеров</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Восстановление гидросистем бульдозеров всех марок. Ремонт насосов, распределителей, гидроцилиндров. Выездная диагностика на объекте.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-lg h-14 px-8 rounded uppercase tracking-wide"
              >
                Заказать диагностику
              </Button>
              <a href="tel:+77714177925" className="flex items-center justify-center gap-3 px-8 h-14 border border-white/20 rounded hover:bg-white/5 transition-colors">
                <Phone className="text-[#FFC000]" />
                <span className="font-bebas text-lg tracking-wide">+7 (771) 417-79-25</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Types */}
      <section className="py-16 bg-[#0a0a0a] border-b border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase">
            Работаем с <span className="text-[#FFC000]">ведущими марками</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded text-center hover:border-[#FFC000]/30 transition-colors">
              <h3 className="font-bebas text-2xl text-[#FFC000]">Caterpillar</h3>
              <p className="text-gray-500 text-sm mt-1">D6, D7, D8, D9</p>
            </div>
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded text-center hover:border-[#FFC000]/30 transition-colors">
              <h3 className="font-bebas text-2xl text-[#FFC000]">Komatsu</h3>
              <p className="text-gray-500 text-sm mt-1">D65, D85, D155</p>
            </div>
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded text-center hover:border-[#FFC000]/30 transition-colors">
              <h3 className="font-bebas text-2xl text-[#FFC000]">Shantui</h3>
              <p className="text-gray-500 text-sm mt-1">SD16, SD22, SD32</p>
            </div>
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded text-center hover:border-[#FFC000]/30 transition-colors">
              <h3 className="font-bebas text-2xl text-[#FFC000]">Liebherr</h3>
              <p className="text-gray-500 text-sm mt-1">PR, PRP серии</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hydraulic Systems */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase">
            Ремонт <span className="text-[#FFC000]">гидравлических систем</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <Gauge className="w-12 h-12 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-2xl mb-3">Гидравлические насосы</h3>
              <p className="text-gray-400 mb-4">Ремонт и восстановление аксиально-поршневых насосов. Замена изношенных пар трения. Регулировка производительности.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Диагностика износа
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Замена подшипников и уплотнений
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Проверка на стенде
                </li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <Settings className="w-12 h-12 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-2xl mb-3">Гидрораспределители</h3>
              <p className="text-gray-400 mb-4">Восстановление распределительных блоков. Замена золотников. Устранение заклинивания секций.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Разборка и дефектовка
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Замена изношенных элементов
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Настройка давления
                </li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <Wrench className="w-12 h-12 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-2xl mb-3">Гидроцилиндры</h3>
              <p className="text-gray-400 mb-4">Ремонт гидроцилиндров отвала и рыхлителя. Замена штоков, уплотнений, восстановление хромированных поверхностей.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Устранение течей
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Хромирование штоков
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Гидроиспытания
                </li>
              </ul>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <Droplet className="w-12 h-12 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-2xl mb-3">Гидромоторы</h3>
              <p className="text-gray-400 mb-4">Капитальный ремонт гидромоторов хода. Восстановление крутящего момента. Замена изношенных деталей.</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Проверка герметичности
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Замена блока цилиндров
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#FFC000] flex-shrink-0" />
                  Балансировка
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-16 bg-[#0a0a0a] border-y border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase">
            Процесс <span className="text-[#FFC000]">выездного ремонта</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="relative">
              <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
                <div className="w-12 h-12 rounded-full bg-[#FFC000] flex items-center justify-center font-bebas text-2xl text-black mb-4">1</div>
                <h3 className="font-bebas text-xl mb-2">Заявка</h3>
                <p className="text-gray-400 text-sm">Принимаем заявку. Уточняем марку техники и характер неисправности.</p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
                <div className="w-12 h-12 rounded-full bg-[#FFC000] flex items-center justify-center font-bebas text-2xl text-black mb-4">2</div>
                <h3 className="font-bebas text-xl mb-2">Диагностика</h3>
                <p className="text-gray-400 text-sm">Выезд инженера на объект. Диагностика гидросистемы. Определение объёма работ.</p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
                <div className="w-12 h-12 rounded-full bg-[#FFC000] flex items-center justify-center font-bebas text-2xl text-black mb-4">3</div>
                <h3 className="font-bebas text-xl mb-2">Ремонт</h3>
                <p className="text-gray-400 text-sm">Выполнение ремонтных работ. Замена изношенных узлов. Регулировка системы.</p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
                <div className="w-12 h-12 rounded-full bg-[#FFC000] flex items-center justify-center font-bebas text-2xl text-black mb-4">4</div>
                <h3 className="font-bebas text-xl mb-2">Сдача</h3>
                <p className="text-gray-400 text-sm">Проверка работоспособности. Фотоотчёт. Оформление документов.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase text-center">
            Преимущества работы <span className="text-[#FFC000]">с ACA Hydraulic</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
              <CheckCircle2 className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Работаем по договору с НДС</h3>
              <p className="text-gray-400 text-sm">Официальное оформление. Полный пакет документов для юридических лиц.</p>
            </div>

            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
              <CheckCircle2 className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Выездные бригады</h3>
              <p className="text-gray-400 text-sm">Ремонт на объекте. Минимизация простоев техники. Работаем по всему Казахстану.</p>
            </div>

            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded">
              <CheckCircle2 className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Технический аудит</h3>
              <p className="text-gray-400 text-sm">Диагностика с применением профессионального оборудования. Точное определение причин.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bebas text-3xl md:text-5xl mb-6 uppercase">
              Требуется ремонт <span className="text-[#FFC000]">бульдозера?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Оставьте заявку — инженер выедет на объект для диагностики в течение 24 часов
            </p>
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-xl h-16 px-12 rounded uppercase tracking-wide"
            >
              Заказать выезд инженера
            </Button>
          </div>
        </div>
      </section>

      {/* Request Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-[#1a1a1a] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-[#FFC000]">Заявка на ремонт бульдозера</DialogTitle>
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
              <Label htmlFor="equipment" className="text-gray-300">Марка бульдозера</Label>
              <Input id="equipment" placeholder="Caterpillar D8" className="bg-[#111] border-white/10 text-white" />
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
