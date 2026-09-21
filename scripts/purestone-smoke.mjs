import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const pages=['/purestone.html','/catalog.html','/compare.html','/kitchen-visualizer.html','/booking.html','/b2b.html','/materiale/elysee-quartz-alb-coante/'];
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
      await page.waitForTimeout(900);
      if(route==='/compare.html' && await page.locator('.card').count()<1) failures.push(`${vp.name} compare: no cards`);
      if(route==='/kitchen-visualizer.html'){
        if(!(await page.locator('#viewer').count())) failures.push(`${vp.name} visualizer: viewer missing`);
        if(!(await page.locator('#demo').count())) failures.push(`${vp.name} visualizer: demo missing`);
        if(!(await page.locator('#compare').count())) failures.push(`${vp.name} visualizer: compare control missing`);
        if(vp.name!=='desktop'){
          const photoBox=await page.locator('.photo-card').boundingBox();
          const stageBox=await page.locator('.stage').boundingBox();
          const materialsBox=await page.locator('.materials-card').boundingBox();
          if(photoBox&&stageBox&&materialsBox && !(photoBox.y<stageBox.y && stageBox.y<materialsBox.y)) failures.push(`${vp.name} visualizer: mobile order incorrect`);
          const appWidth=await page.locator('.app').evaluate(el=>el.getBoundingClientRect().width);
          const stageWidth=await page.locator('.stage').evaluate(el=>el.getBoundingClientRect().width);
          if(stageWidth/appWidth<.94) failures.push(`${vp.name} visualizer: stage not full width`);
        }
        await page.locator('#demo').click();
        try{await page.waitForFunction(()=>/Demo real încărcat/i.test(document.querySelector('#status')?.textContent||''),{timeout:9000})}
        catch{const status=(await page.locator('#status').textContent())?.trim()||'';failures.push(`${vp.name} visualizer: real demo not ready (${status})`)}
        const state=(await page.locator('#pointState').textContent())?.trim();
        if(state!=='4 / 4 puncte') failures.push(`${vp.name} visualizer: demo did not mark surface (${state})`);
        await page.locator('#compare').evaluate(el=>{el.value='75';el.dispatchEvent(new Event('input',{bubbles:true}))});
        const clip=await page.locator('#materialWrap').evaluate(el=>el.style.clipPath);
        if(!/25%/.test(clip)) failures.push(`${vp.name} visualizer: compare clip inactive (${clip})`);
        const left=await page.locator('#handle').evaluate(el=>el.style.left);
        if(left!=='75%') failures.push(`${vp.name} visualizer: drag handle not synced (${left})`);
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
