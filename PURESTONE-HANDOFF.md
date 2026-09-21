# PureStone V4 — Client Handoff / Production Checklist

## Linkuri publice
- Site: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone.html
- Catalog: https://nistordaniel06-cpu.github.io/ios-web-studio/catalog.html
- Compară materiale: https://nistordaniel06-cpu.github.io/ios-web-studio/compare.html
- Programări: https://nistordaniel06-cpu.github.io/ios-web-studio/booking.html
- Cerere ofertă / favorite: https://nistordaniel06-cpu.github.io/ios-web-studio/quote.html
- Portal B2B arhitecți/designeri: https://nistordaniel06-cpu.github.io/ios-web-studio/b2b.html
- Politică de confidențialitate: https://nistordaniel06-cpu.github.io/ios-web-studio/privacy.html
- Termeni: https://nistordaniel06-cpu.github.io/ios-web-studio/terms.html

## Administrare privată
- Dashboard V4: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone-dashboard-v4.html
- URL vechi Dashboard redirecționează automat la V4.
- Content CMS: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone-content-admin-auth.html
- Produse: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone-products-admin.html
- Lead CRM: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone-leads-v4.html
- Offer Builder: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone-offer-builder.html
- B2B / programări admin: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone-b2b-admin.html
- Analytics: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone-analytics.html

Paginile private nu sunt linkuite în site-ul public și sunt excluse din robots.txt.

## PureStone V4 — ce este funcțional
- Homepage premium responsive, loading screen, logo PureStone și tratament editorial al imaginilor.
- Catalog cu aproximativ 286 materiale, căutare, branduri, filtre și favorite.
- Pagini individuale de material.
- Image gateway/cache PureStone pentru imaginile externe.
- Simulator homepage cu maparea corectată pentru Desert Silver și Arte Black.
- Comparare simultană pentru până la trei materiale.
- Favorite → o singură cerere pentru mai multe materiale.
- Upload PDF / fotografie în cererea de ofertă.
- Programări pentru showroom, măsurători și consultație de design.
- Lead CRM cu status, notițe, valoare estimată, fișiere private, apel, WhatsApp și CSV.
- Offer Builder cu linii, cantitate, UM, preț, TVA, total și valabilitate.
- Ofertă publică securizată prin id + token, acceptare client și Print / Save PDF din browser.
- Portal B2B Supabase Auth pentru arhitecți/designeri.
- B2B: profil, proiecte, materiale salvate, solicitări de mostre, fișiere private, oferte și istoric/programări.
- Admin B2B: aprobare/blocare conturi, proiecte, status mostre, programări și oferte.
- Fișierele B2B sunt într-un bucket privat și se deschid prin signed URL temporar.
- Content CMS și Product Admin.
- Analytics first-party cu consimțământ.
- Privacy/terms/cookie preferences.
- Trust strip pe homepage cu brandurile materialelor din catalog și workflow măsurători → producție → montaj.
- SEO static automat: GitHub Action generează `/materiale/<slug>/` pentru fiecare produs și reconstruiește sitemap-ul când se schimbă manifestul.
- webmanifest, logo SVG, robots.txt și structured data.

## Acces administrator
- Administrarea folosește exclusiv Supabase Auth cu email + parolă.
- Există deja un cont PureStone Admin în Supabase Auth.
- Cheia legacy / bootstrap a fost dezactivată în backend și nu mai trebuie folosită sau transmisă.
- Dashboard, Content CMS, Product Admin, CRM, ofertare, B2B Admin și Analytics folosesc sesiunea autentificată.
- Dacă accesul la cont se pierde, recuperarea trebuie făcută prin fluxul Supabase Auth, nu prin cheia veche.

## Demo recomandat
1. Homepage → colecții / selecție / simulator.
2. Compară trei materiale.
3. Catalog → produs → favorite → ofertă.
4. Trimite o programare de test.
5. Trimite un lead cu plan/fotografie.
6. Dashboard → Lead CRM.
7. Offer Builder → generează oferta → deschide linkul client → Print/PDF → Accept oferta.
8. Portal B2B: creează cont, proiect, adaugă materiale, solicită mostră și încarcă un fișier.
9. Dashboard → B2B & programări: gestionează contul, mostra și programarea.
10. Content CMS / Product Admin → modifică un câmp și arată publicarea.
11. Analytics.

## Date reale de completat înainte de lansarea comercială definitivă
- Numele, rolurile, telefoanele și fotografiile reale ale echipei.
- Datele juridice complete ale operatorului în Privacy / Terms / ofertă.
- Adresa și programul real al showroom-ului.
- Prețurile și specificațiile tehnice trebuie confirmate din surse/producători.
- Pentru look editorial maxim, încarcă originalele high-resolution în CMS / Product Admin; AI remasterul real trebuie făcut pornind de la fișierele originale, nu din hotlink-uri comprimate.

## SEO
Workflow: `.github/workflows/purestone-seo.yml`.
Generator: `scripts/generate-purestone-seo.mjs`.
Generatorul produce pagini statice pentru toate materialele și `sitemap.xml`.

## QA automat
Workflow: `.github/workflows/purestone-smoke.yml`.
Rulează Chromium pe desktop, Android-size și iPhone-size pentru homepage, catalog, comparație, programări, B2B și o pagină SEO.

## Backend / Storage
- Conținut: `purestone_content`.
- Override-uri produse: `purestone_product_overrides`.
- Lead-uri: `purestone_leads`.
- Analytics: `purestone_events`.
- B2B: `purestone_b2b_profiles`, `purestone_b2b_projects`, `purestone_b2b_project_materials`, `purestone_b2b_samples`, `purestone_b2b_files`.
- Programări: `purestone_appointments`.
- Oferte: `purestone_offers`.
- Imagini publice: bucket `purestone-media`.
- Lead files: bucket privat `purestone-lead-files`.
- B2B files: bucket privat `purestone-b2b-files`.

## Domeniul
Domeniul personalizat rămâne singurul pas de infrastructură amânat intenționat. La mutare se actualizează canonical, sitemap, Search Console, emailurile și redirecturile.
