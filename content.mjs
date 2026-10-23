// Inhalte aller Seiten. Jede Seite bedient einen eigenen Suchintent;
// Texte werden nicht zwischen Seiten dupliziert.

const eur = (n) => `€&nbsp;${n}`;

import { SITE_URL } from './config.mjs';

// ---------- Wiederverwendbare Bausteine ----------
function zuschussTable(h) {
  return `
<table class="refund-table">
  <caption class="visually-hidden">Kostenzuschuss der gesetzlichen Krankenversicherungen pro Sitzung</caption>
  <thead><tr><th scope="col">Krankenkasse</th><th scope="col">Kostenzuschuss</th></tr></thead>
  <tbody>
    ${h.zuschuesse.map(([k, v]) => `<tr><th scope="row">${k}</th><td>€&nbsp;${v}</td></tr>`).join('\n    ')}
  </tbody>
</table>
<p class="fineprint">Die Höhe und Voraussetzungen der Kostenübernahme können sich ändern. Bitte informieren Sie sich im Zweifelsfall direkt bei Ihrer Versicherung.</p>`;
}

function ctaBand(h, { title = 'Termin vereinbaren', text } = {}) {
  return `
<aside class="cta-band" aria-label="Terminbuchung">
  <div class="wrap cta-inner">
    <div>
      <p class="cta-title">${title}</p>
      <p>${text || `Einzeltherapie ${eur(h.prices.einzel)} · Paar- &amp; Familientherapie ${eur(h.prices.paar)} · je ${h.prices.minutes}&nbsp;Minuten`}</p>
    </div>
    <div class="cta-actions">
      <a class="btn"${h.bookingAttrs}>Termin buchen</a>
      <a class="text-link" href="${h.contact.phoneHref}">${h.contact.phone}</a>
    </div>
  </div>
</aside>`;
}

function pageHero({ eyebrow, title, lead }) {
  return `
<section class="page-hero">
  <div class="wrap narrow">
    ${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}
    <h1>${title}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ''}
  </div>
</section>`;
}

const faq = [
  {
    q: 'Was bedeutet Systemische Therapie?',
    a: '<p>Systemische Therapie betrachtet Menschen nicht isoliert, sondern im Zusammenhang mit ihren Beziehungen, Erfahrungen und ihrem sozialen Umfeld. Gemeinsam werden wiederkehrende Muster sichtbar gemacht, neue Perspektiven entwickelt und individuelle Veränderungsmöglichkeiten erarbeitet.</p>'
  },
  {
    q: 'Was ist Psychotherapie?',
    a: '<p>Psychotherapie ist eine wissenschaftlich fundierte Behandlungsmethode psychischer Belastungen und Erkrankungen. Eine vertrauensvolle therapeutische Beziehung bildet die Grundlage, um schwierige Erfahrungen zu verstehen, neue Perspektiven zu entwickeln und nachhaltige Veränderungen zu ermöglichen. Regelmäßigkeit und ausreichend Zeit können diesen Prozess unterstützen.</p>'
  },
  {
    q: 'Wie lange dauert eine Psychotherapie?',
    a: '<p>Die Dauer richtet sich nach Ihrem Anliegen, Ihrer persönlichen Situation und den gemeinsam vereinbarten Zielen. Manche Themen lassen sich in wenigen Sitzungen bearbeiten, andere benötigen einen längeren therapeutischen Prozess. Dauer und Frequenz werden gemeinsam besprochen und regelmäßig an den aktuellen Bedarf angepasst.</p>'
  },
  {
    q: 'Private Krankenversicherung',
    a: '<p>Wenn Sie privat krankenversichert sind, klären Sie am besten bereits vor Beginn der Psychotherapie, ob und in welchem Umfang Ihre Versicherung die Kosten übernimmt.</p>'
  },
  {
    q: 'Studieren in Wien mit deutscher Krankenversicherung',
    a: '<p>Sie studieren in Wien und sind in Deutschland versichert? Bitte klären Sie möglichst vor Behandlungsbeginn direkt mit Ihrer Krankenversicherung, ob und in welchem Umfang Kosten für Psychotherapie in Österreich übernommen werden.</p>'
  },
  {
    q: 'Terminabsage',
    a: '<p>Vereinbarte Termine sind verbindlich. Bei einer Absage spätestens 24 Stunden vor dem vereinbarten Termin entstehen keine Kosten. Später abgesagte oder nicht wahrgenommene Termine werden in voller Höhe verrechnet. Die Absage ist telefonisch oder per E-Mail möglich.</p>'
  },
  {
    q: 'Verschwiegenheit',
    a: '<p>Als Psychotherapeutin unterliege ich der gesetzlich geregelten Verschwiegenheitspflicht. Inhalte aus der Psychotherapie sowie persönliche Informationen werden vertraulich behandelt.</p><p class="fineprint">§ 45 Psychotherapiegesetz 2024, BGBl. I Nr. 49/2024</p><blockquote class="fineprint">„Berufsangehörige […] sind zur Verschwiegenheitspflicht über alle ihnen in Ausübung ihres Berufes oder im Rahmen der psychotherapeutischen Leistung anvertrauten oder bekannt gewordenen Geheimnisse verpflichtet.“</blockquote>'
  }
];

