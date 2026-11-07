import React, { useId, useState } from 'react';
import { Send, Paperclip, Building2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingField, FloatingInput, FloatingTextarea } from '@/components/ui/floating-field';
import './service-form.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { createContactIntentId, trackFormContactIntent } from '@/lib/contactIntent';

interface B2BLeadFormProps {
  onSuccess?: () => void;
}

const DIAGNOSTIC_TERMS = 'Стоимость согласуем до выезда';

const B2BLeadForm = ({ onSuccess }: B2BLeadFormProps = {}) => {
  const formId = useId();
  const fieldId = (name: string) => `${formId}-${name}`;
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
      toast.error('Подтвердите условия платной диагностики');
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

    const contactIntentId = createContactIntentId();

    const messageLines = [
      'Здравствуйте! Нужна выездная диагностика ACA Hydraulic.',
      'Понимаю, что диагностика платная. Прошу согласовать полную стоимость до выезда.',
      `Номер обращения: ${contactIntentId}`,
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

    const whatsappUrl = `https://wa.me/77714177925?text=${encodeURIComponent(messageLines.join('\n'))}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    trackFormContactIntent('b2b_form', contactIntentId);

    toast.info('Заявка подготовлена', {
      description: 'Отправьте сообщение в WhatsApp. Стоимость диагностики и выезда согласуем заранее.',
    });
    setIsSubmitting(false);
    onSuccess?.();
  };

  return (
    <Card className="service-lead-form">
      <CardHeader className="service-lead-form__header">
        <CardTitle className="service-lead-form__title">
          <Building2 aria-hidden="true" className="shrink-0 text-[#dfb76c]" />
          Заявка на выездную диагностику
        </CardTitle>
        <CardDescription className="service-lead-form__description">
          Укажите технику и место работ. Ремонт и запчасти рассчитываются отдельно после диагностики.
        </CardDescription>
        <div className="service-lead-form__terms">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="font-semibold">Выездная диагностика спецтехники</span>
            <strong className="service-lead-form__price">{DIAGNOSTIC_TERMS}</strong>
          </div>
          <p className="service-lead-form__description mt-2">
            Диагностика платная. Стоимость зависит от местонахождения и характера неисправности. Стоимость диагностики и выезда согласуем заранее; ремонт и запчасти — отдельно.
          </p>
        </div>
      </CardHeader>

      <CardContent className="service-lead-form__body">
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="service-lead-form__description">Поля со звёздочкой * обязательны.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <FloatingInput id={fieldId("location")} name="location" label="Где находится техника? *" autoComplete="address-level2" required placeholder="Город, посёлок или объект" value={formData.location} onChange={e => setFormData({...formData, location:e.target.value})} />
            <FloatingInput id={fieldId("model")} name="model" label="Марка и модель *" required placeholder="Например, Hitachi ZX330" value={formData.model} onChange={e => setFormData({...formData, model:e.target.value})} />
          </div>

          <details className="service-lead-form__company">
            <summary>Реквизиты компании (необязательно)</summary>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <FloatingInput id={fieldId("company")} name="company" label="Название компании" autoComplete="organization" placeholder="ТОО «СтройМашСервис»" value={formData.company} onChange={e => setFormData({...formData, company:e.target.value})} />
              <FloatingInput id={fieldId("bin")} name="bin" label="БИН (опционально)" inputMode="numeric" placeholder="Для выставления счета" value={formData.bin} onChange={e => setFormData({...formData, bin:e.target.value})} />
            </div>
          </details>

          <div className="grid md:grid-cols-2 gap-4">
            <FloatingInput id={fieldId("name")} name="name" label="Контактное лицо *" autoComplete="name" required placeholder="Имя" value={formData.name} onChange={e => setFormData({...formData, name:e.target.value})} />
            <FloatingInput id={fieldId("phone")} name="phone" label="Телефон *" autoComplete="tel" inputMode="tel" type="tel" required placeholder="+7 (777) 000-00-00" value={formData.phone} onChange={e => setFormData({...formData, phone:e.target.value})} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FloatingInput id={fieldId("email")} name="email" label="Email (опционально)" autoComplete="email" type="email" value={formData.email} onChange={e => setFormData({...formData, email:e.target.value})} />
            <FloatingInput id={fieldId("whatsapp")} name="whatsapp" label="WhatsApp (опционально)" autoComplete="tel" inputMode="tel" type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp:e.target.value})} />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <FloatingField id={fieldId("equipmentType")} label="Тип техники" alwaysFloat>
              <Select value={formData.equipmentType} onValueChange={value => setFormData({...formData, equipmentType:value})}>
                <SelectTrigger id={fieldId("equipmentType")} aria-label="Тип техники" className="floating-field__control"><SelectValue placeholder="Выберите тип" /></SelectTrigger>
                <SelectContent className="service-form-options">
                  <SelectItem value="excavator">Экскаватор</SelectItem><SelectItem value="loader">Погрузчик</SelectItem><SelectItem value="crane">Автокран</SelectItem><SelectItem value="bulldozer">Бульдозер</SelectItem><SelectItem value="drilling">Буровая установка</SelectItem><SelectItem value="other">Другое</SelectItem>
                </SelectContent>
              </Select>
            </FloatingField>
            <FloatingField id={fieldId("urgency")} label="Срочность" alwaysFloat>
              <Select value={formData.urgency} onValueChange={value => setFormData({...formData, urgency:value})}>
                <SelectTrigger id={fieldId("urgency")} aria-label="Срочность ремонта" className="floating-field__control"><SelectValue placeholder="Выберите приоритет" /></SelectTrigger>
                <SelectContent className="service-form-options"><SelectItem value="emergency">Срочно</SelectItem><SelectItem value="planned">Плановый ремонт</SelectItem><SelectItem value="maintenance">Техническое обслуживание</SelectItem><SelectItem value="tender">Тендер / Запрос КП</SelectItem></SelectContent>
              </Select>
            </FloatingField>
          </div>

          <FloatingTextarea id={fieldId("problem")} name="problem" label="Описание проблемы" placeholder="Например: после прогрева падает давление, машина теряет мощность..." value={formData.problem} onChange={e => setFormData({...formData, problem:e.target.value})} />

          <div className="service-lead-form__attachment">
            <Paperclip aria-hidden="true" className="w-5 h-5 shrink-0" /><div><span className="font-semibold">Фото шильдика и видео неисправности</span><br/>Их можно отправить сразу после перехода в WhatsApp.</div>
          </div>

          <label className="service-lead-form__consent" data-accepted={budgetAccepted}>
            <input type="checkbox" checked={budgetAccepted} onChange={e => setBudgetAccepted(e.target.checked)} className="shrink-0 mt-1 h-5 w-5 accent-[#dfb76c]" aria-describedby={`${formId}-terms`} />
            <div>
              <div className="font-semibold flex items-start gap-2">
                {budgetAccepted ? <CheckCircle2 aria-hidden="true" className="w-5 h-5 shrink-0 text-green-300" /> : <AlertTriangle aria-hidden="true" className="w-5 h-5 shrink-0 text-[#dfb76c]" />}
                Условия платной диагностики мне понятны
              </div>
              <p id={`${formId}-terms`} className="service-lead-form__description mt-1">Понимаю, что диагностика платная. Стоимость диагностики и выезда согласуем заранее. Ремонт, запчасти и дополнительные расходы согласуются отдельно.</p>
            </div>
          </label>

          <Button type="submit" className="service-lead-form__submit" disabled={isSubmitting || !budgetAccepted}>
            {isSubmitting ? 'Подготовка...' : <span className="flex items-center gap-2">ПОДТВЕРДИТЬ И ПЕРЕЙТИ В WHATSAPP <Send aria-hidden="true" className="w-5 h-5 shrink-0" /></span>}
          </Button>

          {!budgetAccepted && <p className="service-lead-form__notice">Чтобы продолжить, подтвердите условия платной диагностики.</p>}
          <p className="service-lead-form__legal">Заявка считается отправленной после отправки подготовленного сообщения в WhatsApp.</p>
          <p className="service-lead-form__legal">Нажимая кнопку, вы передаёте указанные сведения в WhatsApp для обработки обращения. <a href="/privacy/" className="underline">Политика конфиденциальности</a>.</p>
        </form>
      </CardContent>
    </Card>
  );
};

export default B2BLeadForm;
