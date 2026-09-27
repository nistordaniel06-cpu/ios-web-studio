const SUPABASE_URL='https://bcedyacdepzhqwleizfl.supabase.co';
const SUPABASE_KEY='sb_publishable_vrnEsnBHspLzL9pBxMuBzw_DBZ-1mgx';
const sb=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const PROJECTS=[
['Casă modernă','București','Quartz compozit','https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=82'],
['Apartament premium','București','Ceramică','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=82'],
['Restaurant concept','București','Piatră naturală','https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=900&q=82'],
['Vilă contemporană','Ilfov','Quartz compozit','https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=82'],
['Baie statement','București','Ceramică','https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=900&q=82'],
['Bucătărie dark luxury','București','Quartz compozit','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=82'],
['Hospitality concept','România','Piatră naturală','https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=900&q=82'],
['Showroom concept','București','Quartz compozit','https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=82']];
const projectGrid=document.getElementById('projectGrid');
projectGrid.innerHTML=PROJECTS.map(p=>`<article class="project"><div class="project-media"><img src="${p[3]}" alt="${p[0]}"></div><div class="project-body"><h3>${p[0]}</h3><div class="meta">⌖ ${p[1]}</div><div class="tags"><span class="tag">${p[2]}</span><span class="tag">Inspirație</span></div><span class="arrow">→</span></div></article>`).join('');
let catalog=[];
const PRODUCT_URL='../../catalog_culori_quartz.json';
function renderProducts(filter='all',q=''){
  let arr=catalog.filter(p=>{const mat=(p.material||'').toLowerCase();const txt=`${p.title} ${p.brand} ${p.material}`.toLowerCase();return (filter==='all'||(filter==='quartz'&&mat.includes('cuar'))||(filter==='ceramic'&&mat.includes('ceramic')))&&(!q||txt.includes(q.toLowerCase()))}).slice(0,6);
  products.innerHTML=arr.map(p=>`<article class="product"><div class="media"><img src="${p.thumbnail_url||p.master_image_url}" alt="${p.title}"></div><div class="product-body"><small>${p.brand||'eBlat'}</small><h3>${p.title}</h3><p>${p.material||''}</p><div class="product-price">${p.price||'La cerere'}</div><div class="product-actions"><a href="${p.url}" target="_blank" rel="noopener">Detalii</a><a class="dark quoteProduct" href="#" data-product="${p.title.replace(/"/g,'&quot;')}">Cere ofertă</a></div></div></article>`).join('')||'<p>Nu am găsit materiale.</p>';
  bindQuoteProducts();
}
fetch(PRODUCT_URL).then(r=>r.json()).then(d=>{catalog=d.products||[];renderProducts()}).catch(()=>{products.innerHTML='<p>Catalogul nu este disponibil momentan.</p>'});
document.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{document.querySelectorAll('.chip').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderProducts(b.dataset.filter,searchTop.value)});
searchTop.oninput=()=>renderProducts(document.querySelector('.chip.active')?.dataset.filter||'all',searchTop.value);
const modal=document.getElementById('modal');
function openModal(product=''){modal.classList.add('open');if(product)details.value=`Mă interesează materialul: ${product}. `}
document.querySelectorAll('.quoteOpen').forEach(b=>b.onclick=()=>openModal());
function bindQuoteProducts(){document.querySelectorAll('.quoteProduct').forEach(b=>b.onclick=e=>{e.preventDefault();openModal(b.dataset.product)})}
close.onclick=()=>modal.classList.remove('open');modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};
function showToast(t){toast.textContent=t;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),2600)}
send.onclick=async()=>{
  const n=name.value.trim(),c=contactField.value.trim();
  if(!n||!c)return showToast('Completează numele și contactul.');
  send.disabled=true;send.textContent='Se trimite...';
  const {error}=await sb.from('eblat_public_leads').insert({name:n,contact:c,project_type:type.value,material:material.value,details:details.value.trim(),source:'v32_homepage'});
  send.disabled=false;send.textContent='Trimite cererea →';
  if(error)return showToast('Nu am putut trimite. Încearcă din nou.');
  showToast('Cererea a fost trimisă către eBlat.');
  modal.classList.remove('open');name.value='';contactField.value='';details.value='';
};
hamb.onclick=()=>mobile.classList.toggle('open');document.querySelectorAll('.mobile a').forEach(a=>a.onclick=()=>mobile.classList.remove('open'));