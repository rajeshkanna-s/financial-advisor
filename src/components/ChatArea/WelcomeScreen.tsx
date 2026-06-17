import { BsBank2 } from 'react-icons/bs';
import './WelcomeScreen.css';

interface WelcomeScreenProps {
  onSendMessage: (content: string, category?: string) => void;
}

const suggestedQuestions = [
  { text: 'How should I start investing with ₹5,000/month?', category: 'investment-management' },
  { text: 'What is the 50/30/20 budgeting rule?', category: 'financial-planning' },
  { text: 'PPF vs NPS — which is better for retirement?', category: 'retirement-planning' },
  { text: 'How can I save more on taxes this year?', category: 'tax-planning' },
  { text: 'How much life insurance coverage do I need?', category: 'insurance-risk' },
  { text: 'What are the best books on personal finance?', category: 'books-resources' },
];

export default function WelcomeScreen({ onSendMessage }: WelcomeScreenProps) {
  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-hero">
          <div className="welcome-icon">
            <BsBank2 size={28} />
          </div>
          <h1 className="welcome-title">Financial Advisor AI</h1>
        </div>
        <p className="welcome-subtitle">
          Your intelligent companion for financial planning, investments, tax optimization, and more.
        </p>

        <div className="suggested-questions">
          <h4>Try asking</h4>
          <div className="questions-grid">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                className="question-btn"
                onClick={() => onSendMessage(q.text, q.category)}
              >
                {q.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
