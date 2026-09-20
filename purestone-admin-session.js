(() => {
  const URL='https://bcedyacdepzhqwleizfl.supabase.co';
  const KEY='sb_publishable_vrnEsnBHspLzL9pBxMuBzw_DBZ-1mgx';
  const STORE='purestone-admin-session-v1';
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'null')}catch{return null}};
  const save=s=>localStorage.setItem(STORE,JSON.stringify(s));
  const clear=()=>localStorage.removeItem(STORE);
  async function login(email,password){const r=await fetch(`${URL}/auth/v1/token?grant_type=password`,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({email,password})}),j=await r.json();if(!r.ok||!j.access_token)throw new Error(j.error_description||j.msg||'Autentificare nereușită');const s={access_token:j.access_token,refresh_token:j.refresh_token,expires_at:Date.now()+((j.expires_in||3600)-60)*1000,email:j.user?.email||email};save(s);return s}
  async function refresh(){const s=read();if(!s?.refresh_token)throw new Error('Nu există sesiune');const r=await fetch(`${URL}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:s.refresh_token})}),j=await r.json();if(!r.ok||!j.access_token){clear();throw new Error('Sesiune expirată')}const n={access_token:j.access_token,refresh_token:j.refresh_token||s.refresh_token,expires_at:Date.now()+((j.expires_in||3600)-60)*1000,email:j.user?.email||s.email};save(n);return n}
  async function token(){let s=read();if(!s)return '';if(Date.now()>Number(s.expires_at||0))s=await refresh();return s.access_token||''}
  async function headers(extra={}){const t=await token().catch(()=>''),h={...extra};if(t)h.Authorization=`Bearer ${t}`;return h}
  async function verify(){const t=await token();if(!t)return false;const r=await fetch(`${URL}/functions/v1/purestone-admin-auth`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${t}`},body:JSON.stringify({action:'verify'})}),j=await r.json();return !!(r.ok&&j.ok)}
  window.PureStoneAdminSession={login,refresh,token,headers,verify,logout:clear,session:read};
})();