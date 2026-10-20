// Zentrale Stammdaten der Praxis-Website.
// NAP (Name, Adresse, Telefon) wird überall aus diesen Werten erzeugt,
// damit die Schreibweise auf jeder Seite exakt gleich bleibt.

export const SITE_URL = (process.env.SITE_URL || 'https://www.praxis-seemann.at').replace(/\/$/, '');

// Link des Online-Terminbuchungstools (z. B. Doctolib, Calendly, …).
// Solange kein Link hinterlegt ist, führt „Termin buchen“ zum Kontaktbereich.
export const BOOKING_URL = process.env.BOOKING_URL || '/#kontakt';

export const person = {
  name: 'Mag.a Alexandra Seemann, BA pth.',
  shortName: 'Alexandra Seemann',
  givenName: 'Alexandra',
  familyName: 'Seemann',
  prefix: 'Mag.a',
  suffix: 'BA pth.',
  job: 'Psychotherapeutin',
  method: 'Systemische Therapie',
  hours: 'Über 2.000 Therapiestunden'
};

export const contact = {
  street: 'Gussenbauergasse 1/21',
  zip: '1090',
  city: 'Wien',
  district: 'Alsergrund',
  country: 'AT',
  phone: '+43 670 203 6558',
  phoneHref: 'tel:+436702036558',
  email: 'psyche1010@outlook.at',
  emailHref: 'mailto:psyche1010@outlook.at',
  routeUrl: 'https://www.google.com/maps/dir/?api=1&destination=Gussenbauergasse+1%2C+1090+Wien&travelmode=transit',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Gussenbauergasse%201%2C%201090%20Wien&z=16&hl=de&output=embed',
  transit: [
    ['U-Bahn', 'U4 · Friedensbrücke'],
    ['Straßenbahn', '5, 33, D · Franz-Josefs-Bahnhof'],
    ['S-Bahn & Regionalzug', 'S40, R40, R42 · Franz-Josefs-Bahnhof']
  ]
};

// Profile auf anderen Plattformen (auch als „sameAs“ in den strukturierten Daten).
// LinkedIn: Hier muss die öffentliche Profil-URL stehen (https://www.linkedin.com/in/…).
// Leer gelassen, wird der jeweilige Link nicht angezeigt.
export const profiles = {
  google: 'https://maps.app.goo.gl/RZCw5cMaDNqVEAzh9',
  linkedin: process.env.LINKEDIN_URL || 'https://www.linkedin.com/in/alexandra-seemann'
};

export const intakt = {
  name: 'intakt – Therapiezentrum für Menschen mit Essstörungen',
  url: 'https://www.intakt.at'
};

export const prices = {
  einzel: 140,
  paar: 180,
  minutes: 50
};

// Kostenzuschüsse der gesetzlichen Krankenversicherungen pro Sitzung.
export const zuschuesse = [
  ['ÖGK', '33,70'],
  ['SVS', '50,00'],
  ['BVAEB', '50,20'],
  ['KFA Wien', '39,00']
];
