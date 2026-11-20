import { readFileSync, statSync } from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';

const source = readFileSync('client/src/components/CostCalculator.tsx', 'utf8');
const entries = [...source.matchAll(/\{ id: "([^"]+)", label: "([^"]+)", image: "([^"]+)", alt: "([^"]+)"([^\n]*)/g)];
test('equipment selection keeps all nine original types in order', () => {
  assert.deepEqual(entries.map(e => e[1]), ['excavator', 'loader', 'bulldozer', 'grader', 'mining_loader', 'milling', 'hdd', 'piling', 'other']);
});
test('six matching cards use owner WebP photographs without invented models', () => {
  const expected = { excavator: 'owner-excavator', loader: 'owner-loader', bulldozer: 'owner-bulldozer', milling: 'owner-road-milling', hdd: 'owner-hdd-rig', piling: 'owner-drilling-rig' };
  for (const [id, filename] of Object.entries(expected)) {
    const entry = entries.find(e => e[1] === id);
    assert.equal(entry[3], `/images/calculator/${filename}.webp`);
    assert.match(entry[5], /position: "\d+% \d+%"/);
    assert.match(entry[5], /width: \d+, height: \d+/);
    assert.doesNotMatch(entry[4], /\d/);
    const path = `client/public${entry[3]}`;
    assert.equal(readFileSync(path).subarray(8, 12).toString(), 'WEBP');
    assert.ok(statSync(path).size < 200000);
  }
});
test('unmatched cards retain their images and the form retains its contact boundary', () => {
  for (const [id, filename] of Object.entries({ grader: 'grader', mining_loader: 'mining-loader' })) {
    assert.equal(entries.find(e => e[1] === id)[3], `/images/calculator/${filename}.webp`);
  }
  assert.match(source, /objectPosition: item.position/);
  assert.doesNotMatch(source, /objectFit:|fit: "contain"/);
  assert.match(source, /aspect-\[4\/3\] w-full object-cover/);
  assert.match(source, /md:aspect-\[3\/2\]/);
  assert.match(source, /data-aca-contact-managed="react"/);
  assert.match(source, /trackFormContactIntent\("calculator", contactIntentId\)/);
});
