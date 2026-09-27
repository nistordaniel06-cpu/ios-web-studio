const EBLAT_URL='https://bcedyacdepzhqwleizfl.supabase.co';
const EBLAT_KEY='sb_publishable_vrnEsnBHspLzL9pBxMuBzw_DBZ-1mgx';
const sb=supabase.createClient(EBLAT_URL,EBLAT_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
const STAGES=['oferta','confirmat','masurare','productie','transport','montaj','finalizat'];
function money(v){return new Intl.NumberFormat('ro-RO',{style:'currency',currency:'RON',maximumFractionDigits:0}).format(Number(v||0))}
function esc(v=''){return String(v).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
function toast(msg){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=msg;t.classList.add('show');clearTimeout(t._x);t._x=setTimeout(()=>t.classList.remove('show'),2300)}
async function currentUser(){const {data:{session}}=await sb.auth.getSession();return session?.user||null}
async function requireUser(){const u=await currentUser();if(!u){location.replace('index.html');throw new Error('AUTH_REQUIRED')}return u}
async function bootstrap(){await sb.rpc('eblat_ensure_profile');const u=await currentUser();const [{data:profile},{data:partner}]=await Promise.all([sb.from('eblat_profiles').select('*').eq('user_id',u.id).maybeSingle(),sb.from('eblat_partners').select('*').eq('user_id',u.id).maybeSingle()]);return{user:u,profile,partner}}
async function isAdmin(){const u=await currentUser();if(!u)return false;const {data}=await sb.from('eblat_admins').select('user_id').eq('user_id',u.id).maybeSingle();return!!data}
async function signOut(){await sb.auth.signOut();location.replace('index.html')}
function statusLabel(s){return({oferta:'Ofertă',confirmat:'Confirmat',masurare:'Măsurare',productie:'Producție',transport:'Transport',montaj:'Montaj',finalizat:'Finalizat',anulat:'Anulat'})[s]||s}
function statusClass(s){if(['finalizat','approved','delivered','active'].includes(s))return'green';if(['productie','transport','submitted'].includes(s))return'blue';if(['masurare','montaj','pending','requested','preparing'].includes(s))return'orange';if(['anulat','rejected','cancelled','suspended'].includes(s))return'red';return''}
function timeline(status){const i=STAGES.indexOf(status);return `<div class="timeline">${STAGES.map((s,x)=>`<span class="stage ${x<=i?'done':''}" title="${statusLabel(s)}"></span>`).join('')}</div>`}
function productImg(p){return p.master_image_url||p.thumbnail_url||'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80'}
function parseNum(v){return Number(String(v||'').replace(/[^0-9,.-]/g,'').replace(/\./g,'').replace(',','.'))||0}
function openModal(html){let o=document.querySelector('.overlay');if(!o){o=document.createElement('div');o.className='overlay';o.innerHTML='<div class="modal"></div>';document.body.appendChild(o);o.addEventListener('click',e=>{if(e.target===o)o.classList.remove('open')})}o.querySelector('.modal').innerHTML=html;o.classList.add('open');return o}
function closeModal(){document.querySelector('.overlay')?.classList.remove('open')}
async function signedUrl(path){const {data}=await sb.storage.from('eblat-project-files').createSignedUrl(path,3600);return data?.signedUrl||'#'}
async function uploadProjectFile(userId,projectId,file){if(!file)return null;const clean=file.name.replace(/[^a-zA-Z0-9._-]+/g,'-');const path=`${userId}/${projectId}/${Date.now()}-${clean}`;const {error}=await sb.storage.from('eblat-project-files').upload(path,file,{upsert:false});if(error)throw error;await sb.from('eblat_project_files').insert({project_id:projectId,owner_id:userId,storage_path:path,file_name:file.name,mime_type:file.type,size_bytes:file.size});return path}
async function loadAllProducts(){const {data,error}=await sb.from('eblat_products').select('*').order('title');if(error)throw error;return data||[]}
function qs(k){return new URLSearchParams(location.search).get(k)}