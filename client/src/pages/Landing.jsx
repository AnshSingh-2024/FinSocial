import { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import {
  TrendingUp,
  Users,
  Cpu,
  Newspaper,
  PieChart,
  Clock,
  Zap,
  Shield,
  BarChart3,
  MessageCircle,
  Sparkles,
  ChevronDown,
  ArrowRight,
  LineChart,
  BellRing,
  Wallet,
} from 'lucide-react';
import useStore from '../store';
import { APP_BASE } from '../constants/routes';
import LandingSceneContent from './LandingScene.jsx';
import { LandingScrollYRef } from './landingScrollContext.jsx';

const MARQUEE_ITEMS = [
  { text: 'NIFTY 50 ▲ simulated' },
  { text: 'Portfolio P&L live', className: 'positive' },
  { text: 'ML signals' },
  { text: 'News & AI briefs' },
  { text: 'Live tribes' },
  { text: 'Paper ₹10L' },
];

function MarqueeStripContent({ idPrefix = '' }) {
  return MARQUEE_ITEMS.map((item) => (
    <span key={`${idPrefix}${item.text}`} className={item.className}>
      {item.text}
      <span className="landing-marquee-sep" aria-hidden> · </span>
    </span>
  ));
}

/** Two copies in one row; CSS -50% = one copy width (animates after fonts load). */

function LandingMarquee() {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = () => {
      if (!cancelled) setAnimate(true);
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(start).catch(start);
    } else {
      start();
    }
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="landing-marquee mono" aria-hidden>
      <div className="landing-marquee-track">
        <div
          className={`landing-marquee-strip${animate ? ' landing-marquee-strip--animate' : ''}`}
        >
          <div className="landing-marquee-copy">
            <MarqueeStripContent idPrefix="a-" />
          </div>
          <div className="landing-marquee-copy" aria-hidden>
            <MarqueeStripContent idPrefix="b-" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SceneFallback() {
  return (
    <div
      style={{
        height: '100%',
        background: 'linear-gradient(160deg, #ffffff 0%, #fafbfc 50%, #f8f9fa 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#868e96',
        fontSize: '0.85rem',
      }}
    >
      Loading…
    </div>
  );
}

function Reveal({ children, className = '', delay = 0, id }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setOn(true);
        });
      },
      { rootMargin: '0px 0px -40px 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      id={id}
      ref={ref}
      className={`landing-reveal-wrap ${className}`}
      data-visible={on}
      style={{ transitionDelay: on ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}

function AnimatedStat({ value, label, suffix = '', prefix = '' }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const [go, setGo] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setGo(true);
    }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!go) return;
    const duration = 1100;
    const start = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - start) / duration);
      const eased = 1 - (1 - k) ** 3;
      setN(Math.floor(value * eased));
      if (k < 1) requestAnimationFrame(step);
      else setN(value);
    };
    requestAnimationFrame(step);
  }, [go, value]);

  return (
    <div ref={ref} className="landing-stat-pill mono">
      <span className="landing-stat-value">
        {prefix}
        {n.toLocaleString('en-IN')}
        {suffix}
      </span>
      <span className="landing-stat-label">{label}</span>
    </div>
  );
}

const FAQ_ITEMS = [
  {
    q: 'Is FinSocial real money?',
    a: "No — it's a simulated brokerage. You trade with virtual balance and replay historical prices so you can learn without capital risk.",
  },
  {
    q: 'What data powers the charts?',
    a: 'Charts use historical open-high-low-close and volume; quotes and ranges update as fresh prices arrive for each symbol.',
  },
  {
    q: 'How do ML signals work?',
    a: 'For each ticker, the app runs an ML outlook and surfaces BUY · HOLD · SELL with confidence and a short rationale on your dashboard.',
  },
  {
    q: 'Who sees my trades on the feed?',
    a: 'Community feed events are anonymized — others see pseudonyms like Trader #ABC1 while you still see yourself as «You» when logged in.',
  },
];

const STEPS = [
  { icon: Wallet, title: 'Fund virtually', desc: 'Start with ₹10L practice money — no brokerage account or KYC required to learn.' },
  { icon: LineChart, title: 'Analyze & tilt', desc: 'Candle ranges, sentiment, and ML signals guide your simulated entries.' },
  { icon: MessageCircle, title: 'Discuss live', desc: "Tribes and Forum capture context you won't get from charts alone." },
  { icon: Sparkles, title: 'Iterate fast', desc: 'Hindsight and portfolio optimise let you replay and stress-test decisions.' },
];

