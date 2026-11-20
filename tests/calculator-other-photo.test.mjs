import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
test('existing other choice uses the supplied drilling photograph without renaming', () => {
  const source = readFileSync('client/src/components/CostCalculator.tsx', 'utf8');
  const entry = source.split('\n').find(line => line.includes('id: "other", label: "Другая техника", image:'));
  assert.ok(entry.includes('image: "/images/calculator/owner-other-drilling-rig.webp"'));
  assert.ok(entry.includes('width: 443, height: 960, position: "50% 47%"'));
  assert.ok(entry.includes('alt: "Гусеничная буровая установка — фото владельца"'));
  const bytes = readFileSync('client/public/images/calculator/owner-other-drilling-rig.webp');
  assert.equal(bytes.subarray(8, 12).toString(), 'WEBP');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), '2e642d955c49b215ad84b346a72c1d4c9ba5c4cb3f16826a609b430f0d7bbf13');
  assert.ok(bytes.length < 100000);
});
