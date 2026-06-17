import { BsBank2 } from 'react-icons/bs';
import './WelcomeScreen.css';

interface WelcomeScreenProps {
  onSendMessage: (content: string, category?: string) => void;
}

const suggestedQuestions = [
  { text: 'Build me a complete financial plan for a ₹10 LPA salary', category: 'financial-planning' },
  { text: 'Compare SIP vs Lump Sum — which builds more wealth?', category: 'investment-management' },
  { text: 'How to save ₹5 Lakh+ in taxes using Section 80C, 80D & HRA?', category: 'tax-planning' },
  { text: 'What is the right retirement corpus I need to retire at 50?', category: 'retirement-planning' },
  { text: 'Explain stock valuation — P/E ratio, DCF & fundamental analysis', category: 'accounting-corporate' },
  { text: 'Term insurance vs Whole life — which one should I buy?', category: 'insurance-risk' },
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