const stripTags = (s) => s.replace(/<blockquote[\s\S]*?<\/blockquote>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

function accordion(items, group) {
  return `
<div class="accordion">
  ${items.map(({ q, a }) => `<details name="${group}">
    <summary><span>${q}</span><span class="acc-icon" aria-hidden="true"></span></summary>
    <div class="acc-body">${a}</div>
  </details>`).join('\n  ')}
</div>`;
}

const services = [
  {
    title: 'Einzeltherapie', price: 'einzel',
    text: 'Raum für persönliche Themen, Belastungen, Krisen und Veränderungsprozesse. Gemeinsam entwickeln wir neue Perspektiven und konkrete Möglichkeiten für Ihren Alltag.'
  },
  {
    title: 'Paartherapie', price: 'paar',
    text: 'Wenn Gespräche schwieriger werden, Konflikte sich wiederholen oder Nähe verloren geht, kann Paartherapie helfen, Muster zu verstehen und neue Wege miteinander zu entwickeln.'
  },
  {
    title: 'Familientherapie', price: 'paar',
    text: 'Familientherapie unterstützt dabei, festgefahrene Dynamiken sichtbar zu machen, Kommunikation zu verbessern und gemeinsam tragfähige Lösungen zu entwickeln.'
  },
  {
    title: 'Psychotherapie für Studierende',
    text: 'Studium, Leistungsdruck, Veränderungen und persönliche Belastungen können viel Kraft kosten. Psychotherapie bietet Raum, Situationen zu ordnen und neue Handlungsmöglichkeiten zu entwickeln.'
  },
  {
    title: 'Onlineberatung', price: 'online',
    text: 'Psychotherapeutische Beratung kann auch online stattfinden. Eine flexible Möglichkeit, wenn persönliche Termine in der Praxis nicht oder nur schwer möglich sind.'
  }
];

// ---------- Startseite ----------
const home = {
  path: '/',
  title: 'Psychotherapie Wien | Alexandra Seemann – 1090 Wien',
  description: 'Psychotherapie in 1090 Wien bei Mag.a Alexandra Seemann. Systemische Einzel-, Paar- und Familientherapie sowie Onlineberatung. Termine online buchen.',
  bodyClass: 'home',
  schema: [
    {
      '@type': 'FAQPage',
      mainEntity: faq.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: stripTags(a) } }))
    }
  ],
  body: (h) => `
<section class="hero">
  <div class="wrap hero-grid">
    <div class="hero-text">
      <h1>Psychotherapie in Wien</h1>
      <p class="hero-person">${h.person.name}<br><span>${h.person.job} für ${h.person.method}</span></p>
      <p class="hero-intro">Psychotherapie für Einzelpersonen, Paare und Familien in 1090&nbsp;Wien.</p>
      <p class="hero-services">Einzeltherapie · Paartherapie · Familientherapie · Onlineberatung</p>
      <div class="hero-cta">
        <a class="btn btn-large"${h.bookingAttrs}>Termin buchen</a>
      </div>
      <dl class="hero-prices">
        <div><dt>Einzeltherapie</dt><dd>${eur(h.prices.einzel)} / ${h.prices.minutes}&nbsp;Min.</dd></div>
        <div><dt>Paar- &amp; Familientherapie</dt><dd>${eur(h.prices.paar)} / ${h.prices.minutes}&nbsp;Min.</dd></div>
        <div><dt>Online Einzelberatung</dt><dd>${eur(h.prices.online)} / ${h.prices.minutes}&nbsp;Min.</dd></div>
      </dl>
    </div>
    <div class="hero-ship" aria-hidden="true">
      <svg viewBox="0 0 600 610" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" focusable="false">
        <g class="ship-birds" stroke-width="2.6">
          <path d="M44 128C80 122 112 140 134 170C158 144 192 128 228 124"/>
          <path d="M14 258C36 254 56 264 68 281C84 265 104 255 126 253"/>
          <path d="M150 340C161 339 169 345 174 352C180 344 188 339 198 337"/>
        </g>
        <g class="ship-boat" stroke-width="3">
          <path d="M398 22C400 180 402 340 405 512"/>
          <path d="M386 70C346 220 272 392 196 512C262 500 324 492 384 489"/>
          <path d="M444 154C538 196 590 330 532 480C492 478 452 478 414 482"/>
          <path stroke-width="2.4" d="M404 150C470 228 486 350 414 482"/>
          <path stroke-width="2.4" d="M404 150L462 356"/>
          <path stroke-width="2" d="M456 176C514 254 520 384 446 480"/>
          <path d="M170 542C290 532 410 520 502 498C476 540 440 570 360 576C280 582 206 572 170 542Z"/>
          <path stroke-width="2.4" d="M262 527L262 513L370 507L372 521"/>
        </g>
        <path class="ship-water" stroke-width="1.6" opacity=".55" d="M120 596C220 588 330 586 440 590C480 591 520 593 556 592"/>
      </svg>
    </div>
  </div>
</section>

<section class="section intro" id="psychotherapie">
  <div class="wrap narrow center">
    <h2>Psychotherapie, die zu Ihrer Situation passt</h2>
    <p class="lead">Manchmal braucht es einen geschützten Raum, um Belastendes zu verstehen, neue Perspektiven zu entwickeln und Veränderungen anzustoßen. In meiner Praxis begleite ich Sie dabei professionell, wertschätzend und mit einem Fokus auf Ihre individuellen Möglichkeiten.</p>
  </div>
</section>

<section class="section" id="angebot">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Angebot</p>
      <h2>Psychotherapie in Wien</h2>
    </div>
    <ul class="services">
      ${services.map((s, i) => `<li class="service reveal">
        <div class="service-link">
          <span class="service-no" aria-hidden="true">0${i + 1}</span>
          <div class="service-main">
            <h3>${s.title}</h3>
            <p class="service-text">${s.text}</p>
          </div>
          <span class="service-meta">${s.price ? `${eur(h.prices[s.price])} · ${h.prices.minutes}&nbsp;Minuten` : ''}</span>
        </div>
      </li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="section about" id="ueber-mich">
  <div class="wrap about-grid">
    <figure class="about-photo reveal">
      ${h.img('alexandra-seemann-psychotherapeutin-wien', 'Mag.a Alexandra Seemann, Psychotherapeutin in Wien', { sizes: '(min-width: 960px) 420px, 90vw' })}
    </figure>
    <div class="about-text">
      <p class="eyebrow">Über mich</p>
      <h2>Über mich</h2>
      <p class="about-name">${h.person.name}</p>
      <p class="about-role">${h.person.job} für ${h.person.method}</p>
      <p>Ich arbeite als Psychotherapeutin in Wien und leite <a href="${h.intakt.url}" rel="noopener" target="_blank">intakt</a>, das Therapiezentrum für Menschen mit Essstörungen. In meine therapeutische Arbeit fließen mehr als 2.000 Stunden praktische Therapieerfahrung ein.</p>
      <ul class="facts">
        <li>Systemische Therapie</li>
        <li>Über 2.000 Therapiestunden</li>
        <li>Leitung intakt – Therapiezentrum für Menschen mit Essstörungen</li>
      </ul>
    </div>
  </div>
