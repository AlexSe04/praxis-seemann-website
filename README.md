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

Ohne `SITE_URL` wird `https://www.praxis-seemann.at` verwendet.

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

- **Domain** (`SITE_URL`) – `https://www.praxis-seemann.at` (Domain muss registriert und beim Hosting verbunden sein)
  (betrifft Canonicals, OpenGraph, Sitemap, Schema.org).
- **Buchungslink** (`BOOKING_URL`) – ohne Link führt „Termin buchen“ zum Kontaktbereich.
- **Portraitfoto** in höherer Auflösung (aktuell 770 × 770 px).
- **Preis Onlineberatung** – auf der Website bewusst ohne Preisangabe.
- **Impressum / Datenschutz** rechtlich prüfen (Aufsichtsbehörde, Hosting-Anbieter, Buchungstool).

## Datenschutz & Cookies

- Die Website setzt **keine Cookies** und nutzt weder Local Storage noch Session Storage (geprüft per Browser-Test).
  Darum gibt es **kein Cookie-Banner**. Kommt ein Dienst dazu, der Cookies setzt oder Daten an Dritte überträgt,
  muss die Datenschutzerklärung (inkl. Tabelle) angepasst und ein Banner neu bewertet werden.
- **Google Maps** lädt nur nach Klick auf „Karte laden“ (Zwei-Klick, `src/main.js`); die Auswahl wird nicht gespeichert.
- Die Datenschutzerklärung steht in `content.mjs` (`dsSections`).

## eTermin – vorbereitet, nicht aktiv

Der eTermin-Abschnitt der Datenschutzerklärung erscheint nur mit `ETERMIN_ENABLED=1`.
Vor der Aktivierung:

1. Buchungs-URL von eTermin besorgen und als `BOOKING_URL` setzen (externer Link, kein iFrame/Popup –
   ein eingebettetes Widget bräuchte eine eigene Zwei-Klick-Einwilligung).
2. Buchungsformular bei eTermin minimal halten: nur Name, Telefon und/oder E-Mail, Termin; keine Freitextfelder
   zu Beschwerden/Diagnosen, kein Geburtsdatum/Anschrift, wenn nicht nötig. Erinnerungs-SMS/E-Mails datensparsam formulieren.
3. AVV (05.09.2026, Version 07.2026 v6.2) unterschrieben ablegen; Unterauftragsverarbeiter und TOMs prüfen.
4. Prüfen, ob die eTermin-Buchungsseite Cookies/Tracking einsetzt; Löschfristen in eTermin einstellen.
5. Texte in `content.mjs` (Abschnitt `etermin`, Speicherdauer, Empfänger) mit der tatsächlichen Konfiguration abgleichen.
6. Mit `ETERMIN_ENABLED=1` in den Cloudflare-Pages-Umgebungsvariablen bauen.
