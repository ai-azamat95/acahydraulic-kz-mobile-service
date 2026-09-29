import type { CatalogLanguage } from "@/content/partsCatalog";

export function CatalogLanguageControl({ language, onChange }: { language: CatalogLanguage; onChange: (language: CatalogLanguage) => void }) {
  return (
    <>
      <label className="sm:hidden">
        <span className="sr-only">Язык каталога</span>
        <select value={language} onChange={(event) => onChange(event.target.value as CatalogLanguage)} className="min-h-11 rounded border border-white/15 bg-[#181818] px-2 text-sm font-bold text-white focus:border-[#FFC000] focus:outline-none">
          <option value="ru">RU</option>
          <option value="kz">KZ</option>
          <option value="en">EN</option>
        </select>
      </label>
      <div className="hidden items-center gap-1 sm:flex" aria-label="Language">
        {(["ru", "kz", "en"] as CatalogLanguage[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-pressed={language === item}
            className={`min-h-10 min-w-10 rounded px-3 text-sm font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000] ${language === item ? "bg-[#FFC000] text-black" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>
    </>
  );
}
