import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const evidence = JSON.parse(fs.readFileSync('shared/repair-evidence.json', 'utf8'));
const htmlFor = route => fs.readFileSync(`dist/public${route}index.html`, 'utf8');
const schemas = html => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));

test('published result summaries link to existing case pages and local evidence', () => {
  const hub = htmlFor('/cases/');
  const ids = new Set();
  for (const item of evidence.cases) {
    assert.ok(!ids.has(item.id), item.id);
    ids.add(item.id);
    assert.ok(fs.existsSync(`dist/public${item.href}index.html`), item.href);
    assert.ok(fs.statSync(`client/public${item.video}`).size > 1000, item.video);
    assert.ok(hub.includes(`href="${item.href}"`), item.id);
    assert.ok(hub.includes(`href="${item.video}"`), item.id);
    for (const text of [item.before, item.work, item.result]) assert.ok(hub.includes(text), text);
    assert.doesNotMatch(JSON.stringify(item), /HX300|Семей|₸|рейтинг|отзыв клиента/);
  }
  assert.match(hub, /Числовые протоколы замеров до и после.*не опубликованы/);
  assert.match(hub, /Поставка с установкой обозначена отдельно от ремонта узла/);
});

test('field service and excavator pages expose the complete repair path without JavaScript', () => {
  for (const [route, slug] of [['/services/', null], ['/services/mobile-repair/', 'mobile-repair'], ['/services/excavator-repair/', 'excavator-repair']]) {
    const html = htmlFor(route);
    for (const step of evidence.process) {
      assert.ok(html.includes(step.title), `${route}: ${step.title}`);
      assert.ok(html.includes(step.text), `${route}: ${step.title}`);
    }
    for (const item of evidence.cases.filter(item => !slug || item.services.includes(slug))) {
      assert.ok(html.includes(`data-repair-case="${item.id}"`), `${route}: ${item.id}`);
    }
    assert.match(html, /База ACA Hydraulic.*Астана, трасса Астана–Караганда, 81/);
    assert.match(html, /Выезды на объекты по Казахстану согласуем/);
  }
});

test('changed pages retain a single canonical, one H1 and parseable schema', () => {
  for (const route of ['/', '/services/', '/services/mobile-repair/', '/services/excavator-repair/', '/cases/', '/reviews/']) {
    const html = htmlFor(route);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1, route);
    assert.equal([...html.matchAll(/<link[^>]*rel="canonical"/g)].length, 1, route);
    assert.ok(html.includes(`href="https://acahydraulic.kz${route}"`), route);
    const data = schemas(html);
    assert.ok(data.length, route);
    for (const value of data) assert.doesNotMatch(JSON.stringify(value), /"(?:Review|AggregateRating|ratingValue)"/);
    if (route.startsWith('/services/') && route !== '/services/') {
      const service = data.find(value => value['@type'] === 'Service');
      assert.ok(service, route);
      assert.deepEqual(service.areaServed.map(area => area.name), ['Астана', 'Казахстан']);
      assert.match(service.description, /по Казахстану по согласованию/);
      assert.ok(html.includes(service.description), route);
    }
  }
});

test('reviews remain separate from own cases and third-party directory mentions', () => {
  const html = htmlFor('/reviews/');
  assert.doesNotMatch(html, /KazMinerals|BI Group|более 3 лет|благодарственные письма|lucide-star/);
  assert.match(html, /не являются независимыми отзывами клиентов/);
  assert.match(html, /не означает, что внешних отзывов нет/);
  assert.ok(html.includes('href="https://stanki-stanexpert.ru/partnery/partnery-v-kazahstane/"'));
  assert.match(html, /не клиентский отзыв или подтверждение конкретного ремонта/);
});