</section>

<section class="section costs" id="kosten">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Kosten</p>
      <h2>Kosten der Psychotherapie</h2>
    </div>
    <div class="price-grid">
      <div class="price">
        <h3>Einzeltherapie</h3>
        <p class="price-amount">${eur(h.prices.einzel)}</p>
        <p class="price-unit">${h.prices.minutes} Minuten</p>
      </div>
      <div class="price">
        <h3>Paar- &amp; Familientherapie</h3>
        <p class="price-amount">${eur(h.prices.paar)}</p>
        <p class="price-unit">${h.prices.minutes} Minuten</p>
      </div>
      <div class="price">
        <h3>Online Einzelberatung</h3>
        <p class="price-amount">${eur(h.prices.online)}</p>
        <p class="price-unit">${h.prices.minutes} Minuten</p>
      </div>
    </div>
    <div class="center">
      <a class="btn btn-large"${h.bookingAttrs}>Termin buchen</a>
    </div>
  </div>
</section>

<section class="section refund" id="krankenkasse">
  <div class="wrap narrow">
    <h2>Rückerstattung durch die Krankenkasse</h2>
    <p>Bei Vorliegen der Voraussetzungen können Sie einen Teil der Kosten für Einzeltherapie bei Ihrer gesetzlichen Krankenversicherung einreichen.</p>
    ${zuschussTable(h)}
    <p><a class="text-link" href="/kosten/">Kosten, Kostenzuschuss und Einreichung im Detail</a></p>
  </div>
