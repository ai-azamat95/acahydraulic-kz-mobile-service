import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import merchantCopy from '../shared/catalog-product-merchant-copy.json' with { type: 'json' };
import pilotCopy from '../shared/catalog-product-pilot-copy.json' with { type: 'json' };
import phase2Copy from '../shared/catalog-product-phase2-copy.json' with { type: 'json' };
import reviewedCopy from '../shared/catalog-product-copy.json' with { type: 'json' };
import { catalogCategoryCorrection } from '../shared/catalog-category-corrections.mjs';
import imageManifest from '../client/public/catalog-data/catalog-image-manifest.json' with { type: 'json' };
import {
  cleanFitment,
  createCatalogProductCopy,
  detectedBrand,
  loadProducts,
  productType,
  shortenWords,
} from './create-catalog-product-phase2.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(root, 'shared/catalog-product-phase3-copy.json');
const previousCopy = { ...reviewedCopy, ...pilotCopy, ...phase2Copy, ...merchantCopy };
const imageEntryByKey = new Map(imageManifest.entries.map(entry => [entry.key, entry]));
const productIdsByContentHash = imageManifest.entries.reduce((owners, entry) => {
  const ids = owners.get(entry.contentHash) || new Set();
  ids.add(String(entry.productId));
  owners.set(entry.contentHash, ids);
  return owners;
}, new Map());

export const phase3ModifiedDate = '2026-10-11';

export const phase3Quotas = {
  'hydraulic-pumps': 170,
  'gear-pumps': 60,
  'piston-pumps': 45,
  'fuel-injectors': 80,
  'fuel-pumps': 55,
  'engine-assemblies': 4,
  'engine-rebuild-kits': 14,
  'cylinder-heads': 8,
  'final-drives': 13,
  'main-control-valves': 10,
  'fan-motors': 2,
  controllers: 39,
};

