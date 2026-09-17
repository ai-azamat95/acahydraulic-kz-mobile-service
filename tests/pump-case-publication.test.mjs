import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = 'dist/public';
const route = 'cases/postavka-zamena-gidronasosa';
const html = fs.readFileSync(path.join(root, route, 'index.html'), 'utf8');

test('pump case is useful without JavaScript and does not claim the pending order is complete', () => {
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.match(html, /SANY SY365H/);
  assert.match(html, /демонтировали старый насос, установили новый/);
  assert.match(html, /Hitachi: заказ HANDOK ожидает поставки/);
  assert.match(html, /Установка и запуск ещё не выполнены/);
  assert.match(html, /HANDOK H5V80DTP-12T/);
  assert.match(html, /1 700 000 ₸/);
  assert.match(html, /2 530 000 ₸/);
  assert.match(html, /не являются стоимостью ремонта под ключ/);
  assert.match(html, /https:\/\/wa.me\/77714177925\?text=/);
});

test('direct case URL has its own canonical, social preview and sitemap entry', () => {
  const canonical = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*>/g)];
  assert.equal(canonical.length, 1);
  assert.ok(canonical[0][0].includes(`https://acahydraulic.kz/${route}/`));
  assert.match(html, /<meta property="og:title" content="Гидронасос с доставкой и заменой/);
  assert.match(html, /<meta property="og:image" content="https:\/\/acahydraulic.kz\/media\/pump-cases\/sany-sy365h.webp"/);
  assert.ok(fs.readFileSync(path.join(root, 'sitemap-cases.xml'), 'utf8').includes(`/${route}/`));
});

test('case media is included in the published build and video does not autoplay', () => {
  for (const file of ['sany-pump-36s.mp4', 'sany-sy365h.webp', 'sany-installed.webp', 'k5v160dt-delivery.webp', 'k5v80dtp-china.webp', 'handok-h5v80dtp.webp']) {
    assert.ok(fs.statSync(path.join(root, 'media/pump-cases', file)).size > 1000, file);
  }
  const video = html.match(/<video\b[^>]*>/)?.[0];
  assert.ok(video);
  assert.match(video, /preload="none"/);
  assert.doesNotMatch(video, /autoplay/);
});
