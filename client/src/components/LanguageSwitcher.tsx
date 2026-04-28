import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant={i18n.language === 'ru' ? 'default' : 'ghost'} 
        size="sm" 
        onClick={() => changeLanguage('ru')}
        className={`text-xs font-bold ${i18n.language === 'ru' ? 'bg-[#FFC000] text-black hover:bg-[#E6AC00]' : 'text-gray-400 hover:text-white'}`}
      >
        RU
      </Button>
      <Button 
        variant={i18n.language === 'kz' ? 'default' : 'ghost'} 
        size="sm" 
        onClick={() => changeLanguage('kz')}
        className={`text-xs font-bold ${i18n.language === 'kz' ? 'bg-[#FFC000] text-black hover:bg-[#E6AC00]' : 'text-gray-400 hover:text-white'}`}
      >
        KZ
      </Button>
    </div>
  );
}
