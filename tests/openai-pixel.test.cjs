const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const code = fs.readFileSync('client/public/analytics-gate.js', 'utf8');
function boot({marketing=false, analytics=false, internal=false, bot=false}={}) {
 const listeners={}, docListeners={}, scripts=[];
 const consent={version:1,necessary:true,analytics,marketing,updatedAt:Date.now()};
 const data=new Map([['aca_cookie_consent_v1',JSON.stringify(consent)]]);
 if(internal) data.set('aca_internal_traffic','1');
 const window={location:{search:'?oppref=test',pathname:'/',hash:'',hostname:'acahydraulic.kz',href:'https://acahydraulic.kz/?oppref=test'},navigator:{webdriver:bot,userAgent:'test'},history:{replaceState(){}},localStorage:{getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)},addEventListener:(n,f)=>listeners[n]=f,dispatchEvent:e=>listeners[e.type]?.(e),CustomEvent:function(type,props){this.type=type;this.detail=props.detail}};
 const document={title:'test',cookie:'',referrer:'',head:{appendChild:s=>scripts.push(s)},getElementById:id=>scripts.find(s=>s.id===id),createElement:()=>({}),addEventListener:(n,f)=>docListeners[n]=f};
 vm.runInNewContext(code,{window,document,URLSearchParams,Date,Boolean,Number,Object,Array,JSON});
 const calls=()=>window.oaiq ? window.oaiq.q.map(a=>Array.from(a)) : [];
 const measures=()=>calls().filter(a=>a[0]==='measure');
 const click=(href,isTrusted=true)=>docListeners.click({isTrusted,target:{closest:()=>({getAttribute:()=>href})}});
 return {window,scripts,calls,measures,click,consent};
}
for(const opts of [{},{analytics:true},{marketing:true,internal:true},{marketing:true,bot:true}]) {
 const b=boot(opts); b.click('https://wa.me/123?text=private'); assert.equal(b.calls().length,0);
}
const b=boot({marketing:true});
assert.equal(b.scripts.filter(s=>s.id==='aca-openai-pixel').length,1);
assert.equal(b.calls().filter(c=>c[0]==='init').length,1);
assert.equal(b.calls().find(c=>c[0]==='init')[1].pixelId,'RAqt8xZo4eBECsuc32zrtP');
b.click('https://wa.me/123?text=private');
b.click('tel:123');
b.click('https://wa.me/123',false);
b.click('https://example.com/');
assert.equal(b.measures().length,2);
assert.equal(b.measures()[0][3].custom_event_name,'whatsapp_click');
assert(!JSON.stringify(b.measures()).includes('private'));
b.window.dispatchEvent({type:'aca:openai-contact-intent',detail:'form_whatsapp_click'});
assert.equal(b.measures().length,3);
b.window.dispatchEvent({type:'aca:openai-contact-intent',detail:'lead_created'});
assert.equal(b.measures().length,3);
b.window.__ACA_APPLY_COOKIE_CONSENT__({...b.consent,marketing:false});
assert(b.calls().some(c=>c[0]==='consent'&&c[1]===false));
b.click('tel:123'); assert.equal(b.measures().length,3);
b.window.__ACA_APPLY_COOKIE_CONSENT__(b.consent);
assert.equal(b.scripts.filter(s=>s.id==='aca-openai-pixel').length,1);
assert.equal(b.calls().filter(c=>c[0]==='init').length,1);
console.log('PASS: consent, internal/bot exclusion, single init/load, contact events, PII omission, revoke/regrant, no fake leads');
