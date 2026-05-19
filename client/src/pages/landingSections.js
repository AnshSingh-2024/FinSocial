/** Landing scroll-rail + header anchor config (keep in sync). */
export const LANDING_RAIL_REVEAL_PX = 96;

export const LANDING_SECTIONS = [
  {
    id: 'hero',
    label: 'Intro',
    headerLabel: null,
    pinned: false,
    presentationTitle: 'Welcome',
    hint: 'Scroll to explore charts, tribes, signals, and paper trading on one desk.',
  },
  {
    id: 'trust',
    label: 'Trust',
    headerLabel: null,
    pinned: false,
    presentationTitle: 'Built for clarity',
    hint: 'Secure sessions, live pipeline, and charts from days to ~2 years of history.',
  },
  {
    id: 'hub',
    label: 'Hub',
    headerLabel: 'Hub',
    pinned: true,
    presentationTitle: 'Everything in one hub',
    hint: 'Open stocks, signals, tribes, news, and portfolio without tab-hopping.',
  },
  {
    id: 'flow',
    label: 'Flow',
    headerLabel: 'Flow',
    pinned: true,
    presentationTitle: 'How traders use FinSocial',
    hint: 'Spot setups → size risk → discuss in tribes → iterate with Hindsight.',
  },
  {
    id: 'bento',
    label: 'Tools',
    headerLabel: 'Tools',
    pinned: true,
    presentationTitle: 'Toolbox',
    hint: 'Hindsight replays history; Alerts for ML nudges; charts span six ranges.',
  },
  {
    id: 'social',
    label: 'Voices',
    headerLabel: 'Voices',
    pinned: true,
    presentationTitle: 'Voices from the desk',
    hint: 'See how learners paper-trade together — tribes beat solo screens.',
  },
  {
    id: 'faq',
    label: 'FAQ',
    headerLabel: 'FAQ',
    pinned: true,
    presentationTitle: 'Questions answered',
    hint: 'Tap a row for paper trading, signals, tribes, and data refresh cadence.',
  },
  {
    id: 'cta',
    label: 'Start',
    headerLabel: null,
    pinned: true,
    presentationTitle: 'Ready to begin?',
    hint: 'Create a free account — ₹10L paper balance to practice.',
  },
];

export const LANDING_HEADER_SECTIONS = LANDING_SECTIONS.filter((s) => s.headerLabel);

export const LANDING_PINNED_SECTIONS = LANDING_SECTIONS.filter((s) => s.pinned);
