/** Landing scroll-rail + header anchor config (keep in sync). */
export const LANDING_RAIL_REVEAL_PX = 96;

export const LANDING_SECTIONS = [
  {
    id: 'hero',
    label: 'Intro',
    headerLabel: null,
    pinned: false,
    presentationTitle: 'Welcome',
    hint: 'Paper-trade NSE names with charts, signals, and a social layer — no brokerage required.',
  },
  {
    id: 'trust',
    label: 'Trust',
    headerLabel: null,
    pinned: false,
    presentationTitle: 'Built for learners',
    hint: 'Simulated balances, real OHLC history, and privacy-conscious community feeds.',
  },
  {
    id: 'hub',
    label: 'Hub',
    headerLabel: 'Hub',
    pinned: true,
    presentationTitle: 'One desk for the full loop',
    hint: 'Stocks, signals, news, tribes, forum, portfolio, and leaderboard — without leaving Home.',
  },
  {
    id: 'flow',
    label: 'Flow',
    headerLabel: 'Flow',
    pinned: true,
    presentationTitle: 'How a session unfolds',
    hint: 'Research → paper trade → discuss → review P&L and rank — repeat until it clicks.',
  },
  {
    id: 'bento',
    label: 'Tools',
    headerLabel: 'Tools',
    pinned: true,
    presentationTitle: 'Depth when you need it',
    hint: 'Hindsight replays history, alerts watch high-confidence signals, charts span six ranges.',
  },
  {
    id: 'social',
    label: 'Voices',
    headerLabel: 'Voices',
    pinned: true,
    presentationTitle: 'Learning out loud',
    hint: 'Tribes, anonymised feed, and public profiles — compete on skill, not wallet size.',
  },
  {
    id: 'faq',
    label: 'FAQ',
    headerLabel: 'FAQ',
    pinned: true,
    presentationTitle: 'Good questions',
    hint: 'Paper money, ML signals, FinBot, privacy, and how often data refreshes.',
  },
  {
    id: 'cta',
    label: 'Start',
    headerLabel: null,
    pinned: true,
    presentationTitle: 'Open your paper desk',
    hint: 'Free signup · ₹10L virtual balance · start in under a minute.',
  },
];

export const LANDING_HEADER_SECTIONS = LANDING_SECTIONS.filter((s) => s.headerLabel);

export const LANDING_PINNED_SECTIONS = LANDING_SECTIONS.filter((s) => s.pinned);
