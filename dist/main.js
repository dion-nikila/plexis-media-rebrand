document.querySelectorAll('.service').forEach((service) => {
  service.querySelector('summary').addEventListener('click', () => {
    document.querySelectorAll('.service').forEach((other) => {
      if (other !== service) other.open = false;
    });
  });
});

document.querySelectorAll('.service-enquiry').forEach(link => {
 link.href = '/contact/?service=' + encodeURIComponent(link.closest('.service').querySelector('h3').textContent);
});
const form = document.querySelector('#enquiry-form');
if (form) {
 const service = new URLSearchParams(location.search).get('service');
 if ([...form.elements.service.options].some(option => option.value === service)) form.elements.service.value = service;
 form.addEventListener('submit', async event => {
  event.preventDefault();
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  const endpoint = new URL(form.action);
  button.disabled = true;
  status.textContent = 'Sending your enquiry…';
  try {
   const data = Object.fromEntries(new FormData(form));
   const submission = await fetch(`${endpoint.origin}/ajax${endpoint.pathname}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    body: JSON.stringify(data)
   });
   if (!submission.ok) throw new Error();
   const result = await submission.json();
   if (result.success !== true && result.success !== 'true') throw new Error();
   form.reset();
   status.textContent = 'Thanks — your enquiry has been submitted. We’ll be in touch by email.';
  } catch {
   status.textContent = 'Your enquiry could not be sent. Please try again or ';
   const link = document.createElement('a');
   link.href = `mailto:${decodeURIComponent(endpoint.pathname.slice(1))}`;
   link.textContent = 'email us directly';
   status.append(link, '.');
  }
  finally {button.disabled = false;}
 });
}
// Each fragment has its own quiet orbit. No opacity cycling or path resets.
const heroMotion = matchMedia('(prefers-reduced-motion: reduce)');
function updateHeroMotion() {
 document.querySelectorAll('.path-tile').forEach(tile => tile.style.animationPlayState = heroMotion.matches ? 'paused' : 'running');
}
if (heroMotion.addEventListener) heroMotion.addEventListener('change', updateHeroMotion);
else if (heroMotion.addListener) heroMotion.addListener(updateHeroMotion);
updateHeroMotion();

// A useful starting point, presented as a small stack of studio notes.
const mixIdeas = {
 identity: {title:'Build a distinct brand.', description:'Bring your positioning, voice, and visual direction into focus.', image:'seashell-fern', ingredients:['Brand strategy','Creative direction'], service:'Brand & strategy', link:"Let's find your voice ↗"},
 launch: {title:'Launch with a clear idea.', description:'Shape the launch story, create the work, and reach the right people.', image:'cloud-stairway', ingredients:['Campaign concepts','Content & creative'], service:'Campaigns & growth', link:"Let's plan your launch ↗"},
 connection: {title:'Build a stronger connection.', description:'Find a social voice and content rhythm your audience wants to follow.', image:'feather-origami-bird', ingredients:['Social strategy','Storytelling'], service:'Social & community', link:"Let's build a connection ↗"}
};
document.querySelectorAll('.mix-section').forEach(section => {
 section.querySelectorAll('[data-mix]').forEach(button => button.addEventListener('click', () => {
  const idea = mixIdeas[button.dataset.mix];
  section.querySelectorAll('[data-mix]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  const card = section.querySelector('.mix-card');
  card.querySelector('h3').textContent = idea.title;
  card.querySelector('p').textContent = idea.description;
  card.querySelector('img').src = '/assets/' + idea.image + '.webp';
  card.querySelectorAll('.mix-ingredients span').forEach((span, index) => span.textContent = idea.ingredients[index]);
  const link = card.querySelector('a');link.textContent = idea.link;link.href = '/contact/?service=' + encodeURIComponent(idea.service);
  card.classList.remove('is-changing');
  requestAnimationFrame(() => card.classList.add('is-changing'));
 }));
});
// Keep the mobile navigation easy to reach without relying on JavaScript to expose links.
document.querySelectorAll('.site-header').forEach(header => {
 const toggle = header.querySelector('.menu-toggle');
 const nav = header.querySelector('#primary-nav');
 if (!toggle || !nav) return;
 header.classList.add('has-mobile-nav');
 const closeMenu = () => {
  header.classList.remove('is-menu-open');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Open menu');
 };
 toggle.addEventListener('click', () => {
  const open = !header.classList.contains('is-menu-open');
  header.classList.toggle('is-menu-open', open);
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
 });
 nav.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
 });
 document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && header.classList.contains('is-menu-open')) {
   closeMenu();
   toggle.focus();
  }
 });
 document.addEventListener('click', event => {
  if (!header.contains(event.target)) closeMenu();
 });
 const mobileWidth = matchMedia('(max-width: 600px)');
 if (mobileWidth.addEventListener) mobileWidth.addEventListener('change', closeMenu);
 else if (mobileWidth.addListener) mobileWidth.addListener(closeMenu);
});

// Let the browser edge follow the footer when it enters the viewport.
const footer = document.querySelector('.site-footer');
const themeColor = document.querySelector('meta[name="theme-color"]');
if (footer && themeColor && 'IntersectionObserver' in window) {
 const pageColor = themeColor.content;
 new IntersectionObserver(([entry]) => {
  themeColor.content = entry.isIntersecting ? '#25369c' : pageColor;
 }, {threshold: 0}).observe(footer);
}

// A single entrance per section adds rhythm without constant motion.
if ('IntersectionObserver' in window && matchMedia('(prefers-reduced-motion: no-preference)').matches) {
 const revealItems = document.querySelectorAll('.image-intro .intro-top, .image-intro .image-sentence, .image-intro .intro-bottom, .services .section-heading, .services .service, .mix-intro, .mix-card, .contact-content, .approach-grid .thought-card');
 const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
   if (!entry.isIntersecting) return;
   entry.target.classList.add('is-visible');
   revealObserver.unobserve(entry.target);
  });
 }, {rootMargin: '0px 0px -6% 0px', threshold: 0.05});
 revealItems.forEach(item => {
  item.classList.add('reveal-item');
  revealObserver.observe(item);
 });
}
