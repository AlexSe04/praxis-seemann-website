# Psychotherapie Mag.a Alexandra Seemann, BA pth. – Website

Statische, schnelle Praxis-Website (ohne Framework, ohne Cookies, ohne Tracking, Schriften lokal).

## Inhalte ändern

- `config.mjs` – Stammdaten (NAP, Preise, Kassenzuschüsse, Domain, Buchungslink) – nur hier ändern
- `content.mjs` – Texte aller Seiten

Ist Cloudflare Pages mit dem Repository verbunden (siehe unten), wird die Website nach jedem Push auf `main` automatisch neu gebaut.

## Bauen

```bash
node build.mjs
# optional:
SITE_URL=https://www.ihre-domain.at BOOKING_URL=https://link-zum-buchungstool node build.mjs
```

Das Ergebnis liegt in `site/`. Der Ordner wird bei jedem Build komplett neu erzeugt und ist deshalb
nicht in Git eingecheckt. Benötigt nur Node ≥ 18, keine weiteren Abhängigkeiten.

## Veröffentlichung (Cloudflare Pages)

| Einstellung | Wert |
|---|---|
| Framework preset | None |
| Build command | `node build.mjs` |
| Build output directory | `site` |
| Root directory | `/` |
| Umgebungsvariablen (optional) | `SITE_URL`, `BOOKING_URL`, `LINKEDIN_URL`, `ETERMIN_ENABLED` |

Ohne `SITE_URL` wird die Hauptdomain `https://praxis-seemann.at` verwendet (ohne www). In Cloudflare Pages `SITE_URL` nicht setzen oder genau auf diesen Wert.

Der Build erzeugt zusätzlich `sitemap.xml` (nur indexierbare Seiten, ohne `lastmod`), `robots.txt`, `_redirects` und `_headers` (`X-Robots-Tag: noindex` für `praxis-seemann-website.pages.dev`).

## Struktur

- `build.mjs` – erzeugt HTML, `sitemap.xml`, `robots.txt`, strukturierte Daten und kopiert die Dateien aus `src/`
- `src/styles.css`, `src/main.js`, `src/favicon.svg` – Gestaltung und minimales JS
- `src/fonts/` – Schriften Inter und Newsreader (SIL OFL)
- `src/img/` – fertige, optimierte Bilder (WebP, OpenGraph-JPG); werden beim Build nur kopiert
- `src/img-src/` – Ausgangsfotos für die Bildneuberechnung

## Bilder austauschen

1. Neues Foto als JPG unter demselben Namen in `src/img-src/` ablegen.
2. Lokal `BILDER=1 node build.mjs` ausführen (benötigt ImageMagick `convert`).
   Damit werden die Bilder in `src/img/` neu erzeugt.
3. Die geänderten Dateien in `src/img/` committen.

Hinweis: Für das Portrait liegt in `src/img-src/` nur die bereits veröffentlichte 770 × 770-Version vor.
`BILDER=1` berechnet immer alle Bilder neu – das Portrait würde dabei leicht an Qualität verlieren.
Daher `BILDER=1` erst verwenden, wenn ein höher aufgelöstes Portraitfoto in `src/img-src/` liegt,
oder danach nur die tatsächlich gewünschten Dateien in `src/img/` committen.

## Vor dem Livegang offen

- **Portraitfoto** in höherer Auflösung (aktuell 770 × 770 px).
- **Preis Onlineberatung** – auf der Website bewusst ohne Preisangabe.
- **Impressum / Datenschutz** rechtlich prüfen (Aufsichtsbehörde, Hosting-Anbieter, Buchungstool).

## Datenschutz & Cookies

- Die Website setzt **keine Cookies** und nutzt weder Local Storage noch Session Storage (geprüft per Browser-Test).
  Darum gibt es **kein Cookie-Banner**. Kommt ein Dienst dazu, der Cookies setzt oder Daten an Dritte überträgt,
  muss die Datenschutzerklärung (inkl. Tabelle) angepasst und ein Banner neu bewertet werden.
- **Google Maps** lädt nur nach Klick auf „Karte laden“ (Zwei-Klick, `src/main.js`); die Auswahl wird nicht gespeichert.
- Die Datenschutzerklärung steht in `content.mjs` (`dsSections`).

## Online-Terminbuchung (eTermin)

- Alle „Termin buchen“-Links zeigen auf `BOOKING_URL` (Standard: `https://www.eTermin.net/psyche1010`) und tragen `data-booking`.
- Mit JavaScript öffnet `src/main.js` die Buchungsseite in einem `<dialog>`-Fenster (`#etwidgetModal`);
  der iframe `#etifr` wird erst beim ersten Klick erzeugt – vorher keine Verbindung zu eTermin.
  Ohne JavaScript bzw. ohne `<dialog>`-Unterstützung öffnet der Link einen neuen Tab.
- Das offizielle Skript `etwidget.min.js` wird bewusst nicht geladen (würde schon beim Seitenaufruf
  eine Verbindung zu eTermin herstellen und bringt einen eigenen Button mit).
- Der eTermin-Abschnitt der Datenschutzerklärung ist aktiv; `ETERMIN_ENABLED=0` blendet ihn aus.
- Laufend prüfen: Buchungsformular bei eTermin minimal halten (keine Freitextfelder zu Beschwerden/Diagnosen,
  Geburtsdatum/Anschrift nur wenn nötig), AVV ablegen, Löschfristen in eTermin einstellen,
  in eTermin die Einbettung auf eigener Website erlauben, falls dort einschränkbar.
