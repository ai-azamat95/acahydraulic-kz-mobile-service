import selection from './pump-order-selection.json' with { type: 'json' };

const SITE_ORIGIN = 'https://acahydraulic.kz';
const PUMP_CATEGORIES = new Set(['hydraulic-pumps', 'piston-pumps']);

export function pumpOrderBrand(brandSlug, activeCategory = '') {
  if (activeCategory && !PUMP_CATEGORIES.has(activeCategory)) return undefined;
  return Object.hasOwn(selection.brands, brandSlug) ? selection.brands[brandSlug] : undefined;
}

export function pumpOrderFamily(brandSlug, familyId) {
  return pumpOrderBrand(brandSlug)?.families.find(family => family.id === familyId);
}

export function pumpOrderPageUrl(brandSlug, familyId) {
  if (!pumpOrderFamily(brandSlug, familyId)) throw new Error('Unknown pump family');
  return `${SITE_ORIGIN}/catalog/brand/${brandSlug}/#${familyId}`;
}

// Form fields go only into the message the visitor chooses to send to WhatsApp.
// Analytics callers must use fixed family/brand IDs rather than these values.
export function buildPumpOrderWhatsAppUrl(brandSlug, familyId, fields = {}) {
  const family = pumpOrderFamily(brandSlug, familyId);
  if (!family) throw new Error('Unknown pump family');
  const clean = value => typeof value === 'string' ? value.replace(/\s+/g, ' ').trim().slice(0, 180) : '';
  const lines = [
    `Здравствуйте! Нужен гидронасос ${family.name} под заказ.`,
    'Прошу проверить исполнение, цену и срок поставки.',
    /^ACA-[A-Z0-9]+-[A-Z0-9-]+$/.test(fields.contactIntentId || '') ? `Номер обращения: ${fields.contactIntentId}` : '',
    clean(fields.model) ? `Модель / номер со шильдика: ${clean(fields.model)}` : '',
    clean(fields.city) ? `Город поставки: ${clean(fields.city)}` : '',
    clean(fields.machine) ? `Техника: ${clean(fields.machine)}` : '',
    'Фото шильдика и подключений пришлю в чат.',
    `Страница: ${pumpOrderPageUrl(brandSlug, familyId)}`,
  ].filter(Boolean);
  return `https://wa.me/77714177925?text=${encodeURIComponent(lines.join('\n'))}`;
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function renderPumpOrderNavigation() {
  return `<nav data-pump-order-navigation aria-label="Подбор по семейству гидронасоса"><h2>Подбор по семейству гидронасоса</h2><ul>${Object.entries(selection.brands).flatMap(([slug, brand]) => brand.families.map(family => `<li><a href="/catalog/brand/${slug}/#${family.id}">${escapeHtml(family.name)}</a></li>`)).join('')}</ul></nav>`;
}

export function renderPumpOrderSelection(brandSlug) {
  const brand = pumpOrderBrand(brandSlug);
  if (!brand) return '';
  return `<section data-pump-order-selection="${escapeHtml(brandSlug)}">
    <h2>Подбор насоса по семейству</h2>
    <p>${escapeHtml(selection.terms)}</p>
    <nav aria-label="Семейства гидронасосов"><ul>${brand.families.map(family => `<li><a href="#${family.id}">${escapeHtml(family.name)}</a></li>`).join('')}</ul></nav>
    ${brand.families.map(family => `<article id="${family.id}" data-pump-family="${family.id}">
      <h3>${escapeHtml(family.name)} под заказ</h3>
      <p>${escapeHtml(family.intro)}</p>
      <h4>Что прислать для проверки</h4>
      <ul>${family.checklist.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      <p><a data-aca-contact-event="catalog_whatsapp_click" data-aca-contact-source="static_pump_order_selection" data-aca-pump-family="${family.id}" href="${escapeHtml(buildPumpOrderWhatsAppUrl(brandSlug, family.id))}" target="_blank" rel="noopener noreferrer">${escapeHtml(selection.cta)}</a></p>
      <p>Откроется WhatsApp с подготовленным текстом. Прикрепите фото и отправьте сообщение в чате.</p>
      <p><a href="tel:+77714177925">Позвонить: +7 771 417 79 25</a></p>
      <p><a href="${escapeHtml(family.documentationUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(family.sourceLabel)}</a></p>
    </article>`).join('')}
  </section>`;
}
