import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('dist/public');
const indexPath = path.join(outDir, 'index.html');
const routeDir = path.join(outDir, 'industrial-ai');
const routePath = path.join(routeDir, 'index.html');

if (!fs.existsSync(indexPath)) {
  throw new Error(`Missing ${indexPath}. Run build first.`);
}

let html = fs.readFileSync(indexPath, 'utf8');

const title = 'ACA Industrial AI — Heavy Equipment Diagnostic Copilot';
const description =
  'HackAlem prototype by ACA Hydraulic: structured AI-assisted heavy-equipment diagnostics, verification workflow, parts-search brief and technician safety gates.';
const canonical = 'https://acahydraulic.kz/industrial-ai/';

function replaceOrInsert(regex, replacement) {
  if (regex.test(html)) {
    html = html.replace(regex, replacement);
    return;
  }
  html = html.replace('</head>', `${replacement}\n</head>`);
}

replaceOrInsert(/<title[^>]*>.*?<\/title>/i, `<title>${title}</title>`);
replaceOrInsert(
  /<meta[^>]+name=["']description["'][^>]*>/i,
  `<meta name="description" content="${description}">`
);
replaceOrInsert(
  /<link[^>]+rel=["']canonical["'][^>]*>/i,
  `<link rel="canonical" href="${canonical}">`
);
replaceOrInsert(
  /<meta[^>]+property=["']og:title["'][^>]*>/i,
  `<meta property="og:title" content="${title}">`
);
replaceOrInsert(
  /<meta[^>]+property=["']og:description["'][^>]*>/i,
  `<meta property="og:description" content="${description}">`
);
replaceOrInsert(
  /<meta[^>]+property=["']og:url["'][^>]*>/i,
  `<meta property="og:url" content="${canonical}">`
);

fs.mkdirSync(routeDir, { recursive: true });
fs.writeFileSync(routePath, html);
console.log(`Created ${routePath}`);
