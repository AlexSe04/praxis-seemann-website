// Inhalte aller Seiten. Jede Seite bedient einen eigenen Suchintent;
// Texte werden nicht zwischen Seiten dupliziert.

const eur = (n) => `€&nbsp;${n}`;

import { SITE_URL, ETERMIN_ENABLED } from './config.mjs';

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
    title: 'Onlineberatung',
    text: 'Psychotherapie kann ergänzend zu persönlichen Terminen in der Praxis auch online stattfinden. Eine flexible Möglichkeit, wenn persönliche Termine vor Ort zeitweise nicht oder nur schwer möglich sind. Online- und Präsenzsitzungen wechseln sich dabei ab.'
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
        <p class="fineprint">Die Karte wird von Google bereitgestellt. Erst wenn Sie auf „Karte laden“ klicken, werden Daten (u.&nbsp;a. Ihre IP-Adresse) an Google übertragen, möglicherweise auch in die USA. Ihre Auswahl wird nicht gespeichert. <a href="/datenschutz/#google-maps">Mehr dazu</a></p>
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
  bodyClass: 'page-kosten',
  crumb: 'Kosten & Rückerstattung',
  title: 'Psychotherapie Kosten Wien | Kostenzuschuss & Rückerstattung',
  ogTitle: 'Kosten der Psychotherapie in Wien – Zuschuss & Rückerstattung',
  description: 'Was Psychotherapie in 1090 Wien kostet, welchen Kostenzuschuss ÖGK, SVS, BVAEB und KFA Wien leisten und wie Sie die Rückerstattung beantragen.',
  body: (h) => `
${pageHero({ eyebrow: 'Kosten', title: 'Kosten der Psychotherapie' })}
<section class="section">
  <div class="wrap narrow prose">
    <h2 class="heading-accent">Honorar pro Sitzung</h2>
    <dl class="price-list">
      <div><dt>Einzeltherapie</dt><dd>${eur(h.prices.einzel)} · ${h.prices.minutes}&nbsp;Minuten</dd></div>
      <div><dt>Paartherapie</dt><dd>${eur(h.prices.paar)} · ${h.prices.minutes}&nbsp;Minuten</dd></div>
      <div><dt>Familientherapie</dt><dd>${eur(h.prices.paar)} · ${h.prices.minutes}&nbsp;Minuten</dd></div>
    </dl>
    <p>Ich arbeite als Wahlpsychotherapeutin, also ohne direkte Verrechnung mit der Krankenkasse. Sie bezahlen das Honorar und erhalten eine Honorarnote, die Sie bei Ihrer Versicherung einreichen können.</p>

    <h2 class="heading-accent-plain">Kostenzuschuss der Krankenkassen</h2>
    <p>Gesetzliche Krankenversicherungen in Österreich leisten unter bestimmten Voraussetzungen einen Zuschuss pro Einzeltherapie-Sitzung:</p>
    ${zuschussTable(h)}

    <h2 class="heading-accent">So beantragen Sie die Rückerstattung</h2>
    <ol class="steps">
      <li>Vor Beginn der Psychotherapie ist in der Regel eine ärztliche Untersuchung nötig. Von Ihrem Facharzt oder Allgemeinmediziner erhalten Sie eine „Bestätigung für Psychotherapie“. Diese benötigen Sie spätestens bis zur zweiten Therapiestunde, um die Rechnungen bei Ihrer Krankenkasse einreichen zu können.</li>
      <li>Zusammen mit der Bestätigung für Psychotherapie reichen Sie die bezahlten Honorarnoten bei Ihrer Krankenkasse ein, etwa online oder per Post.</li>
      <li>Ab der zehnten Sitzung ist ein Antrag auf Kostenzuschuss erforderlich. Diesen stelle ich bei Bedarf gemeinsam mit Ihnen.</li>
    </ol>
    <p class="fineprint">Ein Anspruch auf Kostenzuschuss besteht nicht automatisch. Er setzt eine krankheitswertige Störung voraus; die Entscheidung trifft Ihre Versicherung.</p>

    <h2 class="heading-accent">Private Zusatzversicherung</h2>
    <p>Manche private Krankenversicherungen übernehmen zusätzlich einen Teil der Kosten. Umfang und Bedingungen sind sehr unterschiedlich. Fragen Sie daher am besten vor Beginn der Therapie nach.</p>

    <h2 class="heading-accent">Versichert in Deutschland</h2>
    <p>Wenn Sie in Wien leben oder studieren und in Deutschland krankenversichert sind, erkundigen Sie sich bitte vor Beginn der Psychotherapie direkt bei Ihrer Krankenversicherung, welcher Antrag für die Kostenübernahme erforderlich ist und welche weiteren Unterlagen gegebenenfalls benötigt werden. In der Regel stellt Ihnen Ihre Versicherung das entsprechende Antragsformular zur Verfügung. Bei Fragen unterstütze ich Sie gerne.</p>

    <h2 class="heading-accent">Absage von Terminen</h2>
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

// Abschnitte der Datenschutzerklärung. Nummerierung ergibt sich automatisch,
// damit der eTermin-Abschnitt ohne Lücken ein- und ausgeblendet werden kann.
const dsSections = (h) => [
  { id: 'verantwortliche', title: 'Verantwortliche', body: `
    <p>Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website und in meiner Praxis ist:</p>
    <p>${h.person.name}<br>${h.contact.street}, ${h.contact.zip} ${h.contact.city}, Österreich<br>Telefon: <a href="${h.contact.phoneHref}">${h.contact.phone}</a><br>E-Mail: <a href="${h.contact.emailHref}">${h.contact.email}</a></p>` },
  { id: 'allgemeines', title: 'Allgemeines', body: `
    <p>Der Schutz Ihrer Daten ist mir – gerade in der Psychotherapie – ein besonderes Anliegen. Ich verarbeite personenbezogene Daten nach der Datenschutz-Grundverordnung (DSGVO), dem österreichischen Datenschutzgesetz (DSG), dem Telekommunikationsgesetz 2021 (TKG 2021) und dem Psychotherapiegesetz 2024 (PThG 2024).</p>
    <p>Diese Erklärung unterscheidet drei Bereiche, die getrennt voneinander zu betrachten sind:</p>
    <ul>
      <li><strong>Besuch der Website</strong> – technisch notwendige Daten beim Aufruf der Seiten (Abschnitte {hosting} bis {cookies}).</li>
      <li><strong>Kontakt und Terminvereinbarung</strong> – Ihre Angaben, wenn Sie mich anrufen oder mir schreiben${ETERMIN_ENABLED ? ' oder online einen Termin buchen' : ''}.</li>
      <li><strong>Psychotherapeutische Behandlung</strong> – Daten, die im Rahmen einer Psychotherapie entstehen, einschließlich der gesetzlich vorgeschriebenen Dokumentation.</li>
    </ul>
    <p>Diese Website verwendet keine Analyse- oder Trackingdienste, keine Werbe- oder Marketing-Cookies und keine Social-Media-Plugins. Schriftarten und Skripte werden ausschließlich von dieser Website selbst geladen.</p>` },
  { id: 'hosting', title: 'Hosting über Cloudflare', body: `
    <p>Diese Website wird über den Dienst Cloudflare Pages der Cloudflare, Inc., 101 Townsend St., San Francisco, CA 94107, USA, bereitgestellt. Cloudflare speichert die Website-Dateien und liefert sie über ein weltweites Servernetz aus. Dabei wird die Verbindung zu Ihrem Gerät zwangsläufig über Server von Cloudflare hergestellt.</p>
    <p>Cloudflare verarbeitet die Daten als Auftragsverarbeiter (Art.&nbsp;28 DSGVO) auf Grundlage der Vertragsbedingungen von Cloudflare einschließlich des Data Processing Addendum. Rechtsgrundlage ist mein berechtigtes Interesse an einer sicheren, stabilen und schnellen Bereitstellung der Website (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO). Zur Übermittlung in die USA siehe <a href="#drittland">Drittlandübermittlungen</a>.</p>` },
  { id: 'logfiles', title: 'Server-Logfiles', body: `
    <p>Bei jedem Aufruf der Website werden technisch notwendige Verbindungsdaten verarbeitet, insbesondere IP-Adresse, Datum und Uhrzeit, aufgerufene Adresse, übertragene Datenmenge, Referrer (die zuvor besuchte Seite, sofern Ihr Browser sie übermittelt) sowie Browser- und Betriebssystemangaben. Diese Daten sind nötig, um die Seiten auszuliefern, Störungen zu beheben und Angriffe abzuwehren.</p>
    <p>Rechtsgrundlage ist Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;f DSGVO. Ich nutze diese Daten nicht, um Besucherinnen und Besucher zu identifizieren, Profile zu erstellen oder Reichweite zu messen, und führe sie nicht mit anderen Daten zusammen.</p>` },
  { id: 'cookies', title: 'Cookies und Speichertechnologien', body: `
    <p>Diese Website selbst setzt <strong>keine Cookies</strong> und speichert nichts im Local Storage, Session Storage oder in vergleichbaren Speichern Ihres Browsers. Das kleine Skript der Website dient nur der Bedienung (Menü, Kopfzeile, Einblendungen, Laden der Karte auf Klick) und legt keine Daten auf Ihrem Gerät ab. Ein Cookie-Banner ist daher nicht erforderlich. Inhalte anderer Anbieter (Google Maps${ETERMIN_ENABLED ? ', eTermin' : ''}) werden erst geladen, wenn Sie dies durch einen Klick auslösen.</p>
    <div class="table-scroll" role="region" aria-labelledby="cookie-tabelle" tabindex="0">
    <table class="data-table">
      <caption id="cookie-tabelle">Übersicht der Speichertechnologien</caption>
      <thead><tr><th scope="col">Technologie</th><th scope="col">Anbieter</th><th scope="col">Zweck</th><th scope="col">Kategorie</th><th scope="col">Dauer</th><th scope="col">Rechtsgrundlage</th><th scope="col">Drittland</th></tr></thead>
      <tbody>
        <tr><th scope="row">Keine Cookies, kein Local/Session Storage</th><td>Website</td><td>–</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
        <tr><th scope="row">Google Maps (nur nach Klick auf „Karte laden“)</th><td>Google Ireland Limited</td><td>Anzeige der Karte; Google kann dabei eigene Cookies oder ähnliche Technologien einsetzen</td><td>Externer Inhalt, einwilligungsbasiert</td><td>Festgelegt durch Google</td><td>Einwilligung (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO, §&nbsp;165 Abs.&nbsp;3 TKG 2021)</td><td>Möglich (USA)</td></tr>${ETERMIN_ENABLED ? `
        <tr><th scope="row">eTermin-Buchungsseite (nur nach Klick auf „Termin buchen“)</th><td>eTermin GmbH</td><td>Online-Terminbuchung; eTermin kann auf der Buchungsseite eigene Cookies oder ähnliche Technologien einsetzen</td><td>Vom Nutzer angeforderter Dienst</td><td>Festgelegt durch eTermin</td><td>§&nbsp;165 Abs.&nbsp;3 TKG 2021 (ausdrücklich gewünschter Dienst); für die Buchungsdaten siehe <a href="#etermin">Online-Terminbuchung</a></td><td>Schweiz (Angemessenheitsbeschluss)</td></tr>` : ''}
      </tbody>
    </table>
    </div>
    <p>Cloudflare kann aus Sicherheitsgründen in Einzelfällen technisch notwendige Cookies setzen (etwa zur Abwehr automatisierter Zugriffe). Solche Cookies dienen ausschließlich der Sicherheit, werden nicht für Analyse oder Werbung genutzt und sind nach §&nbsp;165 Abs.&nbsp;3 TKG 2021 ohne Einwilligung zulässig. Bei der Prüfung dieser Website wurden keine solchen Cookies festgestellt.</p>` },
  { id: 'kontakt', title: 'Kontakt per Telefon und E-Mail', body: `
    <p>Wenn Sie mich anrufen oder mir eine E-Mail schreiben, verarbeite ich die Angaben, die Sie mir mitteilen (z.&nbsp;B. Name, Telefonnummer, E-Mail-Adresse, Terminwünsche und Ihr Anliegen), um Ihre Anfrage zu beantworten und gegebenenfalls einen Termin zu vereinbaren.</p>
    <p>Rechtsgrundlage ist die Durchführung vorvertraglicher Maßnahmen auf Ihre Anfrage (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO). Soweit Sie Angaben zu Ihrer Gesundheit machen – und schon die Anfrage nach einem Psychotherapietermin kann darauf schließen lassen –, verarbeite ich diese zur Gesundheitsversorgung unter Wahrung der Verschwiegenheitspflicht (Art.&nbsp;9 Abs.&nbsp;2 lit.&nbsp;h und Abs.&nbsp;3 DSGVO).</p>
    <p>Die E-Mail-Adresse wird über Microsoft (Outlook.com) betrieben. Bitte beachten Sie, dass E-Mails in der Regel nicht durchgehend verschlüsselt übertragen werden. Senden Sie mir daher möglichst keine ausführlichen Gesundheitsinformationen per E-Mail; für eine erste Kontaktaufnahme genügen Name, Rückrufnummer und Terminwunsch.</p>` },
  // eTermin: Dieser Abschnitt wird nur veröffentlicht, wenn ETERMIN_ENABLED=1 gesetzt ist (siehe config.mjs).
  ETERMIN_ENABLED && { id: 'etermin', title: 'Online-Terminbuchung über eTermin', body: `
    <p>Für die Online-Terminbuchung nutze ich den Dienst der eTermin GmbH, Mättivor 3, 6430 Schwyz, Schweiz. Wenn Sie auf „Termin buchen“ klicken, öffnet sich die Buchungsseite von eTermin in einem Fenster über dieser Website (eingebettet als iframe) bzw. – ohne JavaScript – in einem neuen Tab. Erst mit diesem Klick wird eine Verbindung zu eTermin hergestellt und es werden Daten wie Ihre IP-Adresse und Browserangaben an eTermin übertragen; vorher lädt diese Website keine Inhalte von eTermin.</p>
    <p>Verarbeitet werden die Angaben, die Sie bei der Buchung eingeben, insbesondere Name und Kontaktdaten, der gewählte Termin, gegebenenfalls Ihre Nachricht an mich sowie technische Daten der Buchung. Bitte machen Sie bei der Buchung keine Angaben zu Beschwerden oder Diagnosen; Ihr Anliegen besprechen wir persönlich.</p>
    <p>Rechtsgrundlage ist die Durchführung vorvertraglicher Maßnahmen (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO). Da bereits die Buchung eines Psychotherapietermins einen Rückschluss auf Ihre Gesundheit zulassen kann, erfolgt die Verarbeitung zusätzlich nach Art.&nbsp;9 Abs.&nbsp;2 lit.&nbsp;h und Abs.&nbsp;3 DSGVO. Eine Cookie-Einwilligung ist nicht die Rechtsgrundlage für diese Buchungsdaten.</p>
    <p>eTermin ist als Auftragsverarbeiter auf Grundlage eines Vertrags nach Art.&nbsp;28 DSGVO tätig (Stand des Vertrags: 05.09.2026, Version 07.2026 v6.2). Nach Angaben von eTermin werden die Daten bei Microsoft Azure im Rechenzentrum Frankfurt am Main gespeichert; Unterauftragsverarbeiter ist hierfür die Microsoft Ireland Operations Limited, Dublin, Irland. Die technischen und organisatorischen Maßnahmen sind im Vertrag festgelegt. Für die Schweiz besteht ein Angemessenheitsbeschluss der Europäischen Kommission (Art.&nbsp;45 DSGVO).</p>
    <p>Auf der Buchungsseite gelten ergänzend die Datenschutzhinweise von eTermin. Wenn Sie nicht online buchen möchten, können Sie einen Termin jederzeit telefonisch oder per E-Mail vereinbaren.</p>` },
  { id: 'gesundheitsdaten', title: 'Gesundheitsdaten und psychotherapeutische Behandlung', body: `
    <p>Im Rahmen einer Psychotherapie verarbeite ich Gesundheitsdaten und weitere besonders geschützte Daten (Art.&nbsp;9 DSGVO), etwa Angaben zu Ihrer Lebenssituation, zum Behandlungsverlauf und zur Abrechnung. Dies erfolgt zur Durchführung der Behandlung und zur Erfüllung gesetzlicher Pflichten, insbesondere der Dokumentationspflicht nach dem PThG 2024.</p>
    <p>Rechtsgrundlagen sind der Behandlungsvertrag (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;b DSGVO), rechtliche Verpflichtungen (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;c DSGVO) sowie Art.&nbsp;9 Abs.&nbsp;2 lit.&nbsp;h und Abs.&nbsp;3 DSGVO. Bestätigungen und Honorarnoten für Ihre Krankenkasse oder Versicherung stelle ich Ihnen aus; deren Weitergabe liegt bei Ihnen.</p>
    <p>Die Behandlungsdokumentation ist von den Daten der Website getrennt. Sie wird weder über diese Website noch über ein Buchungssystem geführt.</p>` },
  { id: 'verschwiegenheit', title: 'Verschwiegenheit', body: `
    <p>Als Psychotherapeutin bin ich nach §&nbsp;45 PThG 2024 zur Verschwiegenheit über alle mir in Ausübung meines Berufes anvertrauten oder bekannt gewordenen Geheimnisse verpflichtet. Diese Pflicht gilt bereits ab der ersten Kontaktaufnahme und besteht auch nach Ende der Behandlung fort. Informationen gebe ich nur weiter, wenn Sie mich davon entbinden oder das Gesetz dies ausdrücklich vorsieht.</p>` },
  { id: 'google-maps', title: 'Google Maps (Zwei-Klick-Lösung)', body: `
    <p>Auf der Startseite kann eine Karte von Google Maps angezeigt werden. Anbieter ist die Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland. Die Karte wird <strong>nicht automatisch</strong> geladen. Bis zu Ihrem Klick auf „Karte laden“ wird keine Verbindung zu Google hergestellt.</p>
    <p>Erst mit dem Klick werden Daten wie Ihre IP-Adresse, Datum und Uhrzeit, die Adresse dieser Seite und Browserangaben an Google übertragen. Google kann dabei Cookies oder ähnliche Technologien einsetzen und Daten auch in die USA übermitteln. Rechtsgrundlage ist Ihre Einwilligung durch den Klick (Art.&nbsp;6 Abs.&nbsp;1 lit.&nbsp;a DSGVO, §&nbsp;165 Abs.&nbsp;3 TKG 2021).</p>
    <p>Ihre Auswahl wird nicht gespeichert: Beim nächsten Seitenaufruf ist die Karte wieder ausgeblendet. Alternativ können Sie den Standort über den Link „In Google Maps öffnen“ oder „Route planen“ direkt bei Google aufrufen oder die Adresse oben verwenden. Weitere Informationen: <a href="https://policies.google.com/privacy?hl=de" target="_blank" rel="noopener">Datenschutzerklärung von Google</a>.</p>` },
  { id: 'externe-links', title: 'Externe Links', body: `
    <p>Diese Website enthält Links zu anderen Angeboten, etwa zu meinem Google-Profil, zu LinkedIn, zur Routenplanung bei Google Maps, zu Notdiensten und Behörden. Diese Seiten werden erst aufgerufen, wenn Sie den Link anklicken; vorher werden keine Daten an diese Anbieter übertragen. Für die verlinkten Seiten sind deren Betreiber verantwortlich.</p>
    <p>Links mit „tel:“ und „mailto:“ öffnen lediglich die Telefon- oder E-Mail-App Ihres Geräts.</p>` },
  { id: 'empfaenger', title: 'Empfänger und Auftragsverarbeiter', body: `
    <p>Ich gebe Ihre Daten nicht zu Werbezwecken weiter und verkaufe sie nicht. Empfänger können – jeweils nur im erforderlichen Umfang – sein:</p>
    <ul>
      <li>Cloudflare, Inc. als Hosting-Anbieter der Website (Auftragsverarbeiter);</li>
      <li>Microsoft als Anbieter des E-Mail-Postfachs, wenn Sie mir schreiben;</li>${ETERMIN_ENABLED ? `
      <li>eTermin GmbH als Anbieter der Online-Terminbuchung (Auftragsverarbeiter) samt Unterauftragsverarbeiter Microsoft Ireland Operations Limited;</li>` : ''}
      <li>Google Ireland Limited, jedoch nur, wenn Sie die Karte laden;</li>
      <li>Behörden, Gerichte oder Sozialversicherungsträger, soweit eine gesetzliche Pflicht besteht oder Sie dies veranlassen.</li>
    </ul>` },
  { id: 'drittland', title: 'Drittlandübermittlungen', body: `
    <p>Bei Cloudflare, Microsoft und Google kann eine Übermittlung personenbezogener Daten in die USA nicht ausgeschlossen werden. Diese Unternehmen sind nach eigenen Angaben nach dem EU-US Data Privacy Framework zertifiziert, für das ein Angemessenheitsbeschluss der Europäischen Kommission besteht (Art.&nbsp;45 DSGVO).${ETERMIN_ENABLED ? ' Für die Schweiz (Sitz der eTermin GmbH) besteht ebenfalls ein Angemessenheitsbeschluss.' : ''}</p>` },
  { id: 'speicherdauer', title: 'Speicherdauer', body: `
    <p>Ich speichere personenbezogene Daten nur so lange, wie es für den jeweiligen Zweck erforderlich ist oder gesetzliche Pflichten es verlangen. Maßgeblich sind folgende Kriterien:</p>
    <ul>
      <li><strong>Logdaten der Website:</strong> so lange, wie es für Betrieb und Sicherheit nötig ist; die Speicherfristen richten sich nach den Vorgaben von Cloudflare.</li>
      <li><strong>Anfragen per Telefon oder E-Mail:</strong> bis zur Erledigung Ihrer Anfrage; kommt es zu einer Behandlung, werden die Daten Teil der Behandlungsunterlagen.</li>${ETERMIN_ENABLED ? `
      <li><strong>Buchungsdaten bei eTermin:</strong> so lange, wie es für Terminverwaltung und Nachweis erforderlich ist; danach werden sie gelöscht.</li>` : ''}
      <li><strong>Behandlungsdokumentation und Abrechnungsunterlagen:</strong> für die Dauer der gesetzlichen Aufbewahrungspflichten (insbesondere nach PThG 2024 und Steuerrecht) sowie solange Ansprüche geltend gemacht werden können.</li>
      <li><strong>Google Maps:</strong> Die Speicherdauer bei Google legt Google fest.</li>
    </ul>` },
  { id: 'rechte', title: 'Ihre Rechte', body: `
    <p>Sie haben das Recht auf Auskunft (Art.&nbsp;15 DSGVO), Berichtigung (Art.&nbsp;16), Löschung (Art.&nbsp;17), Einschränkung der Verarbeitung (Art.&nbsp;18), Datenübertragbarkeit (Art.&nbsp;20) und Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art.&nbsp;21). Gesetzliche Aufbewahrungspflichten können einer Löschung entgegenstehen. Wenden Sie sich dafür bitte an die oben genannten Kontaktdaten.</p>` },
  { id: 'widerruf', title: 'Widerruf Ihrer Einwilligung', body: `
    <p>Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art.&nbsp;7 Abs.&nbsp;3 DSGVO). Die Einwilligung zum Laden von Google Maps gilt nur für den jeweiligen Seitenaufruf und wird nicht gespeichert; Sie widerrufen sie, indem Sie die Seite neu laden oder schließen. Die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt unberührt.</p>` },
  { id: 'beschwerde', title: 'Beschwerde bei der Datenschutzbehörde', body: `
    <p>Wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen Datenschutzrecht verstößt, können Sie sich bei der zuständigen Aufsichtsbehörde beschweren:</p>
    <p>Österreichische Datenschutzbehörde<br>Barichgasse 40–42, 1030 Wien<br><a href="https://www.dsb.gv.at" target="_blank" rel="noopener">www.dsb.gv.at</a></p>
    <p>Gerne können Sie sich vorher direkt an mich wenden.</p>` },
  { id: 'aktualisierung', title: 'Aktualisierung', body: `
    <p>Ich passe diese Datenschutzerklärung an, wenn sich die Website, die eingesetzten Dienste oder die Rechtslage ändern. Es gilt die jeweils hier veröffentlichte Fassung.</p>
    <p>Stand: Oktober 2026</p>` }
].filter(Boolean);

const datenschutz = {
  path: '/datenschutz/',
  crumb: 'Datenschutz',
  title: 'Datenschutz | Psychotherapie Alexandra Seemann, 1090 Wien',
  description: 'Datenschutzerklärung der psychotherapeutischen Praxis von Mag.a Alexandra Seemann, BA pth., in 1090 Wien.',
  noindex: true,
  body: (h) => {
    const sections = dsSections(h);
    const num = Object.fromEntries(sections.map((s, i) => [s.id, i + 1]));
    const fill = (html) => html.replace(/\{(\w[\w-]*)\}/g, (m, id) => (id in num ? String(num[id]) : m));
    return `
${pageHero({ title: 'Datenschutzerklärung' })}
<section class="section">
  <div class="wrap narrow prose">
    <nav class="toc" aria-labelledby="inhaltsverzeichnis">
      <h2 id="inhaltsverzeichnis">Inhalt</h2>
      <ol>
        ${sections.map((s) => `<li><a href="#${s.id}">${s.title}</a></li>`).join('\n        ')}
      </ol>
    </nav>
${sections.map((s, i) => `
    <h2 id="${s.id}">${i + 1}. ${s.title}</h2>${fill(s.body)}`).join('\n')}
  </div>
</section>`;
  }
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
