import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {routes,url,render,schema} from '../site/render.mjs';
import {origin} from '../site/content.mjs';
export const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const output=path.join(root,'dist');
const hash=s=>createHash('sha256').update(s).digest('hex').slice(0,12);
export const headers={'Content-Security-Policy':`default-src 'self'; script-src 'self' 'sha256-${createHash('sha256').update(schema).digest('base64')}'; style-src 'self'; img-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'`,'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=(), payment=()'};
export async function build(){await mkdir(path.join(output,'assets'),{recursive:true});const assets={};for(const [key,file] of Object.entries({css:'style.css',js:'client.js',food:'assets/lunch-editorial.png',favicon:'assets/favicon.svg',appScreen:'assets/app-home-preview.svg'})){const source=await readFile(path.join(root,'site',file)),ext=path.extname(file),name=`${path.basename(file,ext)}-${hash(source)}${ext}`;await writeFile(path.join(output,'assets',name),source);assets[key]=`/assets/${name}`;}
for(const lang of ['en','ru']){for(const route of [...routes,'404']){const dest=path.join(output,lang==='ru'?'ru':'',route?`${route}.html`:'index.html');await mkdir(path.dirname(dest),{recursive:true});await writeFile(dest,render(lang,route,assets));}}
for(const file of ['googlec0cff0dd439eb474.html','googleff0507c6aa6093ea.html'])await copyFile(path.join(root,file),path.join(output,file));
await writeFile(path.join(output,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile(path.join(output,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['en','ru'].flatMap(lang=>routes.map(route=>`<url><loc>${origin}${url(lang,route)}</loc></url>`)).join('')}</urlset>`);
await writeFile(path.join(output,'build-manifest.json'),JSON.stringify({assets,routes:['en','ru'].flatMap(l=>routes.map(r=>url(l,r)))},null,2));
return {assets};}
if(process.argv[1]===fileURLToPath(import.meta.url)){await build();console.log(`Built ${routes.length*2} static content pages, 2 404 pages and preserved verification files.`);}
