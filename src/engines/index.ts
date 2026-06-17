import type { EngineData, Category } from '../types';
import { financialPlanningEngine } from './financial-planning';
import { investmentManagementEngine } from './investment-management';
import { retirementPlanningEngine } from './retirement-planning';
import { taxPlanningEngine } from './tax-planning';
import { insuranceRiskEngine } from './insurance-risk';
import { estatePlanningEngine } from './estate-planning';
import { debtManagementEngine } from './debt-management';
import { behavioralFinanceEngine } from './behavioral-finance';
import { regulatoryComplianceEngine } from './regulatory-compliance';
import { economicsMarketEngine } from './economics-market';
import { bookResources, webResources, booksAndResourcesContext } from './books-resources';
import { advisorySkillsEngine } from './advisory-skills';
import { fintechToolsEngine } from './fintech-tools';
import { accountingCorporateEngine } from './accounting-corporate';

export const allEngines: EngineData[] = [
  financialPlanningEngine,
  investmentManagementEngine,
  retirementPlanningEngine,
  taxPlanningEngine,
  insuranceRiskEngine,
  estatePlanningEngine,
  debtManagementEngine,
  behavioralFinanceEngine,
  regulatoryComplianceEngine,
  economicsMarketEngine,
  advisorySkillsEngine,
  fintechToolsEngine,
  accountingCorporateEngine,
];

export const categories: Category[] = [
  {
    id: 'financial-planning',
    name: 'Financial Planning',
    icon: 'BsGraphUpArrow',
    description: 'Budgeting, cash flow, goal setting',
    color: '#4CAF50',
  },
  {
    id: 'investment-management',
    name: 'Investments',
    icon: 'BsBarChartLine',
    description: 'Stocks, bonds, mutual funds, ETFs',
    color: '#2196F3',
  },
  {
    id: 'retirement-planning',
    name: 'Retirement',
    icon: 'BsHouseDoor',
    description: 'Pension, 401(k), PPF, NPS',
    color: '#FF9800',
  },
  {
    id: 'tax-planning',
    name: 'Tax Planning',
    icon: 'BsCalculator',
    description: 'Income tax, capital gains, deductions',
    color: '#9C27B0',
  },
  {
    id: 'insurance-risk',
    name: 'Insurance',
    icon: 'BsShieldCheck',
    description: 'Life, health, risk management',
    color: '#F44336',
  },
  {
    id: 'estate-planning',
    name: 'Estate Planning',
    icon: 'BsFileEarmarkText',
    description: 'Wills, trusts, succession',
    color: '#795548',
  },
  {
    id: 'debt-management',
    name: 'Debt Management',
    icon: 'BsCreditCard2Back',
    description: 'Loans, credit, debt reduction',
    color: '#E91E63',
  },
  {
    id: 'behavioral-finance',
    name: 'Behavioral Finance',
    icon: 'BsLightbulb',
    description: 'Psychology, biases, decisions',
    color: '#00BCD4',
  },
  {
    id: 'regulatory-compliance',
    name: 'Regulations',
    icon: 'BsBank',
    description: 'SEBI/SEC, fiduciary, compliance',
    color: '#607D8B',
  },
  {
    id: 'economics-market',
    name: 'Economics',
    icon: 'BsGlobe2',
    description: 'Macro, interest rates, markets',
    color: '#FF5722',
  },
  {
    id: 'advisory-skills',
    name: 'Advisory Skills',
    icon: 'BsPeople',
    description: 'Communication, sales, practice management',
    color: '#8BC34A',
  },
  {
    id: 'fintech-tools',
    name: 'FinTech Tools',
    icon: 'BsLaptop',
    description: 'Bloomberg, Excel, CRM, software',
    color: '#00ACC1',
  },
  {
    id: 'accounting-corporate',
    name: 'Accounting & Corp Finance',
    icon: 'BsJournalBookmark',
    description: 'Financial statements, valuation, ratios',
    color: '#6D4C41',
  },
  {
    id: 'books-resources',
    name: 'Books & Resources',
    icon: 'BsBook',
    description: 'Recommended reading & websites',
    color: '#3F51B5',
  },
  {
    id: 'general',
    name: 'General',
    icon: 'BsChatDots',
    description: 'Ask anything about finance',
    color: '#009688',
  },
];

export function getEngineByCategory(category: string): EngineData | undefined {
  return allEngines.find(e => e.category === category);
}

export function getEngineContext(category: string): string {
  if (category === 'books-resources') {
    return booksAndResourcesContext;
  }

  if (category === 'general') {
    return getAllEnginesContext();
  }

  const engine = getEngineByCategory(category);
  if (!engine) return getAllEnginesContext();

  return formatEngineToContext(engine);
}

function formatEngineToContext(engine: EngineData): string {
  let context = `DOMAIN: ${engine.title}\n${engine.description}\n\n`;

  for (const topic of engine.topics) {
    context += `## ${topic.name}\n${topic.description}\n`;
    context += topic.details.map(d => `- ${d}`).join('\n') + '\n';

    if (topic.subtopics) {
      for (const sub of topic.subtopics) {
        context += `\n### ${sub.name}\n${sub.description}\n`;
        context += sub.details.map(d => `- ${d}`).join('\n') + '\n';
      }
    }
    context += '\n';
  }

  context += '\nKEY TERMS:\n';
  for (const term of engine.keyTerms) {
    context += `- ${term.term}: ${term.definition}\n`;
  }

  context += '\nPRACTICAL TIPS:\n';
  for (const tip of engine.tips) {
    context += `- ${tip}\n`;
  }

  context += '\nFREQUENTLY ASKED QUESTIONS:\n';
  for (const faq of engine.faqs) {
    context += `Q: ${faq.question}\nA: ${faq.answer}\n\n`;
  }

  return context;
}