</section>

<section class="section practice" id="praxis">
  <div class="wrap practice-grid">
    <div class="practice-text">
      <p class="eyebrow">Praxis</p>
      <h2>Psychotherapie in 1090 Wien</h2>
      <p>Meine Praxis befindet sich im 9.&nbsp;Wiener Gemeindebezirk, Alsergrund.</p>
      <address class="address">${h.contact.street}<br>${h.contact.zip} ${h.contact.city}</address>
      <h3 class="transit-title">Öffentlich erreichbar</h3>
      <dl class="transit">
        ${h.contact.transit.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('\n        ')}
      </dl>
      <p class="practice-links">
        <a class="text-link" href="${h.contact.routeUrl}" target="_blank" rel="noopener">Route planen</a>
        <a class="text-link" href="${h.profiles.google}" target="_blank" rel="noopener">Google-Profil</a>
      </p>
    </div>
    <figure class="practice-photo reveal">
      ${h.img('psychotherapie-praxis-1090-wien', 'Praxis für Psychotherapie in 1090 Wien', { sizes: '(min-width: 960px) 440px, 360px' })}
    </figure>
  </div>
  <div class="wrap">
    <div class="map" data-map="${h.contact.mapEmbedUrl}">
      <div class="map-consent">
        <p class="map-title">Standort auf Google Maps</p>
        <p class="fineprint">Beim Laden der Karte werden Daten (u.&nbsp;a. Ihre IP-Adresse) an Google übertragen. <a href="/datenschutz/#google-maps">Mehr dazu</a></p>
        <button type="button" class="btn btn-small" data-map-load>Karte laden</button>
        <a class="text-link" href="${h.profiles.google}" target="_blank" rel="noopener">In Google Maps öffnen</a>
      </div>
    </div>
  </div>
