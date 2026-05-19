import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, Sparkles, LineChart } from 'lucide-react';

export default function HoldingTickerMenu({
  holding,
  onAiOverview,
  onViewCharts,
}) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const label = holding.displayTicker || holding.ticker;

  const updatePosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setMenuPos({ top: rect.bottom + 4, left: rect.left });
  };

  const toggle = (e) => {
    e.stopPropagation();
    if (!open) updatePosition();
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return undefined;

    const onDocClick = (e) => {
      if (
        menuRef.current?.contains(e.target)
        || triggerRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const onScroll = () => setOpen(false);

    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', onScroll, true);

    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [open]);

  const menu = open ? (
    <div
      ref={menuRef}
      className="holding-action-menu"
      role="menu"
      style={{ top: menuPos.top, left: menuPos.left }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        role="menuitem"
        className="holding-action-menu-item"
        onClick={() => {
          setOpen(false);
          onAiOverview(holding);
        }}
      >
        <Sparkles size={15} aria-hidden />
        AI overview
      </button>
      <button
        type="button"
        role="menuitem"
        className="holding-action-menu-item"
        onClick={() => {
          setOpen(false);
          onViewCharts(holding.ticker);
        }}
      >
        <LineChart size={15} aria-hidden />
        View charts
      </button>
    </div>
  ) : null;

  return (
    <>
      <div className="holding-ticker-row">
        <button
          ref={triggerRef}
          type="button"
          className="holding-ticker-chevron"
          aria-expanded={open}
          aria-haspopup="menu"
          aria-label={`Actions for ${label}`}
          onClick={toggle}
        >
          <ChevronRight size={14} className={open ? 'is-open' : ''} />
        </button>
        <span className="mono holding-ticker-name">{label}</span>
      </div>
      {typeof document !== 'undefined' && menu
        ? createPortal(menu, document.body)
        : null}
    </>
  );
}
