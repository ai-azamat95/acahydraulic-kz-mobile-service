import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

const read = route => fs.readFileSync(`dist/public/${route}index.html`, 'utf8');
const schemas = html => [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));

const literalValue = node => {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literalValue);
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(
      node.properties.map(property => [property.name.text, literalValue(property.initializer)]),
    );
  }
  throw new Error(`Unsupported schema literal: ${ts.SyntaxKind[node.kind]}`);
};

const configBusinessIdentity = () => {
  const source = fs.readFileSync('client/src/config/seo.ts', 'utf8');
  const ast = ts.createSourceFile('seo.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let schema;
  const visit = node => {
    if (
      ts.isVariableDeclaration(node)
      && node.name.getText(ast) === 'localBusinessSchema'
      && ts.isObjectLiteralExpression(node.initializer)
    ) schema = node.initializer;
    ts.forEachChild(node, visit);
  };
  visit(ast);
  assert.ok(schema, 'localBusinessSchema export');
  const properties = Object.fromEntries(
    schema.properties
      .filter(ts.isPropertyAssignment)
      .map(property => [property.name.getText(ast).replaceAll('"', ''), property.initializer]),
  );
  return { logo: literalValue(properties.logo), sameAs: literalValue(properties.sameAs) };
};

test('business schema uses confirmed identity and appointment-only availability', () => {
  const businesses = schemas(read('')).filter(s => s['@id'] === 'https://acahydraulic.kz/#business');
  assert.equal(businesses.length, 1);
  const [business] = businesses;
  assert.equal(business.legalName, 'ТОО «АСА-ГС»');
  assert.equal(business.taxID, '240540017992');
  assert.equal(business.openingHoursSpecification, undefined);
  assert.equal(business.contactPoint.hoursAvailable, undefined);
  assert.match(business.description, /по договорённости/);
  assert.doesNotMatch(JSON.stringify(business), /24\/7|23:59/);
  assert.deepEqual(business.logo, {
    '@type': 'ImageObject',
    url: 'https://acahydraulic.kz/apple-touch-icon.png',
    width: 180,
    height: 180,
  });
  assert.deepEqual(business.sameAs, [
    'https://www.tiktok.com/@acaservice01',
    'https://www.youtube.com/@acahydraulic',
  ]);
});

test('business identity sources stay synchronized with the real first-party logo', () => {
  const sourceLogo = fs.readFileSync('client/public/apple-touch-icon.png');
  const publishedLogo = fs.readFileSync('dist/public/apple-touch-icon.png');
  assert.deepEqual(publishedLogo, sourceLogo);
  assert.equal(sourceLogo.subarray(1, 4).toString(), 'PNG');
  assert.equal(sourceLogo.readUInt32BE(16), 180);
  assert.equal(sourceLogo.readUInt32BE(20), 180);

  const sourceBusiness = schemas(fs.readFileSync('client/index.html', 'utf8'))
    .find(schema => schema['@id'] === 'https://acahydraulic.kz/#business');
  assert.ok(sourceBusiness, 'client/index.html business schema');
  assert.deepEqual(configBusinessIdentity(), {
    logo: sourceBusiness.logo,
    sameAs: sourceBusiness.sameAs,
  });
});

test('website and social metadata use the exact business name', () => {
  const page = read('');
  const pageSchemas = schemas(page);
  const business = pageSchemas.find(schema => schema['@id'] === 'https://acahydraulic.kz/#business');
  const website = pageSchemas.find(schema => schema['@id'] === 'https://acahydraulic.kz/#website');
  const ogSiteName = page.match(/<meta[^>]*property="og:site_name"[^>]*content="([^"]+)"/u)?.[1];

  assert.equal(business?.name, 'ACA Hydraulic');
  assert.equal(website?.name, business?.name);
  assert.equal(ogSiteName, business?.name);
});

test('company and contact pages identify their relationship to the business', () => {
  for (const [route, type] of [['about/', 'AboutPage'], ['contacts/', 'ContactPage']]) {
    const page = schemas(read(route)).find(schema => schema['@type'] === type);
    assert(page, route);
    assert.deepEqual(page.mainEntity, { '@id': 'https://acahydraulic.kz/#business' });
    assert.equal(page.url, `https://acahydraulic.kz/${route}`);
  }
});

