import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertTriangle,
  CheckCircle2,
  FileText,
  MessageCircle,
  RotateCcw,
} from "lucide-react";

const WHATSAPP_NUMBER = "77714177925";
const DIAGNOSTIC_PRICE = "от 200 000 ₸";
const DIAGNOSTIC_VALUE = 200000;
const GOOGLE_ADS_QUALIFIED_LEAD = "AW-17847190636/JZkfCOu_84McEOyImr5C";

const equipmentTypes = [
  { id: "excavator", label: "Экскаватор", image: "/icons/excavator.svg" },
  { id: "loader", label: "Погрузчик", image: "/icons/loader.svg" },
  { id: "bulldozer", label: "Бульдозер", image: "/icons/bulldozer.svg" },
  { id: "grader", label: "Грейдер", image: "/icons/grader.svg" },
  { id: "mining_loader", label: "Шахтный погрузчик", image: "/icons/mining_loader.svg" },
  { id: "milling", label: "Дорожная фреза", image: "/icons/milling.svg" },
  { id: "hdd", label: "ГНБ установка", image: "/icons/hdd.svg" },
  { id: "piling", label: "Буровая / сваебойная", image: "/icons/piling.svg" },
  { id: "other", label: "Другая техника", image: "/icons/excavator.svg" },
];

const brands = [
  "Caterpillar (CAT)",
  "Komatsu",
  "Hitachi",
  "SANY",
  "XCMG",
  "Volvo CE",
  "Hyundai",
  "Develon / Doosan",
  "Kobelco",
  "JCB",
  "Liebherr",
  "LiuGong",
  "Lonking",
  "Shantui",
  "SDLG",
  "Zoomlion",
  "CASE",
  "New Holland",
  "John Deere",
  "Sumitomo",
  "KATO",
  "Takeuchi",
  "Bobcat",
  "Terex",
  "Wirtgen",
  "BOMAG",
  "Dynapac",
  "HAMM",
  "Sandvik",
  "Epiroc",
  "Atlas Copco",
  "Hidromek",
  "Yanmar",
  "Kubota",
  "Manitou",
  "Merlo",
  "Foton Lovol",
  "SINOMACH",
  "Sunward",
  "Yuchai",
  "Другая марка",
];

const popularModels: Record<string, string[]> = {
  "Caterpillar (CAT)": ["320", "323", "325", "330", "336", "349", "428", "432", "M315"],
  Komatsu: ["PC200", "PC210", "PC220", "PC300", "PC350", "PC400", "PC490", "WA380", "WA470"],
  Hitachi: ["ZX200", "ZX210", "ZX330", "ZX350", "ZX470", "ZX490"],
  SANY: ["SY215", "SY235", "SY305", "SY365H", "SY485"],
  XCMG: ["XE215", "XE260", "XE305", "XE370", "XE490", "XD123"],
  "Volvo CE": ["EC210", "EC220", "EC250", "EC300", "EC380", "EC480"],
  Hyundai: ["R210", "R220", "R300", "R330", "R380", "R520"],
  "Develon / Doosan": ["DX225", "DX300", "DX340", "DX420", "DX480"],
  Kobelco: ["SK200", "SK210", "SK260", "SK350"],
  Liebherr: ["R920", "R934", "R944", "R950", "R956"],
  Shantui: ["SD16", "SD22", "SD32", "SE210", "SE220", "SE370"],
};

const symptoms = [
  { id: "power", label: "Теряет мощность" },
  { id: "slow", label: "Медленно работает гидравлика" },
  { id: "boom", label: "Не поднимает / медленно поднимает стрелу" },
  { id: "travel", label: "Слабый ход / одна сторона забегает" },
  { id: "stall", label: "Глохнет под нагрузкой" },
  { id: "hot", label: "Проблема появляется после нагрева" },
  { id: "jerks", label: "Рывки / пульсации гидравлики" },
  { id: "pump_noise", label: "Шум / гул гидронасоса" },
  { id: "pressure", label: "Низкое или нестабильное давление" },
  { id: "leak", label: "Течь гидравлического масла" },
  { id: "electrical", label: "Ошибка электрики / датчиков / соленоидов" },
  { id: "stopped", label: "Техника полностью не работает" },
  { id: "other", label: "Другая неисправность" },
];

