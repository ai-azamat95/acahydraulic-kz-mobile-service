import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import {
  COOKIE_CONSENT_EVENT,
  getStoredCookieConsent,
  hasMarketingConsent,
} from "@/lib/cookieConsent";

/**
 * Hook that fires TikTok PageView event via server-side Events API
 * on every route change. Also provides helper to fire Contact events.
 */
export function useTikTokPageView() {
  const [location] = useLocation();
  const pageViewMutation = trpc.tiktok.pageView.useMutation();
  const [marketingAllowed, setMarketingAllowed] = useState(
    () => getStoredCookieConsent()?.marketing === true
  );

  useEffect(() => {
    const syncConsent = () => {
      setMarketingAllowed(getStoredCookieConsent()?.marketing === true);
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
  }, []);

  useEffect(() => {
    if (import.meta.env.VITE_ENABLE_TIKTOK_EVENTS_API !== 'true') return;
    if (!marketingAllowed) return;

    const url = window.location.href;
    // Get ttclid from URL params if present (TikTok click ID)
    const params = new URLSearchParams(window.location.search);
    const ttclid = params.get("ttclid") || undefined;

    pageViewMutation.mutate({ pageUrl: url, ttclid });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, marketingAllowed]);
}
/**
 * Returns a function to fire TikTok Contact event (WhatsApp, phone, Telegram clicks)
 */
export function useTikTokContact() {
  const contactMutation = trpc.tiktok.contact.useMutation();

  const fireContact = (contactType: "whatsapp" | "phone" | "telegram") => {
    if (import.meta.env.VITE_ENABLE_TIKTOK_EVENTS_API !== 'true') return;
    if (!hasMarketingConsent()) return;

    contactMutation.mutate({
      pageUrl: window.location.href,
      contactType,
    });
  };

  return fireContact;
}
