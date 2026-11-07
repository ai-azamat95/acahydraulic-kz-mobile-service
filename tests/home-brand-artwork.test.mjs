import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = p => readFileSync(new URL('../'+p, import.meta.url), 'utf8');
test('home shares outlined reference artwork without SERVICE or CSS mark', () => {
 const home=read('client/src/components/home/HomePage.tsx'), footer=read('client/src/components/home/HomeFooter.tsx');
 for(const s of [home,footer]) assert.match(s,/src="\/images\/home\/aca-hydraulic-reference.svg"/);
 assert.doesNotMatch(home,/className="home-mark"|♪|<Music2|<Youtube/);
 const svg=read('client/public/images/home/aca-hydraulic-reference.svg');
 assert.match(svg,/viewBox="0 0 674 174"/);assert.doesNotMatch(svg,/<text|SERVICE|<script/);assert.match(svg,/<path/);
});
test('same brand SVG components are used in header and work channels',()=>{
 const home=read('client/src/components/home/HomePage.tsx');
 for(const brand of ['tiktok','youtube']) assert.equal(home.split(`<BrandIcon brand="${brand}"/>`).length-1,2);
 const icons=read('client/src/components/home/BrandIcon.tsx');assert.match(icons,/aria-hidden="true" focusable="false"/);assert.match(icons,/viewBox="0 0 24 24"/);
 for(const url of ['https://www.tiktok.com/@acaservice01','https://www.youtube.com/@acahydraulic']) assert.equal(home.split(url).length-1,2);
 const css=read('client/src/home.css');assert.match(css,/min-width:44px;min-height:44px/);assert.match(css,/home-social>a:focus-visible/);assert.match(css,/home-channel-links>a:hover/);assert.match(css,/home-header\{background:#1d2228/);
});

test('logo uses the homepage accent and text palette without changing its paths', () => {
 const svg=read('client/public/images/home/aca-hydraulic-reference.svg');
 const css=read('client/src/home.css');
 assert.match(svg, /<g fill="#dfb76c">/);
 assert.match(svg, /<g fill="#e3e4eb">/);
 assert.match(css, /--gold:#dfb76c;--muted:#d0d2db;color:#e3e4eb/);
 assert.doesNotMatch(svg, /#e6bd70|#f1f2f5/);
});
