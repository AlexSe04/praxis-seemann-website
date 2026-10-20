# Psychotherapie Mag.a Alexandra Seemann, BA pth. – Website

Statische, schnelle Praxis-Website (ohne Framework, ohne Cookies, ohne Tracking, Schriften lokal).

## Bauen

```bash
cd praxis-seemann
SITE_URL=https://www.ihre-domain.at BOOKING_URL=https://link-zum-buchungstool node build.mjs
```

Das Ergebnis liegt in `site/` und kann auf jedem statischen Hosting (Netlify, Cloudflare Pages, Apache/Nginx …)
veröffentlicht werden. Benötigt Node ≥ 18 und ImageMagick (`convert`) für die WebP-Bilder.

## Struktur

- `config.mjs` – Stammdaten (NAP, Preise, Kassenzuschüsse, Domain, Buchungslink) – nur hier ändern
- `content.mjs` – Texte aller Seiten
- `build.mjs` – erzeugt HTML, Bilder, `sitemap.xml`, `robots.txt`, strukturierte Daten
- `src/` – CSS, minimales JS, Schriften (SIL OFL), Originalbilder

## Vor dem Livegang offen

- **Domain** (`SITE_URL`) – `https://www.praxis-seemann.at` (Domain muss registriert und beim Hosting verbunden sein)
  (betrifft Canonicals, OpenGraph, Sitemap, Schema.org).
- **Buchungslink** (`BOOKING_URL`) – ohne Link führt „Termin buchen“ zum Kontaktbereich.
- **Portraitfoto** in höherer Auflösung (aktuell 500 × 625 px aus dem intakt-Teamfoto).
- **Preis Onlineberatung** – auf der Website bewusst ohne Preisangabe.
- **Impressum / Datenschutz** rechtlich prüfen (Aufsichtsbehörde, Hosting-Anbieter, Buchungstool).