</section>

<section class="section faq" id="gut-zu-wissen">
  <div class="wrap narrow">
    <h2>Gut zu wissen</h2>
    ${accordion(faq, 'gut-zu-wissen')}
  </div>
</section>

<section class="section contact" id="kontakt">
  <div class="wrap contact-grid">
    <div>
      <h2>Kontakt</h2>
      <p class="contact-hint">Für einen Therapietermin nutzen Sie bitte die <a class="text-link" ${h.bookingAttrs.trim()}>Online-Terminbuchung</a>. Für Fragen erreichen Sie mich telefonisch Mo&nbsp;–&nbsp;Do 09:00&nbsp;Uhr bis 17:00&nbsp;Uhr oder per E-Mail.</p>
    </div>
    <address class="contact-card">
      <strong>${h.person.name}</strong><br>
      ${h.person.job}<br>
      ${h.contact.street}<br>${h.contact.zip} ${h.contact.city}<br>
      <a href="${h.contact.phoneHref}">${h.contact.phone}</a><br>
      <a href="${h.contact.emailHref}">${h.contact.email}</a>
    </address>
  </div>
</section>`
};

// ---------- Unterseiten ----------
const kosten = {
  path: '/kosten/',
  crumb: 'Kosten & Rückerstattung',
  title: 'Psychotherapie Kosten Wien | Kostenzuschuss & Rückerstattung',
  ogTitle: 'Kosten der Psychotherapie in Wien – Zuschuss & Rückerstattung',
  description: 'Was Psychotherapie in 1090 Wien kostet, welchen Kostenzuschuss ÖGK, SVS, BVAEB und KFA Wien leisten und wie Sie die Rückerstattung beantragen.',
  body: (h) => `
${pageHero({ eyebrow: 'Kosten', title: 'Kosten der Psychotherapie', lead: 'Transparente Honorare und ein Überblick, welchen Teil die Krankenkasse unter Umständen rückerstattet.' })}
<section class="section">
  <div class="wrap narrow prose">
    <h2>Honorar pro Sitzung</h2>
    <dl class="price-list">
      <div><dt>Einzeltherapie</dt><dd>${eur(h.prices.einzel)} · ${h.prices.minutes}&nbsp;Minuten</dd></div>
      <div><dt>Paartherapie</dt><dd>${eur(h.prices.paar)} · ${h.prices.minutes}&nbsp;Minuten</dd></div>
      <div><dt>Familientherapie</dt><dd>${eur(h.prices.paar)} · ${h.prices.minutes}&nbsp;Minuten</dd></div>
      <div><dt>Online Einzelberatung</dt><dd>${eur(h.prices.online)} · ${h.prices.minutes}&nbsp;Minuten</dd></div>
    </dl>
    <p>Ich arbeite als Wahlpsychotherapeutin, also ohne direkte Verrechnung mit der Krankenkasse. Sie bezahlen das Honorar und erhalten eine Honorarnote, die Sie bei Ihrer Versicherung einreichen können.</p>

    <h2>Kostenzuschuss der Krankenkassen</h2>
    <p>Gesetzliche Krankenversicherungen in Österreich leisten unter bestimmten Voraussetzungen einen Zuschuss pro Sitzung:</p>
    ${zuschussTable(h)}

    <h2>So beantragen Sie die Rückerstattung</h2>
    <ol class="steps">
      <li>Vor Beginn der Psychotherapie ist in der Regel eine ärztliche Untersuchung nötig. Fragen Sie bei Ihrer Versicherung nach, bis wann diese erfolgen muss.</li>
      <li>Je nach Versicherung ist ab einer bestimmten Anzahl an Sitzungen ein Antrag auf Kostenzuschuss erforderlich. Diesen stelle ich bei Bedarf gemeinsam mit Ihnen.</li>
      <li>Sie reichen die bezahlten Honorarnoten bei Ihrer Krankenkasse ein, etwa online oder per Post.</li>
    </ol>
    <p class="fineprint">Ein Anspruch auf Kostenzuschuss besteht nicht automatisch. Er setzt eine krankheitswertige Störung voraus; die Entscheidung trifft Ihre Versicherung.</p>

    <h2>Private Zusatzversicherung</h2>
    <p>Manche private Krankenversicherungen übernehmen zusätzlich einen Teil der Kosten. Umfang und Bedingungen sind sehr unterschiedlich – fragen Sie am besten vor Beginn der Therapie nach.</p>

    <h2>Versichert in Deutschland</h2>
    <p>Wenn Sie in Wien studieren oder leben und in Deutschland krankenversichert sind, klären Sie bitte vor Beginn der Behandlung direkt mit Ihrer Versicherung, ob und in welchem Umfang Psychotherapiekosten in Österreich übernommen werden.</p>

    <h2>Absage von Terminen</h2>
    <p>Absagen bis 24&nbsp;Stunden vor dem Termin sind kostenfrei, telefonisch unter <a href="${h.contact.phoneHref}">${h.contact.phone}</a> oder per E-Mail an <a href="${h.contact.emailHref}">${h.contact.email}</a>. Später abgesagte oder nicht wahrgenommene Termine werden in voller Höhe verrechnet.</p>
  </div>
