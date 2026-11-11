import { compactSeoTitleBase } from './seo-meta.mjs';

export const CATALOG_PAGE_SIZE = 10;
export const catalogAllProductsSeo = {
  title: 'Все товары каталога запчастей',
  description: 'Все позиции каталога ACA Hydraulic: подбор запчастей по номеру детали, модели и серийному номеру техники. Цену, наличие и срок подтверждаем до оплаты.',
};

export function catalogBasePath(path) {
  return path.replace(/\/page\/[^/]+\/?$/, '').replace(/\/$/, '') || '/';
}

export function catalogPathPage(path) {
  const match = path.match(/^\/catalog(?:\/(?:category|brand|model)\/[^/]+)?\/page\/([^/]+)\/?$/);
  if (!match) return null;
  return /^[1-9]\d*$/.test(match[1]) && Number.isSafeInteger(Number(match[1])) ? Number(match[1]) : 0;
}

export function catalogHasFilters(search) {
  const params = new URLSearchParams(search);
  return ['q', 'category', 'brand', 'model'].some(key => Boolean(params.get(key)?.trim()));
}

export function catalogPagePath(path, page) {
  const base = catalogBasePath(path);
  return base === '/catalog' || page > 1 ? `${base}/page/${page}/` : `${base}/`;
}

export function catalogPage(search) {
  const raw = new URLSearchParams(search).get('page');
  return raw && /^[1-9]\d*$/.test(raw) && Number.isSafeInteger(Number(raw)) ? Number(raw) : 1;
}

export function catalogStaticPageHref(path, search, page) {
  const params = new URLSearchParams(search);
  if (/^\/catalog(?:\/|$)/.test(path)) {
    params.delete('page');
    const filtered = catalogHasFilters(search);
    if (filtered && page > 1) params.set('page', String(page));
    const target = filtered ? `${catalogBasePath(path)}/` : catalogPagePath(path, page);
    return `${target}${params.size ? `?${params.toString()}` : ''}`;
  }
  return catalogPageHref(path, search, page);
}

export function catalogPageHref(path, search, page) {
  const params = new URLSearchParams(search);
  if (page > 1) params.set('page', String(page));
  else params.delete('page');
  const suffix = params.toString();
  return `${path}${suffix ? `?${suffix}` : ''}`;
}

export function catalogPageMetadata(title, description, page, pages, identity = title) {
  return page > 1 ? {
    title: `${compactSeoTitleBase(identity, 36)} — стр. ${page}`,
    description: `Страница ${page} из ${pages}. ${description}`,
  } : { title, description };
}

export function catalogPageNumbers(page, pages) {
  const selected = new Set([1, pages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach(value => selected.add(value));
  if (page >= pages - 2) [pages - 3, pages - 2, pages - 1].forEach(value => selected.add(value));
  const result = [];
  for (const value of [...selected].filter(value => value >= 1 && value <= pages).sort((a, b) => a - b)) {
    if (result.length && value - result[result.length - 1] > 1) result.push('…');
    result.push(value);
  }
  return result;
}
