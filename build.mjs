// Statischer Site-Generator ohne Abhängigkeiten.
// Aufruf: node build.mjs  →  erzeugt die fertige Website in ./site
// Optional: SITE_URL=https://… BOOKING_URL=https://… node build.mjs
// Bilder neu erzeugen (nur lokal, benötigt ImageMagick): BILDER=1 node build.mjs

import { mkdirSync, rmSync, writeFileSync, copyFileSync, readdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_URL, BOOKING_URL, person, contact, intakt, prices, zuschuesse, profiles } from './config.mjs';
import { pages } from './content.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, 'site');
const SRC = join(ROOT, 'src');
const TODAY = new Date().toISOString().slice(0, 10);

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (path) => SITE_URL + path;
const isExternalBooking = /^https?:/.test(BOOKING_URL);
const bookingAttrs = isExternalBooking ? ` href="${esc(BOOKING_URL)}" target="_blank" rel="noopener"` : ` href="${esc(BOOKING_URL)}"`;

const helpers = { esc, abs, bookingAttrs, person, contact, intakt, prices, zuschuesse, profiles, img };
const sameAs = [profiles.google, profiles.linkedin].filter(Boolean);

// ---------- Bilder ----------
// Die fertigen Bilder liegen in src/img und werden beim Build nur kopiert –
// so läuft der Build auch ohne ImageMagick (z. B. auf Cloudflare Pages).
// Mit BILDER=1 werden sie aus src/img-src neu erzeugt (ImageMagick „convert“ nötig).
const images = {
  'alexandra-seemann-psychotherapeutin-wien': { widths: [400, 600, 770], ratio: [1, 1] },
  'psychotherapie-praxis-1090-wien': { widths: [640, 960, 1440], ratio: [4, 3] }
};

function buildImages() {
  const IMG = join(SRC, 'img');
  mkdirSync(IMG, { recursive: true });
  for (const [name, { widths, ratio }] of Object.entries(images)) {
    for (const w of widths) {
      const h = Math.round((w * ratio[1]) / ratio[0]);
      execFileSync('convert', [
        join(SRC, 'img-src', `${name}.jpg`),
        '-resize', `${w}x${h}^`, '-gravity', 'center', '-extent', `${w}x${h}`,
        '-strip', '-quality', '78', join(IMG, `${name}-${w}.webp`)
      ]);
    }
  }
  // OpenGraph-Bild 1200 × 630
  execFileSync('convert', [
    join(SRC, 'img-src', 'psychotherapie-praxis-1090-wien.jpg'),
    '-resize', '1200x630^', '-gravity', 'center', '-extent', '1200x630',
    '-strip', '-quality', '80', join(IMG, 'og-psychotherapie-wien.jpg')
  ]);
}

function img(name, alt, { sizes = '100vw', eager = false, cls = '' } = {}) {
  const { widths, ratio } = images[name];
  const max = widths[widths.length - 1];
  const srcset = widths.map((w) => `/img/${name}-${w}.webp ${w}w`).join(', ');
  return `<img src="/img/${name}-${max}.webp" srcset="${srcset}" sizes="${sizes}" width="${max}" height="${Math.round((max * ratio[1]) / ratio[0])}" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''}${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">`;
}

// ---------- Strukturierte Daten ----------
const ids = { person: abs('/#person'), practice: abs('/#praxis'), website: abs('/#website') };

