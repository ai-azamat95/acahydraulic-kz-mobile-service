import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://acahydraulic.kz';

const pages = [
  '/',
  '/services',
  '/about',
  '/reviews',
  '/contacts',
  '/corporate',
  '/services/hydraulic-pumps',
  '/services/hydraulic-motors',
  '/services/hydraulic-cylinders',
  '/services/hydraulic-valves',
  '/services/emergency-service',
  '/services/b2b-maintenance',
  '/regions/astana',
  '/regions/almaty',
  '/regions/karaganda',
  '/regions/atyrau',
  '/regions/aktau',
  '/regions/shymkent'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

fs.writeFileSync(path.join(process.cwd(), 'client', 'public', 'sitemap.xml'), sitemap);
console.log('Sitemap generated successfully!');