test('every service page has one normalized Service and BreadcrumbList schema', () => {
  const serviceUrls = [...fs.readFileSync('dist/public/sitemap.xml', 'utf8').matchAll(/<loc>(https:\/\/acahydraulic\.kz\/services\/[^<]+)<\/loc>/g)]
    .map(match => match[1]);
  assert.equal(serviceUrls.length, 20);
  for (const url of serviceUrls) {
    const route = new URL(url).pathname.slice(1);
    const pageSchemas = schemas(read(route));
    const services = pageSchemas.filter(schema => schema['@type'] === 'Service');
    const breadcrumbs = pageSchemas.filter(schema => schema['@type'] === 'BreadcrumbList');
    assert.equal(services.length, 1, `${route}: Service schema`);
    assert.equal(breadcrumbs.length, 1, `${route}: BreadcrumbList schema`);
    assert.equal(services[0].url, url, `${route}: Service.url`);
    assert.equal(services[0]['@id'], `${url}#service`, `${route}: Service @id`);
  }
});

test('every case page has one WebPage schema', () => {
  const caseUrls = [...fs.readFileSync('dist/public/sitemap-cases.xml', 'utf8').matchAll(/<loc>(https:\/\/acahydraulic\.kz\/[^<]+)<\/loc>/g)]
    .map(match => match[1]);
  for (const url of caseUrls) {
    const route = new URL(url).pathname.slice(1);
    const webpages = schemas(read(route)).filter(schema => schema['@type'] === 'WebPage');
    assert.equal(webpages.length, 1, `${route}: WebPage schema`);
    assert.equal(webpages[0].url, url, `${route}: WebPage.url`);
  }
});

test('pressure article contains actual diagnosis content before JavaScript runs', () => {
  const html = read('blog/padaet-davlenie-gidravliki-ekskavatora/');
  for (const text of ['Регулятор насоса и управляющее давление', 'Электрика, датчики и соленоиды', 'Что подготовить перед выездом специалиста']) assert.ok(html.includes(text), text);
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
  assert.equal(schemas(html).filter(s => s['@type'] === 'BlogPosting').length, 1);
});

test('technical blog articles expose an article schema before JavaScript runs', () => {
  for (const route of [
    'remont-gidravliki-frezy-wirtgen-1500',
    'kapitalnyy-remont-shantui-sd32',
    'remont-gidravliki-liebherr-r950',
    'vosstanovlenie-gidromotora-volvo-ec380',
  ]) {
    const expectedType = route === 'kapitalnyy-remont-shantui-sd32' ? 'BlogPosting' : 'Article';
    const article = schemas(read(`blog/${route}/`)).find(schema => schema['@type'] === expectedType);
    assert.ok(article, route);
    assert.equal(article.mainEntityOfPage, `https://acahydraulic.kz/blog/${route}/`);
    assert.equal(article.publisher['@id'], 'https://acahydraulic.kz/#business');
  }
});

test('real cases contain case content instead of copied homepage and have matching metadata', () => {
  for (const [route, model] of [
    ['cat-330dl-teryaet-moshchnost-na-goryachuyu', '330DL'],
    ['sany-sy365h-gidravlika-na-goryachuyu', 'SY365H'],
    ['hitachi-330-5g-plavaet-davlenie-strela-ryvkami', '330-5G'],
  ]) {
    const url = `https://acahydraulic.kz/cases/${route}/`;
    const html = read(`cases/${route}/`);
    assert.ok(html.includes(model));
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1);
    assert.ok(html.includes('https://www.tiktok.com/@acaservice01/video/'));
    assert.equal(schemas(html).find(s => s['@type'] === 'WebPage').url, url);
  }
});

test('duplicate projects listing redirects to cases and is excluded from sitemaps', () => {
  const html = read('projects/');
  assert.match(html, /http-equiv="refresh"/);
  assert.match(html, /<link rel="canonical" href="https:\/\/acahydraulic\.kz\/cases\/">/);
  assert.match(html, /<meta name="robots" content="noindex, follow">/);
  for (const file of ['sitemap.xml', 'sitemap-cases.xml']) assert.ok(!fs.readFileSync(`dist/public/${file}`, 'utf8').includes('<loc>https://acahydraulic.kz/projects/</loc>'));
});

test('highest-traffic hydraulic articles link readers to commercial catalog categories', () => {
  for (const route of [
    'blog/padaet-davlenie-gidravliki-ekskavatora/',
    'blog/remont-gidronasosa-cat/',
  ]) {
    const html = read(route);
    assert.match(html, /href="\/catalog\/category\/hydraulic-pumps\/"/);
  }
});
