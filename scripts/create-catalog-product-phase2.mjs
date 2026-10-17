import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import aliases from '../shared/catalog-canonical-aliases.json' with { type: 'json' };
import { catalogCategoryCorrection } from '../shared/catalog-category-corrections.mjs';
import landings from '../shared/catalog-landings.json' with { type: 'json' };
import merchantCopy from '../shared/catalog-product-merchant-copy.json' with { type: 'json' };
import pilotCopy from '../shared/catalog-product-pilot-copy.json' with { type: 'json' };
import reviewedCopy from '../shared/catalog-product-copy.json' with { type: 'json' };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalogDir = path.join(root, 'client/public/catalog-data');
const outputPath = path.join(root, 'shared/catalog-product-phase2-copy.json');

export const phase2Quotas = {
  'hydraulic-pumps': 82,
  'gear-pumps': 35,
  'piston-pumps': 20,
  'fuel-injectors': 60,
  'fuel-pumps': 40,
  'wiring-harnesses': 25,
  'hydraulic-motors': 15,
  'control-valves': 8,
  'final-drives': 10,
  controllers: 5,
};

export const phase2ModifiedDate = '2026-10-11';

export const familyPatterns = {
  'hydraulic-pumps': /\b(?:hydraulic\s+(?:main\s+)?pump|main\s+hydraulic\s+pump)\b/i,
  'gear-pumps': /\b(?:hydraulic\s+)?gear\s+pump\b/i,
  'piston-pumps': /\b(?:hydraulic\s+)?piston\s+pump\b/i,
  'fuel-injectors': /\b(?:fuel|diesel|common\s+rail)(?:\s+diesel|\s+engine)?\s+injector\b|\binjector\s+(?:assy|assembly|unit)\b/i,
  'fuel-pumps': /\b(?:fuel\s+(?:injection|transfer)?\s*pump|injection\s+pump|unit\s+pump)\b/i,
  'wiring-harnesses': /\b(?:wiring|wire)\s+harness\b/i,
  'hydraulic-motors': /\b(?:hydraulic|gerotor|fan|swing|travel|drive)\s+motor\b/i,
  'control-valves': /\b(?:hydraulic\s+)?(?:main\s+)?control\s+valve\b/i,
  'final-drives': /\b(?:final\s+drive|travel\s+motor|swing\s+motor)\b/i,
  controllers: /\b(?:controller(?:\s+(?:panel|unit))?|control\s+unit|ECU|ECM|CPU|MCU)\b/i,
  'engine-assemblies': /\b(?:complete\s+(?:diesel\s+)?engine(?:\s+assembly)?|(?:diesel\s+)?engine\s+assembly)\b/i,
  'engine-rebuild-kits': /\b(?:engine\s+)?(?:rebuild|overhaul)\s+kit\b/i,
  'cylinder-heads': /\bcylinder\s+head(?:\s+assembly)?\b/i,
  'main-control-valves': /\b(?:hydraulic\s+)?main\s+control\s+valve\b/i,
  'fan-motors': /\b(?:hydraulic\s+)?fan\s+motor\b/i,
};

export const familyCategories = {
  'engine-assemblies': 'engine-fuel',
  'cylinder-heads': 'engine-fuel',
  'fan-motors': 'hydraulic-motors',
};