</section>
${ctaBand(h)}`
};

const notfallStellen = [
  { name: 'Sozialpsychiatrischer Notdienst Wien', tel: '01 313 30', href: '+43131330', info: 'Rund um die Uhr', web: 'psd-wien.at' },
  { name: 'Rettung', tel: '144', href: '144', info: 'Bei akuten medizinischen Notfällen.' },
  { name: 'Kriseninterventionszentrum Wien', tel: '01 406 95 95', href: '+4314069595', info: 'Montag bis Freitag, 8:00–17:00 Uhr', web: 'kriseninterventionszentrum.at' },
  { name: 'Telefonseelsorge', tel: '142', href: '142', info: 'Rund um die Uhr', web: 'telefonseelsorge.at' },
  { name: 'Ö3 Kummernummer', tel: '116 123', href: '116123', web: 'oe3.orf.at/kummernummer' },
  { name: 'Hotline für Essstörungen', tel: '0800 20 11 20', href: '+43800201120', info: 'Montag bis Donnerstag, 12:00–17:00 Uhr', mail: 'hilfe@essstoerungshotline.at' },
  { name: 'Männerberatung Wien', tel: '01 603 28 28', href: '+4316032828', web: 'maenner.at', extra: 'Männerinfo Krisenhotline: <a href="tel:+43800400777">0800 400 777</a> – rund um die Uhr' },
  { name: 'Frauenhelpline gegen Gewalt', tel: '0800 222 555', href: '+43800222555', info: 'Rund um die Uhr', web: 'frauenhelpline.at' },
  { name: 'Rat auf Draht', tel: '147', href: '147', info: 'Für Kinder, Jugendliche und junge Erwachsene. Rund um die Uhr.', web: 'rataufdraht.at' }
];

const notfall = {
  path: '/notfall/',
  crumb: 'Hilfe im Notfall',
  title: 'Hilfe im Notfall | Krisen- und Notrufnummern Wien',
  description: 'Notrufnummern und Kriseneinrichtungen in Wien: Sozialpsychiatrischer Notdienst, Rettung, Kriseninterventionszentrum, Telefonseelsorge und weitere Stellen.',
  bodyClass: 'no-motion',
  body: () => `
<section class="page-hero">
  <div class="wrap narrow">
    <h1>Hilfe im Notfall</h1>
    <p class="lead">Meine Praxis bietet keinen psychiatrischen Notdienst. Wenn Sie sich in einer akuten Krise befinden oder unmittelbare Hilfe benötigen, wenden Sie sich bitte an eine der folgenden Stellen.</p>
  </div>
