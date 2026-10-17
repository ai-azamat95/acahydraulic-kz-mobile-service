export const HYDRAUVISION_EXCHANGE_RATE_KZT = 508.95;
export const HYDRAUVISION_MARKUP = 1.5;
export const HYDRAUVISION_ROUNDING_KZT = 1_000;

export const HYDRAUVISION_PRICE_BAND_1_TO_49 = Object.freeze({
  positionFrom: 1,
  positionThrough: 49,
  sourceIds: Object.freeze([
    214, 215, 217, 1547, 1548, 1549, 1550, 230, 1556, 1557,
    229, 1543, 1553, 218, 219, 1542, 1552, 223, 1544, 1551,
    220, 1990, 1545, 1554, 226, 1546, 1555, 1875, 227, 232,
    1558, 1568, 1559, 1560, 1561, 1562, 1853, 1563, 1564, 1565,
    1566, 234, 235, 1567, 1569, 236, 1797, 1801, 1786,
  ]),
  upliftKzt: 348_000,
  throughBrand: 'Daikin',
  throughSku: 'J-V 38SA 3BL X-95',
  expectedAffectedPublishedProducts: 49,
  expectedMinimumRetailPriceKzt: 500_000,
});

export const HYDRAUVISION_PRICE_BAND_50_TO_85 = Object.freeze({
  positionFrom: 50,
  positionThrough: 85,
  sourceIds: Object.freeze([
    1799, 1775, 1811, 1536, 1537, 1607, 1539, 1540, 1907, 1534,
    1535, 1529, 1533, 1908, 1608, 1909, 1944, 1538, 1541, 1902,
    1614, 1526, 1528, 1527, 1532, 1609, 1688, 1613, 1530, 1531,
    1605, 1606, 1763, 1615, 1978, 1610,
  ]),
  upliftKzt: 430_000,
  fromBrand: 'Bosch Rexroth',
  fromSku: 'R901147104',
  throughBrand: 'Danfoss',
  throughSku: '83073386',
  expectedAffectedPublishedProducts: 36,
});

export const HYDRAUVISION_PRICE_ADJUSTMENTS = Object.freeze([
  HYDRAUVISION_PRICE_BAND_1_TO_49,
  HYDRAUVISION_PRICE_BAND_50_TO_85,
]);

const PRICE_ADJUSTMENT_BY_SOURCE_ID = new Map();
for (const adjustment of HYDRAUVISION_PRICE_ADJUSTMENTS) {
  if (adjustment.sourceIds.length !== adjustment.expectedAffectedPublishedProducts) {
    throw new Error(`Hydrauvision price band ${adjustment.positionFrom}-${adjustment.positionThrough} has an unexpected source ID count`);
  }
  for (const sourceId of adjustment.sourceIds) {
    if (PRICE_ADJUSTMENT_BY_SOURCE_ID.has(sourceId)) {
      throw new Error(`Hydrauvision source ID ${sourceId} is present in more than one price band`);
    }
    PRICE_ADJUSTMENT_BY_SOURCE_ID.set(sourceId, adjustment);
  }
}

export function baseHydrauvisionPriceKzt(sourcePriceExclTaxEur) {
  if (!(sourcePriceExclTaxEur > 0)) return null;
  return Math.round(
    (sourcePriceExclTaxEur * HYDRAUVISION_EXCHANGE_RATE_KZT * HYDRAUVISION_MARKUP)
      / HYDRAUVISION_ROUNDING_KZT,
  ) * HYDRAUVISION_ROUNDING_KZT;
}

export function hydrauvisionPriceAdjustmentForSourceId(sourceId) {
  return PRICE_ADJUSTMENT_BY_SOURCE_ID.get(Number(sourceId)) || null;
}

export function hydrauvisionRetailPriceKzt(sourcePriceExclTaxEur, sourceId) {
  const basePriceKzt = baseHydrauvisionPriceKzt(sourcePriceExclTaxEur);
  if (basePriceKzt === null) return null;
  const normalizedSourceId = Number(sourceId);
  if (!Number.isInteger(normalizedSourceId) || normalizedSourceId <= 0) {
    throw new TypeError('Hydrauvision source ID is required for retail price calculation');
  }
  return basePriceKzt + (hydrauvisionPriceAdjustmentForSourceId(normalizedSourceId)?.upliftKzt || 0);
}