const cities = [
  "Астана",
  "Караганда",
  "Павлодар",
  "Кокшетау",
  "Щучинск",
  "Костанай",
  "Петропавловск",
  "Усть-Каменогорск",
  "Семей",
  "Алматы",
  "Талдыкорган",
  "Шымкент",
  "Тараз",
  "Кызылорда",
  "Актобе",
  "Атырау",
  "Актау",
  "Уральск",
  "Жезказган",
  "Балхаш",
  "Каражал",
  "Другой город / объект",
];

const componentOptions = [
  "Гидронасос",
  "Гидромотор",
  "Распределитель / клапаны",
  "Гидроцилиндр",
  "Электрика / датчики / соленоиды",
  "Вся гидросистема",
  "Не знаю — нужна диагностика",
];

type Selection = {
  equipment: string;
  brand: string;
  model: string;
  component: string;
  symptoms: string[];
  details: string;
  city: string;
  locationDetails: string;
  budgetAccepted: boolean;
  name: string;
  phone: string;
};

const initialSelection: Selection = {
  equipment: "",
  brand: "",
  model: "",
  component: "",
  symptoms: [],
  details: "",
  city: "",
  locationDetails: "",
  budgetAccepted: false,
  name: "",
  phone: "",
};

function track(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  (window as any).gtag?.("event", eventName, params);
}

function trackTikTok(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  (window as any).ttq?.track?.(eventName, params);
}

