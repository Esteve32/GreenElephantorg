import { useEffect, type RefObject } from 'react';

// Progressive enhancement: initial HTML requests ONE responsive image, even without JS.
export function useHomepageCarousel(root: RefObject<HTMLDivElement>, language: 'en' | 'fr') {
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const region = host.querySelector<HTMLElement>('.home-photo-hero')!;
    const slides = Array.from(host.querySelectorAll<HTMLImageElement>('.home-slide'));
    const controls = host.querySelector<HTMLElement>('.home-carousel-controls')!;
    const pause = controls.querySelector<HTMLButtonElement>('[data-carousel="pause"]')!;
    const caption = host.querySelector<HTMLElement>('.home-scene-caption')!;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const data = matchMedia('(prefers-reduced-data: reduce)');
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean; effectiveType?: string } }).connection;
    const constrained = () => data.matches || !!connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '');
    let current = 0, paused = motion.matches || constrained(), visible = true, hovering = false;
    let disposed = false, busy = false, timer: ReturnType<typeof setTimeout>;
    const label = () => { pause.textContent = paused ? (language === 'fr' ? 'Lecture' : 'Play') : 'Pause'; };
    const schedule = () => {
      clearTimeout(timer);
      if (!disposed && !paused && visible && !hovering && !document.hidden) timer = setTimeout(() => void show(current + 1), 8000);
    };
    const show = async (index: number) => {
      if (busy || disposed) return;
      clearTimeout(timer);
      busy = true;
      const next = (index + slides.length) % slides.length, img = slides[next];
      try {
        if (!img.getAttribute('src')) {
          img.srcset = img.dataset.srcset!;
          img.src = img.dataset.src!;
        }
        await img.decode(); // Never fade into an unloaded photo on a slow connection.
        if (disposed) return;
        slides[current].classList.remove('is-active');
        img.classList.add('is-active');
        current = next;
        caption.textContent = `0${next + 1} / 05 · ${img.dataset.caption}`;
      } catch { /* Keep the current photograph if another asset cannot load. */ }
      finally { busy = false; schedule(); }
    };
    const click = (event: Event) => {
      const action = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-carousel]')?.dataset.carousel;
      if (!action) return;
      if (action === 'pause') { paused = !paused; label(); schedule(); }
      else { paused = true; label(); void show(current + (action === 'next' ? 1 : -1)); }
    };
    const enter = () => { hovering = true; schedule(); };
    const leave = () => { hovering = false; schedule(); };
    const focus = (event: FocusEvent) => { if ((event.target as HTMLElement).matches(':focus-visible')) { paused = true; label(); schedule(); } };
    const preferences = () => { if (motion.matches || constrained()) paused = true; label(); schedule(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; schedule(); });
    observer.observe(region);
    controls.hidden = false;
    controls.addEventListener('click', click);
    region.addEventListener('mouseenter', enter);
    region.addEventListener('mouseleave', leave);
    controls.addEventListener('focusin', focus);
    document.addEventListener('visibilitychange', schedule);
    motion.addEventListener('change', preferences);
    data.addEventListener('change', preferences);
    connection?.addEventListener('change', preferences);
    label(); schedule();
    return () => {
      disposed = true; clearTimeout(timer); observer.disconnect();
      controls.removeEventListener('click', click);
      region.removeEventListener('mouseenter', enter); region.removeEventListener('mouseleave', leave);
      controls.removeEventListener('focusin', focus);
      document.removeEventListener('visibilitychange', schedule);
      motion.removeEventListener('change', preferences); data.removeEventListener('change', preferences);
      connection?.removeEventListener('change', preferences);
    };
  }, [root, language]);
}
