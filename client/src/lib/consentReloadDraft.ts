import { useEffect, useState } from "react";

// Only used for the service enquiry form. No analytics payload, URL, or durable
// localStorage: retain an unsent draft in this tab only for a consent reload.
const KEY = "aca_consent_reload_service_draft";
export function useConsentReloadDraft<T extends Record<string, string>>(empty: T) {
  const [draft, setDraft] = useState<T>(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      sessionStorage.removeItem(KEY);
      if (!raw) return empty;
      const saved = JSON.parse(raw);
      if (saved.path !== location.pathname || typeof saved.at !== "number" ||
          !Number.isFinite(saved.at) || saved.at > Date.now() || Date.now() - saved.at > 60000) return empty;
      const result = { ...empty };
      for (const key of Object.keys(empty) as Array<keyof T>) {
        if (typeof saved.value?.[key] === "string") result[key] = saved.value[key] as T[keyof T];
      }
      return result;
    } catch { return empty; }
  });
  useEffect(() => {
    const retain = () => {
      if (!Object.values(draft).some(Boolean)) return;
      try {
        sessionStorage.setItem(KEY, JSON.stringify({ path: location.pathname, at: Date.now(), value: draft }));
      } catch { /* Storage unavailable: withdrawal must still proceed. */ }
    };
    window.addEventListener("aca:consent-reload", retain);
    return () => window.removeEventListener("aca:consent-reload", retain);
  }, [draft]);
  return [draft, setDraft] as const;
}