export default function CostCalculator() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const [budgetRejected, setBudgetRejected] = useState(false);

  const maxStep = 6;

  const selectedEquipment = equipmentTypes.find((item) => item.id === selection.equipment)?.label || "—";
  const selectedSymptoms = selection.symptoms
    .map((id) => symptoms.find((item) => item.id === id)?.label)
    .filter(Boolean)
    .join(", ");

  const modelSuggestions = useMemo(
    () => (selection.brand ? popularModels[selection.brand] || [] : []),
    [selection.brand]
  );

  const update = <K extends keyof Selection>(key: K, value: Selection[K]) => {
    setSelection((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSymptom = (id: string) => {
    setSelection((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(id)
        ? prev.symptoms.filter((symptom) => symptom !== id)
        : [...prev.symptoms, id],
    }));
  };

  const goNext = () => setStep((prev) => Math.min(prev + 1, maxStep));
  const goBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const reset = () => {
    setSelection(initialSelection);
    setBudgetRejected(false);
    setStep(1);
  };

  const acceptBudget = () => {
    update("budgetAccepted", true);
    setBudgetRejected(false);
    track("calculator_budget_accepted", {
      equipment: selectedEquipment,
      brand: selection.brand,
      model: selection.model,
      city: selection.city,
      diagnostic_price: DIAGNOSTIC_VALUE,
    });
    trackTikTok("ViewContent", {
      content_type: "service",
      content_name: "Выездная диагностика гидравлики",
      value: DIAGNOSTIC_VALUE,
      currency: "KZT",
    });
    goNext();
  };

  const rejectBudget = () => {
    update("budgetAccepted", false);
    setBudgetRejected(true);
    track("calculator_budget_rejected", {
      equipment: selectedEquipment,
      brand: selection.brand,
      city: selection.city,
      diagnostic_price: DIAGNOSTIC_VALUE,
    });
  };

  const whatsappText = [
    "Здравствуйте! Хочу заказать выездную диагностику ACA Hydraulic.",
    "",
    `Техника: ${selectedEquipment}`,
    `Марка: ${selection.brand || "не указана"}`,
    `Модель: ${selection.model || "не указана"}`,
    `Узел: ${selection.component || "не указан"}`,
    `Симптомы: ${selectedSymptoms || "не указаны"}`,
    selection.details ? `Описание: ${selection.details}` : "",
    `Местонахождение: ${selection.city}${selection.locationDetails ? `, ${selection.locationDetails}` : ""}`,
    `Стоимость диагностики ${DIAGNOSTIC_PRICE}: ПОДТВЕРЖДЕНА`,
    selection.name ? `Контактное лицо: ${selection.name}` : "",
    selection.phone ? `Телефон: ${selection.phone}` : "",
    "",
    "Могу отправить фото шильдика и видео работы техники.",
  ]
    .filter(Boolean)
    .join("\n");

  const openWhatsApp = () => {
    const leadParams = {
      equipment: selectedEquipment,
      brand: selection.brand,
      model: selection.model,
      city: selection.city,
      component: selection.component || "unknown",
      diagnostic_price: DIAGNOSTIC_VALUE,
      value: DIAGNOSTIC_VALUE,
      currency: "KZT",
      lead_type: "qualified_mobile_service",
      budget_confirmed: true,
    };

    track("calculator_whatsapp_click", leadParams);
    track("qualified_lead", leadParams);
    track("generate_lead", leadParams);

    if (typeof window !== "undefined") {
      (window as any).gtag?.("event", "conversion", {
        send_to: GOOGLE_ADS_QUALIFIED_LEAD,
        value: DIAGNOSTIC_VALUE,
        currency: "KZT",
      });
    }

    trackTikTok("SubmitForm", {
      content_type: "service",
      content_name: "Квалифицированная заявка на выездную диагностику",
      value: DIAGNOSTIC_VALUE,
      currency: "KZT",
    });
  };

  const cardClass = (selected: boolean) =>
    `group relative flex flex-col items-center justify-center p-4 md:p-6 rounded-xl border-2 transition-all duration-200 min-h-[112px] bg-[#1F1F1F] ${
      selected
        ? "border-[#FFB800] shadow-[0_0_25px_rgba(255,184,0,0.32)]"
        : "border-[#3A3A3A] hover:border-[#FFB800] hover:shadow-[0_0_20px_rgba(255,184,0,0.15)]"
    }`;

  return (
    <div className="bg-[#2A2A2A] rounded-lg overflow-hidden shadow-2xl max-w-6xl mx-auto">
      <div className="bg-[#1F1F1F] px-4 md:px-6 py-5 border-b border-white/5">
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 shrink-0 bg-[#FFB800] rounded-md flex items-center justify-center">
              <FileText size={24} className="text-[#1F1F1F]" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-2xl text-white tracking-tight">Рассчитать выездную диагностику</h3>
              <p className="text-sm text-gray-400">Заполните данные о технике — это займёт около минуты</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[#FFB800] font-bold text-lg">Шаг {step} из {maxStep}</div>
            <div className="w-24 md:w-36 h-2 bg-[#3A3A3A] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#FFB800] transition-all duration-500 rounded-full"
                style={{ width: `${(step / maxStep) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-[#FFB800]/35 bg-[#FFB800]/10 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-white text-sm md:text-base font-medium">Выездная комплексная диагностика</span>
          <span className="text-[#FFB800] text-xl md:text-2xl font-extrabold">{DIAGNOSTIC_PRICE}</span>
        </div>
      </div>

      <div className="p-4 md:p-10 md:min-h-[520px] flex flex-col">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h4 className="text-2xl text-white mb-2 font-semibold">Какая техника требует диагностики?</h4>
            <p className="text-gray-400 mb-7">Выберите тип техники.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {equipmentTypes.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => {
                    update("equipment", item.id);
                    setTimeout(goNext, 80);
                  }}
                  className={cardClass(selection.equipment === item.id)}
                >
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-12 h-12 md:w-16 md:h-16 object-contain mb-3"
                    style={{ filter: "brightness(0) saturate(100%) invert(76%) sepia(93%) saturate(1815%) hue-rotate(359deg) brightness(102%) contrast(101%)" }}
                  />
                  <span className="text-sm md:text-lg font-semibold text-white text-center">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-3xl mx-auto w-full">
            <h4 className="text-2xl text-white mb-2 font-semibold">Марка и модель техники</h4>
            <p className="text-gray-400 mb-7">Если модели нет в подсказках, просто введите её вручную.</p>

            <label className="block text-sm font-semibold text-gray-300 mb-2">Марка *</label>
            <select
              value={selection.brand}
              onChange={(e) => {
                update("brand", e.target.value);
                update("model", "");
              }}
              className="w-full h-12 rounded-lg bg-[#1F1F1F] border-2 border-[#3A3A3A] text-white px-4 focus:outline-none focus:border-[#FFB800] mb-5"
            >
              <option value="">Выберите марку</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>

            <label className="block text-sm font-semibold text-gray-300 mb-2">Модель *</label>
            <Input
              value={selection.model}
              onChange={(e) => update("model", e.target.value)}
              list="equipment-models"
              placeholder="Например: SY365H, CAT 330, ZX330, PC300"
              className="h-12 bg-[#1F1F1F] border-2 border-[#3A3A3A] text-white placeholder:text-gray-500 focus-visible:ring-[#FFB800]"
            />
            <datalist id="equipment-models">
              {modelSuggestions.map((model) => <option key={model} value={model} />)}
            </datalist>

            <div className="mt-8 flex justify-between gap-3">
              <Button variant="ghost" onClick={goBack} className="text-gray-400 hover:text-white hover:bg-[#3A3A3A]">← Назад</Button>
              <Button
                onClick={goNext}
                disabled={!selection.brand || !selection.model.trim()}
                className="bg-[#FFB800] text-[#1F1F1F] hover:bg-[#FFC000] font-bold px-7"
              >
                Продолжить →
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h4 className="text-2xl text-white mb-2 font-semibold">Что происходит с техникой?</h4>
            <p className="text-gray-400 mb-7">Можно выбрать несколько симптомов.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-7">
              {symptoms.map((item) => {
                const active = selection.symptoms.includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleSymptom(item.id)}
                    className={`p-4 border-2 rounded-xl flex items-center gap-4 text-left bg-[#1F1F1F] transition-all ${
                      active ? "border-[#FFB800] shadow-[0_0_18px_rgba(255,184,0,0.2)]" : "border-[#3A3A3A] hover:border-[#FFB800]/60"
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 ${active ? "border-[#FFB800] bg-[#FFB800]" : "border-gray-500"}`}>
                      {active && <CheckCircle2 className="w-4 h-4 text-[#1F1F1F]" strokeWidth={3} />}
                    </div>
                    <span className="text-white font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <label className="block text-sm font-semibold text-gray-300 mb-2">Какой узел подозреваете?</label>
            <select
              value={selection.component}
              onChange={(e) => update("component", e.target.value)}
              className="w-full h-12 rounded-lg bg-[#1F1F1F] border-2 border-[#3A3A3A] text-white px-4 focus:outline-none focus:border-[#FFB800] mb-5"
            >
              <option value="">Выберите, если знаете</option>
              {componentOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>

            <label className="block text-sm font-semibold text-gray-300 mb-2">Коротко опишите неисправность</label>
            <textarea
              value={selection.details}
              onChange={(e) => update("details", e.target.value)}
              placeholder="Например: после 40 минут работы теряет мощность, давление падает, стрела поднимается медленно..."
              rows={3}
              className="w-full rounded-lg bg-[#1F1F1F] border-2 border-[#3A3A3A] text-white placeholder:text-gray-500 p-4 focus:outline-none focus:border-[#FFB800]"
            />

            <div className="mt-7 flex justify-between gap-3">
              <Button variant="ghost" onClick={goBack} className="text-gray-400 hover:text-white hover:bg-[#3A3A3A]">← Назад</Button>
              <Button
                onClick={goNext}
                disabled={selection.symptoms.length === 0}
                className="bg-[#FFB800] text-[#1F1F1F] hover:bg-[#FFC000] font-bold px-7"
              >
                Продолжить →
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-3xl mx-auto w-full">
            <h4 className="text-2xl text-white mb-2 font-semibold">Где находится техника?</h4>
            <p className="text-gray-400 mb-7">ACA Hydraulic выезжает на объекты по Казахстану.</p>

            <label className="block text-sm font-semibold text-gray-300 mb-2">Город / регион *</label>
            <select
              value={selection.city}
              onChange={(e) => update("city", e.target.value)}
              className="w-full h-12 rounded-lg bg-[#1F1F1F] border-2 border-[#3A3A3A] text-white px-4 focus:outline-none focus:border-[#FFB800] mb-5"
            >
              <option value="">Выберите город</option>
              {cities.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>

            <label className="block text-sm font-semibold text-gray-300 mb-2">Объект / район / ближайший населённый пункт</label>
            <Input
              value={selection.locationDetails}
              onChange={(e) => update("locationDetails", e.target.value)}
              placeholder="Например: карьер, 80 км от Караганды"
              className="h-12 bg-[#1F1F1F] border-2 border-[#3A3A3A] text-white placeholder:text-gray-500 focus-visible:ring-[#FFB800]"
            />

            <div className="mt-8 flex justify-between gap-3">
              <Button variant="ghost" onClick={goBack} className="text-gray-400 hover:text-white hover:bg-[#3A3A3A]">← Назад</Button>
              <Button
                onClick={() => {
                  track("calculator_price_gate_view", { city: selection.city, diagnostic_price: DIAGNOSTIC_VALUE });
                  goNext();
                }}
                disabled={!selection.city}
                className="bg-[#FFB800] text-[#1F1F1F] hover:bg-[#FFC000] font-bold px-7"
              >
                Узнать условия →
              </Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-3xl mx-auto w-full text-center">
            <div className="w-20 h-20 bg-[#FFB800]/15 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-[#FFB800]/50">
              <CheckCircle2 className="w-10 h-10 text-[#FFB800]" strokeWidth={2.5} />
            </div>
            <h4 className="text-2xl md:text-4xl font-bold text-white mb-3">Выездная комплексная диагностика</h4>
            <div className="text-4xl md:text-6xl font-extrabold text-[#FFB800] my-6">{DIAGNOSTIC_PRICE}</div>

            <div className="text-left bg-[#1F1F1F] border-2 border-[#3A3A3A] rounded-xl p-5 md:p-7 mb-6">
              <p className="text-white font-semibold mb-4">Это не просто подключение сканера. В зависимости от неисправности проверяем:</p>
              <div className="grid md:grid-cols-2 gap-3 text-gray-300 text-sm md:text-base">
                <div>✓ давление и работу гидросистемы под нагрузкой</div>
                <div>✓ насосы, регуляторы и управляющее давление</div>
                <div>✓ распределители, клапаны и утечки</div>
                <div>✓ датчики, соленоиды и электропроводку</div>
                <div>✓ фактические параметры неисправности</div>
                <div>✓ причину отказа до замены дорогих узлов</div>
              </div>
              <p className="text-gray-400 text-sm mt-5 border-t border-white/10 pt-4">
                Точная стоимость выезда зависит от местонахождения техники. Ремонт, запчасти, доставка и дополнительные работы рассчитываются отдельно после диагностики.
              </p>
            </div>

            {budgetRejected && (
              <div className="mb-6 rounded-xl border border-orange-400/40 bg-orange-400/10 p-4 text-left flex gap-3">
                <AlertTriangle className="text-orange-400 shrink-0 mt-0.5" size={22} />
                <div>
                  <div className="text-white font-semibold">Заявка на выезд не оформлена</div>
                  <div className="text-gray-300 text-sm mt-1">Наш формат работы рассчитан на профессиональную выездную диагностику сложных неисправностей спецтехники.</div>
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <Button
                onClick={acceptBudget}
                className="bg-[#FFB800] text-[#1F1F1F] hover:bg-[#FFC000] font-extrabold px-7 py-6 h-auto text-base md:text-lg"
              >
                Стоимость понятна и подходит →
              </Button>
              <Button
                variant="outline"
                onClick={rejectBudget}
                className="border-2 border-[#3A3A3A] text-gray-300 hover:text-white hover:bg-[#3A3A3A] px-6 py-6 h-auto"
              >
                Пока не подходит
              </Button>
            </div>
            <Button variant="ghost" onClick={goBack} className="mt-5 text-gray-500 hover:text-white hover:bg-[#3A3A3A]">← Изменить данные</Button>
          </div>
        )}

        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 max-w-3xl mx-auto w-full">
            <div className="text-center mb-7">
              <div className="w-16 h-16 bg-[#25D366]/15 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#25D366]/40">
                <MessageCircle className="w-8 h-8 text-[#25D366]" />
              </div>
              <h4 className="text-2xl md:text-3xl font-bold text-white">Заявка подготовлена</h4>
              <p className="text-gray-400 mt-2">Оставьте контакт и отправьте данные в WhatsApp. Там же можно приложить фото шильдика и видео работы техники.</p>
            </div>

            <div className="bg-[#1F1F1F] rounded-xl border border-[#3A3A3A] p-5 mb-6 text-sm md:text-base">
              <div className="grid grid-cols-[120px_1fr] md:grid-cols-[160px_1fr] gap-y-3 gap-x-3">
                <span className="text-gray-500">Техника</span><span className="text-white font-medium">{selectedEquipment}</span>
                <span className="text-gray-500">Марка / модель</span><span className="text-white font-medium">{selection.brand} {selection.model}</span>
                <span className="text-gray-500">Где находится</span><span className="text-white font-medium">{selection.city}{selection.locationDetails ? `, ${selection.locationDetails}` : ""}</span>
                <span className="text-gray-500">Диагностика</span><span className="text-[#FFB800] font-bold">{DIAGNOSTIC_PRICE} — подтверждено</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Контактное лицо</label>
                <Input
                  value={selection.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Ваше имя"
                  className="h-12 bg-[#1F1F1F] border-2 border-[#3A3A3A] text-white placeholder:text-gray-500 focus-visible:ring-[#FFB800]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Телефон / WhatsApp *</label>
                <Input
                  value={selection.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+7 7__ ___ __ __"
                  inputMode="tel"
                  className="h-12 bg-[#1F1F1F] border-2 border-[#3A3A3A] text-white placeholder:text-gray-500 focus-visible:ring-[#FFB800]"
                />
              </div>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappText)}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={openWhatsApp}
              className={!selection.phone.trim() ? "pointer-events-none opacity-50" : ""}
            >
              <Button
                disabled={!selection.phone.trim() || !selection.budgetAccepted}
                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-extrabold py-6 h-auto text-base md:text-lg rounded-lg"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Отправить заявку в WhatsApp
              </Button>
            </a>

            <p className="text-xs text-gray-500 text-center mt-3">Нажимая кнопку, клиент отправляет уже заполненные данные по технике и подтверждение стоимости диагностики.</p>

            <div className="mt-7 flex flex-wrap justify-between gap-3">
              <Button variant="ghost" onClick={goBack} className="text-gray-400 hover:text-white hover:bg-[#3A3A3A]">← Назад</Button>
              <Button variant="outline" onClick={reset} className="border-[#3A3A3A] text-gray-300 hover:bg-[#3A3A3A] hover:text-white">
                <RotateCcw className="w-4 h-4 mr-2" />
                Начать заново
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
