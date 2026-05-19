import { useEffect, useState } from 'react';

const SPY_THRESHOLDS = [0, 0.1, 0.25, 0.5, 0.75, 1];

/**
 * Tracks which landing section is most visible in the viewport.
 * @param {Array<{ id: string }>} sections
 * @returns {string} active section id
 */
export function useLandingSectionSpy(sections) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? 'hero');

  useEffect(() => {
    const sectionIds = sections.map((s) => s.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return undefined;

    const ratios = new Map();

    const pickActive = () => {
      let bestId = sectionIds[0];
      let bestRatio = -1;

      for (const id of sectionIds) {
        const ratio = ratios.get(id) ?? 0;
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      }

      if (bestRatio <= 0) {
        const scrollY = window.scrollY || 0;
        let lastAbove = sectionIds[0];
        for (const id of sectionIds) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= scrollY + 120) lastAbove = id;
        }
        setActiveId(lastAbove);
        return;
      }

      setActiveId(bestId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (id) ratios.set(id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        pickActive();
      },
      {
        rootMargin: '-42% 0px -42% 0px',
        threshold: SPY_THRESHOLDS,
      },
    );

    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      const anyVisible = [...ratios.values()].some((r) => r > 0);
      if (!anyVisible) pickActive();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    pickActive();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [sections]);

  return activeId;
}
