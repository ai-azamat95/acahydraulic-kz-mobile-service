import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();
const blogSource = fs.readFileSync(path.join(root, 'client/src/pages/Blog.tsx'), 'utf8');
const sitemap = fs.readFileSync(path.join(root, 'client/public/sitemap.xml'), 'utf8');
const genericDiagnosticImage = path.join(root, 'client/public/images/services/field-diagnostics-illustration.webp');

const articles = [
  {
    id: 5,
    slug: 'remont-gidravliki-frezy-wirtgen-1500',
    headline: 'Wirtgen 1500 не едет: выездная диагностика хода и гидросистемы',
    cardTitle: 'Wirtgen 1500 не едет: что проверяли на объекте',
    excerptType: 'Реальный выезд ACA Hydraulic',
    imagePattern: /wirtgen-1500-1\.webp/u,
    imageAltPattern: /Диагностика дорожной фрезы Wirtgen 1500 на объекте/u,
  },
  {
    id: 7,
    slug: 'remont-gidravliki-liebherr-r950',
    headline: 'Liebherr R950 теряет мощность: как диагностировать гидросистему и главный насос',
    cardTitle: 'Liebherr R950 теряет мощность: что проверить в гидросистеме',
    excerptType: 'Практическое руководство',
    imagePattern: /field-diagnostics-illustration\.webp/u,
    imageAltPattern: /Иллюстрация выездной диагностики гидравлики спецтехники/u,
  },
  {
    id: 8,
    slug: 'vosstanovlenie-gidromotora-volvo-ec380',
    headline: 'Volvo EC380 не едет: как диагностировать гидромотор хода и гидросистему',
    cardTitle: 'Volvo EC380 не едет: что проверить до замены гидромотора',
    excerptType: 'Практическое руководство',
    imagePattern: /field-diagnostics-illustration\.webp/u,
    imageAltPattern: /Иллюстрация выездной диагностики гидравлики спецтехники/u,
  },
];

const parseSchemas = html => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
  .map(match => JSON.parse(match[1]));

test('blog cards describe verified diagnostics without invented outcomes', () => {
  assert(fs.existsSync(genericDiagnosticImage), 'generic diagnostic illustration must be published locally');

  for (const article of articles) {
    const card = blogSource.match(new RegExp(`id: ${article.id},[\\s\\S]*?readTime: "6 мин"`, 'u'))?.[0] ?? '';
    assert.match(card, new RegExp(article.cardTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'u'));
    assert.match(card, new RegExp(article.excerptType, 'u'));
    assert.match(card, /date: "2026-10-08"/u);
    assert.match(card, /displayDate: "08\.10\.2026"/u);
    assert.match(card, /author: "ACA Hydraulic"/u);
    assert.match(card, article.imagePattern);
    assert.match(card, article.imageAltPattern);
    assert.doesNotMatch(card, /Реальный кейс|60%|72 часа|48 часов|6 недель|2 дня|[23],[13] млн|разрушени[ея] вала|износ уплотнений гидромоторов|shantui-sd32/iu);
  }
});

test('published blog list identifies ACA Hydraulic as the organization author', () => {
  const htmlPath = path.join(root, 'dist/public/blog/index.html');
  assert(fs.existsSync(htmlPath), 'blog index static page must exist');
  const html = fs.readFileSync(htmlPath, 'utf8');
  const blogSchemas = parseSchemas(html).filter(schema => schema['@type'] === 'Blog');
  assert.equal(blogSchemas.length, 1, 'expected one Blog schema');
  assert.equal(blogSchemas[0]['@id'], 'https://acahydraulic.kz/blog/#blog');
  assert.equal(blogSchemas[0].url, 'https://acahydraulic.kz/blog/');

  for (const article of articles) {
    const posting = blogSchemas[0].blogPost.find(entry => entry.url === `https://acahydraulic.kz/blog/${article.slug}/`);
    assert(posting, `${article.slug}: expected nested BlogPosting`);
    assert.deepEqual(posting.author, { '@type': 'Organization', name: 'ACA Hydraulic' });
  }

  assert.doesNotMatch(html, /износ уплотнений гидромоторов|Ремонт за 2 дня/iu);
});

test('published diagnostic guides expose truthful publication and modification dates', () => {
  for (const article of articles) {
    const htmlPath = path.join(root, 'dist/public/blog', article.slug, 'index.html');
    assert(fs.existsSync(htmlPath), `${article.slug}: static page must exist`);
    const html = fs.readFileSync(htmlPath, 'utf8');
    const articleSchemas = parseSchemas(html).filter(schema => schema['@type'] === 'Article');
    assert.equal(articleSchemas.length, 1, `${article.slug}: expected one Article schema`);
    assert.equal(articleSchemas[0].headline, article.headline);
    assert.equal(articleSchemas[0].datePublished, '2026-10-08');
    assert.equal(articleSchemas[0].dateModified, '2026-10-11');
    assert.equal(articleSchemas[0].mainEntityOfPage, `https://acahydraulic.kz/blog/${article.slug}/`);
    assert.doesNotMatch(html, /Реальный кейс|60%|72 часа|48 часов|6 недель|2 дня|[23],[13] млн|износ уплотнений гидромоторов/iu);

    const sitemapEntry = sitemap.match(new RegExp(`<url>[\\s\\S]*?<loc>https://acahydraulic\\.kz/blog/${article.slug}/<\\/loc>[\\s\\S]*?<\\/url>`, 'u'))?.[0] ?? '';
    assert.match(sitemapEntry, /<lastmod>2026-10-11<\/lastmod>/u);
  }
});
