export const HYDRAUVISION_EXCHANGE_RATE_KZT = 508.95;
export const HYDRAUVISION_MARKUP = 1.5;
export const HYDRAUVISION_ROUNDING_KZT = 1_000;

export const HYDRAUVISION_SELECTED_PRICE_ADJUSTMENT = Object.freeze({
  sourcePriceCeilingExclTaxEur: 1_244.67,
  upliftKzt: 348_000,
  throughBrand: 'Daikin',
  throughSku: 'J-V 38SA 3BL X-95',
  expectedAffectedPublishedProducts: 49,
  expectedMinimumRetailPriceKzt: 500_000,
});

export function baseHydrauvisionPriceKzt(sourcePriceExclTaxEur) {
  if (!(sourcePriceExclTaxEur > 0)) return null;
  return Math.round(
    (sourcePriceExclTaxEur * HYDRAUVISION_EXCHANGE_RATE_KZT * HYDRAUVISION_MARKUP)
      / HYDRAUVISION_ROUNDING_KZT,
  ) * HYDRAUVISION_ROUNDING_KZT;
}

export function hasHydrauvisionSelectedPriceAdjustment(sourcePriceExclTaxEur) {
  return sourcePriceExclTaxEur > 0
    && sourcePriceExclTaxEur <= HYDRAUVISION_SELECTED_PRICE_ADJUSTMENT.sourcePriceCeilingExclTaxEur;
}

export function hydrauvisionRetailPriceKzt(sourcePriceExclTaxEur) {
  const basePriceKzt = baseHydrauvisionPriceKzt(sourcePriceExclTaxEur);
  if (basePriceKzt === null) return null;
  return basePriceKzt + (hasHydrauvisionSelectedPriceAdjustment(sourcePriceExclTaxEur)
    ? HYDRAUVISION_SELECTED_PRICE_ADJUSTMENT.upliftKzt
    : 0);
}
