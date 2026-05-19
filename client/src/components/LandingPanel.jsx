/**
 * Full-viewport scroll-snap panel for the landing page.
 * @param {{
 *   id: string,
 *   pinned?: boolean,
 *   scrollable?: boolean,
 *   className?: string,
 *   style?: import('react').CSSProperties,
 *   children: import('react').ReactNode,
 * }} props
 */
export default function LandingPanel({
  id,
  pinned = false,
  scrollable = false,
  className = '',
  style,
  children,
}) {
  const classes = [
    'landing-panel',
    pinned && 'landing-panel--snap',
    scrollable && 'landing-panel--scroll',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section id={id} className={classes} style={style}>
      <div className="landing-panel__inner">{children}</div>
    </section>
  );
}
