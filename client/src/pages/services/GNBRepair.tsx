import { Button } from "@/components/ui/button";
import { Phone, CheckCircle2, Wrench, AlertTriangle, Settings, Gauge, Droplet, Thermometer, Zap } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function GNBRepair() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#111111] text-white font-roboto pt-20">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-4 py-4 text-sm text-gray-500">
        <Link href="/" className="hover:text-[#FFC000]">Главная</Link>
        <span className="mx-2">/</span>
        <Link href="/services" className="hover:text-[#FFC000]">Услуги</Link>
        <span className="mx-2">/</span>
        <span className="text-white">Ремонт ГНБ установок</span>
      </div>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-[#1a1a1a]">
           <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/70 z-10"></div>
           <div className="absolute inset-0 opacity-40 bg-cover bg-center" style={{backgroundImage: "url('https://private-us-east-1.manuscdn.com/sessionFile/qTqqkhQQWHtkSbR4kERHSj/sandbox/E5cf2giz0crfm3TbfcErdU-img-1_1771348825000_na1fn_YmctZ25iLWRyaWxsaW5n.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvcVRxcWtoUVFXSHRrU2JSNGtFUkhTai9zYW5kYm94L0U1Y2YyZ2l6MGNyZm0zVGJmY0VyZFUtaW1nLTFfMTc3MTM0ODgyNTAwMF9uYTFmbl9ZbWN0WjI1aUxXUnlhV3hzYVc1bi5qcGc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=awYgpXKI274BBNxuwmNU4k3rnEprMNFtzI0wSyrQfA4dfRV2xGtepl3tkMcRag58nf8ewe1TRGA5uICmpIqfqV8U4qEIrJz5EpXWVnq-2tK-Jmjp-cOxQDu~-ztKZsJLrcI1wOQbmIgD8ecDermkBiuJ~6zUPQjRpiQrwQiHpt5edTvZLxhp755JCTpXOoETwVmApkx4~gD0rkmLi8BYyopbTZ4oyJskcaqv3BO77l1EkWn-kUh0dR06JhpedL1SywtMNpXI4Tiyn8RFd42eej9NCaoi2efnJIBx0aTQBwwvKfni0YBx-2LmBkFgtFsbGIztN0JFanGOvKjJiyMBjA__')"}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFC000]/10 border border-[#FFC000]/20 rounded text-[#FFC000] text-xs font-bold uppercase tracking-widest mb-6">
              <Settings size={14} />
              Специализированный сервис
            </div>
            <h1 className="font-bebas font-bold text-4xl md:text-6xl leading-[0.95] mb-6 uppercase">
              Профессиональный ремонт установок <br/>
              <span className="text-[#FFC000]">горизонтально-направленного бурения</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              Инженерная диагностика гидравлических систем ГНБ. Работаем по договору с НДС. Минимизация простоев оборудования.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setIsFormOpen(true)}
                className="bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-lg h-14 px-8 rounded uppercase tracking-wide"
              >
                Получить техническую консультацию
              </Button>
              <a href="tel:+77714177925" onClick={() => window.gtag('event', 'conversion', {'send_to': 'AW-17847190636/gJzYCKDa2vgbEOyImr5C'})} className="flex items-center justify-center gap-3 px-8 h-14 border border-white/20 rounded hover:bg-white/5 transition-colors">
                <Phone className="text-[#FFC000]" />
                <span className="font-bebas text-lg tracking-wide">+7 (771) 417-79-25</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-16 bg-[#0a0a0a] border-b border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase">
            Типичные неисправности <span className="text-[#FFC000]">ГНБ установок</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded hover:border-[#FFC000]/30 transition-colors">
              <Gauge className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Потеря давления</h3>
              <p className="text-gray-400 text-sm">Падение рабочего давления в гидросистеме. Снижение производительности бурения.</p>
            </div>
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded hover:border-[#FFC000]/30 transition-colors">
              <Droplet className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Утечки гидравлики</h3>
              <p className="text-gray-400 text-sm">Течь масла из гидроцилиндров, шлангов высокого давления и соединений.</p>
            </div>
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded hover:border-[#FFC000]/30 transition-colors">
              <AlertTriangle className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Не держит зажим</h3>
              <p className="text-gray-400 text-sm">Проскальзывание штанг в зажимном механизме. Невозможность передачи крутящего момента.</p>
            </div>
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded hover:border-[#FFC000]/30 transition-colors">
              <Thermometer className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Перегрев насоса</h3>
              <p className="text-gray-400 text-sm">Критическое повышение температуры гидронасоса. Риск выхода из строя.</p>
            </div>
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded hover:border-[#FFC000]/30 transition-colors">
              <Zap className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Ошибки системы управления</h3>
              <p className="text-gray-400 text-sm">Сбои электро-гидравлического управления. Некорректная работа датчиков.</p>
            </div>
            <div className="bg-[#1a1a1a] p-6 border border-white/5 rounded hover:border-[#FFC000]/30 transition-colors">
              <Wrench className="w-10 h-10 text-[#FFC000] mb-4" />
              <h3 className="font-bebas text-xl mb-2">Износ распределителей</h3>
              <p className="text-gray-400 text-sm">Заклинивание золотников. Медленная реакция на команды оператора.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-16 bg-[#111111]">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase">
            Наши решения для <span className="text-[#FFC000]">восстановления ГНБ</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#FFC000]" />
                </div>
                <div>
                  <h3 className="font-bebas text-2xl mb-2">Диагностика на объекте</h3>
                  <p className="text-gray-400">Выезд инженера с диагностическим оборудованием. Определение причины неисправности за 2-4 часа.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#FFC000]" />
                </div>
                <div>
                  <h3 className="font-bebas text-2xl mb-2">Восстановление гидросистемы</h3>
                  <p className="text-gray-400">Замена уплотнений, ремонт гидроцилиндров, устранение утечек. Восстановление рабочих параметров.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#FFC000]" />
                </div>
                <div>
                  <h3 className="font-bebas text-2xl mb-2">Ремонт насосов и моторов</h3>
                  <p className="text-gray-400">Капитальный ремонт гидронасосов и гидромоторов. Замена изношенных пар трения.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#FFC000]" />
                </div>
                <div>
                  <h3 className="font-bebas text-2xl mb-2">Ремонт распределителей</h3>
                  <p className="text-gray-400">Восстановление гидрораспределителей. Замена золотников и уплотнительных элементов.</p>
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a1a] p-8 border border-white/5 rounded">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFC000]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-[#FFC000]" />
                </div>
                <div>
                  <h3 className="font-bebas text-2xl mb-2">Регулировка давления</h3>
                  <p className="text-gray-400">Настройка предохранительных клапанов. Калибровка системы под рабочие параметры.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-[#0a0a0a] border-t border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="font-bebas text-3xl md:text-4xl mb-10 uppercase text-center">
            Почему выбирают <span className="text-[#FFC000]">ACA Hydraulic</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#FFC000]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#FFC000]" />
              </div>
              <h3 className="font-bebas text-xl mb-2">Работаем по договору</h3>
              <p className="text-gray-400 text-sm">Официальное оформление. Прозрачные условия сотрудничества.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#FFC000]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#FFC000]" />
              </div>
              <h3 className="font-bebas text-xl mb-2">НДС</h3>
              <p className="text-gray-400 text-sm">Работаем с НДС. Полный пакет документов для бухгалтерии.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#FFC000]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#FFC000]" />
              </div>
              <h3 className="font-bebas text-xl mb-2">Инженерная диагностика</h3>
              <p className="text-gray-400 text-sm">Точное определение причины неисправности. Без «методом тыка».</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#FFC000]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#FFC000]" />
              </div>
              <h3 className="font-bebas text-xl mb-2">Фотоотчёт</h3>
              <p className="text-gray-400 text-sm">Документирование всех этапов работ. Отчёт о выполненных работах.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#FFC000]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#FFC000]" />
              </div>
              <h3 className="font-bebas text-xl mb-2">Минимизация простоев</h3>
              <p className="text-gray-400 text-sm">Срочный выезд. Ремонт на объекте без транспортировки оборудования.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 rounded-full bg-[#FFC000]/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-[#FFC000]" />
              </div>
              <h3 className="font-bebas text-xl mb-2">Опыт работы с ГНБ</h3>
              <p className="text-gray-400 text-sm">Специализация на буровом оборудовании. Знание специфики ГНБ установок.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#111111] border-t border-white/5">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-bebas text-3xl md:text-5xl mb-6 uppercase">
              Нужна диагностика <span className="text-[#FFC000]">ГНБ установки?</span>
            </h2>
            <p className="text-gray-300 text-lg mb-8">
              Оставьте заявку — инженер свяжется с вами в течение 30 минут для уточнения деталей
            </p>
            <Button 
              onClick={() => setIsFormOpen(true)}
              className="bg-[#FFC000] hover:bg-[#E6AC00] text-black font-bebas font-bold text-xl h-16 px-12 rounded uppercase tracking-wide"
            >
              Оставить заявку на диагностику
            </Button>
          </div>
        </div>
      </section>

      {/* Request Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="bg-[#1a1a1a] border border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bebas text-2xl text-[#FFC000]">Заявка на диагностику ГНБ</DialogTitle>
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
              <Label htmlFor="equipment" className="text-gray-300">Марка ГНБ установки</Label>
              <Input id="equipment" placeholder="Vermeer D24x40" className="bg-[#111] border-white/10 text-white" />
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
