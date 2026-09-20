# PureStone — Client Handoff / Production Checklist

## Linkuri publice
- Site: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone.html
- Catalog: https://nistordaniel06-cpu.github.io/ios-web-studio/catalog.html
- Cerere ofertă / favorite: https://nistordaniel06-cpu.github.io/ios-web-studio/quote.html
- Politică de confidențialitate: https://nistordaniel06-cpu.github.io/ios-web-studio/privacy.html
- Termeni: https://nistordaniel06-cpu.github.io/ios-web-studio/terms.html

## Administrare privată
- Dashboard: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone-dashboard.html
- Content CMS autentificat: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone-content-admin-auth.html
- Produse: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone-products-admin.html
- Lead CRM: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone-leads.html
- Analytics: https://nistordaniel06-cpu.github.io/ios-web-studio/purestone-analytics.html

Paginile private nu sunt linkuite în site-ul public și sunt excluse din robots.txt.

## Prima configurare a contului de administrator
1. Deschide `purestone-dashboard.html`.
2. Extinde „Prima configurare a contului”.
3. Introdu cheia veche de administrare o singură dată.
4. Alege emailul și o parolă de minimum 12 caractere.
5. Apasă „Creează contul”.
6. Din acel moment folosește email + parolă. Cheia veche rămâne doar fallback de urgență.

## Ce este funcțional
- Homepage premium responsive, loading screen și logo PureStone.
- Catalog cu aproximativ 286 materiale, căutare, branduri, filtre și favorite.
- Pagini individuale de material cu informații și cerere de ofertă.
- Favorite → o singură cerere pentru mai multe materiale.
- Upload PDF / fotografie în cererea de ofertă (max. 10 MB).
- Lead CRM: status, notițe, valoare estimată, fișiere private, apel, WhatsApp și export CSV.
- Content CMS: hero, showroom, echipă, contact și imagini.
- Product Admin: nume, brand, material, nuanță, preț orientativ, finisaj, grosime, dimensiune placă, imagine, featured, activ/inactiv și ordine.
- Supabase Storage pentru imagini administrate și fișierele private ale lead-urilor.
- Image gateway/cache PureStone pentru imaginile Top-Blat, cu fallback vizual dacă sursa externă cade.
- Analytics first-party cu consimțământ: page views, produse, favorite, simulator, WhatsApp, căutări și cereri.
- Preferințe cookies / analytics, Politică de confidențialitate și Termeni.
- sitemap.xml, robots.txt, webmanifest și logo vectorial.

## Demo recomandat clientului
1. Deschide homepage-ul pe telefon și arată intro-ul + hero-ul.
2. Intră în Catalog și caută un material.
3. Salvează 2–3 materiale la Favorite.
4. Apasă „Ofertă selecție” și arată că poți atașa un plan sau o fotografie.
5. Trimite o cerere de test.
6. Intră în Dashboard → Lead CRM și arată că lead-ul apare cu produsele și fișierul.
7. Schimbă statusul sau adaugă notiță / valoare estimată.
8. Dashboard → Produse: modifică un câmp sau o fotografie și salvează.
9. Dashboard → Conținut: schimbă un text / membru al echipei și publică.
10. Arată Analytics pentru flow-ul complet.

## Ce trebuie completat cu date reale înainte de lansarea comercială definitivă
- Membrii reali ai echipei: nume, rol, telefon, fotografie.
- Datele juridice complete ale operatorului în Politica de confidențialitate / Termeni și documentele comerciale.
- Confirmarea telefonului, WhatsApp și datelor showroom-ului.
- Specificațiile tehnice și prețurile trebuie introduse numai din surse/producători confirmați; unde nu sunt confirmate, site-ul afișează formulări de tip „La cerere / La ofertare”.
- Încarcă fotografiile originale de cea mai bună calitate în Product Admin / Content CMS pentru produsele prioritare.

## Domeniul
Domeniul personalizat este singurul pas de infrastructură amânat intenționat. Când este ales domeniul final, se actualizează canonical, sitemap, Search Console, adresele de email și eventual redirecturile din GitHub Pages.

## Backup / recuperare
- Conținutul principal este în Supabase `purestone_content`.
- Personalizările produselor sunt în `purestone_product_overrides`.
- Lead-urile sunt în `purestone_leads` și pot fi exportate CSV din CRM.
- Imaginile administrate sunt în bucket-ul `purestone-media`.
- Fișierele lead-urilor sunt în bucket privat `purestone-lead-files`.
- Codul și manifestul catalogului sunt versionate în GitHub.