function baseGraph() {
  return [
    {
      '@type': 'WebSite', '@id': ids.website, url: abs('/'), name: `Psychotherapie ${person.shortName}`, inLanguage: 'de-AT',
      publisher: { '@id': ids.practice }
    },
    {
      '@type': 'Person', '@id': ids.person,
      name: person.name, givenName: person.givenName, familyName: person.familyName,
      honorificPrefix: person.prefix, honorificSuffix: person.suffix,
      jobTitle: person.job, knowsAbout: ['Psychotherapie', person.method, 'Paartherapie', 'Familientherapie', 'Essstörungen'],
      image: abs('/img/alexandra-seemann-psychotherapeutin-wien-770.webp'),
      url: abs('/#ueber-mich'), telephone: contact.phone, email: contact.email,
      ...(profiles.linkedin ? { sameAs: [profiles.linkedin] } : {}),
      worksFor: [{ '@id': ids.practice }, { '@type': 'MedicalOrganization', name: intakt.name, url: intakt.url }]
    },
    {
      '@type': 'MedicalBusiness', '@id': ids.practice,
      name: `Psychotherapie ${person.name}`, description: 'Psychotherapeutische Praxis für Systemische Therapie in 1090 Wien: Einzeltherapie, Paartherapie, Familientherapie und Onlineberatung.',
      url: abs('/'), telephone: contact.phone, email: contact.email,
      image: abs('/img/psychotherapie-praxis-1090-wien-1440.webp'),
      address: { '@type': 'PostalAddress', streetAddress: contact.street, postalCode: contact.zip, addressLocality: contact.city, addressRegion: 'Wien', addressCountry: contact.country },
      areaServed: { '@type': 'City', name: 'Wien' },
      hasMap: profiles.google,
      sameAs,
      priceRange: `€ ${prices.online} – € ${prices.paar}`,
      currenciesAccepted: 'EUR',
      founder: { '@id': ids.person },
      employee: { '@id': ids.person },
      knowsLanguage: 'de',
      hasOfferCatalog: {
        '@type': 'OfferCatalog', name: 'Psychotherapie in Wien',
        itemListElement: [
          offer('Einzeltherapie', prices.einzel, '/psychotherapie/'),
          offer('Paartherapie', prices.paar, '/paartherapie-wien/'),
          offer('Familientherapie', prices.paar, '/familientherapie-wien/'),
          offer('Psychotherapie für Studierende', prices.einzel, '/psychotherapie-studierende-wien/'),
          offer('Onlineberatung', prices.online, '/onlineberatung/')
        ]
      }
    }
  ];
}

function offer(name, price, path) {
  const o = { '@type': 'Offer', itemOffered: { '@type': 'Service', name, serviceType: name, url: abs(path), provider: { '@id': ids.practice } } };
  if (price) Object.assign(o, { price: String(price), priceCurrency: 'EUR', description: `${prices.minutes} Minuten` });
  return o;
}

function breadcrumb(page) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: abs('/') },
      { '@type': 'ListItem', position: 2, name: page.crumb, item: abs(page.path) }
    ]
  };
}

// ---------- Layout ----------
const nav = [
  ['Psychotherapie', '/#psychotherapie'],
  ['Angebot', '/#angebot'],
  ['Über mich', '/#ueber-mich'],
  ['Kosten', '/#kosten'],
  ['Praxis', '/#praxis']
];

function header() {
  return `
<a class="skip" href="#inhalt">Zum Inhalt springen</a>
<header class="site-header" data-header>
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="${esc(person.shortName)} – Psychotherapie in Wien, zur Startseite">
      <span class="brand-name">Mag.a Alexandra Seemann, BA&nbsp;pth.</span>
      <span class="brand-sub">Psychotherapie · 1090 Wien</span>
    </a>
    <nav class="main-nav" id="hauptnavigation" aria-label="Hauptnavigation">
      <ul>
        ${nav.map(([label, href]) => `<li><a href="${href}">${label}</a></li>`).join('\n        ')}
      </ul>
    </nav>
    <div class="header-actions">
      <a class="btn btn-small"${bookingAttrs}>Termin buchen</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="hauptnavigation" data-menu-toggle>
        <span class="visually-hidden">Menü</span><span class="menu-icon" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</header>`;
}

