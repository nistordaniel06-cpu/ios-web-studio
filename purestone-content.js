window.PURESTONE_DEFAULT_CONTENT = {
  brand: {
    name: "PURESTONE",
    tagline: "NATURAL ELEGANCE • ROMÂNIA"
  },
  loader: {
    enabled: true,
    showOncePerSession: true,
    duration: 1550
  },
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
    team: [
      {
        id: "team-1",
        name: "Echipa PureStone",
        role: "Consultanță proiecte & showroom",
        phone: "0733 250 220",
        photo: ""
      }
    ]
  },
  contact: {
    phone: "0733 250 220",
    whatsapp: "40733250220",
    area: "București & Ilfov",
    showroomTitle: "Vezi materialele în realitate.",
    showroomText: "Compară mostrele, finisajele și venaturile înainte de decizie.",
    showroomImage: "https://top-blat.ro/wp-content/uploads/2024/05/Blaturi-de-bucatarii-Blaturi-de-Baie-quartz-compozit-Blaturidebucatarii.ro-117-1024x768.avif"
  }
};

window.PureStoneCMS = (() => {
  const KEY = "purestone-site-content-v1";
  const clone = value => JSON.parse(JSON.stringify(value));
  const merge = (base, override) => {
    if (!override || typeof override !== "object") return base;
    Object.keys(override).forEach(key => {
      if (Array.isArray(override[key])) base[key] = override[key];
      else if (override[key] && typeof override[key] === "object") {
        base[key] = merge(base[key] && typeof base[key] === "object" ? base[key] : {}, override[key]);
      } else base[key] = override[key];
    });
    return base;
  };
  const get = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      return merge(clone(window.PURESTONE_DEFAULT_CONTENT), saved || {});
    } catch (_) {
      return clone(window.PURESTONE_DEFAULT_CONTENT);
    }
  };
  const save = content => {
    localStorage.setItem(KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent("purestone-content-updated", { detail: content }));
  };
  const reset = () => localStorage.removeItem(KEY);
  const exportJSON = () => JSON.stringify(get(), null, 2);
  const importJSON = text => {
    const parsed = JSON.parse(text);
    save(parsed);
    return parsed;
  };
  return { get, save, reset, exportJSON, importJSON, key: KEY };
})();