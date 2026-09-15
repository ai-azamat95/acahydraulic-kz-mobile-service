// Classify the part being sold, not equipment mentioned after "for" or broad SEO tags.
export const categoryRules = [
 ['diagnostic-tools', /\b(diagnostic (tool|scanner|cable)|pressure test|gauge kit|test kit|service tool)\b/],
 ['seals-filters', /\b(seal kit|repair kit|gasket(?: kit)?|o ring|filter(?:s| element)?|sealing kit)\b/],
 ['electrical', /\b(sensor|solenoid|relay|(?:wiring |wire |pump )?harness|alternator|starter(?: motor)?|switch|ignition|speed governor|throttle motor)\b/],
 ['controllers-monitors', /\b(controller|monitor|display|ecu|ecm|control panel|computer board)\b/],
 ['pump-parts', /\b(pump (spare |replacement )?parts?|valve plate|cylinder block|piston shoe|swash plate|rotating group|rotary group|pump regulator|pump rebuild|pump repair|pump (?:drive |center )?shaft|pump bearing|pump housing|pump coupling)\b/],
 ['control-valves', /\b(control valve|main valve|relief valve|pilot valve|check valve|flow (control )?valve|valve assembly|valves|valve)\b/],
 ['final-drives', /\b(final drive|travel device|reduction gearbox|travel reduction|swing (reduction|gearbox)|gearbox)\b/],
 ['air-conditioning', /\b(compressor|air conditioning|air conditioner|a c|blower motor|radiator|condenser|evaporator)\b/],
 ['engine-fuel', /\b(fuel injector|injector|injection pump|fuel pump|feed pump|common rail|turbocharger|turbo|water pump|oil pump|engine|cylinder head|crankshaft|camshaft|piston ring|thermostat|muffler)\b/],
 ['hydraulic-motors', /\b(hydraulic (orbit )?motor|swing motor|travel motor|orbit(?:al)? motor|wheel motor|hydro (gear|gearmotor))\b/],
 ['hydraulic-pumps', /\b(hydraulic pump|piston pump|gear pump|main pump|hydrostatic pump)\b/],
 ['other-parts', /$^/],
];
export function normalizeSearchText(value) {
 return String(value || '').toLowerCase().replace(/[-_./]+/g,' ').replace(/\s+/g,' ').trim();
}
export function detectCategoryFromText(value) {
 const text=normalizeSearchText(value);
 return categoryRules.find(([,rule])=>rule.test(text))?.[0] || null;
}
export function detectCategory(product) {
 const title=normalizeSearchText(product.title);
 // Complete garden tools must never inherit a hydraulic category from supplier tags.
 if (/\b(brush cutter|grass trimmer|electric trimmer|electric scythe|chainsaw)\b/.test(title.split(/\bfor\b/)[0])) return 'other-parts';
 const subject=title.split(/\b(?:for|fits|compatible with|suitable for)\b/)[0];
 if (/\b(engine cylinder block|engine valve|fuel.*valve)\b/.test(subject)) return 'engine-fuel';
 return detectCategoryFromText(subject) || detectCategoryFromText(title) || detectCategoryFromText(product.product_type || product.productType) || 'other-parts';
}
