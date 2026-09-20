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
      filter:saturate(.88) contrast(1.085) brightness(1.035) sepia(.035)!important;
      image-rendering:auto;
    }
    .hero-media:before,.collection:before,.project:before,.showroom-img:before,.showroom-photo:before{
      content:"";position:absolute;inset:0;z-index:1;pointer-events:none;
      background:linear-gradient(145deg,rgba(255,248,238,.13),transparent 42%,rgba(45,31,22,.08));mix-blend-mode:soft-light;
    }
    .hero-media img{object-position:center 54%;transform:scale(1.012)}
    .collection img{object-position:center center}.project img{object-position:center 48%}.product-media img{object-position:center center}
    .studio,.studio-stage,.studio-card,.hero-card,.featured,.product,.section-head{min-width:0;max-width:100%}
    .mobile-menu,.intro{min-height:100dvh}
    .image-unavailable{position:relative;background:linear-gradient(145deg,#e8dfd3,#d8c8b5)}
    .image-unavailable:after{content:"Imagine produs indisponibilă temporar";position:absolute;inset:0;display:grid;place-items:center;padding:24px;text-align:center;font-size:11px;color:#746a5f;letter-spacing:.04em}
    @media(max-width:760px){
      body{padding-bottom:calc(96px + env(safe-area-inset-bottom))}
      .wrap{width:calc(100% - 24px)!important;max-width:100%!important}
      header{padding-left:env(safe-area-inset-left);padding-right:env(safe-area-inset-right)}
      .hero-media img{object-position:center 52%;transform:scale(1.02)}
      .collection img{filter:saturate(.9) contrast(1.07) brightness(1.04) sepia(.025)!important}
      .section{padding:62px 0!important}
      .section-head{display:block!important;margin-bottom:22px!important}
      .section-head p{margin-top:14px!important;max-width:100%!important}
      .studio{width:100%!important;padding:12px!important;border-radius:24px!important;overflow:hidden!important}
      .studio-copy{padding:18px 8px 10px!important}
      .studio-stage{width:100%!important;min-width:0!important;min-height:430px!important;border-radius:20px!important;overflow:hidden!important}
      .studio-stage>img{width:100%!important;height:100%!important;object-fit:cover!important}
      .studio-card{left:12px!important;right:12px!important;bottom:12px!important;width:auto!important;max-width:none!important;padding:14px!important;border-radius:18px!important}
      .studio-card h4{font-size:22px!important}
      .studio-card p{font-size:9px!important}
      .featured{grid-template-columns:1fr!important;width:100%!important;gap:14px!important}
      .product{width:100%!important;overflow:hidden!important}
      .product-media{height:260px!important;width:100%!important}
      .product-media img{width:100%!important;height:100%!important;object-fit:cover!important}
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
      .studio-stage{min-height:400px!important}
      .product-media{height:235px!important}
    }
  `;
  document.head.appendChild(style);

  const repairFeaturedImages = () => {
    if (!Array.isArray(window.TOP_BLAT_CATALOG)) return;
    document.querySelectorAll(".featured .product").forEach(card => {
      const title = card.querySelector("h3")?.textContent?.trim();
      const img = card.querySelector(".product-media img");
      if (!title || !img) return;
      const p = window.TOP_BLAT_CATALOG.find(x => String(x.title || "").trim() === title);
      const candidates = Array.isArray(p?.remote_images) ? p.remote_images.filter(Boolean) : [];
      if (!candidates.length) return;
      let index = 0;
      img.referrerPolicy = "no-referrer";
      img.loading = "lazy";
      const tryNext = () => {
        if (index >= candidates.length) {
          img.onerror = null;
          img.removeAttribute("src");
          img.alt = `${title} — fotografie indisponibilă temporar`;
          img.parentElement?.classList.add("image-unavailable");
          return;
        }
        img.src = candidates[index++];
      };
      img.onload = () => img.parentElement?.classList.remove("image-unavailable");
      img.onerror = tryNext;
      tryNext();
    });
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
    setTimeout(repairFeaturedImages, 350);
    setTimeout(repairFeaturedImages, 1200);
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", runFixes, { once:true });
  else runFixes();
})();