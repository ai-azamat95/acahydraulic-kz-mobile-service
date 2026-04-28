import fs from 'node:fs';
import path from 'node:path';

const outDir = path.resolve('dist/public');
const indexPath = path.join(outDir, 'index.html');
const sitemapPath = path.join(outDir, 'sitemap.xml');

if (!fs.existsSync(indexPath)) {
  throw new Error(`Missing ${indexPath}. Run build first.`);
}

const indexHtml = fs.readFileSync(indexPath, 'utf8');
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const locs = [...sitemap.matchAll(/<loc>https?:\/\/[^/]+\/([^<]*)<\/loc>/g)].map((m) => m[1]);
const routes = new Set(['404']);

for (const raw of locs) {
  const route = raw.replace(/^\/+|\/+$/g, '');
  if (!route) continue;
  if (/\.[a-z0-9]+$/i.test(route)) continue;
  routes.add(route);
}

for (const route of routes) {
  const dir = path.join(outDir, route);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), indexHtml);
}

// GitHub Pages SPA fallback for unknown routes.
fs.writeFileSync(path.join(outDir, '404.html'), indexHtml);
console.log(`Created ${routes.size} route copies from sitemap.`);
