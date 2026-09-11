import React, { useState } from 'react';
import { Send, Paperclip, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

interface B2BLeadFormProps {
  onSuccess?: () => void;
}

const DIAGNOSTIC_PRICE = 'от 200 000 ₸';
const DIAGNOSTIC_VALUE = 200000;
const GOOGLE_ADS_QUALIFIED_LEAD = 'AW-17847190636/JZkfCOu_84McEOyImr5C';

const B2BLeadForm = ({ onSuccess }: B2BLeadFormProps = {}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    whatsapp: '',
    location: '',
    model: '',
    company: '',
    bin: '',
    equipmentType: '',
    urgency: '',
    problem: '',
  });
  const [budgetAccepted, setBudgetAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!budgetAccepted) {
      toast.error('Подтвердите стоимость выездной диагностики');
      return;
    }

    setIsSubmitting(true);

    if (formData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Укажите телефон с кодом города или оператора');
      setIsSubmitting(false);
      return;
    }

    const labels: Record<string, string> = {
      excavator: 'Экскаватор',
      loader: 'Погрузчик',
      crane: 'Автокран',
      bulldozer: 'Бульдозер',
      drilling: 'Буровая установка',
      other: 'Другое',
      emergency: 'Срочно',
      planned: 'Плановый ремонт',
      maintenance: 'Техническое обслуживание',
      tender: 'Запрос КП',
    };

    const messageLines = [
      'Здравствуйте! Нужна выездная диагностика ACA Hydraulic.',
      `Стоимость диагностики ${DIAGNOSTIC_PRICE}: ПОДТВЕРЖДЕНА`,
      '',
      `Контактное лицо: ${formData.name}`,
      `Телефон: ${formData.phone}`,
      `Местонахождение: ${formData.location}`,
      `Марка и модель: ${formData.model}`,
      formData.company ? `Компания: ${formData.company}` : '',
      formData.bin ? `БИН: ${formData.bin}` : '',
      formData.email ? `Email: ${formData.email}` : '',
      formData.whatsapp ? `WhatsApp: ${formData.whatsapp}` : '',
      formData.equipmentType ? `Тип техники: ${labels[formData.equipmentType] || formData.equipmentType}` : '',
      formData.urgency ? `Срочность: ${labels[formData.urgency] || formData.urgency}` : '',
      formData.problem ? `Проблема: ${formData.problem}` : '',
      `Страница: ${window.location.href}`,
      '',
      'Могу отправить фото шильдика и видео работы техники.',
    ].filter(Boolean);

    const qualifiedParams = {
      lead_type: 'qualified_b2b_form',
      diagnostic_price: DIAGNOSTIC_VALUE,
      value: DIAGNOSTIC_VALUE,
      currency: 'KZT',
      budget_confirmed: true,
      equipment_type: formData.equipmentType || 'unknown',
      model: formData.model,
      location: formData.location,
    };

    if (typeof window !== 'undefined') {
      (window as any).gtag?.('event', 'b2b_budget_accepted', qualifiedParams);
      (window as any).gtag?.('event', 'qualified_lead', qualifiedParams);
      (window as any).gtag?.('event', 'generate_lead', qualifiedParams);
      (window as any).gtag?.('event', 'conversion', {
        send_to: GOOGLE_ADS_QUALIFIED_LEAD,
        value: DIAGNOSTIC_VALUE,
        currency: 'KZT',
      });
      (window as any).ttq?.track?.('SubmitForm', {
        content_type: 'service',
        content_name: 'Квалифицированная B2B заявка на выездную диагностику',
        value: DIAGNOSTIC_VALUE,
        currency: 'KZT',
      });
    }

    const whatsappUrl = `https://wa.me/77714177925?text=${encodeURIComponent(messageLines.join('\n'))}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

    toast.info('Квалифицированная заявка подготовлена', {
      description: 'Отправьте сообщение в WhatsApp. В нём уже отмечено подтверждение стоимости диагностики.',
    });
    setIsSubmitting(false);
    onSuccess?.();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-[#FFB800]/20 shadow-xl bg-white dark:bg-zinc-900">
      <CardHeader className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Building2 className="text-[#FFB800]" />
          Заявка на выездную диагностику
        </CardTitle>
        <CardDescription>
          Укажите технику и место работ. Ремонт и запчасти рассчитываются отдельно после диагностики.
        </CardDescription>
        <div className="mt-3 rounded-lg border border-[#FFB800]/40 bg-[#FFB800]/10 p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="font-semibold text-zinc-900 dark:text-white">Выездная комплексная диагностика</span>
            <strong className="text-xl text-[#B87900] dark:text-[#FFB800]">{DIAGNOSTIC_PRICE}</strong>
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
            Стоимость зависит от местонахождения и характера неисправности. Выезд за пределы города, ремонт и запчасти согласуются отдельно.
          </p>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="location">Где находится техника? *</Label><Input id="location" required placeholder="Город, посёлок или объект" value={formData.location} onChange={e => setFormData({...formData, location:e.target.value})} /></div>
            <div className="space-y-2"><Label htmlFor="model">Марка и модель *</Label><Input id="model" required placeholder="Например, Hitachi ZX330" value={formData.model} onChange={e => setFormData({...formData, model:e.target.value})} /></div>
          </div>

          <details className="rounded border p-3">
            <summary className="cursor-pointer">Реквизиты компании (необязательно)</summary>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div className="space-y-2"><Label htmlFor="company">Название компании</Label><Input id="company" placeholder="ТОО «СтройМашСервис»" value={formData.company} onChange={e => setFormData({...formData, company:e.target.value})} className="bg-zinc-50 dark:bg-zinc-950" /></div>
              <div className="space-y-2"><Label htmlFor="bin">БИН (опционально)</Label><Input id="bin" placeholder="Для выставления счета" value={formData.bin} onChange={e => setFormData({...formData, bin:e.target.value})} className="bg-zinc-50 dark:bg-zinc-950" /></div>
            </div>
          </details>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="name">Контактное лицо *</Label><Input id="name" required placeholder="Имя" value={formData.name} onChange={e => setFormData({...formData, name:e.target.value})} className="bg-zinc-50 dark:bg-zinc-950" /></div>
            <div className="space-y-2"><Label htmlFor="phone">Телефон *</Label><Input id="phone" type="tel" required placeholder="+7 (777) 000-00-00" value={formData.phone} onChange={e => setFormData({...formData, phone:e.target.value})} className="bg-zinc-50 dark:bg-zinc-950" /></div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="email">Email (опционально)</Label><Input id="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email:e.target.value})} className="bg-zinc-50 dark:bg-zinc-950" /></div>
            <div className="space-y-2"><Label htmlFor="whatsapp">WhatsApp (опционально)</Label><Input id="whatsapp" type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp:e.target.value})} className="bg-zinc-50 dark:bg-zinc-950" /></div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Тип техники</Label>
              <Select value={formData.equipmentType} onValueChange={value => setFormData({...formData, equipmentType:value})}>
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950"><SelectValue placeholder="Выберите тип" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="excavator">Экскаватор</SelectItem><SelectItem value="loader">Погрузчик</SelectItem><SelectItem value="crane">Автокран</SelectItem><SelectItem value="bulldozer">Бульдозер</SelectItem><SelectItem value="drilling">Буровая установка</SelectItem><SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Срочность</Label>
              <Select value={formData.urgency} onValueChange={value => setFormData({...formData, urgency:value})}>
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950"><SelectValue placeholder="Выберите приоритет" /></SelectTrigger>
                <SelectContent><SelectItem value="emergency">Срочно</SelectItem><SelectItem value="planned">Плановый ремонт</SelectItem><SelectItem value="maintenance">Техническое обслуживание</SelectItem><SelectItem value="tender">Тендер / Запрос КП</SelectItem></SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2"><Label htmlFor="problem">Описание проблемы</Label><Textarea id="problem" placeholder="Например: после прогрева падает давление, машина теряет мощность..." className="min-h-[100px] bg-zinc-50 dark:bg-zinc-950" value={formData.problem} onChange={e => setFormData({...formData, problem:e.target.value})} /></div>

          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30 text-sm text-blue-700 dark:text-blue-300">
            <Paperclip className="w-5 h-5 shrink-0" /><div><span className="font-semibold">Фото шильдика и видео неисправности</span><br/>Их можно отправить сразу после перехода в WhatsApp.</div>
          </div>

          <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${budgetAccepted ? 'border-green-500/50 bg-green-50 dark:bg-green-950/20' : 'border-amber-300 bg-amber-50 dark:bg-amber-950/20'}`}>
            <input type="checkbox" checked={budgetAccepted} onChange={e => setBudgetAccepted(e.target.checked)} className="mt-1 h-5 w-5 accent-[#FFB800]" />
            <div>
              <div className="font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                {budgetAccepted ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
                Стоимость диагностики мне понятна
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">Подтверждаю, что выездная комплексная диагностика начинается {DIAGNOSTIC_PRICE}. Ремонт, запчасти и дополнительные расходы согласуются отдельно.</p>
            </div>
          </label>

          <Button type="submit" className="w-full bg-[#FFB800] text-black hover:bg-[#FFB800]/90 font-bold text-lg h-12 disabled:opacity-50" disabled={isSubmitting || !budgetAccepted}>
            {isSubmitting ? 'Подготовка...' : <span className="flex items-center gap-2">ПОДТВЕРДИТЬ И ПЕРЕЙТИ В WHATSAPP <Send className="w-5 h-5" /></span>}
          </Button>

          {!budgetAccepted && <p className="text-xs text-center text-amber-700 dark:text-amber-400">Чтобы продолжить, подтвердите минимальную стоимость диагностики.</p>}
          <p className="text-xs text-center text-muted-foreground">Заявка считается отправленной после отправки подготовленного сообщения в WhatsApp.</p>
          <p className="text-xs text-center text-muted-foreground">Нажимая кнопку, вы передаёте указанные сведения в WhatsApp для обработки обращения. <a href="/privacy/" className="underline">Политика конфиденциальности</a>.</p>
        </form>
      </CardContent>
    </Card>
  );
};

export default B2BLeadForm;