const sensitiveHandles = {
  'engine-assemblies': [
    '4d106-2wfb-engine-assembly-for-komatsu-excavator-pc110',
    '6d102e-2-diesel-engine-assembly-for-komatsu-wheel-loader-wa320-5l',
    'engine-cummins-b5-9-c-for-komatsu-excavator-pc220-6',
    'nt855-engine-assembly-inline-6-4-stroke-cycle-diesel',
  ],
  'engine-rebuild-kits': [
    '2382720-engine-overhaul-rebuild-kit-for-cat-caterpillar-c7-engine',
    '3204-engine-overhaul-rebuild-kit-2w4831-for-cat-3204-engine-excavator',
    '3d95-engine-overhaul-kit',
    '3tne82a-overhaul-rebuild-kit-for-yanmar-engine',
    '4bg1t-rebuild-kit',
    '4d84-2-4d84e-2-engine-overhaul-rebuild-kit-for-yanmar-b6-komatsu-pc40-7-pc50uu-2',
    '4tne94-engine-overhaul-kit',
    '4tnv94-4tnv94l-4tnv94le-engine-rebuild-kit-for-hyundai-r55-7-r60-7',
    'mitsubishi-6d34t-engine-rebuild-kit',
    '6hk1-6hk1t-engine-overhaul-rebuild-kit-for-hitachi-zx330-ex356-excavator',
    'c240-c240pkj-c240pkg-engine-rebuild-kit-for-isuzu-tcm-komatsu-forklift',
    'd950-d950bh-d950b-engine-overhaul-rebuild-kit-for-kubota-engine-kh41-kh61-tractor',
    'komatsu-6d95-engine-parts-rebuild-kit',
    'kubota-v2607-rebuild-kit-for-kubota-v2607t-v2607-di-v2607-engine-overhaul-rebuild-kit-bobcat-s550-s570-s590-excavator-rebuild-kit',
  ],
  'cylinder-heads': [
    '223-7263-c18-cylinder-head-for-cat-caterpillar223-7263-223-9250-c18-cylinder-head',
    '223-9250-2239250-c18-cylinder-head-for-cat-caterpillar',
    '3945021-3948583-qsc8-3-cylinder-head-for-cummins39450213948583-qsc8-3-cylinder-head',
    '426-3438-complete-cylinder-head-for-caterpillar-cat-3024c-t-c2-2t-engine',
    '7w-2203-engine-cylinder-head-for-tractor-d8r-d8n-d8r-ii-engine-3406c-3406b',
    'cylinder-head-assembly-ch12455-for-perkins-1106-2206-engine',
    'cylinder-head-11101-76017-71-11101-73020-71-for-toyota-5fg-6fg-7fg-forklift-truck-4y-engine',
    'd902-complete-cylinder-head-for-kubota-kx41-3-bx23s-bx24-bx1880-bx2360-bx2370d-bx2380-zd323-zd1021-tractor-mower',
  ],
  'final-drives': [
    '14566400-excavator-final-drive-tm60-for-ec360-ec380',
    '170401-00014-excavator-final-drive-tm70-for-dx340lca-s420lca',
    '20t-60-72120-excavator-final-drive-tm06-for-pc55-50',
    '19031-20800-excavator-final-drive-tm175-for-tb175',
    '2401-9229a-excavator-final-drive-for-dx520lc-r520lc-7-r500lc-7',
    '31m8-40010-excavator-final-drive-ztm07-for-r60-sk60-ec55',
    '31q5-42050-excavator-final-drive-for-r140lc-9s',
    '31q7-40040-excavator-final-drive-for-r320-7-r330-9',
    '401-00023a-excavator-final-drive-for-daewoo-doosan-s255lc-v',
    '708-8f-31140-excavator-final-drive-gm35-for-komatsu-pc200-5-6-7-8',
    '4246158-excavator-final-drive-mag33-for-zax50-zax55-sy55',
    '9254461-travel-device-final-drive-for-hitachi-excavator-zx670lch-3',
    '9261222-final-drive-for-hitachi-excavator-zx200-3-zx210h-3-zx210k-3-zx210lc-3',
  ],
  'main-control-valves': [
    '31n7-10110-main-control-valve-for-hyundai-crawler-excavator-r250lc-7-r265lc-7',
    '723-19-13501-723-19-13503-main-control-valve',
    '723-46-20401-main-control-valve-for-komatsu-excavator-pc200-7-pc220-7',
    '723-47-23103-hydraulic-main-control-valve',
    'main-control-valve-4254673-for-hitachi-excavator-ex200-2',
    'main-control-valve-4606144-4628664-for-hitachi-excavator-zx200lc-3',
    'main-control-valve-4625137-for-hitachi-zx330-3-zx350h-3-excavator',
    'main-control-valve-723-46-20404-for-komatsu-excavator-pc200-7',
    'main-control-valve-723-47-23703-for-komatsu-pc200lc-8-engine',
    'main-control-valve-7234-62-0502-for-komatsu-excavator-pc220-7',
  ],
  'fan-motors': [
    'fan-motor-708-7s-00313-for-komatsu-wheel-loader-wa380-wa400-wa430',
    'fan-motor-708-7t-00710-for-komatsu-loader-wa500-6',
  ],
  controllers: [
    '119-0607-cpu-controller',
    '151-9293-cpu-controller',
    '20r2323-controller',
    '221-8874-excavator-320d-e320d-controller',
    '240-5304-2405304-ecu-controller-engine-control-module-ecm-for-cat-caterpillar-322c-966g',
    '262-2879-2622879-controller-control-unit-for-cat-caterpillar-336d-330d-336d2-324d-330d-excavator-c9-engine',
    '309-5710-control-unit',
    'pc200-8-ecu-engine-controller-komatsu',
    '7834-10-2002-excavator-controller-for-komatsu-pc200-6',
    '7834-10-9001-excavator-pump-controller-for-komatsu-pc100-6-pc120-6',
    '7834-20-2001-pc350-6-komatsu-excavator-controller',
    '7824-11-3000-controller',
    '7834-21-2000-controller-governor-assy-for-komatsu-excavator-pc200-6-pc200lc-6',
    '7835-28-3002-komatsu-excavator-controller-panel-pc400-7-pc450-7-pc800-7',
    '4248572-hitachi-ex200-2-ex300-2-computer-board',
    '4377228-controller',
    '8980121634-isuzu-controller',
    '9104907-hitachi-ex120-2-main-pump-controller',
    '9292114-controller',
    'voe-3161983-volvo-ec240b-ec210b-ecu',
    '14390248-volvo-controller',
    '14531360-volvo-ec210c-ec210b-ec210blc-vecu-controller',
    'voe-14594707-volvo-ec210d-ec220d-ec240d-vecu',
    '60100011-ecu-volvo',
    '21n6-42100-hce',
    '21n8-32300-hyundai-r290lc-7-cpu-computer-board',
    '21n1-32101-hyundai-r80-7-cpu-control-panel',
    '21n4-33101-cpu-controller',
    '21n8-32301-cpu-controller',
    '300611-00042l-controller',
    'k1007727a-doosan-excavator-dx340lc-e-epos-controller',
    '1pc-k1008873a-controller-for-doosan',
    '2480u307f2-kobelco-sk220lc-3-controller',
    '32g87-49340-engine-controller',
    'lq22e00024f2-controller-for-kobelco-excavator-sk250lc-sk250-6',
    'khr1785-sumitomo-sh120-2-sh120lc-2-vecu',
    'sumitomo-a2-controller-khr1784',
    'electronic-control-module-ecm-5317106-for-cummins-isx15-and-isb6-7-engine',
    '1pc-khr2692-controller-for-case-cx330-cx350',
  ],
};

