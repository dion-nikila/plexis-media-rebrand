const butterflyScene = document.querySelector('.butterfly-scene');
const butterflyButton = document.querySelector('.butterfly-trigger');
const butterflyLayersSupported = 'CSS' in window && 'supports' in CSS &&
  CSS.supports('transform', 'rotateY(10deg)') && CSS.supports('clip-path', 'polygon(0 0, 100% 0, 100% 100%)');
const reducedMotion = 'matchMedia' in window ? matchMedia('(prefers-reduced-motion: reduce)') : null;

if (butterflyScene && butterflyButton) {
  let flutterTimer;
  const updateButton = () => {
    butterflyButton.disabled = !butterflyLayersSupported || !reducedMotion || reducedMotion.matches;
    if (butterflyButton.disabled) {
      clearTimeout(flutterTimer);
      butterflyScene.classList.remove('is-fluttering');
    }
  };
  butterflyButton.addEventListener('click', () => {
    if (butterflyButton.disabled) return;
    clearTimeout(flutterTimer);
    butterflyScene.classList.remove('is-fluttering');
    void butterflyScene.offsetWidth;
    butterflyScene.classList.add('is-fluttering');
    flutterTimer = setTimeout(() => butterflyScene.classList.remove('is-fluttering'), 1150);
  });
  if (reducedMotion && reducedMotion.addEventListener) reducedMotion.addEventListener('change', updateButton);
  else if (reducedMotion && reducedMotion.addListener) reducedMotion.addListener(updateButton);
  updateButton();
}
if (butterflyScene && 'IntersectionObserver' in window && 'matchMedia' in window &&
    butterflyLayersSupported) {
  const heroStage = butterflyScene.closest('.hero-stage');
  const canAnimate = matchMedia('(prefers-reduced-motion: no-preference)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let inView = false;
  let frame = 0;
  let tiltX = 0;
  let tiltY = 0;

  const updateMotion = () => {
    const enabled = canAnimate.matches;
    butterflyScene.classList.toggle('is-enhanced', enabled);
    butterflyScene.classList.toggle('is-active', enabled && inView && !document.hidden);
    if (!enabled) {
      butterflyScene.style.removeProperty('--tilt-x');
      butterflyScene.style.removeProperty('--tilt-y');
    }
  };

  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updateMotion();
  }, {threshold: 0.05}).observe(heroStage);

  heroStage.addEventListener('pointermove', event => {
    if (!inView || !canAnimate.matches || !finePointer.matches) return;
    const rect = heroStage.getBoundingClientRect();
    tiltX = ((event.clientY - rect.top) / rect.height - .5) * -7;
    tiltY = ((event.clientX - rect.left) / rect.width - .5) * 9;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      butterflyScene.style.setProperty('--tilt-x', `${tiltX.toFixed(1)}deg`);
      butterflyScene.style.setProperty('--tilt-y', `${tiltY.toFixed(1)}deg`);
      frame = 0;
    });
  }, {passive: true});
  heroStage.addEventListener('pointerleave', () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    butterflyScene.style.removeProperty('--tilt-x');
    butterflyScene.style.removeProperty('--tilt-y');
  });
  if (canAnimate.addEventListener) canAnimate.addEventListener('change', updateMotion);
  else if (canAnimate.addListener) canAnimate.addListener(updateMotion);
  document.addEventListener('visibilitychange', updateMotion);
  updateMotion();
}
