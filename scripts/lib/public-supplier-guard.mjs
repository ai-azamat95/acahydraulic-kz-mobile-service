import fs from 'node:fs';
import path from 'node:path';

const TEXT_EXTENSIONS = new Set([
  '.css', '.html', '.js', '.mjs', '.cjs', '.json', '.map', '.svg', '.txt', '.xml', '.md', '.webmanifest',
]);

// These are private source fields, never the owner-approved retail price fields.
// Normalize common camelCase/snake_case spellings without inspecting values.
export function isPrivateSupplierKey(key) {
  const normalized = String(key).replace(/[-_$]/g, '').toLowerCase();
  return normalized === 'sourceurl'
    || normalized === 'sourceupdatedat'
    || /^(?:source(?:prices?|costs?|unitprices?)|supplier(?:prices?|costs?|unitprices?)|vendor(?:prices?|costs?)|purchase(?:prices?|costs?|unitprices?)|procurement(?:prices?|costs?)|buying(?:prices?|costs?)|buyprices?|wholesale(?:prices?|costs?)|costprices?|unitcosts?|landedcosts?)/.test(normalized)
    || /^(?:controllermarkup|monitormarkup)(?:percent|percentage|rate|kzt|eur|usd)?$/.test(normalized)
    || /^markup(?:percent|percentage|rate|kzt|eur|usd)$/.test(normalized);
}

/** Inspect quoted JSON/JSON-LD keys and unquoted/minified JS property keys.
 * Findings intentionally contain field names only, never financial values.
 */
export function publicSupplierFindings(text) {
  const findings = [];
  if (/sinocmp|hydrauvision/i.test(text)) findings.push({ reason: 'supplier brand' });
  const keys = new Set();
  const propertyKeys = /(?:\\?["'])?([A-Za-z_$][A-Za-z0-9_$-]*)(?:\\?["'])?\s*:/g;
  for (const match of text.matchAll(propertyKeys)) {
    if (isPrivateSupplierKey(match[1])) keys.add(match[1]);
  }
  for (const key of [...keys].sort()) findings.push({ reason: 'private supplier field', key });
  return findings;
}

export function publicJsonFiles(directory) {
  const files = [];
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.json') {
        files.push(path.relative(directory, target));
      }
    }
  }
  visit(directory);
  return files.sort();
}

export function scanPublicSupplierDirectory(directory) {
  const failures = [];
  let filesChecked = 0;
  function visit(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) visit(target);
      else if (entry.isFile() && TEXT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        filesChecked += 1;
        for (const finding of publicSupplierFindings(fs.readFileSync(target, 'utf8'))) {
          failures.push({ file: path.relative(directory, target), ...finding });
        }
      }
    }
  }
  visit(directory);
  return { filesChecked, failures };
}
