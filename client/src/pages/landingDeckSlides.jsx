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
  { icon: Wallet, title: 'Create & fund', desc: 'Sign up free and get ₹10L paper cash — no broker link, no KYC, no real orders.' },
  { icon: LineChart, title: 'Read the tape', desc: 'Open any NSE ticker: six chart ranges, community sentiment, and ML BUY · HOLD · SELL on the dashboard.' },
  { icon: MessageCircle, title: 'Trade & talk', desc: 'Execute simulated buys and sells, then debrief in Tribe rooms, Forum threads, or with FinBot.' },
  { icon: Sparkles, title: 'Review & rank', desc: 'Track portfolio P&L, replay dates in Hindsight, follow profiles, and climb the weekly leaderboard.' },
];

const FAQ_ITEMS = [
  {
    q: 'Is this real money trading?',
    a: 'No. FinSocial is a simulated desk — every trade uses your virtual balance and stored market prices. Nothing is sent to a live broker.',
  },
  {
    q: 'What stocks and charts are available?',
    a: 'The demo ships with ~25 NSE tickers (e.g. RELIANCE, TCS, INFY). Charts use OHLCV history from the database; live quotes refresh on a schedule when market data APIs are configured.',
  },
  {
    q: 'How do ML signals work?',
    a: 'An XGBoost model scores each ticker for BUY, HOLD, or SELL with confidence and a short rationale. Signals refresh on a cron (about every five minutes) and can be triggered manually from Home. Community sentiment is blended into the stored confidence score.',
  },
  {
    q: 'What is FinBot?',
    a: 'FinBot is an in-app assistant powered by Gemini with optional RAG over your docs and market context. Use it from the floating chat or inside Tribe channels when you want a second opinion.',
  },
  {
    q: 'Who sees my activity?',
    a: 'The community feed anonymises other traders (e.g. Trader #A1B2). You see yourself as «You». Profiles and leaderboard show public stats and holdings tickers — not your email.',
  },
  {
    q: 'Does it cost anything?',
    a: 'The demo is free to use. You only need an account to persist portfolio, watchlist, tribes, and forum activity.',
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
            <h3>Stocks &amp; charts</h3>
            <p>TradingView-style candles from intraday through multi-year history, plus per-ticker bullish / bearish polls.</p>
          </article>
          <article className="landing-card landing-card-enhanced">
            <Cpu className="landing-card-icon" style={{ color: '#818cf8' }} aria-hidden />
            <h3>ML signal board</h3>
            <p>XGBoost verdicts with confidence, reasoning, and optional probability breakdown on the Stocks table.</p>
          </article>
          <article className="landing-card landing-card-enhanced">
            <Users className="landing-card-icon" style={{ color: '#38bdf8' }} aria-hidden />
            <h3>Tribe, Forum &amp; FinBot</h3>
            <p>Real-time tribe rooms with polls, threaded forum Q&amp;A, and a Gemini-powered assistant when you are stuck.</p>
          </article>
          <article className="landing-card landing-card-enhanced">
            <Newspaper className="landing-card-icon" style={{ color: '#fbbf24' }} aria-hidden />
            <h3>News &amp; live feed</h3>
            <p>Headlines with AI summaries on Home, plus an anonymised trade tape so you can read flow without doxxing.</p>
          </article>
          <article className="landing-card landing-card-enhanced">
            <PieChart className="landing-card-icon" style={{ color: '#a78bfa' }} aria-hidden />
            <h3>Portfolio &amp; ranks</h3>
            <p>Paper positions, allocation hints, public profiles, and weekly / monthly / all-time leaderboards.</p>
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
            <p>Pick a past session date, size a hypothetical trade, and see how it would have compounded against today&apos;s price.</p>
            {isAuthenticated ? (
              <Link className="landing-bento-link" to={`${APP_BASE}/hindsight`}>Open Hindsight →</Link>
            ) : (
              <Link className="landing-bento-link" to="/auth">Sign in to try →</Link>
            )}
          </div>
          <div className="landing-bento-cell">
            <BellRing className="landing-bento-ic" aria-hidden />
            <h3>Price alerts</h3>
            <p>Set watchlist alerts when ML confidence crosses your threshold — notifications land in-app when Redis is up.</p>
          </div>
          <div className="landing-bento-cell">
            <TrendingUp className="landing-bento-ic positive" aria-hidden />
            <h3>Six chart ranges</h3>
            <p>From 1D through ~2Y daily bars; the dashboard chart polls intraday while you watch a single name.</p>
          </div>
          <div className="landing-bento-cell landing-bento-wide">
            <MessageCircle className="landing-bento-ic landing-bento-ic-blue" aria-hidden />
            <h3>Profiles &amp; copy context</h3>
            <p>Tap leaderboard rows or holdings to open trader profiles, then jump straight into that stock&apos;s chart.</p>
          </div>
        </div>
      );
    } else if (section.id === 'social') {
      children = (
        <div className="landing-deck-slide landing-deck-slide--social landing-deck-quotes" role="region" aria-label="Testimonials">
          {[
            { quote: 'Signals plus tribe chat finally connected RSI noise to what people were actually doing on RELIANCE.', who: 'Paper trader, Mumbai' },
            { quote: 'We ran a weekly leaderboard in our study group — competitive without anyone risking tuition money.', who: 'Campus investing club, Pune' },
            { quote: 'FinBot answered my margin question while the Forum thread stayed focused on the chart setup.', who: 'First-time investor, Bengaluru' },
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
            <h2>Your paper desk is one signup away</h2>
            <p>
              Build habits on NSE names with charts, ML signals, and a community that trades in the open —
              simulated balances only, no financial advice.
            </p>
            <div className="landing-cta-buttons">
              {isAuthenticated ? (
                <Link to={APP_BASE} className="btn btn-primary landing-hero-primary">Go to dashboard</Link>
              ) : (
                <Link to="/auth" className="btn btn-primary landing-hero-primary">Create free account</Link>
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
