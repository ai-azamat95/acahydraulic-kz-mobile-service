import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calculator, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  MessageCircle,
  RotateCcw,
  Hammer,
  FileText
} from "lucide-react";

const equipmentTypes = [
  { id: "excavator", label: "Экскаватор", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/uimFEjQUQrJlzfJt.png" },
  { id: "mining_loader", label: "Шахтный погрузчик", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/TsqBFrJNskKFvpQB.png" },
  { id: "bulldozer", label: "Бульдозер", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/hrYqkTIsmnQddFjH.png" },
  { id: "milling", label: "Фреза", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/KegBNBKntKPbBqkG.png" },
  { id: "hdd", label: "ГНБ установка", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/aKudUWvRqPnPGiAz.png" },
  { id: "piling", label: "Сваебойная (ротор)", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/tQAGuPtvrpTPsadn.png" },
  { id: "grader", label: "Грейдер", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/oNbmVRVdlYzTDScK.png" },
  { id: "loader", label: "Погрузчик", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/astfUhmYDNprxTqH.png" },
  { id: "other", label: "Другая техника", image: "https://files.manuscdn.com/user_upload_by_module/session_file/310419663029800642/mZSsogfHopLnibyj.png" },
];

const components = [
  { id: "pump", label: "Гидронасос" },
  { id: "motor", label: "Гидромотор" },

  { id: "valve", label: "Распределитель" },
  { id: "system", label: "Вся система" },
  { id: "unknown", label: "Не знаю / Диагностика" },
];

const symptoms = [
  { id: "slow", label: "Медленная работа" },
  { id: "noise", label: "Посторонний шум/стук" },
  { id: "heat", label: "Перегрев масла" },
  { id: "leak", label: "Течь масла" },
  { id: "no_pressure", label: "Нет давления" },
  { id: "stuck", label: "Заклинило" },
];

export default function CostCalculator() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    equipment: "",
    component: "",
    symptoms: [] as string[],
    phone: ""
  });

  const handleSymptomToggle = (id: string) => {
    setSelection(prev => {
      const newSymptoms = prev.symptoms.includes(id)
        ? prev.symptoms.filter(s => s !== id)
        : [...prev.symptoms, id];
      return { ...prev, symptoms: newSymptoms };
    });
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const reset = () => {
    setStep(1);
    setSelection({ equipment: "", component: "", symptoms: [], phone: "" });
  };

  const getEstimate = () => {
    // Simple logic to generate a "dynamic" looking estimate text
    if (selection.component === "pump") return "от 150 000 ₸";
    if (selection.component === "motor") return "от 120 000 ₸";

    if (selection.component === "valve") return "от 80 000 ₸";
    return "по запросу";
  };

  return (
    <div className="bg-[#2A2A2A] rounded-lg overflow-hidden shadow-2xl max-w-6xl mx-auto">
      {/* Header with progress indicator */}
      <div className="bg-[#1F1F1F] px-6 py-5 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFB800] rounded-md flex items-center justify-center">
            <FileText size={24} className="text-[#1F1F1F]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-bold text-2xl text-white tracking-tight">Калькулятор ремонта</h3>
            <p className="text-sm text-gray-400 font-normal">Рассчитайте предварительную стоимость</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[#FFB800] font-bold text-xl">Шаг {step} из 4</div>
          <div className="w-32 h-2 bg-[#3A3A3A] rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-[#FFB800] transition-all duration-500 rounded-full" 
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-8 md:p-12 min-h-[500px] flex flex-col">
        
        {/* Step 1: Equipment */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h4 className="text-2xl text-white mb-8 font-semibold">Какая техника требует ремонта?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {equipmentTypes.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelection({ ...selection, equipment: item.id });
                    nextStep();
                  }}
                  className={`group relative flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all duration-200 min-h-[200px] bg-[#1F1F1F]
                    ${selection.equipment === item.id 
                      ? "border-[#FFB800] shadow-[0_0_25px_rgba(255,184,0,0.4)]" 
                      : "border-[#3A3A3A] hover:border-[#FFB800] hover:shadow-[0_0_20px_rgba(255,184,0,0.2)]"
                    }
                  `}
                >
                  <img 
                    src={item.image} 
                    alt={item.label} 
                    className="w-[70px] h-[70px] object-contain transition-all duration-200 mb-4" 
                    style={{ filter: 'brightness(0) saturate(100%) invert(76%) sepia(93%) saturate(1815%) hue-rotate(359deg) brightness(102%) contrast(101%)' }}
                  />
                  <span className="text-lg font-semibold text-white text-center">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Component */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h4 className="text-2xl text-white mb-8 font-semibold">Какой узел неисправен?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {components.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelection({ ...selection, component: item.id });
                    nextStep();
                  }}
                  className={`p-8 border-2 rounded-xl flex flex-col items-center justify-center gap-3 transition-all min-h-[140px] bg-[#1F1F1F] ${
                    selection.component === item.id 
                      ? "border-[#FFB800] shadow-[0_0_25px_rgba(255,184,0,0.4)]" 
                      : "border-[#3A3A3A] hover:border-[#FFB800] hover:shadow-[0_0_20px_rgba(255,184,0,0.2)]"
                  }`}
                >
                  <span className="text-white font-semibold text-lg text-center">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-10 flex justify-start">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                className="text-gray-400 hover:text-white hover:bg-[#3A3A3A] px-6 py-3 text-base"
              >
                ← Назад
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Symptoms */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h4 className="text-2xl text-white mb-8 font-semibold">Какие признаки неисправности? (можно несколько)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {symptoms.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSymptomToggle(item.id)}
                  className={`p-5 border-2 rounded-xl flex items-center gap-4 transition-all text-left bg-[#1F1F1F] ${
                    selection.symptoms.includes(item.id)
                      ? "border-[#FFB800] shadow-[0_0_20px_rgba(255,184,0,0.3)]" 
                      : "border-[#3A3A3A] hover:border-[#FFB800]/50"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${
                    selection.symptoms.includes(item.id) ? "border-[#FFB800] bg-[#FFB800]" : "border-gray-500"
                  }`}>
                    {selection.symptoms.includes(item.id) && <CheckCircle2 className="w-4 h-4 text-[#1F1F1F]" strokeWidth={3} />}
                  </div>
                  <span className="text-white font-medium text-base">{item.label}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                onClick={prevStep} 
                className="text-gray-400 hover:text-white hover:bg-[#3A3A3A] px-6 py-3 text-base"
              >
                ← Назад
              </Button>
              <Button 
                onClick={nextStep} 
                className="bg-[#FFB800] text-[#1F1F1F] hover:bg-[#FFC000] font-bold tracking-wide px-10 py-6 text-lg rounded-lg"
                disabled={selection.symptoms.length === 0}
              >
                Рассчитать стоимость →
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Result */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300 text-center">
            <div className="w-20 h-20 bg-[#FFB800]/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#FFB800]/50">
              <CheckCircle2 className="w-10 h-10 text-[#FFB800]" strokeWidth={2.5} />
            </div>
            
            <h4 className="text-4xl font-bold text-white mb-3">Предварительная оценка</h4>
            <p className="text-gray-400 text-lg mb-10">На основе выбранных параметров</p>

            <div className="bg-[#1F1F1F] border-2 border-[#3A3A3A] p-8 rounded-xl max-w-md mx-auto mb-10">
              <div className="text-sm text-gray-500 uppercase tracking-widest mb-3 font-semibold">Стоимость работ</div>
              <div className="text-5xl font-bold text-[#FFB800] mb-3">{getEstimate()}</div>
              <div className="text-sm text-gray-400">*Точная сумма только после дефектовки</div>
            </div>

            <div className="flex flex-col md:flex-row gap-5 justify-center">
              <a 
                href={`https://wa.me/77714177925?text=Здравствуйте! Рассчитал стоимость на сайте. Техника: ${selection.equipment}, Узел: ${selection.component}, Проблемы: ${selection.symptoms.join(', ')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  const url = `https://wa.me/77714177925?text=Здравствуйте! Рассчитал стоимость на сайте. Техника: ${selection.equipment}, Узел: ${selection.component}, Проблемы: ${selection.symptoms.join(', ')}`;
                  if (typeof (window as any).gtag_whatsapp_conversion === 'function') {
                    (window as any).gtag_whatsapp_conversion(url);
                  } else {
                    window.open(url, '_blank');
                  }
                }}
              >
                <Button className="w-full md:w-auto bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-10 py-7 h-auto text-lg rounded-lg">
                  <MessageCircle className="w-6 h-6 mr-3" />
                  Получить смету в WhatsApp
                </Button>
              </a>
              <Button 
                variant="outline" 
                onClick={reset}
                className="border-2 border-[#3A3A3A] text-white hover:bg-[#3A3A3A] hover:border-[#FFB800] px-10 py-7 text-lg rounded-lg"
              >
                <RotateCcw className="w-5 h-5 mr-3" />
                Рассчитать заново
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
