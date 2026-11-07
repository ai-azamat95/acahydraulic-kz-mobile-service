import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
test('modal backdrop and contents cover navigation and consent; selects remain above the form', () => {
 const dialog = read('client/src/components/ui/dialog.tsx');
 const select = read('client/src/components/ui/select.tsx');
 assert.match(dialog, /fixed inset-0 z-\[90\]/);
 assert.match(dialog, /left-\[50%\] z-\[100\]/);
 assert.match(select, /relative z-\[110\]/);
 for (const path of ['client/src/components/SiteQuickNav.tsx', 'client/src/components/CookieConsent.tsx', 'client/src/components/ui/sheet.tsx']) {
  for (const [, layer] of read(path).matchAll(/z-\[(\d+)\]/g)) assert.ok(Number(layer) < 90, `${path} must stay behind modal backdrop`);
 }
});
