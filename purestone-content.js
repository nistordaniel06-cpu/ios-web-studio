window.PURESTONE_DEFAULT_CONTENT = {
  brand: { name: "PURESTONE", tagline: "NATURAL ELEGANCE • ROMÂNIA" },
  loader: { enabled: true, showOncePerSession: true, duration: 1550 },
  hero: {
    eyebrow: "Mai mult decât un blat.",
    title: "Blaturi premium pentru bucătării care impresionează.",
    subtitle: "Quartz, ceramică și suprafețe premium realizate la comandă. De la alegerea materialului până la măsurători și montaj.",
    image: "https://top-blat.ro/wp-content/uploads/2024/05/Blaturi-de-bucatarii-Blaturi-de-Baie-quartz-compozit-Blaturidebucatarii.ro-107-1-1024x768.avif"
  },
  professionals: {
    eyebrow: "Pentru designeri & arhitecți",
    title: "Programează o întâlnire cu echipa PureStone.",
    subtitle: "Pentru proiecte rezidențiale, horeca sau amenajări premium, discută direct cu un consultant despre materiale, mostre, disponibilitate și ofertare.",
    team: [{ id: "team-1", name: "Echipa PureStone", role: "Consultanță proiecte & showroom", phone: "0733 250 220", photo: "" }]
  },
  contact: {
    phone: "0733 250 220", whatsapp: "40733250220", area: "București & Ilfov",
    showroomTitle: "Vezi materialele în realitate.",
    showroomText: "Compară mostrele, finisajele și venaturile înainte de decizie.",
    showroomImage: "https://top-blat.ro/wp-content/uploads/2024/05/Blaturi-de-bucatarii-Blaturi-de-Baie-quartz-compozit-Blaturidebucatarii.ro-117-1024x768.avif"
  }
};

window.PURESTONE_SUPABASE = {
  url: "https://bcedyacdepzhqwleizfl.supabase.co",
  publishableKey: "sb_publishable_vrnEsnBHspLzL9pBxMuBzw_DBZ-1mgx",
  table: "purestone_content",
  rowId: "site"
};

