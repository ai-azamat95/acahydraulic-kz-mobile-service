import React, { useState } from 'react';
import { Send, Paperclip, Building2, Truck, AlertCircle } from 'lucide-react';
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.phone.replace(/\D/g, '').length < 10) {
      toast.error('Укажите телефон с кодом города или оператора');
      setIsSubmitting(false);
      return;
    }
    const labels: Record<string, string> = {excavator:'Экскаватор', loader:'Погрузчик', crane:'Автокран', bulldozer:'Бульдозер', drilling:'Буровая установка', other:'Другое', emergency:'Срочно', planned:'Плановый ремонт', maintenance:'Техническое обслуживание', tender:'Запрос КП'};
    const messageLines = [
      'Здравствуйте! Нужна заявка на ремонт гидравлики с сайта acahydraulic.kz',
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
    ].filter(Boolean);

    const whatsappUrl = `https://wa.me/77714177925?text=${encodeURIComponent(messageLines.join('\n'))}`;

    // Open synchronously from the user action; never wait for advertising scripts.
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    toast.info('Сообщение подготовлено', {
      description: 'Отправьте его в WhatsApp. Если окно не открылось, нажмите кнопку ещё раз. Введённые данные сохранены в форме.',
    });
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-[#FFB800]/20 shadow-xl bg-white dark:bg-zinc-900">
      <CardHeader className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-100 dark:border-zinc-800">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Building2 className="text-[#FFB800]" />
          Заявка на выездной ремонт
        </CardTitle>
        <CardDescription>
          Укажите технику и место работ. Срок и стоимость выезда согласуем в WhatsApp.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label htmlFor="location">Где находится техника? *</Label><Input id="location" required placeholder="Город, посёлок или объект" value={formData.location} onChange={e => setFormData({...formData, location:e.target.value})} /></div>
            <div className="space-y-2"><Label htmlFor="model">Марка и модель *</Label><Input id="model" required placeholder="Например, Hitachi ZX330" value={formData.model} onChange={e => setFormData({...formData, model:e.target.value})} /></div>
          </div>
          <details className="rounded border p-3"><summary className="cursor-pointer">Реквизиты компании (необязательно)</summary>
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            <div className="space-y-2">
              <Label htmlFor="company">Название компании</Label>
              <Input
                id="company"
                placeholder="ТОО «СтройМашСервис»"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="bg-zinc-50 dark:bg-zinc-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bin">БИН (опционально)</Label>
              <Input
                id="bin"
                placeholder="Для выставления счета"
                value={formData.bin}
                onChange={(e) => setFormData({...formData, bin: e.target.value})}
                className="bg-zinc-50 dark:bg-zinc-950"
              />
            </div>
          </div>

          </details>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Контактное лицо *</Label>
              <Input
                id="name"
                placeholder="Иван Петров"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="bg-zinc-50 dark:bg-zinc-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (777) 000-00-00"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-zinc-50 dark:bg-zinc-950"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (опционально)</Label>
              <Input
                id="email"
                type="email"
                placeholder="ivan@company.kz"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-zinc-50 dark:bg-zinc-950"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (опционально)</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+7 (777) 000-00-00"
                value={formData.whatsapp}
                onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                className="bg-zinc-50 dark:bg-zinc-950"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Тип техники</Label>
              <Select value={formData.equipmentType} onValueChange={(value) => setFormData({...formData, equipmentType: value})}>
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950">
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excavator">Экскаватор</SelectItem>
                  <SelectItem value="loader">Погрузчик</SelectItem>
                  <SelectItem value="crane">Автокран</SelectItem>
                  <SelectItem value="bulldozer">Бульдозер</SelectItem>
                  <SelectItem value="drilling">Буровая установка</SelectItem>
                  <SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Срочность</Label>
              <Select value={formData.urgency} onValueChange={(value) => setFormData({...formData, urgency: value})}>
                <SelectTrigger className="bg-zinc-50 dark:bg-zinc-950">
                  <SelectValue placeholder="Выберите приоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emergency" className="text-red-500 font-bold">
                    🔥 Аварийный ремонт (Срочно)
                  </SelectItem>
                  <SelectItem value="planned">Плановый ремонт</SelectItem>
                  <SelectItem value="maintenance">Техническое обслуживание</SelectItem>
                  <SelectItem value="tender">Тендер / Запрос КП</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem">Описание проблемы</Label>
            <Textarea
              id="problem"
              placeholder="Опишите симптомы неисправности (например: пропало давление на горячую, шум в насосе...)"
              className="min-h-[100px] bg-zinc-50 dark:bg-zinc-950"
              value={formData.problem}
              onChange={(e) => setFormData({...formData, problem: e.target.value})}
            />
          </div>

          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30 text-sm text-blue-700 dark:text-blue-300">
            <Paperclip className="w-5 h-5 shrink-0" />
            <div>
              <span className="font-semibold">Есть фото шильдика или дефектовка?</span>
              <br />
              Менеджер запросит файлы в WhatsApp после получения заявки.
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#FFB800] text-black hover:bg-[#FFB800]/90 font-bold text-lg h-12"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Отправка..."
            ) : (
              <span className="flex items-center gap-2">
                ПРОДОЛЖИТЬ В WHATSAPP <Send className="w-5 h-5" />
              </span>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Заявка поступит после отправки сообщения в WhatsApp.
          </p>

          <p className="text-xs text-center text-muted-foreground">
            Нажимая кнопку, вы передаёте указанные сведения в WhatsApp для обработки обращения. <a href="/privacy/" className="underline">Политика конфиденциальности</a>.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default B2BLeadForm;
