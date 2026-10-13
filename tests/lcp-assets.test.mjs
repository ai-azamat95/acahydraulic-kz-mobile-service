import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const home = fs.readFileSync('client/src/pages/Home.tsx', 'utf8');
const html = fs.readFileSync('client/index.html', 'utf8');
const responsiveBackgroundPages = [
  'client/src/pages/Blog.tsx',
  'client/src/pages/services/LoaderRepair.tsx',
  'client/src/pages/services/BulldozerRepair.tsx',
  'client/src/pages/services/ManipulatorRepair.tsx',
  'client/src/pages/services/DumpTruckRepair.tsx',
  'client/src/pages/services/MineLoaderRepair.tsx',
  'client/src/pages/services/PressRepair.tsx',
  'client/src/pages/services/GraderRepair.tsx',
  'client/src/pages/services/WirtgenRepair.tsx',
  'client/src/pages/services/RailwayRepair.tsx',
];

test('the mobile LCP hero uses a right-sized high-priority asset', () => {
  const asset = 'client/public/images/hero-bg-v4-mobile.webp';
  assert.ok(fs.existsSync(asset));
  assert.ok(fs.statSync(asset).size < 150 * 1024, 'mobile hero should remain below 150 KiB');
  assert.match(home, /<picture/);
  assert.match(home, /media="\(max-width: 767px\)" srcSet="\/images\/hero-bg-v4-mobile\.webp"/);
  assert.match(home, /width=\{1536\}/);
  assert.match(home, /height=\{2752\}/);
  assert.match(home, /fetchPriority="high"/);
});

test('service and article heroes use the smaller image before the desktop breakpoint', () => {
  for (const file of responsiveBackgroundPages) {
    const source = fs.readFileSync(file, 'utf8');
    assert.match(source, /bg-\[url\('\/images\/hero-bg-v4-mobile\.webp'\)\]/, file);
    assert.match(source, /md:bg-\[url\('\/images\/hero-bg-v4\.webp'\)\]/, file);
  }
});

test('Google Fonts CSS does not block first render when JavaScript is available', () => {
  assert.match(html, /rel="preload" as="style" href="https:\/\/fonts\.googleapis\.com/);
  assert.match(html, /rel="stylesheet" media="print" onload="this\.media='all'"/);
  assert.match(html, /<noscript><link[^>]+fonts\.googleapis\.com[^>]+rel="stylesheet"/);
});
