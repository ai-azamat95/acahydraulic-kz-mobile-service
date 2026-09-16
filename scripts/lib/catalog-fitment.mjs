const FITMENT_MARKER = /\b(?:suitable\s+for|compatible\s+with|fits?(?:\s+for)?|for)\s+(.+)$/gi;

/**
 * Extract only fitment explicitly stated in the public product title.
 * Missing fitment must stay unknown rather than being inferred from a part name.
 */
export function extractFitment(value) {
  const title = String(value || '').replace(/\s+/g, ' ').trim();
  const match = [...title.matchAll(FITMENT_MARKER)].at(-1);
  const fitment = String(match?.[1] || '')
    .replace(/[\s,.;:–—-]+$/g, '')
    .trim();

  if (fitment.length < 2) return null;
  return fitment.slice(0, 180).trim();
}
