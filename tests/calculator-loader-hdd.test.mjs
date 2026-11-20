import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
const source = readFileSync('client/src/components/CostCalculator.tsx', 'utf8');
for (const [id, label, file, position, hash] of [
  ['loader', 'Погрузчик', 'owner-loader', '50% 44%', '5ab217d5ae6f1209395b14bcd31d4683c210489a8cf730cca8bab532b6a20898'],
  ['hdd', 'ГНБ установка', 'owner-hdd-rig', '50% 49%', '884c9678bb3bc8dbce3a31a86df000a40d388b2bae3da9a099c45d92fb8d6e05'],
]) {
  test(`${id} uses its supplied owner photograph in the existing choice`, () => {
    const entry = source.split('\n').find(line => line.includes(`id: "${id}"`));
    assert.ok(entry.includes(`label: "${label}"`));
    assert.ok(entry.includes(`image: "/images/calculator/${file}.webp"`));
    assert.ok(entry.includes(`position: "${position}"`));
    assert.ok(entry.includes('width: 443, height: 960'));
    const bytes = readFileSync(`client/public/images/calculator/${file}.webp`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash);
  });
}
