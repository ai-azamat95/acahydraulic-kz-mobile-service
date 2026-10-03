import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const minimumPrice = /(?:от\s*)?200[\s,.]*000\s*(?:₸|тг|тенге|KZT)/iu;
const read = (file) => fs.readFileSync(file, 'utf8');

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}

test('diagnostic landing pages, article offers and schema have no public minimum fee', () => {
  const pages = ['services', 'brands', 'regions', 'blog', 'cases'].flatMap((section) => htmlFiles(`dist/public/${section}`));
  pages.push('dist/public/index.html');
  assert.ok(pages.length > 30, 'check the built public routes, not an empty directory');
  for (const file of pages) {
    assert.doesNotMatch(read(file), /диагностик[^.!?\n]{0,180}200[\s,.]*000\s*(?:₸|тг|тенге|KZT)/iu, file);
  }
  for (const route of ['services/hydraulic-pumps', 'services/hydraulic-motors', 'regions/astana', 'blog/remont-gidronasosa-cat']) {
    const html = read(`dist/public/${route}/index.html`);
    assert.match(html, /стоимость согласуем до выезда/i, route);
    assert.doesNotMatch(html, /бесплатн[а-я]*\s+диагностик/iu, route);
  }
});

test('both intake forms acknowledge paid diagnostics with a pending quote and preserve event contracts', () => {
  const contracts = {
    B2BLeadForm: ['b2b_budget_accepted', 'qualified_lead', 'generate_lead', 'qualified_b2b_form'],
    CostCalculator: ['calculator_budget_accepted', 'calculator_budget_rejected', 'calculator_price_gate_view', 'calculator_whatsapp_click', 'qualified_lead', 'generate_lead', 'qualified_mobile_service'],
  };
  for (const [component, events] of Object.entries(contracts)) {
    const source = read(`client/src/components/${component}.tsx`);
    assert.doesNotMatch(source, minimumPrice);
    assert.doesNotMatch(source, /DIAGNOSTIC_VALUE|diagnostic_price\s*:|budget_confirmed\s*:|\bvalue\s*:\s*\d|currency\s*:/);
    assert.match(source, /paid_diagnostics_acknowledged: true/);
    assert.match(source, /price_agreement_pending: true/);
    assert.match(source, /Понимаю, что диагностика платная\. Прошу согласовать полную стоимость до выезда\./);
    assert.doesNotMatch(source, /до начала работ/);
    assert.doesNotMatch(source, /ПОДТВЕРЖДЕНА|минимальную стоимость|подтверждение стоимости/);
    assert.match(source, /AW-17847190636\/JZkfCOu_84McEOyImr5C/);
    assert.match(source, /SubmitForm/);
    for (const event of events) assert.ok(source.includes(event), `${component}: ${event}`);
  }
});

test('non-diagnostic approved shipping prices and historical project amounts remain available', () => {
  const pumps = JSON.parse(read('shared/merchant-pumps.json'));
  assert.equal(pumps.shippingPriceKzt, 200000);
  assert.match(read('shared/delivery-and-returns.json'), /180 000–200 000 ₸/);
  assert.match(read('client/src/pages/Projects.tsx'), /1 200 000 тенге/);
});
