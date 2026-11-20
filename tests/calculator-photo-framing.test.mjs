import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import test from 'node:test';
const source = readFileSync('client/src/components/CostCalculator.tsx', 'utf8');
const photos = [
  ['excavator', '50% 10%', '7cd2571a4e6013db906db6c6524b6bc4fdae64b1b19842abf71af1de586cb710'],
  ['bulldozer', '50% 53%', 'd6791a62800eaf4cb40f0c68aef54c6f9b03c34030555c7ecedb0c0d5c4da907'],
  ['road-milling', '50% 40%', 'a67a750ff86ed5a50467fc307dd5995a523b981ec7644f916af5a5d31c6fd1db'],
  ['drilling-rig', '55% 50%', '1b0d856e748ec65a0cfd528af24b9b623380086fd82f44d50e572c00f50a24a4'],
];
test('cover framing retains the exact four owner photographs and individual focal points', () => {
  for (const [name, position, hash] of photos) {
    const line = source.split('\n').find(line => line.includes(`/owner-${name}.webp`));
    assert.ok(line.includes(`position: "${position}"`));
    const bytes = readFileSync(`client/public/images/calculator/owner-${name}.webp`);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), hash);
  }
  assert.equal((source.match(/position: "/g) || []).length, 6);
  assert.match(source, /style=\{item.position \? \{ objectPosition: item.position \} : undefined\}/);
});
