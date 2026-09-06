import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync('client/index.html', 'utf8');
const tracker = html.split('<!-- One tracker per contact click.')[1].match(/<script>([\s\S]*?)<\/script>/)[1];
test('one analytics event per contact click, no navigation dependency or personal query data', () => {
  for (const href of ['tel:+77714177925', 'https://wa.me/77714177925?text=PRIVATE_CLIENT_DATA']) {
    let listener; const calls = [];
    vm.runInNewContext(tracker, {document:{addEventListener:(_, fn) => listener = fn}, window:{gtag:(...args) => calls.push(args)}});
    listener({target:{closest:() => ({getAttribute:() => href})}});
    assert.equal(calls.length, 2);
    assert.equal(calls.filter(c => c[1] === 'conversion').length, 1);
    assert.ok(!JSON.stringify(calls).includes('PRIVATE_CLIENT_DATA'));
  }
});
test('blocked or throwing analytics cannot cancel a contact click', () => {
  for (const window of [{}, {gtag:() => {throw Error('blocked')}}]) {
    let listener;
    vm.runInNewContext(tracker,{document:{addEventListener:(_,fn)=>listener=fn},window});
    assert.doesNotThrow(()=>listener({target:{closest:()=>({getAttribute:()=> 'https://wa.me/77714177925'})}}));
  }
});
test('every sitemap page has one correct static canonical and a page bundle', () => {
  const sitemap=fs.readFileSync('dist/public/sitemap.xml','utf8');
  for (const [,url] of sitemap.matchAll(/<loc>(.*?)<\/loc>/g)) {
    const route=new URL(url).pathname;
    const page=fs.readFileSync('dist/public'+route+'index.html','utf8');
    const tags=page.match(/<link[^>]*rel="canonical"[^>]*>/g)||[];
    assert.equal(tags.length,1,route);
    assert.ok(tags[0].includes(`href="${url}"`),route);
    assert.ok(tags[0].includes('data-rh="true"'),route);
    assert.match(page, /<script[^>]+src="\/assets\//);
  }
});
