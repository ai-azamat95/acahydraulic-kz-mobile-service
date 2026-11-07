import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read = file => fs.readFileSync(file, "utf8");
test("floating labels are real labels with stable per-instance IDs, not placeholders", () => {
  const fields = read("client/src/components/ui/floating-field.tsx");
  assert.match(fields, /htmlFor=\{id\}/);
  assert.match(fields, /useId\(\)/);
  assert.match(fields, /<Input\s+\{\.\.\.props\}/);
  assert.match(fields, /<Textarea\s+\{\.\.\.props\}/);
  const lead = read("client/src/components/B2BLeadForm.tsx");
  assert.match(lead, /const formId = useId\(\)/);
  assert.match(
    lead,
    /label="Телефон \*"[^\n]*autoComplete="tel"[^\n]*inputMode="tel"[^\n]*type="tel"[^\n]*required/
  );
  assert.match(lead, /disabled=\{isSubmitting \|\| !budgetAccepted\}/);
  assert.match(lead, /href="\/privacy\/"/);
});
test("field styling is scoped, readable, keyboard visible and reduced-motion aware", () => {
  const css = read("client/src/components/ui/floating-field.css");
  assert.match(css, /font-size: 16px/);
  assert.match(css, /input:not\(:placeholder-shown\)/);
  assert.match(css, /input:autofill/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /forced-colors: active/);
  assert.match(css, /resize: vertical/);
  assert.match(css, /outline: 2px solid var\(--field-accent\)/);
  assert.doesNotMatch(css, /(?:^|\n)(?:input|textarea|select|label)\s*\{/);
});
test("service calculator uses associated labels and a telephone keyboard without changing intent measurement", () => {
  const calculator = read("client/src/components/CostCalculator.tsx");
  assert.match(
    calculator,
    /label="Телефон \/ WhatsApp \*"[^\n]*type="tel"[^\n]*autoComplete="tel"/
  );
  assert.equal((calculator.match(/<FloatingField /g) || []).length, 3);
  assert.equal((calculator.match(/<FloatingInput /g) || []).length, 4);
  assert.equal((calculator.match(/<FloatingTextarea /g) || []).length, 1);
  assert.match(
    calculator,
    /trackFormContactIntent\("calculator", contactIntentId\)/
  );
});
