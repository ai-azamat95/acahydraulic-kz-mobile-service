import selection from './nsh-pump-selection.json' with { type: 'json' };

export const nshPumpSeries = selection.series;
export function nshPumpCopy(language = 'ru') {
  return Object.hasOwn(selection.copy, language) ? selection.copy[language] : selection.copy.ru;
}

export function nshPumpRequestHref(seriesId, language = 'ru') {
  const series = nshPumpSeries.find(item => item.id === seriesId);
  if (!series && seriesId !== 'other') throw new Error('Unknown NSh series');
  const t = nshPumpCopy(language);
  const message = [
    series ? t.request.replace('{series}', series.name) : t.requestOther,
    t.details,
    'https://acahydraulic.kz/catalog/category/gear-pumps/#nsh-selection',
  ].join('\n');
  return `https://wa.me/77714177925?text=${encodeURIComponent(message)}`;
}

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
export function renderNshPumpSelection(language = 'ru') {
  const t = nshPumpCopy(language);
  const link = (id, label) => `<a href="${escape(nshPumpRequestHref(id, language))}" target="_blank" rel="noopener noreferrer" data-aca-contact-event="catalog_whatsapp_click" data-aca-contact-source="catalog_nsh_selection" data-nsh-series="${id}">${escape(label)}</a>`;
  return `<section id="nsh-selection" data-nsh-selection aria-labelledby="nsh-selection-title"><h2 id="nsh-selection-title">${escape(t.heading)}</h2><p>${escape(t.intro)}</p><ul>${nshPumpSeries.map(series => `<li>${link(series.id, `${series.name} — ${t.action}`)}</li>`).join('')}</ul><p>${link('other', t.other)}</p><p>${escape(t.note)}</p></section>`;
}
