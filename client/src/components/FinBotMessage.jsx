import ReactMarkdown from 'react-markdown';
import { normalizeFinbotMarkdown } from '../utils/finbotMarkdown';

export default function FinBotMessage({ role, content }) {
  if (role === 'user') {
    return <div className="chatbot-msg user">{content}</div>;
  }

  const markdown = normalizeFinbotMarkdown(content);

  return (
    <div className="chatbot-msg bot">
      <div className="chatbot-markdown">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
