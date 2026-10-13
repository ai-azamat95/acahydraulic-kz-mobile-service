import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const contactIntent = fs.readFileSync('client/src/lib/contactIntent.ts', 'utf8');
const b2bForm = fs.readFileSync('client/src/components/B2BLeadForm.tsx', 'utf8');
const calculator = fs.readFileSync('client/src/components/CostCalculator.tsx', 'utf8');
const home = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');
const footer = fs.readFileSync('client/src/components/Footer.tsx', 'utf8');
const ru = JSON.parse(fs.readFileSync('client/src/locales/ru/translation.json', 'utf8'));

test('a prepared WhatsApp message is not reported as a qualified or Google Ads lead', () => {
  assert.doesNotMatch(contactIntent, /send_to|AW-17847190636|qualified_lead|generate_lead/);
  assert.match(contactIntent, /lead_stage: 'contact_intent'/);
  assert.match(contactIntent, /contact_intent_id/);
});

test('service forms carry the same non-PII inquiry reference into WhatsApp and analytics', () => {
  for (const source of [b2bForm, calculator]) {
    assert.match(source, /Номер обращения:/);
    assert.match(source, /trackFormContactIntent\([^,]+, contactIntentId\)/);
  }
});

test('the public seller and payment recipient are the acquiring legal entity and link to the offer', () => {
  for (const source of [home, footer]) {
    assert.match(source, /Продавец и получатель оплаты:/);
    assert.match(source, /href="\/offer\/"/);
    assert.match(source, /ТОО «АСА-ГС» · БИН 240540017992/);
  }
});

test('the diagnostic intake is not presented as a price calculator', () => {
  assert.equal(ru.costCalculator.title, 'Заявка на');
  assert.equal(ru.costCalculator.titleHighlight, 'диагностику');
  assert.doesNotMatch(`${ru.costCalculator.title} ${ru.costCalculator.titleHighlight} ${ru.costCalculator.subtitle}`, /калькулятор|приблизительная стоимость/i);
});
