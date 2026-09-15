const year = document.querySelector('#copyright-year');
year.textContent = String(new Date().getFullYear());
document.querySelectorAll('.service').forEach((service) => {
  service.addEventListener('toggle', () => {
    if (service.open) document.querySelectorAll('.service').forEach((other) => {
      if (other !== service) other.open = false;
    });
  });
});

// The supplied curved-path marquee, adapted to the site's lightweight DOM.
// A shared animation loop keeps the path responsive without per-frame layout reads.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero-stage');
const collage = document.querySelector('.path-collage');
const path = document.querySelector('.motion-path path');
const allTiles = [...document.querySelectorAll('.path-tile')];
const journey = document.querySelector('.about-journey');
const pin = document.querySelector('.about-pin');
const planes = [...document.querySelectorAll('.perspective-layer')];
const pathLength = path.getTotalLength();
const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const ease = (value) => value * value * (3 - 2 * value);
let geometry = {};
let tiles = [];
let scrollPosition = window.scrollY;
let scrollDirty = true;
let previousTime = performance.now();
let elapsed = 0;
let frameId = 0;
let heroVisible = true;

function measure() {
  const box = collage.getBoundingClientRect();
  const aboutBox = journey.getBoundingClientRect();
  const titleBox = document.querySelector('#hero-title').getBoundingClientRect();
  const kickerBox = document.querySelector('.hero-kicker').getBoundingClientRect();
  const compact = window.innerWidth <= 600;
  const topOffset = Number.parseFloat(getComputedStyle(pin).top) || 0;
  geometry = {
    width: box.width,
    height: box.height,
    aboutTop: aboutBox.top + window.scrollY,
    travel: Math.max(180, journey.offsetHeight - pin.offsetHeight),
    topOffset,
    compact,
    textAreas: [titleBox, kickerBox].map((rect) => ({
      left: rect.left - box.left - 15,
      right: rect.right - box.left + 15,
      top: rect.top - box.top - 13,
      bottom: rect.bottom - box.top + 13,
    })),
  };
  tiles = allTiles.filter((tile) => getComputedStyle(tile).display !== 'none').map((tile) => ({
    element: tile,
    width: tile.offsetWidth,
    height: tile.offsetHeight,
  }));
  scrollPosition = window.scrollY;
  scrollDirty = true;
  drawPath(motionPreference.matches ? 0 : elapsed);
  drawPerspective();
}

function drawPath(time) {
  tiles.forEach((tile, index) => {
    const progress = (time / 46000 + index / tiles.length + 0.075) % 1;
    const point = path.getPointAtLength(progress * pathLength);
    const next = path.getPointAtLength(Math.min(pathLength, progress * pathLength + 4));
    const angle = clamp(Math.atan2(next.y - point.y, next.x - point.x) * 180 / Math.PI * 0.24, -13, 13);
    const x = point.x / 1200 * geometry.width - tile.width / 2;
    const y = point.y / 560 * geometry.height - tile.height / 2;
    const scale = 0.87 + 0.13 * Math.sin(progress * Math.PI);
    tile.element.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    // Quietly fade fragments as they pass behind the type; motion never stops.
    const proximity = geometry.textAreas.reduce((nearest, area) => {
      const dx = Math.max(area.left - (x + tile.width), x - area.right, 0);
      const dy = Math.max(area.top - (y + tile.height), y - area.bottom, 0);
      return Math.min(nearest, Math.hypot(dx, dy));
    }, Infinity);
    tile.element.style.opacity = (0.12 + 0.8 * ease(clamp(proximity / 55))).toFixed(3);
  });
}

// The scroll-image-tunnel idea becomes a full-section atmosphere. Only the
// decorative planes move; the copy and its paper scrim stay stable.
function drawPerspective() {
  const progress = motionPreference.matches || geometry.compact ? 0 : clamp((scrollPosition - geometry.aboutTop + geometry.topOffset) / geometry.travel);
  const firstChange = ease(clamp((progress - 0.13) / 0.4));
  const secondChange = ease(clamp((progress - 0.61) / 0.35));
  planes[0].style.transform = `translate3d(${(-progress * 4).toFixed(2)}%, ${(-progress * 3).toFixed(2)}%, 0) scale(${(1 + progress * 0.12).toFixed(3)})`;
  planes[0].style.opacity = (1 - firstChange * 0.88).toFixed(3);
  planes[1].style.transform = `translate3d(${(5 - progress * 7).toFixed(2)}%, ${(5 - progress * 7).toFixed(2)}%, 0) scale(${(0.82 + progress * 0.48).toFixed(3)})`;
  planes[1].style.opacity = (firstChange * (1 - secondChange)).toFixed(3);
  planes[2].style.transform = `translate3d(${(-3 - progress * 4).toFixed(2)}%, ${(-progress * 4).toFixed(2)}%, 0) scale(${(1.05 + progress * 0.25).toFixed(3)})`;
  planes[2].style.opacity = secondChange.toFixed(3);
  scrollDirty = false;
}

function animate(now) {
  const delta = Math.min(now - previousTime, 64);
  previousTime = now;
  if (!motionPreference.matches && !document.hidden) {
    elapsed += delta;
    if (heroVisible) drawPath(elapsed);
  }
  if (scrollDirty) drawPerspective();
  frameId = requestAnimationFrame(animate);
}

window.addEventListener('scroll', () => {
  scrollPosition = window.scrollY;
  scrollDirty = true;
}, { passive: true });
const resizeObserver = new ResizeObserver(measure);
resizeObserver.observe(hero);
resizeObserver.observe(pin);
resizeObserver.observe(journey);
const visibilityObserver = new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; });
visibilityObserver.observe(hero);
motionPreference.addEventListener('change', measure);
document.fonts.ready.then(measure);
measure();
frameId = requestAnimationFrame(animate);
window.addEventListener('pagehide', () => cancelAnimationFrame(frameId));
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    previousTime = performance.now();
    measure();
    frameId = requestAnimationFrame(animate);
  }
});
