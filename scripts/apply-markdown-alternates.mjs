import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('dist/public');
const markdownRoutes = new Map([
  ['', '/index.md'],
  ['services', '/services/index.md'],
  ['services/hydraulic-pumps', '/services/hydraulic-pumps/index.md'],
  ['catalog', '/catalog/index.md'],
  ['parts/engines-complete', '/parts/engines-complete/index.md'],
  ['cases', '/cases/index.md'],
  ['contacts', '/contacts/index.md'],
  ['payment', '/payment/index.md'],
  ['offer', '/offer/index.md'],
  ['delivery-and-returns', '/delivery-and-returns/index.md'],
]);
const alternatePattern = /<link(?=[^>]*\brel=["']alternate["'])(?=[^>]*\btype=["']text\/markdown["'])[^>]*>\s*/gi;

function indexFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...indexFiles(absolute));
    else if (entry.name === 'index.html') files.push(absolute);
  }
  return files;
}

if (!fs.existsSync(path.join(outDir, 'index.html'))) {
  throw new Error('Missing dist/public/index.html. Build and generate static routes first.');
}

for (const markdownPath of markdownRoutes.values()) {
  const file = path.join(outDir, markdownPath.replace(/^\//, ''));
  if (!fs.existsSync(file)) throw new Error(`Missing Markdown resource: ${file}`);
}

let updated = 0;
let linked = 0;
for (const file of indexFiles(outDir)) {
  const route = path.relative(outDir, path.dirname(file)).split(path.sep).join('/');
  const original = fs.readFileSync(file, 'utf8');
  let html = original.replace(alternatePattern, '');
  const markdownPath = markdownRoutes.get(route);
  if (markdownPath) {
    html = html.replace('</head>', `<link rel="alternate" type="text/markdown" href="${markdownPath}">\n</head>`);
    linked += 1;
  }
  if (html !== original) {
    fs.writeFileSync(file, html);
    updated += 1;
  }
}

console.log(`Published ${linked} Markdown alternates; normalized ${updated} HTML files.`);
