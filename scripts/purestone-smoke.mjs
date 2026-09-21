import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const pages=['/purestone.html','/catalog.html','/compare.html','/booking.html','/b2b.html','/materiale/elysee-quartz-alb-coante/'];
const viewports=[{name:'desktop',width:1440,height:1000},{name:'android',width:390,height:844},{name:'iphone',width:393,height:852}];
let failures=[];
for(const vp of viewports){
  for(const route of pages){
    const page=await browser.newPage({viewport:{width:vp.width,height:vp.height}});
    const errors=[];
    page.on('pageerror',e=>errors.push(String(e)));
    page.on('console',m=>{if(m.type()==='error'&&!/Failed to load resource|ERR_BLOCKED|favicon|net::ERR_/i.test(m.text()))errors.push(m.text())});
    try{
      const r=await page.goto('http://127.0.0.1:4173'+route,{waitUntil:'domcontentloaded',timeout:20000});
      if(!r||r.status()>=400)failures.push(`${vp.name} ${route}: HTTP ${r?.status()}`);
      await page.waitForTimeout(1000);
      if(route==='/compare.html'){
        const n=await page.locator('.card').count();
        if(n<1)failures.push(`${vp.name} compare: no cards`);
      }
      if(route==='/booking.html'&&!(await page.locator('#form').count()))failures.push(`${vp.name} booking: form missing`);
      if(route==='/b2b.html'&&!(await page.locator('#loginBtn').count()))failures.push(`${vp.name} b2b: login missing`);
      if(errors.length)failures.push(`${vp.name} ${route}: ${errors.join(' | ')}`);
    }catch(e){failures.push(`${vp.name} ${route}: ${e.message}`)}finally{await page.close()}
  }
}
await browser.close();
if(failures.length){console.error('PureStone smoke failures:\n'+failures.join('\n'));process.exit(1)}
console.log(`PureStone smoke OK: ${pages.length} pages × ${viewports.length} viewports`);
