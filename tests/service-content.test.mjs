import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const content = JSON.parse(fs.readFileSync('shared/service-content.json', 'utf8'));

test('priority services publish the same useful content and metadata without JavaScript', () => {
  for (const [route, page] of Object.entries(content)) {
    const html = fs.readFileSync('dist/public' + route + '/index.html', 'utf8');
    assert.ok(html.includes('<title data-rh="true">' + page.title + '</title>'), route);
    for (const section of page.sections) {
      assert.ok(html.includes(section.title), route);
      assert.ok(html.includes(section.text), route);
    }
    for (const faq of page.faq) {
      assert.ok(html.includes(faq.question), route);
      assert.ok(html.includes(faq.answer), route);
    }
    for (const link of page.related) {
      assert.ok(fs.existsSync('dist/public' + link.href + 'index.html'), link.href);
      assert.ok(html.includes('href="' + link.href + '"'), link.href);
    }
    assert.doesNotMatch(html, /Диагностика бесплатно|Гарантия 12 месяцев/);
  }
});
