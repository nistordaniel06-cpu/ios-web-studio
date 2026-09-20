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

/* Editorial photo remaster — non-destructive and faithful to the real material. */
(() => {
  const style = document.createElement("style");
  style.id = "purestone-magazine-grade";
  style.textContent = `
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
    @media(max-width:760px){.hero-media img{object-position:center 52%;transform:scale(1.02)}.collection img{filter:saturate(.9) contrast(1.07) brightness(1.04) sepia(.025)!important}}
  `;
  document.head.appendChild(style);
})();