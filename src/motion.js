import { useEffect, useRef } from 'react';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---- Reveal: elements with [data-reveal] get .is-in once they enter the viewport.
let revealObserver;
function getRevealObserver() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          revealObserver.unobserve(e.target);
        }
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  }
  return revealObserver;
}

export function useRevealAll(deps = []) {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]:not(.is-in)');
    if (reduced()) { els.forEach(el => el.classList.add('is-in')); return; }
    const io = getRevealObserver();
    els.forEach(el => io.observe(el));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ---- Parallax: one scroll listener drives every registered element through a CSS variable.
const parallaxItems = new Map(); // el -> depth
let ticking = false;
let visible = new Set();
let visObserver;

function update() {
  ticking = false;
  const vh = window.innerHeight;
  for (const el of visible) {
    const depth = parallaxItems.get(el);
    const r = el.getBoundingClientRect();
    const offset = (r.top + r.height / 2 - vh / 2) / vh; // -1 .. 1 around the viewport centre
    el.style.setProperty('--py', `${(-offset * depth * 60).toFixed(1)}px`);
  }
}
function onScroll() {
  if (!ticking) { ticking = true; requestAnimationFrame(update); }
}

export function useParallax(depth = 0.5) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    // Phones get a gentler effect.
    const scaled = window.innerWidth < 720 ? depth * 0.6 : depth;
    if (!visObserver) {
      visObserver = new IntersectionObserver(entries => {
        for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
        onScroll();
      }, { rootMargin: '20% 0px' });
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    }
    parallaxItems.set(el, scaled);
    visObserver.observe(el);
    return () => {
      parallaxItems.delete(el);
      visible.delete(el);
      visObserver.unobserve(el);
    };
  }, [depth]);
  return ref;
}

// ---- Tilt: a few degrees of rotation towards the pointer, desktop only.
export function useTilt(max = 5) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !finePointer()) return;
    const host = el.closest('[data-tilt-host]') || el;
    let raf = 0;
    const move = e => {
      const r = host.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(-y * max).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${(x * max).toFixed(2)}deg`);
      });
    };
    const leave = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    return () => {
      host.removeEventListener('pointermove', move);
      host.removeEventListener('pointerleave', leave);
      cancelAnimationFrame(raf);
    };
  }, [max]);
  return ref;
}
