import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { COOKIE_CONSENT_EVENT, hasMarketingConsent } from '@/lib/cookieConsent';
import { captureTikTokAttribution, contactTypeForHref, trackTikTokContact } from '@/lib/tiktokAttribution';

/** Browser Pixel works on the static deployment; Events API requires a live backend. */
export function useTikTokPageView() {
  const [location] = useLocation();
  const lastLocation = useRef(location);
  useEffect(() => {
    captureTikTokAttribution();
    if (lastLocation.current !== location) {
      lastLocation.current = location;
      if (!window.__ACA_ANALYTICS_EXCLUDE__ && hasMarketingConsent()) window.ttq?.page?.();
    }
  }, [location]);

  useEffect(() => {
    const syncConsent = () => captureTikTokAttribution();
    const contactClick = (event: MouseEvent) => {
      if (event.defaultPrevented || !(event.target instanceof Element)) return;
      const anchor = event.target.closest('a[href]');
      if (!anchor || anchor.getAttribute('aria-disabled') === 'true') return;
      const type = contactTypeForHref(anchor.getAttribute('href') || '');
      if (type) trackTikTokContact(type);
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, syncConsent);
    document.addEventListener('click', contactClick);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_EVENT, syncConsent);
      document.removeEventListener('click', contactClick);
    };
  }, []);
}

/** Contact links are measured once by the delegated listener above. */
export function useTikTokContact() {
  return (_contactType: 'whatsapp' | 'phone' | 'telegram') => {};
}
