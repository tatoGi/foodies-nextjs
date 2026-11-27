'use client';

import {useCallback, useEffect, useRef, useState} from 'react';
import type {KeyboardEvent, MouseEvent, PointerEvent} from 'react';
import {useLocale} from 'next-intl';
import {Link} from '@/i18n/navigation';
import type {CmsProduct} from '@/lib/cms';
import {loopDistance, stadiumPoint} from '@/lib/dish-belt';
import styles from './DishBelt.module.css';

const FALLBACK_IMAGE = '/assets/img/home-1/food-menu-1.png';

// Loop geometry (px, in the belt's own flat plane before the 3D tilt).
const STRAIGHT = 380;
const RADIUS = 150;
const LOOP = 2 * STRAIGHT + 2 * Math.PI * RADIUS;
const FRONT = STRAIGHT / 2; // distance along the loop of the front-centre spot

// Motion tuning.
const CRUISE = 55; // px/s when nobody touches the belt
const EASE = 2.5; // how fast speed follows its target (1/s)
const FLICK_EASE = 0.9; // slower easing after a flick, so it spins on
const SNAP = 9; // how fast prev/next glide to the next plate (1/s)
const DRAG_THRESHOLD = 6; // px of pointer travel before a press counts as a drag

// Button labels; the site has only these two locales.
const LABELS = {
  ka: {prev: 'წინა კერძი', next: 'შემდეგი კერძი', pause: 'გაჩერება', play: 'გაშვება', belt: 'კერძების ლენტი'},
  en: {prev: 'Previous dish', next: 'Next dish', pause: 'Pause', play: 'Play', belt: 'Dish belt'}
};

/**
 * Kaiten-style dish belt for the home hero: plates ride a tilted stadium loop.
 * Hover stops it, drag scrubs it, a flick spins it on with inertia, the front
 * plate is lifted and described below; prev/pause/next and arrow keys step it.
 * Positions are written straight to the DOM each frame (no React re-render);
 * React state only tracks the front plate and the paused flag.
 */
