import assert from 'node:assert/strict';
import test from 'node:test';

import { extractFitment } from '../scripts/lib/catalog-fitment.mjs';

test('extracts only explicit machine and engine fitment from product titles', () => {
  assert.equal(
    extractFitment('Fuel Pump 3090942 Fits for Cummins Engine M11 N14 L10'),
    'Cummins Engine M11 N14 L10',
  );
  assert.equal(
    extractFitment('Hydraulic Pump compatible with CAT 320D Excavator'),
    'CAT 320D Excavator',
  );
  assert.equal(extractFitment('K5V160DT Hydraulic Pump'), null);
  assert.equal(extractFitment('Seal Kit suitable for Komatsu PC200-7 ---'), 'Komatsu PC200-7');
});
