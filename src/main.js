// Kleine Progressive-Enhancement-Schicht: kompakter Header, mobiles Menü, dezente Einblendungen.
(function () {
  var root = document.documentElement;
  root.classList.add('js');

  var header = document.querySelector('[data-header]');
  var onScroll = function () { header.classList.toggle('is-compact', window.scrollY > 40); };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var toggle = document.querySelector('[data-menu-toggle]');
  var setOpen = function (open) {
    toggle.setAttribute('aria-expanded', String(open));
    header.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
  document.querySelectorAll('#hauptnavigation a').forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setOpen(false); });

  // Google Maps erst nach Klick laden (Datenschutz)
  document.querySelectorAll('[data-map-load]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var box = btn.closest('[data-map]');
      var frame = document.createElement('iframe');
      frame.src = box.getAttribute('data-map');
      frame.title = 'Standort der Praxis auf Google Maps';
      frame.setAttribute('allowfullscreen', '');
      frame.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
      box.innerHTML = '';
      box.appendChild(frame);
      box.classList.add('is-loaded');
    });
  });

  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
