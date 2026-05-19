import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  Cpu,
  Newspaper,
  PieChart,
  Clock,
  MessageCircle,
  ChevronDown,
  BellRing,
  Wallet,
  LineChart,
  Sparkles,
} from 'lucide-react';
import { APP_BASE } from '../constants/routes';
import { LANDING_PINNED_SECTIONS } from './landingSections.js';

const STEPS = [
  { icon: Wallet, title: 'Fund virtually', desc: 'Start with ₹10L practice money — no brokerage account or KYC required to learn.' },
  { icon: LineChart, title: 'Analyze & tilt', desc: 'Candle ranges, sentiment, and ML signals guide your simulated entries.' },
  { icon: MessageCircle, title: 'Discuss live', desc: "Tribes and Forum capture context you won't get from charts alone." },
  { icon: Sparkles, title: 'Iterate fast', desc: 'Hindsight and portfolio optimise let you replay and stress-test decisions.' },
];

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

/**
 * @param {{
 *   isAuthenticated: boolean,
 *   openFaq: number | null,
 *   setOpenFaq: (v: number | null) => void,
 * }} opts
 */
export function buildLandingDeckSlides({ isAuthenticated, openFaq, setOpenFaq }) {
  return LANDING_PINNED_SECTIONS.map((section, index) => {
    const kicker = `${String(index + 1).padStart(2, '0')} · ${section.label}`;
    const title = section.presentationTitle ?? section.label;
    const hint = section.hint ?? '';

    let children = null;
    if (section.id === 'hub') {
      children = (
        <div className="landing-deck-slide landing-deck-slide--hub landing-hub-grid">
          <article className="landing-card landing-card-enhanced">
            <TrendingUp className="landing-card-icon positive" aria-hidden />
            <h3>Stocks &amp; candles</h3>
            <p>OHLC ranges from daily snapshots through multi-year history — sentiment polls per ticker.</p>
          </article>
          <article className="landing-card landing-card-enhanced">
            <Cpu className="landing-card-icon" style={{ color: '#818cf8' }} aria-hidden />
            <h3>Signal board</h3>
            <p>BUY · HOLD · SELL with confidence and a short rationale from the models on your dashboard.</p>
          </article>
          <article className="landing-card landing-card-enhanced">
            <Users className="landing-card-icon" style={{ color: '#38bdf8' }} aria-hidden />
            <h3>Tribes &amp; forum</h3>
            <p>Rooms with polls and threaded Q&amp;A — learning out loud beats solo screens.</p>
          </article>
          <article className="landing-card landing-card-enhanced">
            <Newspaper className="landing-card-icon" style={{ color: '#fbbf24' }} aria-hidden />
            <h3>Market news</h3>
            <p>Market headlines with optional summaries and bullish or bearish tags for quick reads.</p>
          </article>
          <article className="landing-card landing-card-enhanced">
            <PieChart className="landing-card-icon" style={{ color: '#a78bfa' }} aria-hidden />
            <h3>Portfolio &amp; optimiser</h3>
            <p>Paper positions, optimisation suggestions, and leaderboard context — build allocation habits without risking capital.</p>
          </article>
        </div>
      );
    } else if (section.id === 'flow') {
      children = (
        <ol className="landing-deck-slide landing-deck-slide--flow landing-steps">
          {STEPS.map(({ icon: Icon, title: stepTitle, desc }, i) => (
            <li key={stepTitle} className="landing-step">
              <div className="landing-step-reveal">
                <span className="landing-step-num mono">{String(i + 1).padStart(2, '0')}</span>
                <div className="landing-step-body">
                  <Icon className="landing-step-icon" aria-hidden strokeWidth={1.75} />
                  <h3>{stepTitle}</h3>
                  <p>{desc}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      );
    } else if (section.id === 'bento') {
      children = (
        <div className="landing-deck-slide landing-deck-slide--bento landing-bento">
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
          <div className="landing-bento-cell">
            <BellRing className="landing-bento-ic" aria-hidden />
            <h3>Alerts &amp; feed</h3>
            <p>High-confidence ML nudges for watchlist tickers plus anonymised trade tape on Home.</p>
          </div>
          <div className="landing-bento-cell">
            <TrendingUp className="landing-bento-ic positive" aria-hidden />
            <h3>Charts that respond</h3>
            <p>Six ranges from a tight snapshot through multi-year daily history whenever data is available for the symbol.</p>
          </div>
          <div className="landing-bento-cell landing-bento-wide">
            <MessageCircle className="landing-bento-ic landing-bento-ic-blue" aria-hidden />
            <h3>Discuss before you size</h3>
            <p>Diligence tribeside — paste a ticker, run a poll, or link a Forum thread next to your chart.</p>
          </div>
        </div>
      );
    } else if (section.id === 'social') {
      children = (
        <div className="landing-deck-slide landing-deck-slide--social landing-deck-quotes" role="region" aria-label="Testimonials">
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
      );
    } else if (section.id === 'faq') {
      children = (
        <ul className="landing-deck-slide landing-deck-slide--faq landing-faq-list">
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
      );
    } else if (section.id === 'cta') {
      children = (
        <div className="landing-deck-slide landing-deck-slide--cta">
          <div className="landing-cta-inner">
            <div className="landing-cta-buttons">
              {isAuthenticated ? (
                <Link to={APP_BASE} className="btn btn-primary landing-hero-primary">Enter FinSocial</Link>
              ) : (
                <Link to="/auth" className="btn btn-primary landing-hero-primary">Create account — free</Link>
              )}
              <a className="landing-cta-secondary mono" href="#hero">Back to top ↑</a>
            </div>
          </div>
        </div>
      );
    }

    return {
      id: section.id,
      kicker,
      label: section.label,
      title,
      hint,
      children,
    };
  });
}
