// Local review only. This helper is not part of the production bundle.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
const root=path.resolve('dist/public');
const guard=`<script>window.__ACA_ANALYTICS_EXCLUDE__=true;window.open=function(){alert('Проверочная версия: заявка не отправлена.');return null;};document.addEventListener('click',function(e){const a=e.target.closest&&e.target.closest('a[href]');if(a){const u=new URL(a.href,location.href);if(u.origin!==location.origin){e.preventDefault();e.stopImmediatePropagation();alert('В проверочной версии внешние переходы отключены.');}}},true);</script>`;
http.createServer((req,res)=>{
 if(req.method!=='GET'&&req.method!=='HEAD')return res.writeHead(405).end();
 let file=path.join(root,decodeURIComponent(req.url.split('?')[0]));
 if(!file.startsWith(root+path.sep)&&file!==root)return res.writeHead(403).end();
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){if(path.extname(file))return res.writeHead(404).end();file=path.join(root,'index.html');}
 res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self'; frame-src 'none'; form-action 'none'; base-uri 'self'");
 res.setHeader('Content-Type',({'.html':'text/html;charset=utf-8','.js':'application/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2'})[path.extname(file)]||'application/octet-stream');
 if(file.endsWith('.html'))return res.end(fs.readFileSync(file,'utf8').replace('<head>','<head>'+guard));
 fs.createReadStream(file).pipe(res);
}).listen(5183,'127.0.0.1',()=>console.log('Local review: http://127.0.0.1:5183/ (external traffic and submissions disabled)'));