export default function DishBelt({plates}: {plates: CmsProduct[]}) {
  const labels = LABELS[useLocale() === 'en' ? 'en' : 'ka'];
  const count = plates.length;
  const gap = count > 0 ? LOOP / count : LOOP;

  const plateRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const motion = useRef({offset: 0, speed: 0, ease: EASE, hover: false, snapTo: null as number | null});
  const drag = useRef({id: -1, x: 0, t: 0, moved: 0});
  const focusFront = useRef(false);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const pausedRef = useRef(paused);

  // Mirror `paused` into a ref so the animation loop reads it without restarting.
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  // Follow the visitor's reduced-motion setting: no cruising, instant steps.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  // Index of the plate closest to the front-centre spot for a given offset.
  const frontIndex = useCallback(
    (offset: number) => {
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < count; i++) {
        const dist = Math.abs(loopDistance(offset + i * gap, FRONT, LOOP));
        if (dist < bestDist) [best, bestDist] = [i, dist];
      }
      return best;
    },
    [count, gap]
  );

  // Moves every plate to its spot on the loop and reports the front plate.
  const place = useCallback(() => {
    const {offset} = motion.current;
    for (let i = 0; i < count; i++) {
      const el = plateRefs.current[i];
      if (!el) continue;
      const {x, y} = stadiumPoint(offset + i * gap, STRAIGHT, RADIUS);
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    }
    const front = frontIndex(offset);
    setActive((prev) => (prev === front ? prev : front));
  }, [count, gap, frontIndex]);

  // Animation loop: eases speed toward its target (cruise, 0 on hover/pause) or glides to a snap point.
  useEffect(() => {
    if (count === 0) return;
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const m = motion.current;

      if (drag.current.id === -1) {
        if (m.snapTo !== null) {
          const diff = m.snapTo - m.offset;
          m.offset = Math.abs(diff) < 0.5 || reduced ? m.snapTo : m.offset + diff * Math.min(1, dt * SNAP);
          m.speed = 0;
          if (m.offset === m.snapTo) m.snapTo = null;
        } else {
          const target = m.hover || pausedRef.current || reduced ? 0 : CRUISE;
          m.speed += (target - m.speed) * Math.min(1, dt * m.ease);
          if (Math.abs(m.speed - target) < 1) m.ease = EASE;
          m.offset += m.speed * dt;
        }
      }

      place();
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [count, place, reduced]);

  // After a keyboard step, keep focus on whichever plate is now in front.
  useEffect(() => {
    if (focusFront.current) {
      focusFront.current = false;
      plateRefs.current[active]?.focus({preventScroll: true});
    }
  }, [active]);

  // Glides the belt one plate forward (+1) or back (-1) from the current front plate.
  const step = (direction: 1 | -1) => {
    const m = motion.current;
    const base = m.snapTo ?? m.offset + loopDistance(m.offset + frontIndex(m.offset) * gap, FRONT, LOOP);
    m.snapTo = base + direction * gap;
  };

  // Pointer press on the belt: start tracking a possible drag.
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    drag.current = {id: e.pointerId, x: e.clientX, t: performance.now(), moved: 0};
    motion.current.snapTo = null;
  };

  // Pointer move: once past the threshold, scrub the belt and measure flick speed.
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const now = performance.now();
    d.moved += Math.abs(dx);
    if (d.moved < DRAG_THRESHOLD) return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
    const m = motion.current;
    m.offset += dx;
    m.speed = (dx / Math.max(now - d.t, 1)) * 1000;
    d.x = e.clientX;
    d.t = now;
  };

  // Pointer release: let a flick spin on and ease back to cruise slowly.
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (drag.current.id !== e.pointerId) return;
    drag.current.id = -1;
    if (performance.now() - drag.current.t > 80) motion.current.speed = 0; // held still before letting go
    motion.current.ease = FLICK_EASE;
  };

  // A press that turned into a drag must not also open the product.
  const onPlateClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.detail !== 0 && drag.current.moved >= DRAG_THRESHOLD) e.preventDefault(); // detail 0 = keyboard Enter
  };

  // Arrow keys step the belt while a plate has focus.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    focusFront.current = true;
    step(e.key === 'ArrowRight' ? -1 : 1);
  };

  if (count === 0) return null;
  const current = plates[active];

  return (
    <div className={styles.belt} role="region" aria-roledescription="carousel" aria-label={labels.belt}>
      <div
        className={styles.stage}
        onPointerEnter={() => (motion.current.hover = true)}
        onPointerLeave={() => (motion.current.hover = false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        <div className={styles.loop}>
          <div className={styles.island} />
          {plates.map((product, i) => (
            <Link
              key={`${product.id}-${i}`}
              ref={(el) => {
                plateRefs.current[i] = el;
              }}
              href={`/products/${product.slug}`}
              className={`${styles.plate}${i === active ? ` ${styles.active}` : ''}`}
              tabIndex={i === active ? 0 : -1}
              aria-label={`${product.title}, ${product.price}`}
              draggable={false}
              onClick={onPlateClick}
            >
              <img src={product.image ?? FALLBACK_IMAGE} alt="" draggable={false} />
            </Link>
          ))}
        </div>
        <span className={styles.chip} aria-hidden="true">
          <i className={styles.dot} />
          {current.title} <b>{current.price}</b>
        </span>
      </div>

      <div className={styles.controls}>
        <button type="button" onClick={() => step(1)} aria-label={labels.prev}>
          <i className="fa-solid fa-chevron-left" />
        </button>
        <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? labels.play : labels.pause} aria-pressed={paused}>
          <i className={`fa-solid ${paused ? 'fa-play' : 'fa-pause'}`} />
        </button>
        <button type="button" onClick={() => step(-1)} aria-label={labels.next}>
          <i className="fa-solid fa-chevron-right" />
        </button>
      </div>

      <p className={styles.caption} aria-live="polite">
        <strong>{current.title}</strong> · {current.price}
        {current.excerpt ? <span>{current.excerpt}</span> : null}
      </p>
    </div>
  );
}
