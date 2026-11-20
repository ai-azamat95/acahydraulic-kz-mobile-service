import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
test('mining_loader uses the owner photograph without changing its identity or framing', () => {
  const source = readFileSync('client/src/components/CostCalculator.tsx', 'utf8');
  const entry = source.split('\n').find(l => l.includes('id: "mining_loader"'));
  assert.ok(entry.includes('label: "Шахтный погрузчик"'));
  assert.ok(entry.includes('image: "/images/calculator/owner-mining-loader.webp"'));
  assert.ok(entry.includes('width: 443, height: 960, position: "50% 49%"'));
  assert.ok(entry.includes('alt: "Низкопрофильный шахтный погрузчик — фото владельца"'));
  const bytes = readFileSync('client/public/images/calculator/owner-mining-loader.webp');
  assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), '4f9809e2d5dd05d789862ae1007635cb4f08ec865e970f1e5e7885bf53c38e02');
  assert.ok(bytes.length < 100000);
});