export const familyExclusionPatterns = {
  'hydraulic-pumps': /\b(?:hydraulic\s+(?:main\s+)?pump\s+(?:regulator|valve|sensor|solenoid|wiring\s+harness|case|housing|seal|repair\s+kit|parts?)|main\s+hydraulic\s+pump\s+parts?|pump\s+regulator|seal\s+kit)\b/i,
  'gear-pumps': /\b(?:A10V[A-Z0-9-]*|gear\s+pump\s+(?:regulator|valve|sensor|solenoid|wiring\s+harness|case|housing|seal|repair\s+kit)|pump\s+regulator|seal\s+kit)\b/i,
  'piston-pumps': /\b(?:piston\s+pump\s+(?:regulator|valve|sensor|solenoid|wiring\s+harness|case|housing|seal|repair\s+kit)|pump\s+regulator|seal\s+kit)\b/i,
  'fuel-injectors': /\b(?:injector\s+(?:connector\s+)?(?:tubes?|lines?|pipes?|wiring\s+harness|repair\s+kit)|connector\s+tubes?|seal\s+kit)\b/i,
  'fuel-pumps': /\b(?:fuel\s+(?:injection\s+|transfer\s+)?pump\s+(?:valve|sensor|solenoid|wiring\s+harness|case|housing|seal|repair\s+kit)|pump\s+valve|seal\s+kit)\b/i,
  'wiring-harnesses': /\b(?:repair\s+kit|connector\s+tubes?)\b/i,
  'hydraulic-motors': /\b(?:control\s+valve|sensor|repair\s+kit|seal\s+kit)\b/i,
  'control-valves': /\b(?:control\s+valve\s+(?:wiring\s+harness|case|housing|seal|repair\s+kit)|wire\s+harness|fuel|suction\s+control\s+valve|metering)\b/i,
  'final-drives': /\b(?:repair\s+kit|seal\s+kit|bearing\s+kit|gear\s+set|shaft)\b/i,
  controllers: /\b(?:wiring|wire\s+harness|sensor|repair\s+kit)\b/i,
  'engine-assemblies': /\b(?:long\s+block|short\s+block|gasket|repair\s+kit|rebuild\s+kit|overhaul\s+kit)\b/i,
  'engine-rebuild-kits': /\b(?:valve|pump|injector)\s+(?:rebuild|overhaul)\s+kit\b/i,
  'cylinder-heads': /\b(?:gasket|bolt|cover|repair\s+kit)\b/i,
  'main-control-valves': /\b(?:wiring\s+harness|repair\s+kit|seal\s+kit|solenoid)\b/i,
  'fan-motors': /\b(?:repair\s+kit|seal\s+kit|sensor|valve)\b/i,
};

const passengerVehiclePattern = /\b(?:Citro[eë]n|Peugeot|Dodge|Great\s+Wall|Mitsubishi\s+L200|Kia\s+(?:Sportage|Sorento)|Hyundai\s+(?:Tucson|Santa\s+Fe)|Ram\s+(?:2500|3500|4500|5500))\b/i;
const conflictingFitmentPattern = /\b(?:Cummins[^.]*4JJ1|4JJ1[^.]*Cummins)\b/i;

const priorityHandles = new Map([
  ['22423435-controller', 2],
  ['hydraulic-gear-pump-gsp2-box14r-10-632-0-for-rexroth-case-cx50b-cx55b-excavator', 1],
]);

const existingCopy = { ...reviewedCopy, ...pilotCopy, ...merchantCopy };
// Preserve the brand vocabulary used to review the fixed October 11 cohorts.
// New navigation brands must not silently reselect or rewrite approved copy.
const reviewedBrandSlugs = new Set('caterpillar komatsu hitachi volvo hyundai sany xcmg shantui doosan kobelco liebherr jcb danfoss rexroth kawasaki parker husco handok cummins'.split(' '));
const brandAliases = landings.brands
  .filter(brand => reviewedBrandSlugs.has(brand.slug))
  .flatMap(brand => brand.aliases.map(alias => ({ alias, name: brand.name.replace(/\s+CE$/i, '') })))
  .sort((a, b) => b.alias.length - a.alias.length);

const codes = value => String(value || '')
  .toUpperCase()
  .match(/\b[A-Z0-9]+(?:[-./][A-Z0-9]+)*\b/g)
  ?.filter(word => /\d/.test(word) && !/^(?:\d+V|\d+PCS?|\d+T)$/i.test(word)) || [];

export const normalizedCode = value => value.toUpperCase().replace(/[^A-Z0-9]/g, '');

function productCategories(product) {
  return product.categories?.length ? product.categories : [product.category];
}

