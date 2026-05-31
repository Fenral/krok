# Fishbrain feature-inventar mappet mot Krok MVP

Denne tabellen samler observerte Fishbrain-features fra scrape-rundene (forside, catches-feed, artsdatabase, fiskevann-katalog og app-promo) og mapper dem mot Krok sitt MVP-scope: **auth, logg fangst, min logg, kart, artsdatabase, profil**. Alt utenfor disse seks omraadene er merket **Post-MVP**. Kolonnen "Norsk tilpasning" beskriver hva som maa endres for at featuren skal funke for norske sportsfiskere (regelverk, sprak, arter, geografi, marked) — ikke en direkte kopi av Fishbrain. Screenshot-lenker peker til de fangede referansebildene i samme mappe.

| Fishbrain-feature | I MVP? | Norsk tilpasning |
|---|---|---|
| Sticky topbar med logo, primaer-nav (App/Map/Discover/Blog), search-ikon, Log in, hamburger | Ja (profil + auth-entry) | Norsk meny: Hjem / Kart / Logg / Arter / Profil. "Logg inn"-knapp, hamburger kun pa mobil. |
| Hero med H1 "Find your best fishing spot" + vinklet app-preview + tre ikon-tiles | Post-MVP | Hvis brukt: norsk H1 ("Finn din neste fiskeplass") og bilder fra norske vann (Mjosa, Femund, Hardangerfjorden). MVP trenger ikke marketing-hero. |
| Alternerende feature-seksjoner (Find the best spot, Local fishing reports, Regulations, Log catches) | Post-MVP (marketing) | Regulations-seksjonen er saerlig viktig: norsk fiskeregelverk varierer per fylke/kommune + laksefiske krever fiskeravgift. |
| App Store + Google Play badges inline | Post-MVP | Krok er web-PWA forst; native badges kommer naar Capacitor-bygg er klart. |
| Social-proof "Join 20 million anglers" + editor's choice-badge + QR-kode | Post-MVP | Norge har ~500k sportsfiskere — bruk realistiske tall ("Bli med X norske sportsfiskere"), ikke importer global hype. |
| FAQ-accordion + final download-CTA + utility-footer | Post-MVP | FAQ pa bokmal; footer maa ha lenke til personvern + cookies + kontaktadresse iht. norsk markedsforingslov. |
| Cookie-consent-dialog med per-kategori toggles (Maalrettet annonsering / Personlig tilpasning / Analyse) — allerede norsk | Ja (compliance pa tvers) | Allerede GDPR-konform pa norsk; gjenbruk monsteret men host hos norsk/EU-region (ikke US). Krok skal ha kategori-toggles fra dag 1. |
| Catch-feed (publisk web-rute redirecter til 404 + henviser til app) | Ja (logg fangst + min logg) | Krok skal ha publisk web-feed for "Min logg" + valgfri delbar fangst — vi ber ikke folk laste ned app for a se egne fangster. |
| Generic "Page not found"-template med deep-link-forklaring | Post-MVP | Norsk 404: "Siden finnes ikke" + lenke tilbake til /kart eller /logg. Ikke push app-install. |
| Intercom/Open Chat floating support-knapp | Post-MVP | Bytt med enkel "Kontakt oss"-mailto eller Crisp/Tawk pa norsk. Ikke prioritet i MVP. |
| Multi-kolonne footer (4 lenkekolonner + adresse + sosialt + app-badges) | Post-MVP | Forenklet footer i MVP: Om / Personvern / Vilkaar / Kontakt. Adresse paakrevd hvis vi tar betalt. |
| Artsdatabase med A-Z paginering (URL /directory/species/{bokstav}) | Ja (artsdatabase) | Norske arter forst: oerret, roye, harr, abbor, gjedde, sik, laks, sjooerret, makrell, torsk, sei, lyr, hyse — ikke 227 globale arter. Begynn med ~25-40 vanlige norske ferskvanns- + saltvannsarter. |
| Species-detalj som ren tekstliste (ingen miniatyrer, SEO-forst) | Delvis (artsdatabase) | Krok bor ha **bilde + norsk navn + latinsk navn + min/maks-storrelse + fredningstid + minstemaal per fylke**. Tekstliste alene er for tynt i norsk marked. |
| Letter-paged liste-arkitektur ("Species: A - Page 1") | Post-MVP | Med ~40 arter trenger vi ikke A-Z-paginering — bruk filter (ferskvann/saltvann) + sok i MVP. |
| Fiskevann-katalog A-Z (/directory/fishing-waters/{letter}) — tekstlenker, ikke interaktivt kart | Ja (kart) | Krok MVP = **interaktivt kart** (Leaflet + NVE/Kartverket-tiles) med pin per vann, ikke SEO-katalog. Katalogside kan komme post-MVP for SEO. |
| Sekundaer directory-tab-nav (Countries / Regions / Cities / Species / Fishing Waters) med aktiv-state | Post-MVP | Norge trenger Fylker / Kommuner / Vann / Arter — ikke Countries. Kun relevant naar SEO-katalog bygges. |
| H1 inkluderer state ("Fishing Waters: A - Page 1") for SEO | Post-MVP | Samme monster paa norsk naar SEO-katalog kommer ("Fiskevann i Innlandet — side 1"). |
| 170+ lenker per side (tett SEO-densitet, navn-pattern "Sted, Region, Land") | Post-MVP | Norsk pattern: "Vannnavn, Kommune, Fylke" (f.eks. "Atnsjoen, Stor-Elvdal, Innlandet"). |
| App-only deep-link med eksplisitt mobil-hint ("opne fra telefon med Fishbrain-appen") | Post-MVP | Krok skal vaere full web-funksjonell — ikke tvinge native app. PWA forst, native senere. |
| Adjust.com tracking-lenker pa app-badges (adj_t/adj_campaign/adj_adgroup) | Post-MVP | Hvis vi later trenger install-attribution: bruk EU-host (Plausible/Umami for web, Adjust kun hvis nodvendig). |
| i18n basert paa browser locale (samme side serverer norsk consent-banner) | Ja (default norsk) | Krok er **norsk-forst**; engelsk er ikke prioritet for MVP. Hardkod nb-NO. |
| Auth ("Log in"-knapp i topbar, ingen synlig signup-flow paa web) | Ja (auth) | Krok MVP: Supabase auth med e-post + magic link. Apple Sign In + Google Sign In kommer i Capacitor-bygg. Vis BAADE "Logg inn" og "Opprett konto" — Fishbrain skjuler signup. |
| Min logg / personal bests (vist som ikon-tile i hero, faktisk feed laast bak app) | Ja (min logg) | Krok skal ha publisk **/logg**-rute som viser brukerens fangster (storrelse, art, dato, sted, bilde). Privat-toggle per fangst. |
| Logg fangst (CTA i feature-seksjon, ikke selve flowen synlig pa web) | Ja (logg fangst) | Krok MVP-flow: Velg art -> lengde/vekt -> kart-pin -> bilde -> notat -> lagre. Validering: norsk minstemaal + fredningstid varsel. |
| Profil-side (ikke direkte observert pa publisk web — sannsynligvis app-only) | Ja (profil) | Krok: /profil med visningsnavn, bilde, totale fangster, favorittart, favorittvann. Offentlig vs. privat-toggle. |
| Local fishing reports (feature nevnt i hero, ikke implementert publisk) | Post-MVP | Norsk vri: "Vannstand + temperatur" fra NVE + "siste fangster i naerheten" fra brukerdata. |
| Fishing regulations (feature nevnt, ikke vist publisk) | Post-MVP (men varsel allerede i MVP) | Kritisk for Norge: fiskeravgift, fredningstid per art/vann, minstemaal per fylke. MVP viser advarsel ved logging, full database post-MVP. |
| Free trial / Premium-modell (microcopy "Free trial available") | Post-MVP | Krok MVP er gratis. Premium-modell vurderes etter PMF (eks: ubegrenset fangst-historikk, vaerdata, kart-offline). |
| Discover-tab (innhold/blog) | Post-MVP | Norsk fiskebloggosfaere er liten; ikke prioritert. |
| Editor's choice-badge (App Store-features) | Post-MVP | Ikke relevant for Krok MVP. |

## Screenshot-referanser

- **Landing / forside:** [landing.png](./landing.png) — kilde til topbar, hero, feature-seksjoner, social proof, FAQ, footer, cookie-banner
- **Catches-feed (publisk 404):** [catches.png](./catches.png) — kilde til app-only deep-link-monster og Open Chat-floater
- **Artsdatabase A-Z:** [species.png](./species.png) — kilde til letter-paged species-liste og directory-arkitektur
- **Fiskevann-katalog A-Z:** [map.png](./map.png) — kilde til alfabetisk vann-katalog (ikke interaktivt kart) og sekundaer tab-nav
- **App-promo (publisk 404 med mobil-hint):** [app-promo.png](./app-promo.png) — kilde til app-install-funnel og adjust.com tracking-monster