</section>
<section class="section emergency">
  <div class="wrap narrow">
    <ul class="emergency-list">
      ${notfallStellen.map((s) => `<li>
        <h2>${s.name}</h2>
        <p class="emergency-tel"><a href="tel:${s.href}">${s.tel}</a></p>
        ${s.info ? `<p>${s.info}</p>` : ''}
        ${s.extra ? `<p>${s.extra}</p>` : ''}
        ${s.web ? `<p><a href="https://${s.web}" target="_blank" rel="noopener">${s.web}</a></p>` : ''}
        ${s.mail ? `<p><a href="mailto:${s.mail}">${s.mail}</a></p>` : ''}
      </li>`).join('\n      ')}
    </ul>
  </div>
</section>`
};

const impressum = {
  path: '/impressum/',
  crumb: 'Impressum',
  title: 'Impressum | Psychotherapie Alexandra Seemann, 1090 Wien',
  description: 'Impressum und Offenlegung gemäß § 5 ECG und § 25 MedienG – Mag.a Alexandra Seemann, BA pth., Psychotherapeutin in 1090 Wien.',
  noindex: true,
  body: (h) => `
${pageHero({ title: 'Impressum' })}
<section class="section">
  <div class="wrap narrow prose">
    <p class="small">Informationen gemäß § 5 E-Commerce-Gesetz und Offenlegung gemäß § 25 Mediengesetz</p>
    <h2>Medieninhaberin und Diensteanbieterin</h2>
    <address>
      ${h.person.name}<br>
      ${h.person.job} (${h.person.method})<br>
      ${h.contact.street}<br>${h.contact.zip} ${h.contact.city}, Österreich<br>
      Telefon: <a href="${h.contact.phoneHref}">${h.contact.phone}</a><br>
      E-Mail: <a href="${h.contact.emailHref}">${h.contact.email}</a>
    </address>
    <h2>Berufsbezeichnung und Berufsrecht</h2>
    <p>Psychotherapeutin, Berufsbezeichnung verliehen in der Republik Österreich. Eingetragen in die Psychotherapeutinnen- und Psychotherapeutenliste des Gesundheitsministeriums.</p>
    <p>Berufsrechtliche Vorschriften: Psychotherapiegesetz 2024 (PThG 2024), BGBl. I Nr. 49/2024, abrufbar unter <a href="https://www.ris.bka.gv.at" target="_blank" rel="noopener">ris.bka.gv.at</a>.</p>
    <p>Aufsichtsbehörde: Bundesministerium für Arbeit, Soziales, Gesundheit, Pflege und Konsumentenschutz.</p>
    <h2>Blattlinie</h2>
    <p>Information über das psychotherapeutische Angebot der Praxis.</p>
    <h2>Haftung für Links</h2>
    <p>Für Inhalte externer Websites, auf die verlinkt wird, sind ausschließlich deren Betreiber verantwortlich.</p>
  </div>
</section>`
};

const datenschutz = {
  path: '/datenschutz/',
  crumb: 'Datenschutz',
  title: 'Datenschutz | Psychotherapie Alexandra Seemann, 1090 Wien',
  description: 'Datenschutzerklärung der psychotherapeutischen Praxis von Mag.a Alexandra Seemann, BA pth., in 1090 Wien.',
  noindex: true,
  body: (h) => `
