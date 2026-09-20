(function configureAnalyticsGate(window) {
  var storageKey = "aca_internal_traffic";
  var internal = false;

  try {
    var params = new URLSearchParams(window.location.search);
    var marker = params.get("aca_internal");

    if (marker === "1") window.localStorage.setItem(storageKey, "1");
    if (marker === "0") window.localStorage.removeItem(storageKey);
    internal = window.localStorage.getItem(storageKey) === "1";

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
    window["ga-disable-G-XZB9KZ4VCH"] = true;
    window["ga-disable-AW-17847190636"] = true;
  }
})(window);