export function productType(product, family) {
  const title = product.title;
  if (family === 'hydraulic-pumps') return /\bmain\b/i.test(title) ? 'Основной гидронасос' : 'Гидронасос';
  if (family === 'gear-pumps') return /\bpilot\b/i.test(title) ? 'Пилотный шестерённый насос' : 'Шестерённый насос';
  if (family === 'piston-pumps') return 'Поршневой гидронасос';
  if (family === 'fuel-injectors') {
    const packageCount = Number(title.match(/\b(\d+)\s*PCS?\b/i)?.[1] || 0);
    if (packageCount > 1) return /\bcommon\s+rail\b/i.test(title)
      ? `Комплект из ${packageCount} форсунок Common Rail`
      : `Комплект из ${packageCount} топливных форсунок`;
    return /\bcommon\s+rail\b/i.test(title) ? 'Форсунка Common Rail' : 'Топливная форсунка';
  }
  if (family === 'fuel-pumps') {
    if (/\btransfer\s+pump\b/i.test(title)) return 'Топливоподкачивающий насос';
    if (/\b(?:fuel\s+injection|injection|unit)\s+pump\b/i.test(title)) return 'ТНВД';
    return 'Топливный насос';
  }
  if (family === 'wiring-harnesses') {
    if (/\b(?:internal|inner|cabin)\b/i.test(title)) return 'Внутренний жгут проводки';
    if (/\bexternal|outer\b/i.test(title)) return 'Внешний жгут проводки';
    if (/\bhydraulic\s+pump\s+(?:wiring|wire)\s+harness\b/i.test(title)) return 'Жгут проводки гидронасоса';
    if (/\bengine\s+(?:wiring|wire)\s+harness\b/i.test(title)) return 'Жгут проводки двигателя';
    return 'Жгут проводки';
  }
  if (family === 'hydraulic-motors') {
    if (/\bfan\s+motor\b/i.test(title)) return 'Гидромотор вентилятора';
    if (/\bswing\s+motor\b/i.test(title)) return 'Гидромотор поворота';
    if (/\btravel\s+motor\b/i.test(title)) return 'Гидромотор хода';
    return 'Гидромотор';
  }
  if (family === 'control-valves') {
    if (/\bmain\s+control\s+valve\b/i.test(title)) return 'Главный гидрораспределитель';
    if (/\bcontrol\s+valve\s+block\b/i.test(title)) return 'Блок клапанов управления';
    return 'Клапан управления';
  }
  if (family === 'final-drives') {
    if (/\b(?:travel\s+motor|final\s+drive\s+motor)\b/i.test(title)) return 'Гидромотор хода';
    if (/\bswing\s+motor\b/i.test(title)) return 'Гидромотор поворота';
    return 'Бортовой редуктор';
  }
  if (family === 'engine-assemblies') return 'Двигатель в сборе';
  if (family === 'engine-rebuild-kits') return 'Ремкомплект двигателя';
  if (family === 'cylinder-heads') return 'Головка блока цилиндров';
  if (family === 'main-control-valves') return 'Главный гидрораспределитель';
  if (family === 'fan-motors') return 'Гидромотор вентилятора';
  return 'Контроллер';
}