export default function Landing() {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const [scrollPct, setScrollPct] = useState(0);
  const [scrolledNav, setScrolledNav] = useState(false);
  const [openFaq, setOpenFaq] = useState(/** @type {number | null} */ (null));
  const landingScrollYRef = useRef(0);

  useEffect(() => {
    document.body.dataset.page = 'landing';
    document.body.style.overflow = 'auto';
    document.documentElement.style.setProperty('--landing-parallax-y', '0px');
    document.documentElement.style.setProperty('--landing-parallax-x', '0px');
    document.documentElement.style.setProperty('--landing-parallax-scale', '1');
    return () => {
      delete document.body.dataset.page;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.removeProperty('--landing-parallax-y');
      document.documentElement.style.removeProperty('--landing-parallax-x');
      document.documentElement.style.removeProperty('--landing-parallax-scale');
    };
  }, []);

  const onScroll = useCallback(() => {
    const y = window.scrollY || 0;
    landingScrollYRef.current = y;
    setScrolledNav(y > 32);
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = (y / max) * 100;
    const prog = max > 0 ? y / max : 0;
    setScrollPct(pct);
    doc.style.setProperty('--landing-parallax-y', `${y * -0.068}px`);
    doc.style.setProperty('--landing-parallax-x', `${Math.sin(prog * Math.PI) * 10}px`);
    doc.style.setProperty('--landing-parallax-scale', String(1 + prog * 0.045));
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', onScroll, { passive: true });
    const id = requestAnimationFrame(() => {
      onScroll();
    });
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('scroll', onScroll);
    };
  }, [onScroll]);

  return (
    <LandingScrollYRef.Provider value={landingScrollYRef}>
    <div className="landing-root">
      <div
        className="landing-scroll-progress"
        style={{ transform: `scaleX(${Math.min(100, Math.max(0, scrollPct)) / 100})` }}
        aria-hidden
      />

      <div className="landing-canvas-wrap" aria-hidden>
        <div className="landing-canvas-parallax-stack">
          <Suspense fallback={<SceneFallback />}>
            <Canvas
              dpr={[1, 2]}
              camera={{ position: [0.45, 0.35, 8.6], fov: 42, near: 0.1, far: 80 }}
              gl={{ alpha: false, antialias: true, powerPreference: 'high-performance' }}
            >
              <LandingSceneContent />
            </Canvas>
          </Suspense>
          <div className="landing-canvas-overlay" />
        </div>
      </div>

      <header className={`landing-header ${scrolledNav ? 'landing-header-scrolled' : ''}`}>
        <Link to="/" className="landing-logo-link">
          <svg viewBox="0 0 28 28" fill="none" width="28" height="28" aria-hidden>
            <rect width="28" height="28" rx="6" fill="#f8fafc" />
            <path d="M7 20V12l5-4v12M16 20V8l5-4v16" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" />
          </svg>
          FinSocial
        </Link>

        <nav className="landing-nav-center mono" aria-label="Page sections">
          <a href="#hub" className="landing-anchor">Hub</a>
          <a href="#flow" className="landing-anchor">Flow</a>
          <a href="#bento" className="landing-anchor">Tools</a>
          <a href="#social" className="landing-anchor">Voices</a>
          <a href="#faq" className="landing-anchor">FAQ</a>
        </nav>

        <nav className="landing-nav">
          {isAuthenticated ? (
            <Link to={APP_BASE} className="btn btn-primary landing-cta-main">Open app</Link>
          ) : (
            <>
              <Link to="/auth" className="landing-link">Sign in</Link>
              <Link to="/auth" className="btn btn-primary landing-cta-main">Get started</Link>
            </>
          )}
        </nav>
      </header>

      <main className="landing-main">
        <section className="landing-hero-stack landing-snap-section landing-snap-hero">
          <div className="landing-hero-copy">
            <p className="landing-kicker mono">India · simulated investing · social edge</p>
            <h1 className="landing-headline">
              Trade together.
              {' '}
              <span className="landing-accent">Grow smarter.</span>
            </h1>
            <p className="landing-lead">
              A community-first paper-trading desk: tribe rooms, Q&amp;A, signals, news, and portfolios together.
              A live candlestick backdrop stays visible as you scroll, and the navigation stays at hand so context never slips away.
            </p>

            <div className="landing-hero-actions">
              {isAuthenticated ? (
                <Link to={APP_BASE} className="btn btn-primary landing-hero-primary">Continue to dashboard</Link>
              ) : (
                <Link to="/auth" className="btn btn-primary landing-hero-primary">Create free account</Link>
              )}
              <a className="landing-ghost-link" href="#hub">
                Explore features <ArrowRight size={14} aria-hidden />
              </a>
            </div>

            <LandingMarquee />

            <div className="landing-hero-metrics">
              <AnimatedStat value={1000000} prefix="₹" label="Starting paper balance" />
              <AnimatedStat value={560} suffix="+" label="Trading days of history (≈2y)" />
              <AnimatedStat value={5} suffix=" min" label="Typical signal refresh" />
              <AnimatedStat value={30} suffix=" min" label="Typical news refresh" />
            </div>
          </div>

          <p className="landing-scroll-hint mono">
            Scroll
            {' '}
            <span className="landing-scroll-bounce">↓</span>
          </p>
        </section>

        <Reveal className="landing-trust landing-snap-section">
          <div>
            <p className="landing-trust-title mono">Built for clarity and momentum</p>
            <div className="landing-trust-pills">
              <span><Shield size={14} aria-hidden /> Secure sessions</span>
              <span><Cpu size={14} aria-hidden /> Reliable price pipeline</span>
              <span><Zap size={14} aria-hidden /> Live updates</span>
              <span><BarChart3 size={14} aria-hidden /> Charts from days to ~2 years</span>
            </div>
          </div>
        </Reveal>

        <section className="landing-features landing-section-pad landing-snap-section" id="hub">
          <Reveal>
            <div>
              <h2 className="landing-section-title">Everything in one hub</h2>
              <p className="landing-section-sub">Pick a capability — each card expands your desk without hopping tabs.</p>
            </div>
          </Reveal>
          <div className="landing-feature-grid landing-feature-grid-relaxed">
            <Reveal delay={60}>
              <article className="landing-card tilt-3d landing-card-enhanced">
                <TrendingUp className="landing-card-icon positive" aria-hidden />
                <h3>Stocks &amp; candles</h3>
                <p>OHLC ranges from daily snapshots through multi-year history — sentiment polls per ticker.</p>
              </article>
            </Reveal>
            <Reveal delay={100}>
              <article className="landing-card tilt-3d landing-card-enhanced">
                <Cpu className="landing-card-icon" style={{ color: '#818cf8' }} aria-hidden />
                <h3>Signal board</h3>
                <p>BUY · HOLD · SELL with confidence and a short rationale from the models on your dashboard.</p>
              </article>
            </Reveal>
            <Reveal delay={140}>
              <article className="landing-card tilt-3d landing-card-enhanced">
                <Users className="landing-card-icon" style={{ color: '#38bdf8' }} aria-hidden />
                <h3>Tribes &amp; forum</h3>
                <p>Rooms with polls and threaded Q&amp;A — learning out loud beats solo screens.</p>
              </article>
            </Reveal>
            <Reveal delay={180}>
              <article className="landing-card tilt-3d landing-card-enhanced">
                <Newspaper className="landing-card-icon" style={{ color: '#fbbf24' }} aria-hidden />
                <h3>Market news</h3>
                <p>Market headlines with optional summaries and bullish or bearish tags for quick reads.</p>
              </article>
            </Reveal>
            <Reveal delay={220}>
              <article className="landing-card tilt-3d landing-card-enhanced landing-card-span2">
                <PieChart className="landing-card-icon" style={{ color: '#a78bfa' }} aria-hidden />
                <h3>Portfolio &amp; optimiser</h3>
                <p>Paper positions, optimisation suggestions, and leaderboard context — build allocation habits without risking capital.</p>
              </article>
            </Reveal>
          </div>
        </section>

        <section className="landing-how landing-section-pad landing-snap-section" id="flow">
          <Reveal>
            <div>
              <h2 className="landing-section-title">How traders use FinSocial</h2>
              <p className="landing-section-sub">A playbook you remix — hover each step for depth.</p>
            </div>
          </Reveal>
          <ol className="landing-steps">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <li key={title} className="landing-step">
                <Reveal delay={i * 80} className="landing-step-reveal">
                  <span className="landing-step-num mono">{String(i + 1).padStart(2, '0')}</span>
                  <div className="landing-step-body">
                    <Icon className="landing-step-icon" aria-hidden strokeWidth={1.75} />
                    <h3>{title}</h3>
                    <p>{desc}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <section className="landing-bento-section landing-section-pad landing-snap-section" id="bento">
          <Reveal>
            <div>
              <h2 className="landing-section-title">Toolbox</h2>
              <p className="landing-section-sub">Modules you reopen every session.</p>
            </div>
          </Reveal>
          <div className="landing-bento">
            <Reveal delay={50}>
              <div className="landing-bento-cell landing-bento-wide">
                <Clock className="landing-bento-ic" aria-hidden />
                <h3>Hindsight</h3>
                <p>Pick a historical date with price history — simulate sizing and compound forward against today&apos;s reference.</p>
                {isAuthenticated ? (
                  <Link className="landing-bento-link" to={`${APP_BASE}/hindsight`}>Open Hindsight →</Link>
                ) : (
                  <Link className="landing-bento-link" to="/auth">Sign in to try →</Link>
                )}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="landing-bento-cell">
                <BellRing className="landing-bento-ic" aria-hidden />
                <h3>Alerts &amp; feed</h3>
                <p>High-confidence ML nudges for watchlist tickers plus anonymised trade tape on Home.</p>
              </div>
            </Reveal>
            <Reveal delay={150}>
              <div className="landing-bento-cell">
                <TrendingUp className="landing-bento-ic positive" aria-hidden />
                <h3>Charts that respond</h3>
                <p>Six ranges from a tight snapshot through multi-year daily history whenever data is available for the symbol.</p>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="landing-bento-cell landing-bento-wide">
                <MessageCircle className="landing-bento-ic landing-bento-ic-blue" aria-hidden />
                <h3>Discuss before you size</h3>
                <p>Diligence tribeside — paste a ticker, run a poll, or link a Forum thread next to your chart.</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="landing-social landing-section-pad landing-snap-section" id="social">
          <Reveal>
            <div>
              <h2 className="landing-section-title">Voices from the desk</h2>
              <p className="landing-section-sub">What learners say about practising on FinSocial.</p>
            </div>
          </Reveal>
          <div className="landing-carousel" role="region" aria-label="Testimonials carousel">
            {[
              { quote: 'I finally clicked how RSI clashes with tape — Tribe beside RELIANCE was worth the rabbit hole.', who: 'Retail learner, Mumbai' },
              { quote: 'Paper P&L and the leaderboard made practice sessions competitive without real money on the line.', who: 'Study-circle lead, Delhi' },
              { quote: 'Anonymised flow means I can read whale-ish size without creeping real names.', who: 'Swing hobbyist, BLR' },
            ].map((t, i) => (
              <blockquote key={t.who + i} className="landing-quote">
                <p>{`"${t.quote}"`}</p>
                <footer className="mono">{t.who}</footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className="landing-faq landing-section-pad landing-snap-section" id="faq">
          <Reveal>
            <div>
              <h2 className="landing-section-title">FAQ</h2>
              <p className="landing-section-sub">Tap a row to expand.</p>
            </div>
          </Reveal>
          <ul className="landing-faq-list">
            {FAQ_ITEMS.map((item, idx) => {
              const open = openFaq === idx;
              return (
                <li key={item.q} className="landing-faq-item">
                  <button
                    type="button"
                    className={`landing-faq-q ${open ? 'open' : ''}`}
                    onClick={() => setOpenFaq(open ? null : idx)}
                    aria-expanded={open}
                  >
                    <span>{item.q}</span>
                    <ChevronDown className="landing-faq-chevron" size={18} aria-hidden />
                  </button>
                  <div className={`landing-faq-a ${open ? 'open' : ''}`} aria-hidden={!open}>
                    {item.a}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <Reveal className="landing-cta-band landing-snap-section" id="cta">
          <div className="landing-cta-inner">
            <h2>Ready to paper-trade with the tribe?</h2>
            <p>Open the dashboard and jump back into your paper portfolio anytime.</p>
            <div className="landing-cta-buttons">
              {isAuthenticated ? (
                <Link to={APP_BASE} className="btn btn-primary landing-hero-primary">Enter FinSocial</Link>
              ) : (
                <Link to="/auth" className="btn btn-primary landing-hero-primary">Create account — free</Link>
              )}
              <a className="landing-cta-secondary mono" href="#hub">Back to top ↑</a>
            </div>
          </div>
        </Reveal>

        <footer className="landing-footer mono landing-snap-section landing-snap-footer">
          <div className="landing-footer-links">
            <Link to="/" className="landing-footer-link">Home</Link>
            <a href="#faq" className="landing-footer-link">FAQ</a>
            {isAuthenticated ? (
              <Link to={`${APP_BASE}/forum`} className="landing-footer-link">Forum →</Link>
            ) : (
              <Link to="/auth" className="landing-footer-link">Forum (sign in) →</Link>
            )}
          </div>
          <span>© {new Date().getFullYear()} FinSocial</span>
          <Link to="/auth" className="landing-footer-link">Sign in →</Link>
        </footer>
      </main>
    </div>
    </LandingScrollYRef.Provider>
  );
}