${pageHero({ title: 'Datenschutzerklärung' })}
<section class="section">
  <div class="wrap narrow prose">
    <h2>Verantwortliche</h2>
    <p>${h.person.name}, ${h.contact.street}, ${h.contact.zip} ${h.contact.city}<br>E-Mail: <a href="${h.contact.emailHref}">${h.contact.email}</a> · Telefon: <a href="${h.contact.phoneHref}">${h.contact.phone}</a></p>

    <h2>Grundsatz</h2>
    <p>Diese Website verwendet keine Cookies, keine Analyse- oder Trackingdienste und keine Social-Media-Plugins. Eine Karte von Google Maps wird nur nach Ihrem Klick geladen (siehe unten). Schriftarten werden lokal von diesem Server geladen.</p>

    <h2>Server-Logfiles</h2>
    <p>Beim Aufruf der Website verarbeitet der Hosting-Anbieter technisch notwendige Daten (z.&nbsp;B. IP-Adresse, Datum und Uhrzeit, aufgerufene Seite, Browsertyp), um die Website sicher und stabil bereitzustellen. Rechtsgrundlage ist das berechtigte Interesse gemäß Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO. Die Daten werden nicht mit anderen Daten zusammengeführt und nach kurzer Zeit gelöscht.</p>

    <h2>Kontaktaufnahme</h2>
    <p>Wenn Sie mich per E-Mail oder Telefon kontaktieren, verarbeite ich Ihre Angaben zur Bearbeitung Ihrer Anfrage. Bitte beachten Sie, dass unverschlüsselte E-Mails nicht vollständig vor dem Zugriff Dritter geschützt sind. Senden Sie sensible Gesundheitsinformationen daher möglichst nicht per E-Mail.</p>

    <h2>Online-Terminbuchung</h2>
    <p>Für die Terminbuchung werden Sie zu einem externen Buchungsanbieter weitergeleitet. Dort gelten zusätzlich dessen Datenschutzbestimmungen.</p>

    <h2>Psychotherapeutische Behandlung</h2>
    <p>Im Rahmen der Psychotherapie verarbeite ich Gesundheitsdaten gemäß Art.&nbsp;9 Abs.&nbsp;2 lit.&nbsp;h DSGVO ausschließlich zur Behandlung und zur Erfüllung gesetzlicher Dokumentations- und Aufbewahrungspflichten. Alle Informationen unterliegen der Verschwiegenheitspflicht nach §&nbsp;45 Psychotherapiegesetz 2024.</p>

    <h2 id="google-maps">Google Maps</h2>
    <p>Auf der Startseite kann eine Karte von Google Maps (Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland) angezeigt werden. Die Karte wird erst geladen, wenn Sie auf „Karte laden“ klicken. Erst dann werden Daten wie Ihre IP-Adresse an Google übertragen, gegebenenfalls auch in die USA. Rechtsgrundlage ist Ihre Einwilligung gemäß Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO, die durch den Klick erteilt wird und durch Neuladen der Seite endet. Details: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a>.</p>

    <h2>Externe Links</h2>
    <p>Links zu externen Seiten (z.&nbsp;B. „Route planen“, Google-Profil oder LinkedIn) werden erst durch Ihren Klick aufgerufen. Ab dann gelten die Datenschutzbestimmungen des jeweiligen Anbieters.</p>

    <h2>Ihre Rechte</h2>
    <p>Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wenden Sie sich dafür an die oben genannte Adresse. Zudem können Sie Beschwerde bei der Österreichischen Datenschutzbehörde einreichen: Barichgasse 40–42, 1030 Wien, <a href="https://www.dsb.gv.at" target="_blank" rel="noopener">dsb.gv.at</a>.</p>
  </div>
</section>`
};

const notFound = {
  path: '/404.html',
  file: '404.html',
  crumb: 'Seite nicht gefunden',
  title: 'Seite nicht gefunden | Psychotherapie Alexandra Seemann',
  description: 'Diese Seite existiert nicht.',
  noindex: true,
  body: () => `
${pageHero({ title: 'Seite nicht gefunden', lead: 'Die gesuchte Seite existiert nicht oder wurde verschoben.' })}
<section class="section"><div class="wrap narrow"><p><a class="text-link" href="/">Zur Startseite</a></p></div></section>`
};

export const pages = [home, kosten, notfall, impressum, datenschutz, notFound];