export function cleanFitment(value) {
  return String(value)
    .replace(/\bcompatible\s+with\b/gi, ' ')
    .replace(/\b(?:fits?|for|various)\b/gi, ' ')
    .replace(/\btruck\s*(?:&|\/)\s*excavator(?:\s+engine)?\b/gi, ' ')
    .replace(/\b(?:skid\s+steer\s+loader|skid\s+steers?|wheel\s+loader|backhoe\s+loader|crawler\s+loader|crawler\s+dozer|drilling\s+rig|road\s+roller|motor\s+grader|scissor\s+lifts?|tracked\s+skidders?|mini\s+excavator|industrial\s+equipment|excavators?|bulldozers?|loaders?|forklifts?|dozers?|crawlers?|wheels?|industrial|mini|machines?|trucks?|tractors?|engines?|equipment|parts?|series|diesel|bus|genuine|assy|assembly)\b/gi, ' ')
    .replace(/\b(?:and)\b|&/gi, ' ')
    .replace(/(^|\s)\/(?=\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^\s*[,:;/|-]+|[,:;/|-]+\s*$/g, '')
    .trim();
}

export function identityCodes(product) {
  const values = [product.title, product.catalogTitle, product.fitment].filter(Boolean).join(' ');
  return [...new Set(codes(values))];
}

const compactIdentityFamilies = new Set([
  'engine-assemblies',
  'engine-rebuild-kits',
  'cylinder-heads',
]);

function isSpecificationCode(code, source = '') {
  if (/^(?:19|20)\d{2}(?:-(?:19|20)\d{2})?$/i.test(code)) return true;
  if (/^\d+(?:\.\d+)?(?:L|MM|PCS?|CYLINDERS?)$/i.test(code)) return true;
  if (/^\d+(?:\.\d+)?-?CYLINDERS?$/i.test(code)) return true;
  if (/^\d+-?STROKE(?:-CYCLE)?$/i.test(code)) return true;
  const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (/^\d+(?:\.\d+)?$/i.test(code) && new RegExp(`\\b${escaped}\\s*(?:LITERS?|L|CYLINDERS?)\\b`, 'i').test(source)) return true;
  return /^\d{1,3}$/.test(code);
}

export function identityCodesForFamily(product, family) {
  const sourceCodes = identityCodes(product);
  return compactIdentityFamilies.has(family)
    ? sourceCodes.filter(code => !isSpecificationCode(code, `${product.title} ${product.catalogTitle || ''}`))
    : sourceCodes;
}

export function partCodes(product) {
  const fitmentCodes = new Set(codes(product.fitment).map(normalizedCode));
  const title = [product.title, product.catalogTitle].filter(Boolean).join(' ');
  const titleCodes = codes(title);
  const contextualDescriptors = new Set(titleCodes.slice(1)
    .filter(code => {
      const escaped = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`\\b${escaped}\\s+(?:ENGINE\\s+)?(?:ECM|WIRING\\s+HARNESS)\\b`, 'i').test(title)
        || new RegExp(`\\b(?:CONTROLLER|ECM|CPU)\\s+${escaped}\\s+FOR\\b`, 'i').test(title);
    })
    .map(normalizedCode));
  return [...new Set(titleCodes)]
    .filter(code => !fitmentCodes.has(normalizedCode(code)) && !contextualDescriptors.has(normalizedCode(code)));
}

export function partCodesForFamily(product, family) {
  const sourceCodes = partCodes(product);
  return compactIdentityFamilies.has(family)
    ? sourceCodes.filter(code => !isSpecificationCode(code, `${product.title} ${product.catalogTitle || ''}`))
    : sourceCodes;
}

export function normalizedPartCodesForFamily(product, family, { splitCrossReferences = false } = {}) {
  return [...new Set(partCodesForFamily(product, family)
    .flatMap(code => {
      if (!splitCrossReferences || !code.includes('/')) return [code];
      const parts = code.split('/').filter(Boolean);
      return parts.length > 1 && parts.every(part => normalizedCode(part).length >= 4 && /\d/.test(part)) ? parts : [code];
    })
    .map(normalizedCode)
    .filter(Boolean))];
}

function primaryCode(product) {
  const preferred = partCodes(product).find(code => normalizedCode(code).length >= 5);
  return preferred || codes(product.title).find(code => normalizedCode(code).length >= 5) || '';
}

function familyCategory(family) {
  return familyCategories[family] || family;
}

export function detectedBrand(product) {
  const identity = `${product.title} ${product.fitment}`.toLowerCase();
  return brandAliases.find(({ alias }) => new RegExp(`(^|[^a-z0-9])${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^a-z0-9]|$)`, 'i').test(identity))?.name || '';
}

