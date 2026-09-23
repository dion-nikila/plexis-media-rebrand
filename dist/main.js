document.querySelectorAll('.service').forEach((service) => {
  service.addEventListener('toggle', () => {
    if (service.open) document.querySelectorAll('.service').forEach((other) => {
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
  button.disabled = true;
  status.textContent = 'Sending your enquiry…';
  try {
   const response = await fetch('/contact-config.json');
   if (!response.ok) throw new Error();
   const {email} = await response.json();
   if (!email) {status.textContent = 'Enquiries are not connected yet. Please check back soon.'; return;}
   const data = Object.fromEntries(new FormData(form));
   const submission = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(email), {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
    body: JSON.stringify(data)
   });
   if (!submission.ok) throw new Error();
   const result = await submission.json();
   if (result.success !== true && result.success !== 'true') throw new Error();
   form.reset();
   status.textContent = 'Thanks — your enquiry has been submitted. We’ll be in touch by email.';
  } catch {status.textContent = 'Your enquiry could not be sent. Please try again.';}
  finally {button.disabled = false;}
 });
}
// Each fragment has its own quiet orbit. No opacity cycling or path resets.
const heroMotion = matchMedia('(prefers-reduced-motion: reduce)');
function updateHeroMotion() {
 document.querySelectorAll('.path-tile').forEach(tile => tile.style.animationPlayState = heroMotion.matches ? 'paused' : 'running');
}
heroMotion.addEventListener('change', updateHeroMotion);
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
