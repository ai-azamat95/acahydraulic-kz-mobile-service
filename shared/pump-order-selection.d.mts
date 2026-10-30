export type PumpOrderFamily = {
  id: string;
  name: string;
  intro: string;
  checklist: string[];
  documentationUrl: string;
  sourceLabel: string;
};
export type PumpOrderBrand = {
  families: PumpOrderFamily[];
};
export function pumpOrderBrand(brandSlug: string, activeCategory?: string): PumpOrderBrand | undefined;
export function pumpOrderFamily(brandSlug: string, familyId: string): PumpOrderFamily | undefined;
export function pumpOrderPageUrl(brandSlug: string, familyId: string): string;
export function buildPumpOrderWhatsAppUrl(brandSlug: string, familyId: string, fields?: { model?: string; city?: string; machine?: string; contactIntentId?: string }): string;
export function renderPumpOrderNavigation(): string;
export function renderPumpOrderSelection(brandSlug: string): string;
