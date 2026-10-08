export const CATALOG_PAGE_SIZE = 10;

export function catalogPage(search) {
  const raw = new URLSearchParams(search).get('page');
  return raw && /^[1-9]\d*$/.test(raw) && Number.isSafeInteger(Number(raw)) ? Number(raw) : 1;
}

export function catalogPageHref(path, search, page) {
  const params = new URLSearchParams(search);
  if (page > 1) params.set('page', String(page));
  else params.delete('page');
  const suffix = params.toString();
  return `${path}${suffix ? `?${suffix}` : ''}`;
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
