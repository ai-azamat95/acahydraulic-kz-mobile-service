import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const showcase = JSON.parse(fs.readFileSync(path.join(root, 'shared/service-showcase.json'), 'utf8'));
const assessment = JSON.parse(fs.readFileSync(path.join(root, 'shared/service-assessment.json'), 'utf8'));
const app = fs.readFileSync(path.join(root, 'client/src/App.tsx'), 'utf8');

test('every published service route has distinct, complete metadata and a local decorative image', () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const [slug, service] of Object.entries(showcase)) {
    assert.match(app, new RegExp(`path=\\{?"/services/${slug}"`), `missing route ${slug}`);
    assert.ok(service.label && service.summary && service.title && service.description);
    assert.ok(service.description.length >= 80, `description too short: ${slug}`);
    assert.ok(!titles.has(service.title), `duplicate title: ${slug}`);
    assert.ok(!descriptions.has(service.description), `duplicate description: ${slug}`);
    titles.add(service.title);
    descriptions.add(service.description);
    assert.ok(fs.existsSync(path.join(root, 'client/public/images/services', service.image)), `missing image: ${slug}`);
    if (service.cases.length === 0 && !['hydraulic-motors', 'mining-loader-repair', 'piledriver-repair', 'mining-truck-repair'].includes(slug)) {
      // These four pages already have longer, dedicated diagnostic copy in service-content.json.
      assert.ok(assessment[slug]?.intro && assessment[slug]?.checks.length === 3, `missing diagnostic guidance: ${slug}`);
    }
  }
});

test('case references are precise links to existing local routes or the official ACA TikTok account', () => {
  for (const [slug, service] of Object.entries(showcase)) {
    for (const item of service.cases) {
      assert.ok(item.model && item.work, `missing model or work: ${slug}`);
      assert.ok(item.href || item.video, `case has no evidence link: ${slug}`);
      if (item.href) {
        assert.ok(item.href.startsWith('/cases/') || item.href.startsWith('/blog/'));
        assert.ok(app.includes(item.href.replace(/\/$/, '')), `unknown local case: ${item.href}`);
      }
      if (item.video) assert.match(item.video, /^https:\/\/www\.tiktok\.com\/@acaservice01\/video\/\d+$/);
    }
  }
});
