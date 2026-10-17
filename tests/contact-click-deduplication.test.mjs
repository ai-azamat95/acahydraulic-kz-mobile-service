import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';

const indexHtml = fs.readFileSync('client/index.html', 'utf8');
const trackerSource = [...indexHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map(match => match[1])
  .find(source => source.includes("document.addEventListener('click'"));

assert.ok(trackerSource, 'document-level contact tracker is required');

class AnchorHarness extends EventTarget {
  constructor(attributes) {
    super();
    this.attributes = new Map(Object.entries(attributes));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  closest(selector) {
    return selector === 'a[href]' ? this : null;
  }

  click() {
    this.dispatchEvent(new Event('click', { bubbles: true, cancelable: true }));
  }
}

function contactClickHarness(attributes) {
  const anchor = new AnchorHarness(attributes);
  const gtagCalls = [];
  const tiktokCalls = [];
  const window = {
    __ACA_ANALYTICS_EXCLUDE__: false,
    __ACA_COOKIE_CONSENT__: { analytics: true, marketing: true },
    gtag: (...args) => gtagCalls.push(args),
    ttq: { track: (...args) => tiktokCalls.push(args) },
  };
  const document = {
    addEventListener(type, listener, options) {
      anchor.addEventListener(type, listener, options);
    },
  };

  vm.runInNewContext(trackerSource, { document, window });
  return { anchor, gtagCalls, tiktokCalls, window };
}

test('one React-managed WhatsApp DOM click emits only its source-specific contact-intent event', () => {
  for (const eventName of ['case_whatsapp_click', 'catalog_whatsapp_click']) {
    const { anchor, gtagCalls, tiktokCalls, window } = contactClickHarness({
      href: 'https://wa.me/77714177925?text=test',
      'data-aca-contact-managed': 'react',
    });
    anchor.addEventListener('click', () => {
      window.gtag('event', eventName, { lead_stage: 'contact_intent' });
    });

    anchor.click();

    assert.deepEqual(gtagCalls, [
      ['event', eventName, { lead_stage: 'contact_intent' }],
    ]);
    assert.equal(tiktokCalls.length, 0);
    assert.doesNotMatch(
      JSON.stringify(gtagCalls),
      /acahydraulic_whatsapp_click|generate_lead|qualified_lead|purchase|revenue/,
    );
  }
});

test('the document tracker still records an ordinary unmarked WhatsApp click once', () => {
  const { anchor, gtagCalls } = contactClickHarness({
    href: 'https://wa.me/77714177925?text=test',
  });

  anchor.click();

  assert.equal(gtagCalls.length, 1);
  assert.equal(gtagCalls[0][0], 'event');
  assert.equal(gtagCalls[0][1], 'acahydraulic_whatsapp_click');
});

test('every new React-managed case and brand CTA carries the document-level opt-out marker', () => {
  const caseDir = path.resolve('client/src/pages/cases');
  const caseSources = fs.readdirSync(caseDir)
    .filter(file => file.endsWith('.tsx'))
    .map(file => fs.readFileSync(path.join(caseDir, file), 'utf8'))
    .join('\n');
  const brandSource = fs.readFileSync(
    'client/src/components/catalog/BrandPumpShowcase.tsx',
    'utf8',
  );

  const caseContactAnchors = [...caseSources.matchAll(/<a\b[\s\S]*?<\/a>/g)]
    .map(match => match[0])
    .filter(anchor =>
      anchor.includes('trackCaseContactIntent') ||
      anchor.includes('onClick={recordInquiry}'),
    );
  const brandContactAnchors = [...brandSource.matchAll(/<a\b[\s\S]*?<\/a>/g)]
    .map(match => match[0])
    .filter(anchor => anchor.includes('trackCatalogEvent("catalog_whatsapp_click"'));

  assert.equal(caseContactAnchors.length, 11);
  assert.equal(brandContactAnchors.length, 1);
  for (const anchor of [...caseContactAnchors, ...brandContactAnchors]) {
    assert.match(anchor, /data-aca-contact-managed="react"/);
  }
  assert.match(indexHtml, /if \(reactManagedContact\) return;/);
});
