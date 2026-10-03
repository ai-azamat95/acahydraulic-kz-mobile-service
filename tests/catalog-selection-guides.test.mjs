import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const guides = JSON.parse(fs.readFileSync('shared/catalog-selection-guides.json', 'utf8'));
const categories = JSON.parse(fs.readFileSync('shared/catalog-landings.json', 'utf8')).categories;
const services = JSON.parse(fs.readFileSync('shared/service-content.json', 'utf8'));
const readPage = route => fs.readFileSync(`dist/public${route}index.html`, 'utf8');

test('seven distinct hydraulic selection guides have relevant local links', () => {
  assert.equal(Object.keys(guides).length, 7);
  assert.equal(new Set(Object.values(guides).map(guide => guide.heading)).size, 7);
  assert.equal(new Set(Object.values(guides).map(guide => guide.text)).size, 7);
  for (const [category, guide] of Object.entries(guides)) {
    assert.ok(categories.some(item => item.id === category), category);
    assert.ok(guide.text.length >= 250, category);
    assert.ok(guide.links.length >= 2, category);
    assert.equal(new Set(guide.links.map(link => link.href)).size, guide.links.length);
    for (const link of guide.links) {
      assert.match(link.href, /^\/(catalog\/category|services|blog|cases)\/[a-z0-9-]+\/$/);
      assert.ok(link.label.length > 20, link.href);
    }
  }
});

test('selection content is visible before JavaScript, with resolvable links and one H1', () => {
  for (const [category, guide] of Object.entries(guides)) {
    const route = `/catalog/category/${category}/`;
    const html = readPage(route);
    assert.ok(html.includes('data-catalog-selection-guide'), route);
    assert.ok(html.includes(guide.heading), route);
    assert.ok(html.includes(guide.text), route);
    assert.ok(html.indexOf('data-catalog-selection-guide') < html.indexOf('<h2>Товары раздела</h2>'), route);
    assert.ok(html.includes('<summary>Проверка перед заказом и полезные ссылки</summary>'), route);
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, route);
    for (const link of guide.links) {
      assert.ok(html.includes(`href="${link.href}"`), link.href);
      assert.ok(html.includes(link.label), link.href);
      assert.ok(fs.existsSync(`dist/public${link.href}index.html`), link.href);
    }
  }
});

test('service pages link back to appropriate parts rather than an unrelated catalogue', () => {
  for (const [route, targets] of [
    ['/services/hydraulic-pumps', ['hydraulic-pumps', 'pump-parts']],
    ['/services/hydraulic-motors', ['hydraulic-motors', 'final-drives']],
  ]) {
    const html = readPage(`${route}/`);
    for (const target of targets) {
      const href = `/catalog/category/${target}/`;
      assert.ok(services[route].related.some(link => link.href === href), href);
      assert.ok(html.includes(`href="${href}"`), href);
    }
  }
});

test('React uses the same selection data as the static catalogue pages', () => {
  const lib = fs.readFileSync('client/src/lib/catalogLandings.ts', 'utf8');
  const ui = fs.readFileSync('client/src/pages/Catalog.tsx', 'utf8');
  assert.ok(lib.includes('@shared/catalog-selection-guides.json'));
  assert.ok(ui.includes('categorySelectionGuide(categoryLanding?.id)'));
  for (const field of ['selectionGuide.heading', 'selectionGuide.text', 'selectionGuide.links.map']) {
    assert.ok(ui.includes(field), field);
  }
  assert.ok(ui.indexOf('data-catalog-selection-guide') < ui.indexOf('id="catalog-results"'));
  assert.ok(ui.includes('isLandingPage && selectionGuide'));
});

test('commercial pump and motor metadata is distinct and honest about ordering', () => {
  const selected = categories.filter(item => ['hydraulic-pumps', 'piston-pumps', 'pump-parts', 'hydraulic-motors'].includes(item.id));
  assert.equal(selected.length, 4);
  assert.equal(new Set(selected.map(item => item.title)).size, 4);
  for (const item of selected) {
    const html = readPage(`/catalog/category/${item.id}/`);
    assert.ok(html.includes(item.title), item.id);
    assert.ok(html.includes(item.description), item.id);
    assert.match(item.description, /под заказ|срок — после/);
    assert.doesNotMatch(item.description, /в наличии|бесплатн|гарантия \d/i);
  }
});

test('selection guide uses dark text on a light surface independently of catalogue heading overrides', () => {
  const ui = fs.readFileSync('client/src/pages/Catalog.tsx', 'utf8');
  const start = ui.indexOf('isLandingPage && selectionGuide');
  const end = ui.indexOf('id="catalog-results"', start);
  const guide = ui.slice(start, end);
  assert.ok(guide.includes('bg-white'));
  assert.ok(guide.includes('text-[#17242b]'));
  assert.ok(guide.includes('text-gray-700'));
  assert.ok(guide.includes('text-[#795809]'));
  assert.ok(!guide.includes('text-white'));
});