export function shortenWords(value, maxLength) {
  const words = value.split(/\s+/).filter(Boolean).filter((word, index, all) => (
    index === 0 || normalizedCode(word) !== normalizedCode(all[index - 1])
  ));
  while (words.length > 1 && words.join(' ').length > maxLength) words.pop();
  const result = words.join(' ').replace(/(?:\s+[\/,&-])+$/, '').trim();
  return result.length <= maxLength ? result : '';
}

function buildTitle(type, primary, fitment) {
  const base = `${type} ${primary}`;
  if (base.length > 49) return '';
  const available = 49 - base.length - 5;
  const shortFitment = available > 2 ? shortenWords(fitment, available) : '';
  return shortFitment ? `${base} для ${shortFitment}` : base;
}

function buildDescription(type, primary, fitment) {
  const fitmentShort = shortenWords(fitment, 42) || detectedBrand({ title: fitment, fitment }) || 'спецтехники';
  const intro = `${type} ${primary} для ${fitmentShort}`;
  const tails = [
    '. Перед заказом сверим номер детали, модель техники и шильдик. Цену и срок поставки подтвердим до оплаты.',
    '. Подбор по номеру детали, модели и шильдику. Цену, комплектацию и срок поставки подтвердим до оплаты.',
    '. Сверим номер детали, модель и шильдик. Цену и срок подтвердим до оплаты.',
  ];
  let description = tails.map(tail => intro + tail).find(value => value.length <= 180) || `${type} ${primary}. Подбор по номеру детали и шильдику. Цену и срок подтвердим до оплаты.`;
  if (description.length < 110) description += ' Поставка по Казахстану.';
  if (description.length < 110) description += ' Комплектацию уточним заранее.';
  return description;
}

export function makeCopy(product, family, { modifiedDate = phase2ModifiedDate } = {}) {
  const type = productType(product, family);
  const fitment = cleanFitment(product.fitment);
  const missingCodes = partCodesForFamily(product, family);
  const primary = compactIdentityFamilies.has(family)
    ? missingCodes.find(code => /\d/.test(code)) || primaryCode(product)
    : primaryCode(product);
  const identifiers = missingCodes.length ? missingCodes.join(' / ') : primary;
  const name = `${type} ${identifiers} для ${fitment}`.replace(/\s+/g, ' ').trim();
  const title = buildTitle(type, primary, fitment);
  const description = buildDescription(type, primary, fitment);
  return {
    sourceTitle: product.title,
    primaryCode: primary,
    name,
    title,
    description,
    selectionCategory: familyCategory(family),
    modifiedDate,
  };
}

function score(product, priorities = priorityHandles, preferPriced = true) {
  return [
    priorities.get(product.handle) || 0,
    preferPriced ? Number(Number.isFinite(product.minPriceKzt)) : 0,
    Math.min(product.gallery?.length || 0, 4),
    Number(Boolean(detectedBrand(product))),
  ];
}

export function compareCandidates(a, b, priorities = priorityHandles, preferPriced = true) {
  const left = score(a, priorities, preferPriced);
  const right = score(b, priorities, preferPriced);
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) return right[index] - left[index];
  }
  return a.handle.localeCompare(b.handle, 'en');
}

export function validCandidate(product, family, excludedCopy = existingCopy) {
  if (excludedCopy[product.handle] || aliases[product.handle]) return false;
  if (!product.imageUrl || !product.fitment || !product.sku) return false;
  if (passengerVehiclePattern.test(`${product.title} ${product.fitment}`)) return false;
  if (conflictingFitmentPattern.test(`${product.title} ${product.fitment}`)) return false;
  if (product.catalogTitle && /[А-ЯЁ]/i.test(product.catalogTitle)) return false;
  if (!productCategories(product).includes(familyCategory(family)) || !familyPatterns[family].test(product.title)) return false;
  if (familyExclusionPatterns[family].test(product.title)) return false;
  const copy = makeCopy(product, family);
  const fitment = cleanFitment(product.fitment);
  if (!fitment || (!codes(fitment).length && !detectedBrand(product))) return false;
  if (!copy.primaryCode || !copy.title || copy.name.length > 180 || /\bдля\s*$/i.test(copy.name)) return false;
  if (!/[А-ЯЁ]/i.test(copy.name) || /\b(?:Hydraulic|Fuel|Injection|Pump|Injector|Wiring|Harness|Fits|for|Excavator|Engine|Machine|Truck|Loader|Controller|Motor|Valve)\b/i.test(copy.name)) return false;
  if (copy.description.length < 110 || copy.description.length > 180) return false;
  const sourceCodes = identityCodesForFamily(product, family);
  const nameCodes = codes(copy.name);
  if (sourceCodes.some(code => !nameCodes.includes(code))) return false;
  if (nameCodes.some(code => !sourceCodes.includes(code))) return false;
  return true;
}

