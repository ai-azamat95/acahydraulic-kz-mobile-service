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

function readJpegDimensions(buffer) {
  assert.equal(buffer.readUInt16BE(0), 0xffd8, 'social preview must be a real JPEG');
  const startOfFrameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  let offset = 2;

  while (offset + 8 < buffer.length) {
    if (buffer[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = buffer[offset + 1];
    if (startOfFrameMarkers.has(marker)) {
      return {
        width: buffer.readUInt16BE(offset + 7),
        height: buffer.readUInt16BE(offset + 5),
      };
    }

    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }

    const segmentLength = buffer.readUInt16BE(offset + 2);
    offset += 2 + segmentLength;
  }

  throw new Error('JPEG dimensions were not found');
}

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

test('the social preview is lightweight and matches its Open Graph dimensions', () => {
  const asset = 'client/public/webdev-static-assets/og-image.jpg';
  const image = fs.readFileSync(asset);

  assert.ok(image.length < 200 * 1024, 'social preview should remain below 200 KiB');
  assert.deepEqual(readJpegDimensions(image), { width: 1200, height: 630 });
  assert.match(html, /<meta property="og:image:type" content="image\/jpeg" \/>/);
  assert.match(html, /<meta property="og:image:width" content="1200" \/>/);
  assert.match(html, /<meta property="og:image:height" content="630" \/>/);
  assert.doesNotMatch(html, /24\/7/);
});

test('the home page source does not skip heading levels', () => {
  const levels = [...home.matchAll(/<h([1-6])\b/g)].map((match) => Number(match[1]));

  assert.ok(levels.length > 0);
  assert.equal(levels[0], 1);
  for (let index = 1; index < levels.length; index += 1) {
    assert.ok(
      levels[index] <= levels[index - 1] + 1,
      `heading level jumps from h${levels[index - 1]} to h${levels[index]}`,
    );
  }
});
