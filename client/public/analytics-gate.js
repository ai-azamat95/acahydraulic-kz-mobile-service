(function configureAnalyticsConsent(window, document) {
  "use strict";

  var CONSENT_STORAGE_KEY = "aca_cookie_consent_v1";
  var CONSENT_VERSION = 1;
  var CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
  var GA_ID = "G-XZB9KZ4VCH";
  var ADS_ID = "AW-17847190636";
  var YANDEX_ID = 109131701;
  var TIKTOK_ID = "D6M5H3JC77U9JTU04Q60";
  var internal = false;

  try {
    var params = new URLSearchParams(window.location.search);
    var marker = params.get("aca_internal");

    if (marker === "1")
      window.localStorage.setItem("aca_internal_traffic", "1");
    if (marker === "0") window.localStorage.removeItem("aca_internal_traffic");
    internal = window.localStorage.getItem("aca_internal_traffic") === "1";

    if (marker !== null) {
      params.delete("aca_internal");
      var query = params.toString();
      var cleanUrl =
        window.location.pathname +
        (query ? "?" + query : "") +
        window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  } catch (_) {
    internal = false;
  }

  var navigator = window.navigator || {};
  var userAgent = navigator.userAgent || "";
  var automated =
    Boolean(navigator.webdriver) ||
    /bot|crawler|spider|headless|lighthouse|pagespeed|pingdom|uptimerobot|monitoring/i.test(
      userAgent
    );

  window.__ACA_ANALYTICS_EXCLUDE__ = internal || automated;
  window.__ACA_ANALYTICS_EXCLUSION_REASON__ = internal
    ? "internal"
    : automated
      ? "automated"
      : null;

  if (window.__ACA_ANALYTICS_EXCLUDE__) {
    window["ga-disable-" + GA_ID] = true;
    window["ga-disable-" + ADS_ID] = true;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      var command = Array.prototype.slice.call(arguments);
      if (command[0] === "event") {
        var consent = window.__ACA_COOKIE_CONSENT__;
        var isAdsConversion = command[1] === "conversion";
        if (
          !consent ||
          (isAdsConversion && !consent.marketing) ||
          (!isAdsConversion && !consent.analytics)
        ) {
          return;
        }
      }
      window.dataLayer.push(command);
    };

  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500,
  });
  window.gtag("set", "ads_data_redaction", true);

  function normalizeConsent(value) {
    if (
      !value ||
      value.version !== CONSENT_VERSION ||
      typeof value.analytics !== "boolean" ||
      typeof value.marketing !== "boolean" ||
      typeof value.updatedAt !== "number" ||
      Date.now() - value.updatedAt > CONSENT_MAX_AGE_MS
    ) {
      return null;
    }

    return {
      version: CONSENT_VERSION,
      necessary: true,
      analytics: value.analytics,
      marketing: value.marketing,
      updatedAt: value.updatedAt,
    };
  }

  function readConsent() {
    try {
      var stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
      var parsed = stored ? normalizeConsent(JSON.parse(stored)) : null;
      if (!parsed && stored)
        window.localStorage.removeItem(CONSENT_STORAGE_KEY);
      return parsed;
    } catch (_) {
      return null;
    }
  }

  function appendScript(id, src) {
    if (document.getElementById && document.getElementById(id)) return;
    var script = document.createElement("script");
    script.id = id;
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
  }

  function updateGoogleConsent(consent) {
    window.gtag("consent", "update", {
      analytics_storage: consent.analytics ? "granted" : "denied",
      ad_storage: consent.marketing ? "granted" : "denied",
      ad_user_data: consent.marketing ? "granted" : "denied",
      ad_personalization: consent.marketing ? "granted" : "denied",
    });
  }

  function loadGoogle(consent) {
    if (!consent.analytics && !consent.marketing) return;

    appendScript(
      "aca-google-tag",
      "https://www.googletagmanager.com/gtag/js?id=" +
        (consent.analytics ? GA_ID : ADS_ID)
    );

    if (!window.__ACA_GOOGLE_TAG_INITIALIZED__) {
      window.gtag("js", new Date());
      window.__ACA_GOOGLE_TAG_INITIALIZED__ = true;
    }
    if (consent.analytics && !window.__ACA_GA4_CONFIGURED__) {
      window.gtag("config", GA_ID);
      window.__ACA_GA4_CONFIGURED__ = true;
    }
    if (consent.marketing && !window.__ACA_ADS_CONFIGURED__) {
      window.gtag("config", ADS_ID);
      window.__ACA_ADS_CONFIGURED__ = true;
    }
  }

  function loadYandex() {
    if (!window.ym) {
      window.ym = function () {
        (window.ym.a = window.ym.a || []).push(arguments);
      };
      window.ym.l = Number(new Date());
    }

    appendScript(
      "aca-yandex-metrika",
      "https://mc.yandex.ru/metrika/tag.js?id=" + YANDEX_ID
    );

    if (!window.__ACA_YANDEX_INITIALIZED__) {
      window.ym(YANDEX_ID, "init", {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: "dataLayer",
        referrer: document.referrer,
        url: window.location.href,
        accurateTrackBounce: true,
        trackLinks: true,
      });
      window.__ACA_YANDEX_INITIALIZED__ = true;
    }
  }

  function prepareTikTokQueue() {
    if (window.ttq) return;
    var ttq = (window.ttq = []);
    var methods = [
      "page",
      "track",
      "identify",
      "instances",
      "debug",
      "on",
      "off",
      "once",
      "ready",
      "alias",
      "group",
      "enableCookie",
      "disableCookie",
      "holdConsent",
      "revokeConsent",
      "grantConsent",
    ];
    var defer = function (target, method) {
      target[method] = function () {
        target.push([method].concat(Array.prototype.slice.call(arguments)));
      };
    };
    for (var index = 0; index < methods.length; index += 1) {
      defer(ttq, methods[index]);
    }
    window.TiktokAnalyticsObject = "ttq";
  }

  function loadTikTok() {
    prepareTikTokQueue();
    window.ttq._i = window.ttq._i || {};
    window.ttq._i[TIKTOK_ID] = window.ttq._i[TIKTOK_ID] || [];
    window.ttq._i[TIKTOK_ID]._u =
      "https://analytics.tiktok.com/i18n/pixel/events.js";
    window.ttq._t = window.ttq._t || {};
    window.ttq._t[TIKTOK_ID] = window.ttq._t[TIKTOK_ID] || Number(new Date());
    window.ttq._o = window.ttq._o || {};
    window.ttq._o[TIKTOK_ID] = window.ttq._o[TIKTOK_ID] || {};
    appendScript(
      "aca-tiktok-pixel",
      "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" +
        TIKTOK_ID +
        "&lib=ttq"
    );
    if (!window.__ACA_TIKTOK_INITIALIZED__) {
      window.ttq.grantConsent();
      window.ttq.page();
      window.__ACA_TIKTOK_INITIALIZED__ = true;
    }
  }

  function clearTrackingCookies(consent) {
    if (!document.cookie) return;
    var knownPrefixes = [];
    if (!consent.analytics) knownPrefixes.push("_ga", "_ym_");
    if (!consent.marketing) {
      knownPrefixes.push("_gcl_", "_ttp", "_tt_enable_cookie", "ttcsid");
    }
    var host = window.location.hostname || "";
    document.cookie.split(";").forEach(function (part) {
      var name = part.split("=")[0].trim();
      var isTrackingCookie = knownPrefixes.some(function (prefix) {
        return name.indexOf(prefix) === 0;
      });
      if (!isTrackingCookie) return;
      document.cookie = name + "=; Max-Age=0; Path=/; SameSite=Lax";
      if (host) {
        document.cookie =
          name +
          "=; Max-Age=0; Path=/; Domain=." +
          host.replace(/^www\./, "") +
          "; SameSite=Lax";
      }
    });
  }

  function dispatchConsentChange(consent) {
    if (!window.dispatchEvent || !window.CustomEvent) return;
    window.dispatchEvent(
      new window.CustomEvent("aca:cookie-consent-changed", {
        detail: consent,
      })
    );
  }

  function applyConsent(value) {
    var consent = normalizeConsent(value);
    if (!consent) return;
    window.__ACA_COOKIE_CONSENT__ = consent;
    updateGoogleConsent(consent);

    if (!window.__ACA_ANALYTICS_EXCLUDE__) {
      loadGoogle(consent);

      if (consent.analytics) {
        loadYandex();
      } else if (window.__ACA_YANDEX_INITIALIZED__ && window.ym) {
        window.ym(YANDEX_ID, "destruct");
        window.__ACA_YANDEX_INITIALIZED__ = false;
      }

      if (consent.marketing) {
        loadTikTok();
      } else if (window.ttq && window.ttq.revokeConsent) {
        window.ttq.revokeConsent();
      }
    }

    if (!consent.analytics || !consent.marketing) clearTrackingCookies(consent);
    dispatchConsentChange(consent);
  }

  window.__ACA_COOKIE_CONSENT__ = readConsent();
  window.__ACA_APPLY_COOKIE_CONSENT__ = applyConsent;

  if (window.__ACA_COOKIE_CONSENT__) {
    applyConsent(window.__ACA_COOKIE_CONSENT__);
  }
})(window, document);
