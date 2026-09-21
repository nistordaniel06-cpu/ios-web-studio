(() => {
  const SUPABASE_URL = 'https://bcedyacdepzhqwleizfl.supabase.co';
  const PUBLISHABLE_KEY = 'sb_publishable_vrnEsnBHspLzL9pBxMuBzw_DBZ-1mgx';
  const CONSENT_KEY = 'purestone-consent-v1';
  const SESSION_KEY = 'purestone-session-v1';
  let overridesCache = null;

  const sessionId = () => {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) { id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`; localStorage.setItem(SESSION_KEY, id); }
    return id;
  };
  const consent = () => localStorage.getItem(CONSENT_KEY) || 'unset';
  const analyticsAllowed = () => consent() === 'analytics';

  async function track(event_name, metadata = {}, product_slug = '') {
    if (!analyticsAllowed()) return;
    try {
      await fetch(`${SUPABASE_URL}/functions/v1/purestone-event`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
        body: JSON.stringify({ event_name, page: location.href, product_slug, session_id: sessionId(), metadata })
      });
    } catch (_) {}
  }

  async function loadOverrides(force = false) {
    if (overridesCache && !force) return overridesCache;
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/purestone_product_overrides?select=*`, { headers: { apikey: PUBLISHABLE_KEY }, cache: 'no-store' });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      overridesCache = await r.json();
      return overridesCache;
    } catch (_) { overridesCache = []; return overridesCache; }
  }

  function mergeCatalog(base, overrides = []) {
    const map = new Map((overrides || []).map(x => [x.slug, x]));
    return (base || []).map(item => {
      const o = map.get(item.slug);
      if (!o) return { ...item, is_active: true };
      const merged = { ...item };
      ['title','brand','material','color_family','furniture_pairing','furniture_category','price_label','finish','thickness','slab_size','image_url','sort_order','is_featured','is_active'].forEach(k => {
        if (o[k] !== null && o[k] !== undefined && o[k] !== '') merged[k] = o[k];
      });
      return merged;
    }).filter(x => x.is_active !== false).sort((a,b) => Number(a.sort_order || 0) - Number(b.sort_order || 0));
  }

  function proxiedImage(src, name = 'PureStone') {
    try {
      const u = new URL(src, location.href);
      if (!['top-blat.ro','www.top-blat.ro'].includes(u.hostname) || !u.pathname.startsWith('/wp-content/uploads/')) return src;
      return `${SUPABASE_URL}/functions/v1/purestone-image?src=${encodeURIComponent(u.href)}&name=${encodeURIComponent(name)}`;
    } catch { return src; }
  }

  function proxyImages(root = document) {
    root.querySelectorAll?.('img[src]').forEach(img => {
      const current = img.getAttribute('src') || '';
      const next = proxiedImage(current, img.alt || 'PureStone');
      if (next !== current) img.setAttribute('src', next);
    });
  }

  function observeImages() {
    proxyImages(document);
    const observer = new MutationObserver(list => {
      for (const m of list) m.addedNodes.forEach(node => {
        if (!(node instanceof Element)) return;
        if (node.matches?.('img[src]')) {
          const current = node.getAttribute('src') || '';
          const next = proxiedImage(current, node.getAttribute('alt') || 'PureStone');
          if (next !== current) node.setAttribute('src', next);
        }
        proxyImages(node);
        node.querySelectorAll?.('a[href*="kitchen-visualizer"]').forEach(a => a.remove());
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function hideKitchenVisualizerLinks(root = document) {
    root.querySelectorAll?.('a[href*="kitchen-visualizer"]').forEach(a => a.remove());
  }

  function fixVisualizerSwap() {
    const chips = document.querySelector('#materialChips');
    const stage = document.querySelector('#studioImage');
    if (!chips || !stage || chips.dataset.purestoneMappingFix === '1') return;
    chips.dataset.purestoneMappingFix = '1';
    const correctedScenes = {
      'Desert Silver': 'https://top-blat.ro/wp-content/uploads/2024/05/Blaturi-de-bucatarii-Blaturi-de-Baie-quartz-compozit-Blaturidebucatarii.ro-117-1024x768.avif',
      'Arte Black': 'https://top-blat.ro/wp-content/uploads/2024/05/Blaturi-de-bucatarii-Blaturi-de-Baie-quartz-compozit-Blaturidebucatarii.ro-269-1024x497.avif'
    };
    chips.addEventListener('click', event => {
      const chip = event.target.closest('.chip');
      if (!chip) return;
      const name = chip.querySelector('b')?.textContent?.trim();
      const src = correctedScenes[name];
      if (!src) return;
      setTimeout(() => {
        stage.src = proxiedImage(src, name);
        stage.alt = `${name} • PureStone`;
      }, 160);
    });
  }

  function ensureHeadAssets() {
    if (!document.querySelector('link[rel="manifest"]')) {
      const l = document.createElement('link'); l.rel = 'manifest'; l.href = './site.webmanifest'; document.head.appendChild(l);
    }
    if (!document.querySelector('link[rel~="icon"]')) {
      const l = document.createElement('link'); l.rel = 'icon'; l.type = 'image/svg+xml'; l.href = './purestone-mark.svg'; document.head.appendChild(l);
    }
    if (!document.querySelector('meta[name="theme-color"]')) {
      const m = document.createElement('meta'); m.name = 'theme-color'; m.content = '#f4efe7'; document.head.appendChild(m);
    }
  }

  async function injectStructuredData() {
    document.querySelectorAll('script[data-purestone-schema]').forEach(x => x.remove());
    const add = data => { const s=document.createElement('script'); s.type='application/ld+json'; s.dataset.purestoneSchema='1'; s.textContent=JSON.stringify(data); document.head.appendChild(s); };
    add({ '@context':'https://schema.org', '@type':'Organization', name:'PureStone', url:location.origin + location.pathname.replace(/[^/]+$/,'purestone.html'), logo:location.origin + location.pathname.replace(/[^/]+$/,'purestone-mark.svg'), contactPoint:{ '@type':'ContactPoint', telephone:'+40 733 250 220', contactType:'sales', areaServed:'RO', availableLanguage:['ro'] } });
    if (!/product\.html$/i.test(location.pathname)) return;
    const slug = new URLSearchParams(location.search).get('slug');
    const base = (typeof TOP_BLAT_CATALOG !== 'undefined' && Array.isArray(TOP_BLAT_CATALOG)) ? TOP_BLAT_CATALOG : [];
    if (!slug || !base.length) return;
    const all = mergeCatalog(base, await loadOverrides());
    const p = all.find(x => x.slug === slug); if (!p) return;
    const raw = p.image_url || p.remote_images?.[0] || '';
    add({ '@context':'https://schema.org', '@type':'Product', name:p.title, description:p.furniture_pairing || `${p.title} — material premium PureStone.`, category:p.material || 'Suprafață premium', brand:p.brand ? { '@type':'Brand', name:p.brand } : undefined, image:raw ? [proxiedImage(raw,p.title)] : undefined, url:location.href.split('#')[0] });
  }

  function enhanceProductActions() {
    if (!/product\.html$/i.test(location.pathname)) return;
    const slug = new URLSearchParams(location.search).get('slug');
    const actions = document.querySelector('.actions');
    if (!slug || !actions || actions.dataset.v4Enhanced === '1') return;
    actions.dataset.v4Enhanced = '1';
    const compare = document.createElement('a');
    compare.className = 'btn light';
    compare.href = `./compare.html?slugs=${encodeURIComponent(slug)}`;
    compare.textContent = 'Compară';
    actions.append(compare);
  }

  function injectLegalLinks() {
    document.querySelectorAll('footer').forEach(footer => {
      if (footer.querySelector('[data-purestone-legal]')) return;
      const wrap = document.createElement('div');
      wrap.dataset.purestoneLegal = '1';
      wrap.style.cssText = 'margin-top:16px;font-size:10px;display:flex;gap:14px;flex-wrap:wrap;opacity:.75';
      wrap.innerHTML = '<a href="./privacy.html">Confidențialitate</a><a href="./terms.html">Termeni</a><button type="button" data-cookie-settings style="border:0;background:none;padding:0;color:inherit;font:inherit;cursor:pointer">Preferințe cookies</button>';
      (footer.querySelector('.wrap') || footer).appendChild(wrap);
    });
  }

  function showConsent(force = false) {
    if (!force && consent() !== 'unset') return;
    document.querySelector('#purestone-consent')?.remove();
    const el = document.createElement('div');
    el.id = 'purestone-consent';
    el.style.cssText = 'position:fixed;z-index:9999;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);width:min(560px,calc(100% - 24px));background:#211e1a;color:white;border:1px solid rgba(255,255,255,.14);border-radius:22px;padding:16px;box-shadow:0 24px 70px rgba(0,0,0,.28);font-family:DM Sans,system-ui,sans-serif';
    el.innerHTML = '<div style="font-family:Playfair Display,serif;font-size:21px;margin-bottom:5px">Preferințe de confidențialitate</div><div style="font-size:11px;line-height:1.55;color:rgba(255,255,255,.72)">Folosim stocare esențială pentru funcționarea site-ului. Analytics first-party este opțional și ne ajută să înțelegem ce materiale sunt utile.</div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:13px"><button data-consent="essential" style="border:1px solid rgba(255,255,255,.22);background:transparent;color:white;border-radius:999px;padding:10px 13px;font-weight:700">Doar necesare</button><button data-consent="analytics" style="border:0;background:#a48058;color:white;border-radius:999px;padding:10px 13px;font-weight:700">Accept analytics</button><a href="./privacy.html" style="align-self:center;color:white;font-size:10px;margin-left:auto">Detalii</a></div>';
    document.body.appendChild(el);
    el.querySelectorAll('[data-consent]').forEach(btn => btn.addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, btn.dataset.consent); el.remove();
      if (btn.dataset.consent === 'analytics') track('page_view', { title: document.title });
    }));
  }

  function init() {
    hideKitchenVisualizerLinks();
    ensureHeadAssets(); injectLegalLinks(); showConsent(false); observeImages(); fixVisualizerSwap(); enhanceProductActions(); injectStructuredData();
    document.addEventListener('click', e => {
      const settings = e.target.closest?.('[data-cookie-settings]'); if (settings) showConsent(true);
      const wa = e.target.closest?.('a[href*="wa.me"],a[href*="api.whatsapp.com"]'); if (wa) track('open_whatsapp', { text:(wa.textContent||'').trim().slice(0,100) });
      const sim = e.target.closest?.('a[href*="#visualizer"],a[href*="visualizer"]'); if (sim) track('open_simulator');
      const compare = e.target.closest?.('a[href*="compare.html"]'); if (compare) track('open_compare');
    });
    if (analyticsAllowed()) track('page_view', { title: document.title });
  }

  window.PureStoneRuntime = { SUPABASE_URL, PUBLISHABLE_KEY, consent, analyticsAllowed, track, loadOverrides, mergeCatalog, proxiedImage, proxyImages, showConsent, init };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once:true }); else init();
})();
