import {
  BarChart3,
  Cookie,
  Megaphone,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import {
  COOKIE_CONSENT_EVENT,
  getStoredCookieConsent,
  OPEN_COOKIE_SETTINGS_EVENT,
  saveCookieConsent,
  type CookieConsent as CookieConsentPreference,
} from "@/lib/cookieConsent";

type ConsentChoiceProps = {
  checked: boolean;
  description: string;
  disabled?: boolean;
  icon: typeof ShieldCheck;
  label: string;
  onChange?: (checked: boolean) => void;
};

function ConsentChoice({
  checked,
  description,
  disabled = false,
  icon: Icon,
  label,
  onChange,
}: ConsentChoiceProps) {
  return (
    <label className="flex items-start gap-3 border-b border-white/10 py-4 last:border-b-0">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/5 text-[#FFC000]">
        <Icon aria-hidden="true" className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-gray-400">
          {description}
        </span>
      </span>
      <span className="relative mt-1 inline-flex shrink-0">
        <input
          aria-label={label}
          checked={checked}
          className="peer sr-only"
          disabled={disabled}
          onChange={event => onChange?.(event.target.checked)}
          type="checkbox"
        />
        <span className="h-6 w-11 rounded-full border border-white/20 bg-white/10 transition-colors peer-checked:border-[#FFC000] peer-checked:bg-[#FFC000] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#FFC000] peer-disabled:opacity-60" />
        <span className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-5 peer-checked:bg-black" />
      </span>
    </label>
  );
}

export function CookieConsent() {
  const initialConsent = getStoredCookieConsent();
  const [preference, setPreference] = useState<CookieConsentPreference | null>(
    initialConsent
  );
  const [isOpen, setIsOpen] = useState(!initialConsent);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [analytics, setAnalytics] = useState(
    initialConsent?.analytics ?? false
  );
  const [marketing, setMarketing] = useState(
    initialConsent?.marketing ?? false
  );
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const openSettings = () => {
      const current = getStoredCookieConsent();
      setAnalytics(current?.analytics ?? false);
      setMarketing(current?.marketing ?? false);
      setIsCustomizing(true);
      setIsOpen(true);
      window.setTimeout(() => titleRef.current?.focus(), 0);
    };
    const syncConsent = (event: Event) => {
      const detail = (event as CustomEvent<CookieConsentPreference>).detail;
      if (detail) setPreference(detail);
    };

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);
    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, openSettings);
      window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && preference) setIsOpen(false);
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [isOpen, preference]);

  const commit = (next: { analytics: boolean; marketing: boolean }) => {
    const revokedExistingPermission =
      Boolean(preference?.analytics && !next.analytics) ||
      Boolean(preference?.marketing && !next.marketing);
    const saved = saveCookieConsent(next);
    setPreference(saved);
    setAnalytics(saved.analytics);
    setMarketing(saved.marketing);
    setIsOpen(false);
    setIsCustomizing(false);
    if (revokedExistingPermission) window.location.reload();
  };

  if (!isOpen && preference) {
    return (
      <button
        aria-label="Открыть настройки cookie"
        className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-3 z-[70] inline-flex min-h-11 items-center gap-2 rounded-md border border-white/15 bg-[#171717] px-3 text-xs font-semibold text-gray-200 shadow-lg transition-colors hover:border-[#FFC000]/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000] md:bottom-4"
        onClick={() => {
          setIsCustomizing(true);
          setIsOpen(true);
        }}
        type="button"
      >
        <Settings2 aria-hidden="true" className="h-4 w-4 text-[#FFC000]" />
        <span className="hidden sm:inline">Настройки cookie</span>
      </button>
    );
  }

  if (!isOpen) return null;

  return (
    <section
      aria-describedby="cookie-consent-description"
      aria-labelledby="cookie-consent-title"
      aria-modal="false"
      className="fixed inset-x-3 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[80] mx-auto max-h-[calc(100dvh-12rem)] max-w-4xl overflow-y-auto rounded-lg border border-white/15 bg-[#171717] text-gray-200 shadow-2xl md:bottom-4"
      role="dialog"
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#FFC000] text-black">
            <Cookie aria-hidden="true" className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2
              className="text-base font-bold text-white outline-none sm:text-lg"
              id="cookie-consent-title"
              ref={titleRef}
              tabIndex={-1}
            >
              Управление файлами cookie
            </h2>
            <p
              className="mt-1 text-xs leading-5 text-gray-400 sm:text-sm"
              id="cookie-consent-description"
            >
              Обязательные данные обеспечивают работу сайта. Аналитика помогает
              улучшать страницы, а рекламные cookie — измерять эффективность
              рекламы. Вы можете изменить выбор в любое время.
            </p>
          </div>
          {preference ? (
            <button
              aria-label="Закрыть настройки cookie"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-white/5 hover:text-white focus-visible:outline-2 focus-visible:outline-[#FFC000]"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          ) : null}
        </div>

        {isCustomizing ? (
          <div className="mt-4 rounded-md border border-white/10 bg-black/20 px-4">
            <ConsentChoice
              checked
              description="Нужны для безопасности, сохранения вашего выбора и основных функций сайта."
              disabled
              icon={ShieldCheck}
              label="Обязательные"
            />
            <ConsentChoice
              checked={analytics}
              description="Google Analytics и Яндекс Метрика: посещения, страницы и действия без данных из сообщений WhatsApp."
              icon={BarChart3}
              label="Аналитика"
              onChange={setAnalytics}
            />
            <ConsentChoice
              checked={marketing}
              description="Google Ads и TikTok: оценка рекламных кампаний и конверсий."
              icon={Megaphone}
              label="Реклама"
              onChange={setMarketing}
            />
          </div>
        ) : null}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          {isCustomizing ? (
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#FFC000] px-5 text-sm font-bold text-black transition-colors hover:bg-[#ffd24d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
              onClick={() => commit({ analytics, marketing })}
              type="button"
            >
              Сохранить выбор
            </button>
          ) : (
            <button
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/25 bg-white/5 px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
              onClick={() => setIsCustomizing(true)}
              type="button"
            >
              Настроить
            </button>
          )}
          {!isCustomizing ? (
            <>
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-white/25 bg-transparent px-5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
                onClick={() => commit({ analytics: false, marketing: false })}
                type="button"
              >
                Только обязательные
              </button>
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#FFC000] px-5 text-sm font-bold text-black transition-colors hover:bg-[#ffd24d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFC000]"
                onClick={() => commit({ analytics: true, marketing: true })}
                type="button"
              >
                Принять все
              </button>
            </>
          ) : null}
          <Link
            className="px-2 py-2 text-center text-xs text-gray-400 underline decoration-gray-600 underline-offset-4 hover:text-white sm:ml-auto"
            href="/privacy"
          >
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </section>
  );
}