function getAllEnginesContext(): string {
  let context = 'You are a comprehensive financial advisor with expertise in:\n\n';
  for (const engine of allEngines) {
    context += `- ${engine.title}: ${engine.description}\n`;
  }
  context += `\nYou also have knowledge of recommended financial books and resources:\n${booksAndResourcesContext}\n`;
  context += '\nKey areas summary:\n';
  for (const engine of allEngines) {
    context += `\n## ${engine.title}\n`;
    for (const topic of engine.topics) {
      context += `- ${topic.name}: ${topic.description}\n`;
    }
  }
  return context;
}

export function detectCategory(message: string): string {
  const lower = message.toLowerCase();
  const categoryKeywords: Record<string, string[]> = {
    'financial-planning': ['budget', 'budgeting', 'cash flow', 'emergency fund', 'savings', 'financial plan', 'goal setting', 'net worth', 'expense', 'income tracking', 'sinking fund', '50/30/20'],
    'investment-management': ['stock', 'bond', 'mutual fund', 'etf', 'portfolio', 'asset allocation', 'dividend', 'equity', 'nifty', 'sensex', 'index fund', 'sip', 'nav', 'p/e ratio', 'sharpe', 'alpha', 'beta', 'rebalancing', 'diversif', 'crypto', 'bitcoin', 'ethereum', 'blockchain', 'defi', 'option', 'futures', 'derivative', 'hedging', 'call option', 'put option', 'f&o', 'commodity'],
    'retirement-planning': ['retire', 'retirement', '401k', '401(k)', 'pension', 'ppf', 'nps', 'epf', 'ira', 'roth', 'social security', 'annuity', 'fire', 'financial independence', 'withdraw', '4% rule'],
    'tax-planning': ['tax', 'income tax', 'capital gain', 'deduction', '80c', '80d', 'tax loss', 'tds', 'gst', 'old regime', 'new regime', 'tax saving', 'elss', 'hra', 'section 80'],
    'insurance-risk': ['insurance', 'life insurance', 'health insurance', 'term plan', 'premium', 'claim', 'risk management', 'disability', 'coverage', 'ulip', 'endowment', 'rider'],
    'estate-planning': ['will', 'trust', 'estate', 'succession', 'inheritance', 'probate', 'power of attorney', 'beneficiary', 'wealth transfer', 'nominee', 'legal heir'],
    'debt-management': ['debt', 'loan', 'emi', 'mortgage', 'credit card', 'credit score', 'cibil', 'fico', 'interest rate', 'refinance', 'consolidat', 'snowball', 'avalanche', 'prepayment'],
    'behavioral-finance': ['bias', 'psychology', 'emotion', 'fear', 'greed', 'panic', 'herd', 'overconfidence', 'loss aversion', 'anchoring', 'fomo', 'behavioral', 'mental accounting'],
    'regulatory-compliance': ['sebi', 'sec', 'regulation', 'compliance', 'fiduciary', 'kyc', 'insider trading', 'finra', 'cfp', 'cfa', 'registered', 'adviser registration'],
    'economics-market': ['gdp', 'inflation', 'interest rate', 'repo rate', 'fed', 'rbi', 'recession', 'bull market', 'bear market', 'economic', 'fiscal', 'monetary policy', 'yield curve', 'pmi', 'market cycle', 'fpi', 'fii'],
    'advisory-skills': ['advisor', 'adviser', 'client', 'communication', 'soft skill', 'negotiation', 'sales', 'practice management', 'cfp', 'certification', 'fiduciary', 'client acquisition', 'referral', 'fee structure', 'aum', 'onboarding', 'client meeting', 'report writing', 'empathy', 'trust'],
    'fintech-tools': ['bloomberg', 'excel', 'spreadsheet', 'xirr', 'crm', 'software', 'tool', 'platform', 'fintech', 'robo', 'screener', 'trading view', 'tradingview', 'tally', 'quickbooks', 'moneyguide', 'financial model', 'dcf model', 'monte carlo', 'google sheets', 'pivot table'],
    'accounting-corporate': ['financial statement', 'balance sheet', 'income statement', 'cash flow statement', 'p&l', 'profit and loss', 'ratio analysis', 'roe', 'roa', 'roce', 'ebitda', 'valuation', 'business valuation', 'dcf', 'wacc', 'corporate finance', 'llc', 's-corp', 'c-corp', 'pvt ltd', 'private limited', 'llp', 'corporate structure', 'book value', 'enterprise value', 'free cash flow', 'working capital', 'dupont', 'accounting', 'ind as', 'gaap', 'ifrs'],
    'books-resources': ['book', 'read', 'recommend', 'resource', 'website', 'course', 'learn', 'study', 'education', 'intelligent investor', 'rich dad', 'psychology of money'],
  };

  let bestCategory = 'general';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

export { bookResources, webResources, booksAndResourcesContext };
