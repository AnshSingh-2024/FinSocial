import React, { useState } from 'react';

/** Interactive poll for Tribe chat. */
export default function TribePollCard({ poll, counts, userVote, disabled, onVote }) {
  const [submitting, setSubmitting] = useState(false);
  const options = poll.options || [];
  const total = options.reduce((s, o) => s + (Number(counts[o]) || 0), 0);
  const maxBar = Math.max(1, ...options.map((o) => Number(counts[o]) || 0));

  const handleClick = async (opt) => {
    if (userVote || disabled) return;
    setSubmitting(true);
    try {
      await onVote(opt);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="tribe-poll-card">
      <div className="tribe-poll-title">{poll.question}</div>
      <div className="tribe-poll-options">
        {options.map((opt) => {
          const n = Number(counts[opt]) || 0;
          const pct = total > 0 ? Math.round((n / total) * 100) : 0;
          const sel = userVote === opt;
          return (
            <div key={opt} className="tribe-poll-row">
              <button
                type="button"
                className={`tribe-poll-vote-btn ${sel ? 'active' : ''}`}
                onClick={() => handleClick(opt)}
                disabled={Boolean(userVote) || submitting || disabled}
              >
                {opt}
              </button>
              <div className="tribe-poll-meter">
                <div className="tribe-poll-meter-fill" style={{ width: `${(n / maxBar) * 100}%` }} />
              </div>
              <span className="tribe-poll-pct">{n} ({pct}%)</span>
            </div>
          );
        })}
      </div>
      <div className="tribe-poll-hint">
        {userVote
          ? <>You voted <strong>{userVote}</strong> · {total} vote{total === 1 ? '' : 's'}</>
          : submitting
            ? 'Submitting…'
            : 'Tap an option to vote'}
      </div>
    </div>
  );
}
