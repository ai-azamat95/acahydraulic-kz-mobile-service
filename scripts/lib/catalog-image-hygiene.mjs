const VISIBLE_SUPPLIER_MARK_KEYS_BY_PRODUCT_ID = new Map([
  ['7100654583970', new Set(['img2226'])],
  ['7100655534242', new Set(['img2224', 'img2225', 'img2226'])],
  ['7100655698082', new Set(['img2225', 'img2226'])],
  ['7098727923874', new Set(['wiringharness20706715625'])],
  ['7098723696802', new Set(['20y0671512pc2007wiringharness9'])],
  ['7718092800162', new Set(['img2839'])],
  ['7098718322850', new Set(['0001835hydraulicpumpwiringharnessforhitachiexcavator01'])],
  ['7100659695778', new Set(['hitachizax2003excavatorpartshydraulicpumpwiringharness1'])],
  [
    '7101340942498',
    new Set([
      '6735611501komatsuexcavators4d102epc607pc2006waterpump50720',
      '6735611501komatsuexcavators4d102epc607pc2006waterpump50721',
      '6735611501komatsuexcavators4d102epc607pc2006waterpump50722',
      '6735611501komatsuexcavators4d102epc607pc2006waterpump50723',
    ]),
  ],
  ['7102543757474', new Set(['6'])],
  [
    '7102671487138',
    new Set([
      '14390248voe14390248volvoecucontroller01',
      '14390248voe14390248volvoecucontroller02',
    ]),
  ],
]);

const VERIFIED_DUPLICATE_IMAGE_PATHS = new Set([
  '/s/files/1/0594/4046/4034/files/Bucket-Cylinder-Seal-Kit_04_26aea9c7-c2ea-4a83-81b8-f09dda34f05a.jpg',
  '/s/files/1/0594/4046/4034/files/Center-Joint-Seal-Kit_05_dc1356df-dc9b-409b-a758-a01bf241b61e.jpg',
  '/s/files/1/0594/4046/4034/files/Control-Valve-Seal-Kit_06_8e34df76-c53d-4f71-aa59-146715cd082e.jpg',
  '/s/files/1/0594/4046/4034/files/IMG_0377_2313f903-9723-4e24-a8ee-f382aaea6c56.jpg',
  '/s/files/1/0594/4046/4034/files/IMG_0377_68bb0809-5dff-426c-a5c0-6db971d3723f.jpg',
  '/s/files/1/0594/4046/4034/files/IMG_0377_766668b2-dd65-47d0-9ff3-4eded32b8862.jpg',
  '/s/files/1/0594/4046/4034/files/IMG_0378_2df55071-f30a-43ad-99d4-8d4d3cf2869d.jpg',
  '/s/files/1/0594/4046/4034/files/IMG_0378_2fc5ccc6-f945-46c6-b080-a993b45518b3.jpg',
  '/s/files/1/0594/4046/4034/files/IMG_2224.jpg',
  '/s/files/1/0594/4046/4034/files/IMG_2226.jpg',
  '/s/files/1/0594/4046/4034/files/IMG_2227.jpg',
  '/s/files/1/0594/4046/4034/files/IMG_2228.jpg',
  '/s/files/1/0594/4046/4034/files/IMG_2229.jpg',
  '/s/files/1/0594/4046/4034/files/IMG_2230.jpg',
  '/s/files/1/0594/4046/4034/files/IMG_7488_a8cb60e4-3e86-4c92-984a-dfa36989c3bf.jpg',
  '/s/files/1/0594/4046/4034/files/Pilot-Valve-Seal-Kit_09_d94ea8f1-a763-4872-a471-170482d4c201.jpg',
  '/s/files/1/0594/4046/4034/files/Swing-Motor-Seal-Kit_10_e5054250-f5ae-40df-8f5f-6663055a11fd.jpg',
  '/s/files/1/0594/4046/4034/files/Travel-Motor-Seal-Kit_11_eb19bb69-591d-45f7-815c-c680a384f837.jpg',
  '/s/files/1/0594/4046/4034/files/catE320BLMonitorLCDDisplay_1_b3d1f47d-8653-465a-ba98-5887aa503000.jpg',
  '/s/files/1/0594/4046/4034/products/YN22E00062F1_4_c2156d50-db4e-4f1d-8f4f-8d0adc1d9209.jpg',
]);

export function catalogImageIdentityKey(value) {
  try {
    const url = new URL(value, 'https://acahydraulic.kz');
    return decodeURIComponent(url.pathname.split('/').pop() || '')
      .toLowerCase()
      .replace(/\.(?:avif|gif|jpe?g|png|svg|webp)$/i, '')
      .replace(/_[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i, '')
      .replace(/(?:[-_](?:min|small|medium|large|thumb|thumbnail))+$/i, '')
      .replace(/[^a-z0-9]+/g, '');
  } catch {
    return String(value || '').toLowerCase();
  }
}

function catalogImagePath(value) {
  try {
    return decodeURIComponent(new URL(value, 'https://acahydraulic.kz').pathname);
  } catch {
    return '';
  }
}

export function catalogImageExclusionReason(productId, value) {
  const visibleSupplierMarkKeys = VISIBLE_SUPPLIER_MARK_KEYS_BY_PRODUCT_ID.get(String(productId));
  if (visibleSupplierMarkKeys?.has(catalogImageIdentityKey(value))) return 'visible-supplier-mark';
  if (VERIFIED_DUPLICATE_IMAGE_PATHS.has(catalogImagePath(value))) return 'verified-duplicate';
  return null;
}

export function isExcludedCatalogImage(productId, value) {
  return catalogImageExclusionReason(productId, value) !== null;
}