function footer() {
  return `
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-nap">
      <p class="footer-name">${esc(person.name)}</p>
      <p>${person.job} · ${person.method}</p>
      <address>
        ${contact.street}<br>${contact.zip} ${contact.city} (${contact.district})<br>
        <a href="${contact.phoneHref}">${contact.phone}</a><br>
        <a href="${contact.emailHref}">${contact.email}</a>
      </address>
      <p class="footer-profiles">
        <a href="${profiles.google}" target="_blank" rel="noopener">Google-Profil</a>${profiles.linkedin ? `
        <a href="${esc(profiles.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
      </p>
    </div>
    <nav aria-label="Angebot">
      <p class="footer-title">Angebot</p>
      <ul>
        <li><a href="/psychotherapie/">Einzeltherapie</a></li>
        <li><a href="/paartherapie-wien/">Paartherapie in Wien</a></li>
        <li><a href="/familientherapie-wien/">Familientherapie in Wien</a></li>
        <li><a href="/psychotherapie-studierende-wien/">Psychotherapie für Studierende</a></li>
        <li><a href="/onlineberatung/">Onlineberatung</a></li>
      </ul>
    </nav>
    <nav aria-label="Informationen">
      <p class="footer-title">Informationen</p>
      <ul>
        <li><a href="/kosten/">Kosten &amp; Rückerstattung</a></li>
        <li><a href="/notfall/" class="footer-emergency">Hilfe im Notfall</a></li>
        <li><a href="/impressum/">Impressum</a></li>
        <li><a href="/datenschutz/">Datenschutz</a></li>
      </ul>
    </nav>
  </div>
  <div class="wrap footer-base">
    <p>© ${new Date().getFullYear()} ${esc(person.name)} · Psychotherapie in 1090 Wien</p>
  </div>
</footer>`;
}

function layout(page) {
  const graph = [...baseGraph(), ...(page.path !== '/' && !page.file ? [breadcrumb(page)] : []), ...(page.schema || [])];
  const canonical = abs(page.path);
  const ogImage = abs('/img/og-psychotherapie-wien.jpg');
  return `<!doctype html>
<html lang="de-AT">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${page.noindex ? '<meta name="robots" content="noindex, follow">' : ''}
<link rel="canonical" href="${canonical}">
<link rel="preload" href="/fonts/newsreader-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles.css">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta name="theme-color" content="#f5f1ea">
<meta property="og:type" content="website">
<meta property="og:locale" content="de_AT">
<meta property="og:site_name" content="Psychotherapie ${esc(person.shortName)}">
<meta property="og:title" content="${esc(page.ogTitle || page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Praxis für Psychotherapie in 1090 Wien">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.ogTitle || page.title)}">
<meta name="twitter:description" content="${esc(page.description)}">
<meta name="twitter:image" content="${ogImage}">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>
<script src="/main.js" defer></script>
</head>
<body class="${page.bodyClass || ''}">
${header()}
<main id="inhalt">
${page.body(helpers)}
</main>
${footer()}
</body>
</html>
`;
}

// ---------- Build ----------
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

if (process.env.BILDER === '1') buildImages();
mkdirSync(join(OUT, 'img'));
for (const f of readdirSync(join(SRC, 'img'))) copyFileSync(join(SRC, 'img', f), join(OUT, 'img', f));
mkdirSync(join(OUT, 'fonts'));
for (const f of readdirSync(join(SRC, 'fonts'))) copyFileSync(join(SRC, 'fonts', f), join(OUT, 'fonts', f));
for (const f of ['styles.css', 'main.js', 'favicon.svg']) copyFileSync(join(SRC, f), join(OUT, f));

for (const page of pages) {
  const dir = page.path === '/' ? OUT : join(OUT, page.path);
  if (page.file) {
    writeFileSync(join(OUT, page.file), layout(page));
    continue;
  }
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), layout(page));
}

const indexable = pages.filter((p) => !p.noindex && !p.file);
writeFileSync(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${TODAY}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);

if (!isExternalBooking) console.warn('Hinweis: BOOKING_URL ist nicht gesetzt – „Termin buchen“ verweist auf den Kontaktbereich.');
console.log(`${pages.length} Seiten nach ${OUT} geschrieben.`);
if (!existsSync(join(OUT, 'index.html'))) process.exit(1);
