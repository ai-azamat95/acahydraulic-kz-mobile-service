const DEFAULT_SITE_NAME = 'ACA Hydraulic';

export function normalizeSeoText(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

export function compactSeoTitleBase(value, maxLength = 52) {
  const normalized = normalizeSeoText(value);
  if (normalized.length <= maxLength) return normalized;

  const candidate = normalized.slice(0, maxLength + 1);
  const boundary = Math.max(
    candidate.lastIndexOf(' '),
    candidate.lastIndexOf('—'),
    candidate.lastIndexOf(':'),
  );
  const compacted = boundary >= Math.floor(maxLength * 0.62)
    ? candidate.slice(0, boundary)
    : normalized.slice(0, maxLength);
  let result = compacted.replace(/[\s,:;|/—-]+$/u, '').trim();
  const trailingConnector = /\s+(?:and|for|from|of|the|to|with|для|и|из|на|от|по|с)$/iu;
  while (trailingConnector.test(result)) result = result.replace(trailingConnector, '').trim();
  return result;
}

export function formatSeoTitle(value, siteName = DEFAULT_SITE_NAME, maxLength = 68) {
  const normalized = normalizeSeoText(value);
  if (!normalized) return siteName;

  const escapedSiteName = siteName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const trailingBrand = new RegExp(`\\s*(?:[|—-])\\s*${escapedSiteName}$`, 'iu');
  const base = normalized.replace(trailingBrand, '').trim();

  if (base === siteName || (base.includes(siteName) && !trailingBrand.test(normalized))) {
    return compactSeoTitleBase(base, maxLength);
  }

  const suffix = ` | ${siteName}`;
  return `${compactSeoTitleBase(base, Math.max(20, maxLength - suffix.length))}${suffix}`;
}

export function compactSeoDescription(value, maxLength = 165) {
  const normalized = normalizeSeoText(value);
  if (normalized.length <= maxLength) return normalized;

  const sentences = normalized.match(/[^.!?]+[.!?]+(?:\s+|$)/gu) || [];
  let complete = '';
  for (const sentence of sentences) {
    const next = `${complete} ${sentence.trim()}`.trim();
    if (next.length > maxLength) break;
    complete = next;
  }
  if (complete.length >= Math.min(90, Math.floor(maxLength * 0.55))) return complete;

  const candidate = normalized.slice(0, maxLength - 1);
  const boundary = candidate.lastIndexOf(' ');
  const compacted = (boundary >= Math.floor(maxLength * 0.7)
    ? candidate.slice(0, boundary)
    : candidate
  ).replace(/[\s,:;|—-]+$/u, '');
  return `${compacted}…`;
}