export const phase3AllowedHandles = Object.fromEntries(
  Object.entries(sensitiveHandles).map(([family, handles]) => [family, new Set(handles)]),
);

export const rejectedPhase3Handles = new Set([
  '1dz-ii-1dz-2-engine-rebuild-kit-for-toyota-7-8fd-forklift-sdk-loaders-free-shipping',
  '4-pcs-fuel-injector-3349084-3802978-4089267-for-cummins-engine-4b3-9-4bta3-9',
  '4628892-travel-motor-final-drive-motor-fits-for-john-deere-50d-hitachi-zx40u-2-zx50u-2',
  'hydraulic-pump-160-psi-g1-2-inch-utb-u-650-power-steering-control-unit-bk99206-bzz-160-fits-for-danfoss-bzz-series',
  'hydraulic-pump-31lh-00200-hyundai-hl780-7a-hl780-9s-fits-case-1221e-wheel-loader',
  '9233692-excavator-final-drive-for-jd200g-jd210g',
  '9226744-for-hitachi-excavator-zx135us-zx135us-e-control-parts-with-programmed',
  'ym22e00027f2-programmed-controller',
]);

const detailByFamily = {
  'hydraulic-pumps': 'Сверим OEM, шильдик, вал, фланец, порты, вращение и регулятор.',
  'gear-pumps': 'Сверим OEM, рабочий объём, вращение, вал, фланец и порты.',
  'piston-pumps': 'Сверим OEM, шильдик, вал, фланец, порты, регулятор и датчики.',
  'fuel-injectors': 'Сверим OEM, маркировку, модель двигателя, разъём и код исполнения.',
  'fuel-pumps': 'Сверим OEM, шильдик, привод, разъёмы и порты.',
  'engine-assemblies': 'Проверим полный индекс, серийный номер, навесные узлы и подключения.',
  'engine-rebuild-kits': 'Сверим модель, серийный номер двигателя, размеры деталей и состав комплекта.',
  'cylinder-heads': 'Сверим OEM, модель двигателя, отверстия, клапаны и комплектацию.',
  'final-drives': 'Сверим OEM, посадочные размеры, отверстия и исполнение гидромотора.',
  'main-control-valves': 'Сверим OEM, секции, порты, клапаны, управление и разъёмы.',
  'fan-motors': 'Сверим OEM, вал, фланец, порты и направление вращения.',
  controllers: 'Сверим OEM, аппаратную версию, разъёмы и необходимость программирования.',
};

