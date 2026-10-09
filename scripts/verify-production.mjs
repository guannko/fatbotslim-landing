import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {routes,url} from '../site/render.mjs';
import {headers,root} from './build.mjs';

const origin='https://fatbotslim.fit';
const assets=new Set();
for(const lang of ['en','ru'])for(const route of routes){
  const pathname=url(lang,route);
  const response=await fetch(origin+pathname);
  assert.equal(response.status,200,pathname);
  const html=await response.text();
  assert.ok(html.includes(`<html lang="${lang}"`),pathname);
  assert.ok(html.includes(`rel="canonical" href="${origin}${pathname}"`),pathname);
  assert.equal(response.headers.get('content-security-policy'),headers['Content-Security-Policy']);
  assert.doesNotMatch(html,/11\.99|Free Trial|cdn\.tailwindcss/);
  for(const match of html.matchAll(/(?:href|src)="(\/assets\/[^\"]+)"/g))assets.add(match[1]);
  console.log(`PASS ${pathname}: 200, language, canonical, security headers`);
}
for(const pathname of assets){const response=await fetch(origin+pathname);assert.equal(response.status,200,pathname);assert.match(response.headers.get('cache-control'),/immutable/);console.log(`PASS asset ${pathname}`);}
for(const file of ['googlec0cff0dd439eb474.html','googleff0507c6aa6093ea.html']){const response=await fetch(origin+'/'+file);assert.equal(response.status,200);assert.equal(await response.text(),await readFile(path.join(root,file),'utf8'));console.log(`PASS Google verification ${file}`);}
const sitemap=await fetch(origin+'/sitemap.xml');assert.equal(sitemap.status,200);assert.equal(((await sitemap.text()).match(/<loc>/g)||[]).length,10);console.log('PASS sitemap: 10 content URLs');
const robots=await fetch(origin+'/robots.txt');assert.equal(robots.status,200);assert.ok((await robots.text()).includes(`Sitemap: ${origin}/sitemap.xml`));console.log('PASS robots.txt');
for(const pathname of ['/deployment-check-not-a-page','/ru/deployment-check-not-a-page','/site/content.mjs']){const response=await fetch(origin+pathname);assert.equal(response.status,404,pathname);console.log(`PASS ${pathname}: genuine 404`);}
console.log('Production HTTP verification passed. Search indexing and bot behavior are outside this check.');
