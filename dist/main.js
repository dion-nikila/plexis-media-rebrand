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
  try {
   const response = await fetch('/contact-config.json');
   if (!response.ok) throw new Error();
   const {email} = await response.json();
   if (!email) {status.textContent = 'Enquiries are not connected yet. Please check back soon.'; return;}
   const data = new FormData(form);
   const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nBrand: ${data.get('brand') || 'Not provided'}\nInterested in: ${data.get('service')}\n\n${data.get('message')}`;
   location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Project enquiry — ' + data.get('name')) + '&body=' + encodeURIComponent(body);
   status.textContent = 'Your email draft is ready to open. Send it from your email app to complete your enquiry.';
  } catch {status.textContent = 'We could not open your enquiry. Please try again.';}
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
 identity: {title:'Make it unmistakably you.', description:'Get your positioning, personality, and visual direction working together.', image:'seashell-fern', ingredients:['Brand strategy','Creative direction'], service:'Brand & strategy', link:"Let's find your voice ↗"},
 launch: {title:'Give a good idea a great entrance.', description:'Build a launch story, shape the creative, and get it in front of the right people.', image:'cloud-stairway', ingredients:['Campaign concepts','Content & creative'], service:'Campaigns & growth', link:"Let's plan your launch ↗"},
 connection: {title:'Become part of their everyday.', description:'Find a content rhythm and a social voice people want to spend time with.', image:'feather-origami-bird', ingredients:['Social strategy','Storytelling'], service:'Social & community', link:"Let's build a connection ↗"}
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