function normalizeBrandNames(value) {
  return value
    .replace(/\bCAT\s+Caterpillar\b/gi, 'Caterpillar')
    .replace(/\bdoosan\b/g, 'Doosan')
    .replace(/\s+/g, ' ')
    .trim();
}

export function hasHonestPhase3PrimaryImage(product) {
  if (product.imageUrl?.startsWith('/catalog-assets/category-')) return true;
  if (product.imageUrl?.startsWith('/')) return true;
  if (!product.imageUrl?.startsWith(imageManifest.imageBaseUrl)) return false;
  const key = product.imageUrl.slice(imageManifest.imageBaseUrl.length).replace(/^\//, '');
  const entry = imageEntryByKey.get(key);
  return Boolean(entry && productIdsByContentHash.get(entry.contentHash)?.size === 1);
}

function buildPhase3Description(product, family, primaryCode) {
  const type = productType(product, family);
  const fitment = normalizeBrandNames(cleanFitment(product.fitment));
  const brand = detectedBrand(product) || 'спецтехники';
  const detail = detailByFamily[family];
  const close = ' Цену и срок поставки подтвердим до оплаты.';
  const fitmentLimits = [44, 36, 30, 24, 18];
  const candidates = fitmentLimits.map(limit => {
    const shortFitment = shortenWords(fitment, limit) || brand;
    return `${type} ${primaryCode} для ${shortFitment}. ${detail}${close}`;
  });
  let description = candidates.find(value => value.length >= 110 && value.length <= 180);
  if (!description) {
    description = `${type} ${primaryCode} для ${brand}. ${detail}${close}`;
  }
  if (description.length < 110) description += ' Совместимость проверим заранее.';
  assert(description.length >= 110 && description.length <= 180, `${product.handle}: phase-three description must be 110–180 characters`);
  return description;
}

export function createPhase3Copy(products = loadProducts()) {
  const byHandle = new Map(products.map(product => [product.handle, product]));
  const raw = createCatalogProductCopy(products, {
    quotas: phase3Quotas,
    excludedCopy: previousCopy,
    allowedHandlesByFamily: phase3AllowedHandles,
    excludedHandles: rejectedPhase3Handles,
    modifiedDate: phase3ModifiedDate,
    preferPriced: false,
    splitCrossReferences: true,
    candidatePredicate: product => !catalogCategoryCorrection(product.id) && hasHonestPhase3PrimaryImage(product),
  });

  return Object.fromEntries(Object.entries(raw).map(([handle, content]) => {
    const product = byHandle.get(handle);
    const family = Object.entries(phase3AllowedHandles).find(([, handles]) => handles.has(handle))?.[0]
      || Object.keys(phase3Quotas).find(candidate => content.selectionCategory === candidate);
    assert(product && family, `${handle}: phase-three family must be traceable`);
    return [handle, {
      ...content,
      name: normalizeBrandNames(content.name),
      title: normalizeBrandNames(content.title),
      description: buildPhase3Description(product, family, content.primaryCode),
      reviewFamily: family,
      modifiedDate: phase3ModifiedDate,
    }];
  }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const serialized = `${JSON.stringify(createPhase3Copy(), null, 2)}\n`;
  if (process.argv.includes('--check')) {
    assert.equal(fs.readFileSync(outputPath, 'utf8'), serialized, 'phase-3 Russian copy is stale; regenerate it');
    console.log(`Verified ${Object.keys(JSON.parse(serialized)).length} deterministic phase-three Russian catalog copies.`);
  } else {
    fs.writeFileSync(outputPath, serialized);
    console.log(`Wrote ${Object.keys(JSON.parse(serialized)).length} phase-three Russian catalog copies to ${path.relative(root, outputPath)}.`);
  }
}
