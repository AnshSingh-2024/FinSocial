import { useCallback } from 'react';

/**
 * @param {{
 *   sections: Array<{
 *     id: string,
 *     label: string,
 *     presentationTitle?: string,
 *     hint?: string,
 *   }>,
 *   scrollPct: number,
 *   activeId: string,
 *   revealed?: boolean,
 *   className?: string,
 * }} props
 */
export default function LandingScrollRail({
  sections,
  scrollPct,
  activeId,
  revealed = false,
  className = '',
}) {
  const activeIndex = Math.max(
    0,
    sections.findIndex((s) => s.id === activeId),
  );

  const fillScale = Math.min(100, Math.max(0, scrollPct)) / 100;
  const visibleClass = revealed ? ' landing-scroll-chrome--visible' : '';

  const jumpTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (window.history?.replaceState) {
      window.history.replaceState(null, '', `#${id}`);
    }
  }, []);

  return (
    <div
      className={`landing-scroll-chrome mono${visibleClass} ${className}`.trim()}
      aria-hidden={!revealed}
    >
      <aside className="landing-scroll-progress" aria-label="Scroll progress">
        <div className="landing-scroll-progress__glass">
          <div className="landing-scroll-progress__body">
            <div className="landing-scroll-progress__track" aria-hidden>
              <div
                className="landing-scroll-progress__fill"
                style={{ transform: `scaleY(${fillScale})` }}
              />
            </div>
            <div className="landing-scroll-progress__deck" aria-live="polite">
              <div
                className="landing-scroll-progress__deck-track"
                style={{ transform: `translateY(calc(-1 * ${activeIndex} * var(--rail-slide-h)))` }}
              >
                {sections.map((section) => (
                  <div key={section.id} className="landing-scroll-progress__slide">
                    <strong className="landing-scroll-progress__title">
                      {section.presentationTitle ?? section.label}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      <nav className="landing-scroll-dots" aria-label="Page sections">
        <div className="landing-scroll-dots__glass">
          <div className="landing-scroll-dots__track-mobile" aria-hidden>
            <div
              className="landing-scroll-dots__fill-mobile"
              style={{ transform: `scaleY(${fillScale})` }}
            />
          </div>
          <ol className="landing-scroll-dots__steps">
            {sections.map((section, index) => {
              const isActive = section.id === activeId;
              const isDone = index < activeIndex;
              let stateClass = 'landing-scroll-dots__dot--upcoming';
              if (isActive) stateClass = 'landing-scroll-dots__dot--active';
              else if (isDone) stateClass = 'landing-scroll-dots__dot--done';

              return (
                <li key={section.id} className="landing-scroll-dots__step">
                  <button
                    type="button"
                    className={`landing-scroll-dots__dot ${stateClass}`}
                    aria-label={`Jump to ${section.label}`}
                    aria-current={isActive ? 'true' : undefined}
                    onClick={() => jumpTo(section.id)}
                    tabIndex={revealed ? 0 : -1}
                  >
                    <span className="landing-scroll-dots__dot-core" aria-hidden />
                  </button>
                  <span
                    className={`landing-scroll-dots__label${isActive ? ' landing-scroll-dots__label--visible' : ''}`}
                  >
                    {section.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </nav>
    </div>
  );
}
