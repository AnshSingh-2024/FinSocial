import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** S-curve between first and last timeline dot (y coords in nav-local px). */
function buildTimelineCurvePath(y1, y2) {
  const span = y2 - y1;
  if (span < 12) return `M 8 ${y1} L 8 ${y2}`;
  const mid = y1 + span * 0.5;
  return `M 8 ${y1} Q 30 ${y1 + span * 0.28} 8 ${mid} Q -6 ${y1 + span * 0.72} 8 ${y2}`;
}

/**
 * @typedef {{
 *   id: string,
 *   kicker: string,
 *   label: string,
 *   title: string,
 *   hint: string,
 *   children: import('react').ReactNode,
 * }} LandingDeckSlide
 */

/**
 * Left timeline + right detail card (scroll-spy style deck).
 * @param {{
 *   slides: LandingDeckSlide[],
 *   activeId: string,
 *   onSelect: (id: string) => void,
 * }} props
 */
export default function LandingPresentationDeck({ slides, activeId, onSelect }) {
  const activeIndex = Math.max(
    0,
    slides.findIndex((s) => s.id === activeId),
  );
  const activeSlide = slides[activeIndex] ?? slides[0];
  const railRef = useRef(null);
  const curvePathRef = useRef(null);
  const prevIndexRef = useRef(activeIndex);
  const [slideDir, setSlideDir] = useState(1);
  const [curveLength, setCurveLength] = useState(0);
  const [curvePath, setCurvePath] = useState('');
  const [curveHeight, setCurveHeight] = useState(1);

  const progress =
    slides.length <= 1 ? 1 : activeIndex / (slides.length - 1);
  const progressOffset = curveLength * (1 - progress);

  const measureTimelineCurve = useCallback(() => {
    const nav = railRef.current;
    if (!nav) return;

    const dots = nav.querySelectorAll('.landing-deck-timeline__dot');
    if (dots.length < 2) return;

    const navRect = nav.getBoundingClientRect();
    const first = dots[0].getBoundingClientRect();
    const last = dots[dots.length - 1].getBoundingClientRect();

    const y1 = first.top + first.height / 2 - navRect.top;
    const y2 = last.top + last.height / 2 - navRect.top;

    setCurveHeight(Math.max(1, Math.ceil(navRect.height)));
    setCurvePath(buildTimelineCurvePath(y1, y2));
  }, []);

  useLayoutEffect(() => {
    measureTimelineCurve();
    const nav = railRef.current;
    if (!nav) return undefined;

    const ro = new ResizeObserver(() => measureTimelineCurve());
    ro.observe(nav);
    const list = nav.querySelector('.landing-deck-timeline__list');
    if (list) ro.observe(list);

    return () => ro.disconnect();
  }, [measureTimelineCurve, slides.length]);

  useLayoutEffect(() => {
    const path = curvePathRef.current;
    if (!path || !curvePath) return;
    setCurveLength(path.getTotalLength());
  }, [curvePath, curveHeight, activeIndex]);

  useEffect(() => {
    const prev = prevIndexRef.current;
    if (prev !== activeIndex) {
      setSlideDir(activeIndex > prev ? 1 : -1);
      prevIndexRef.current = activeIndex;
    }
    const id = window.setTimeout(measureTimelineCurve, 60);
    return () => window.clearTimeout(id);
  }, [activeIndex, measureTimelineCurve]);

  const animClass = slideDir >= 0
    ? 'landing-deck-detail__panel--fwd'
    : 'landing-deck-detail__panel--back';

  const select = useCallback((id) => {
    onSelect(id);
  }, [onSelect]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return undefined;
    const onKey = (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      const delta = e.key === 'ArrowDown' ? 1 : -1;
      const next = slides[activeIndex + delta];
      if (next) select(next.id);
    };
    rail.addEventListener('keydown', onKey);
    return () => rail.removeEventListener('keydown', onKey);
  }, [activeIndex, slides, select]);

  return (
    <div className="landing-deck">
      <nav
        ref={railRef}
        className="landing-deck-timeline"
        aria-label="Product tour"
        tabIndex={0}
      >
        {curvePath ? (
          <svg
            className="landing-deck-timeline__curve"
            viewBox={`0 0 48 ${curveHeight}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`Tour progress: step ${activeIndex + 1} of ${slides.length}`}
          >
            <defs>
              <linearGradient
                id="landing-deck-progress-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2={curveHeight}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#22c55e" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
            <path
              ref={curvePathRef}
              className="landing-deck-timeline__track"
              d={curvePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              className="landing-deck-timeline__progress"
              d={curvePath}
              fill="none"
              stroke="url(#landing-deck-progress-gradient)"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              strokeDasharray={curveLength || undefined}
              strokeDashoffset={curveLength ? progressOffset : undefined}
            />
          </svg>
        ) : null}
        <ol className="landing-deck-timeline__list">
          {slides.map((slide, index) => {
            const isActive = slide.id === activeId;
            const isDone = index < activeIndex;
            let state = 'upcoming';
            if (isActive) state = 'active';
            else if (isDone) state = 'done';

            return (
              <li key={slide.id} className={`landing-deck-timeline__item landing-deck-timeline__item--${state}`}>
                <button
                  type="button"
                  className="landing-deck-timeline__btn"
                  aria-current={isActive ? 'step' : undefined}
                  onClick={() => select(slide.id)}
                >
                  <span className="landing-deck-timeline__dot" aria-hidden />
                  <span className="landing-deck-timeline__copy">
                    <span className="landing-deck-timeline__kicker mono">{slide.kicker}</span>
                    <span className="landing-deck-timeline__label">{slide.label}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <article className="landing-deck-detail" aria-live="polite">
        <div className="landing-deck-detail__card">
          <header className="landing-deck-detail__head">
            <p className="landing-deck-detail__kicker mono">
              <span className="landing-deck-detail__kicker-text">{activeSlide.kicker}</span>
              <span className="landing-deck-detail__badge">{activeSlide.label}</span>
            </p>
            <h2 className="landing-deck-detail__title">{activeSlide.title}</h2>
            <p className="landing-deck-detail__hint">{activeSlide.hint}</p>
          </header>
          <div
            key={`body-${activeSlide.id}`}
            className={`landing-deck-detail__body landing-deck-detail__body--${activeSlide.id} landing-deck-detail__panel ${animClass}`}
          >
            {activeSlide.children}
          </div>
        </div>
      </article>
    </div>
  );
}