export function loadProducts() {
  return fs.readdirSync(catalogDir)
    .filter(file => /^search-index-\d+\.json$/.test(file))
    .sort()
    .flatMap(file => JSON.parse(fs.readFileSync(path.join(catalogDir, file), 'utf8')))
    .filter(product => !product.catalogSupplement);
}

export function createCatalogProductCopy(products, {
  quotas,
  excludedCopy,
  priorities = new Map(),
  allowedHandlesByFamily = {},
  excludedHandles = new Set(),
  modifiedDate = phase2ModifiedDate,
  preferPriced = true,
  splitCrossReferences = false,
  candidatePredicate = () => true,
} = {}) {
  const byHandle = new Map(products.map(product => [product.handle, product]));
  const usedCodes = new Set();
  for (const handle of Object.keys(excludedCopy)) {
    const product = byHandle.get(handle);
    if (!product) continue;
    for (const code of normalizedPartCodesForFamily(product, '', { splitCrossReferences })) usedCodes.add(code);
  }

  const result = {};
  for (const [family, quota] of Object.entries(quotas)) {
    const allowedHandles = allowedHandlesByFamily[family];
    const candidates = products
      .filter(product => !excludedHandles.has(product.handle))
      .filter(product => !allowedHandles || allowedHandles.has(product.handle))
      .filter(candidatePredicate)
      .filter(product => validCandidate(product, family, excludedCopy))
      .sort((a, b) => compareCandidates(a, b, priorities, preferPriced));
    let selected = 0;
    for (const product of candidates) {
      const copy = makeCopy(product, family, { modifiedDate });
      const normalizedPartCodes = normalizedPartCodesForFamily(product, family, { splitCrossReferences });
      if (!normalizedPartCodes.length || normalizedPartCodes.some(code => usedCodes.has(code))) continue;
      for (const code of normalizedPartCodes) usedCodes.add(code);
      result[product.handle] = copy;
      selected += 1;
      if (selected === quota) break;
    }
    assert.equal(selected, quota, `${family}: expected ${quota} high-confidence products, selected ${selected}`);
  }
  return result;
}

export function createPhase2Copy(products = loadProducts()) {
  return createCatalogProductCopy(products, {
    quotas: phase2Quotas,
    excludedCopy: existingCopy,
    priorities: priorityHandles,
    // Phase two is a fixed reviewed cohort. Later taxonomy corrections must
    // not silently replace already-reviewed product copy at a quota boundary.
    candidatePredicate: product => !catalogCategoryCorrection(product.id),
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const serialized = `${JSON.stringify(createPhase2Copy(), null, 2)}\n`;
  if (process.argv.includes('--check')) {
    assert.equal(fs.readFileSync(outputPath, 'utf8'), serialized, 'phase-2 Russian copy is stale; regenerate it');
    console.log(`Verified ${Object.keys(JSON.parse(serialized)).length} deterministic Russian catalog copies.`);
  } else {
    fs.writeFileSync(outputPath, serialized);
    console.log(`Wrote ${Object.keys(JSON.parse(serialized)).length} Russian catalog copies to ${path.relative(root, outputPath)}.`);
  }
}