window.PureStoneCMS = (() => {
  const KEY = "purestone-site-content-v1";
  const cfg = window.PURESTONE_SUPABASE;
  let remoteCache = null;
  const clone = value => JSON.parse(JSON.stringify(value));
  const merge = (base, override) => {
    if (!override || typeof override !== "object") return base;
    Object.keys(override).forEach(key => {
      if (Array.isArray(override[key])) base[key] = override[key];
      else if (override[key] && typeof override[key] === "object") base[key] = merge(base[key] && typeof base[key] === "object" ? base[key] : {}, override[key]);
      else base[key] = override[key];
    });
    return base;
  };
  const local = () => { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch (_) { return null; } };
  const get = () => {
    const base = clone(window.PURESTONE_DEFAULT_CONTENT);
    if (remoteCache) return merge(base, clone(remoteCache));
    return merge(base, local() || {});
  };
  const emit = content => window.dispatchEvent(new CustomEvent("purestone-content-updated", { detail: content }));
  const save = content => { localStorage.setItem(KEY, JSON.stringify(content)); emit(content); };
  const reset = () => localStorage.removeItem(KEY);
  const exportJSON = () => JSON.stringify(get(), null, 2);
  const importJSON = text => { const parsed = JSON.parse(text); save(parsed); return parsed; };
  const loadRemote = async () => {
    try {
      const url = `${cfg.url}/rest/v1/${cfg.table}?id=eq.${encodeURIComponent(cfg.rowId)}&select=content`;
      const r = await fetch(url, { headers: { apikey: cfg.publishableKey }, cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const rows = await r.json();
      if (rows?.[0]?.content) {
        remoteCache = rows[0].content;
        localStorage.setItem(KEY, JSON.stringify(remoteCache));
        emit(get());
        return remoteCache;
      }
    } catch (e) { console.warn("PureStone CMS remote load failed; local fallback active.", e); }
    return null;
  };
  const ready = loadRemote();
  return { get, save, reset, exportJSON, importJSON, loadRemote, ready, key: KEY };
})();

/* Editorial photo remaster + cross-device layout hardening. */
(() => {
  const style = document.createElement("style");
  style.id = "purestone-magazine-grade";
  style.textContent = `
    html,body{max-width:100%;overflow-x:hidden}
    footer a[href*="purestone-admin"]{display:none!important}
    .hero-media img,.collection img,.studio-stage>img,.product-media img,.project img,.showroom-img img,.showroom-photo img,.team-photo img{
      filter:saturate(.9) contrast(1.065) brightness(1.025) sepia(.022)!important;
      image-rendering:auto;
    }
    .hero-media:before,.collection:before,.project:before,.showroom-img:before,.showroom-photo:before{
      content:"";position:absolute;inset:0;z-index:1;pointer-events:none;
      background:linear-gradient(145deg,rgba(255,248,238,.11),transparent 42%,rgba(45,31,22,.07));mix-blend-mode:soft-light;
    }
    .hero-media img{object-position:center 54%;transform:scale(1.012)}
    .collection img{object-position:center center}.project img{object-position:center 48%}.product-media img{object-position:center center}
    .studio,.studio-stage,.studio-card,.hero-card,.featured,.product,.section-head,.config{min-width:0;max-width:100%}
    .mobile-menu,.intro{min-height:100dvh}
    .featured .product-media{background:#d6cbbb;position:relative}
    .featured .product-media:after{content:"";position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}
    .presentation-bridge{margin:26px auto 0;display:grid;grid-template-columns:repeat(4,1fr);gap:10px;max-width:980px}
    .presentation-step{padding:14px 15px;border:1px solid rgba(32,29,25,.1);border-radius:18px;background:rgba(255,255,255,.46);font-size:10px;color:#786f65;line-height:1.45}
    .presentation-step b{display:block;color:#211e1a;font-size:11px;margin-bottom:3px}
    .presentation-step span{color:#a48058;font-weight:800;margin-right:6px}
    #calculator{scroll-margin-top:90px}
    @media(max-width:760px){
      body{padding-bottom:calc(96px + env(safe-area-inset-bottom))}
      .wrap{width:calc(100% - 24px)!important;max-width:100%!important}
      header{padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}
      .hero-media img{object-position:center 52%;transform:scale(1.02)}
      .collection img{filter:saturate(.92) contrast(1.055) brightness(1.03) sepia(.015)!important}
      .section{padding:58px 0!important}
      .section-head{display:block!important;margin-bottom:22px!important}
      .section-head p{margin-top:14px!important;max-width:100%!important}
      .studio{width:100%!important;padding:12px!important;border-radius:24px!important;overflow:hidden!important}
      .studio-copy{padding:18px 8px 10px!important}
      .studio-stage{width:100%!important;min-width:0!important;min-height:430px!important;border-radius:20px!important;overflow:hidden!important}
      .studio-stage>img{width:100%!important;height:100%!important;object-fit:cover!important}
      .studio-card{left:12px!important;right:12px!important;bottom:12px!important;width:auto!important;max-width:none!important;padding:14px!important;border-radius:18px!important}
      .featured{grid-template-columns:1fr!important;width:100%!important;gap:14px!important}
      .product{width:100%!important;overflow:hidden!important;border-radius:24px!important}
      .product-media{height:240px!important;width:100%!important}
      .product-media img{width:100%!important;height:100%!important;object-fit:cover!important}
      .presentation-bridge{grid-template-columns:1fr 1fr;gap:8px;margin-top:18px}
      .presentation-step{padding:12px;font-size:9px}
      .config{padding:24px 16px!important;border-radius:26px!important}
      .config-head{display:block!important}
      .total{text-align:left!important;margin-top:18px!important}
      .config-grid{grid-template-columns:1fr!important}
      .config-actions .btn{width:100%!important}
      .dock{
        left:50%!important;right:auto!important;transform:translateX(-50%)!important;
        width:calc(100% - 24px)!important;max-width:430px!important;
        bottom:max(10px,env(safe-area-inset-bottom))!important;
        display:flex!important;justify-content:space-around!important;gap:0!important;
        padding:7px 6px!important;box-sizing:border-box!important;border-radius:21px!important;
      }
      .dock a{min-width:0!important;width:auto!important;flex:1 1 0!important;padding:7px 3px!important;font-size:8px!important;white-space:nowrap!important}
      .dock svg{width:17px!important;height:17px!important}
    }
    @media(max-width:390px){
      .dock{width:calc(100% - 18px)!important}
      .dock a{font-size:7.5px!important}
      .studio-stage{min-height:395px!important}
      .product-media{height:225px!important}
      .presentation-bridge{grid-template-columns:1fr!important}
    }
  `;
  document.head.appendChild(style);

  const IMAGE_GATEWAY = "https://bcedyacdepzhqwleizfl.supabase.co/functions/v1/purestone-image";
  const TITLE_TO_SLUG = {
    "Elysee Quartz Alb":"elysee-quartz-alb",
    "Milet Quartz":"milet-quartz",
    "Gaia Quartz":"gaia-quartz",
    "Mystic Blue Quartz":"mystic-blue-quartz",
    "Kalynda Quartz":"kalynda-quartz",
    "Idyma Quartz":"idyma-quartz"
  };

  const repairFeaturedImages = () => {
    document.querySelectorAll(".featured .product").forEach(card => {
      const title = card.querySelector("h3")?.textContent?.trim();
      const img = card.querySelector(".product-media img");
      const slug = TITLE_TO_SLUG[title];
      if (!title || !img || !slug) return;
      const src = `${IMAGE_GATEWAY}?slug=${encodeURIComponent(slug)}`;
      img.loading = "lazy";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.onerror = null;
      if (img.getAttribute("src") !== src) img.src = src;
      img.alt = `${title} — mostră material PureStone`;
    });
  };

  const improveFeaturedLinks = () => {
    document.querySelectorAll(".featured .product").forEach(card => {
      const title = card.querySelector("h3")?.textContent?.trim();
      card.querySelectorAll("a").forEach(a => {
        if (a.textContent?.toLowerCase().includes("detalii")) {
          a.href = `./luxury-catalog.html?material=${encodeURIComponent(title || "")}`;
          a.setAttribute("aria-label", `Vezi ${title || "materialul"} în catalog`);
        }
      });
    });
  };

  const addPresentationBridge = () => {
    const featured = document.querySelector("#featuredProducts");
    const calculator = document.querySelector("#calculator");
    if (!featured || !calculator || document.querySelector(".presentation-bridge")) return;
    const host = featured.parentElement;
    if (!host) return;
    const bridge = document.createElement("div");
    bridge.className = "presentation-bridge";
    bridge.innerHTML = `
      <div class="presentation-step"><b><span>01</span>Alegi materialul</b>Compari nuanța, textura și aplicația.</div>
      <div class="presentation-step"><b><span>02</span>Configurezi</b>Introduci dimensiunile și primești estimarea.</div>
      <div class="presentation-step"><b><span>03</span>Măsurăm</b>Validăm proiectul și detaliile tehnice.</div>
      <div class="presentation-step"><b><span>04</span>Montăm</b>Producție și montaj profesionist.</div>`;
    host.appendChild(bridge);
  };

  const cleanupPublicAdminLinks = () => {
    document.querySelectorAll('footer a[href*="purestone-admin"]').forEach(a => {
      const parent = a.parentElement;
      if (parent) parent.innerHTML = parent.innerHTML.replace(/\s*[•·]\s*<a[^>]*>Admin<\/a>/i, "");
      else a.remove();
    });
  };

  const runFixes = () => {
    cleanupPublicAdminLinks();
    repairFeaturedImages();
    improveFeaturedLinks();
    addPresentationBridge();
    setTimeout(() => { repairFeaturedImages(); improveFeaturedLinks(); }, 350);
    setTimeout(() => { repairFeaturedImages(); improveFeaturedLinks(); }, 1200);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", runFixes, { once:true });
  else runFixes();
})();