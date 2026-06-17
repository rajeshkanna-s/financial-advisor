import type { BookResource, WebResource } from '../types';

export const bookResources: BookResource[] = [
  {
    title: 'The Intelligent Investor',
    author: 'Benjamin Graham',
    category: 'Investing Foundations',
    description: 'The definitive book on value investing, first published in 1949. Warren Buffett calls it "the best book about investing ever written."',
    keyTakeaways: [
      'Invest with a margin of safety — buy assets well below their intrinsic value to protect against errors and market downturns.',
      'Distinguish between investing and speculation. An investment operation promises safety of principal and an adequate return.',
      'Mr. Market allegory: The market is an emotional partner who offers to buy/sell shares daily at different prices. Take advantage of his irrationality rather than being influenced by it.',
      'Defensive investor strategy: Diversified portfolio of high-grade bonds and leading common stocks. Minimal effort, solid results.',
      'Enterprising investor: Willing to put in more effort for potentially higher returns through careful stock selection and analysis.',
      'Focus on the long-term business value of a company, not short-term market price fluctuations.',
    ],
  },
  {
    title: 'Rich Dad Poor Dad',
    author: 'Robert Kiyosaki',
    category: 'Personal Finance',
    description: 'A personal finance classic that contrasts the financial philosophies of two father figures, emphasizing financial literacy and building assets.',
    keyTakeaways: [
      'Assets put money in your pocket; liabilities take money out. Build assets, minimize liabilities.',
      'The rich don\'t work for money — they make money work for them through investments and passive income.',
      'Financial literacy is more important than earning a high salary. Understanding accounting, investing, and markets is essential.',
      'The difference between the rich, middle class, and poor is what they do with their income — the rich buy assets first.',
      'Mind your own business — develop income-generating assets alongside your career.',
      'Overcome fear, cynicism, laziness, bad habits, and arrogance to achieve financial success.',
    ],
  },
  {
    title: 'The Psychology of Money',
    author: 'Morgan Housel',
    category: 'Wealth Building',
    description: 'Explores how emotions, personal history, and psychology influence financial decisions more than technical knowledge.',
    keyTakeaways: [
      'No one is crazy — everyone makes financial decisions based on their unique experiences and worldview.',
      'Luck and risk are siblings — recognize the role of both in financial outcomes. Not all success is due to skill.',
      'Getting wealthy is about earning and saving; staying wealthy is about humility, frugality, and paranoia about losing what you have.',
      'Compounding is the most powerful force in finance. Time is the most important factor — Warren Buffett earned 97% of his wealth after age 65.',
      'Tail events drive outcomes — a few investments or decisions create the majority of results.',
      'Reasonable is more realistic than rational. Make financial decisions you can live with, even if they\'re not mathematically optimal.',
      'Save money without needing a specific reason. Savings give you flexibility, options, and the ability to wait for opportunities.',
    ],
  },
  {
    title: 'A Random Walk Down Wall Street',
    author: 'Burton Malkiel',
    category: 'Portfolio Theory',
    description: 'Makes the case for index investing, arguing that stock prices follow a random walk and that active management rarely beats the market.',
    keyTakeaways: [
      'Stock prices are largely random and unpredictable in the short term — consistent market-beating is extremely difficult.',
      'Efficient Market Hypothesis: Markets generally reflect all available information. Persistent alpha generation is rare.',
      'Index funds outperform the majority of actively managed funds over long periods, especially after fees.',
      'Diversification across asset classes, geographies, and time (dollar-cost averaging) is the best risk management strategy.',
      'Both fundamental analysis and technical analysis have significant limitations as predictive tools.',
      'A buy-and-hold strategy with broad market exposure is optimal for most investors.',
    ],
  },
  {
    title: 'The Total Money Makeover',
    author: 'Dave Ramsey',
    category: 'Financial Planning',
    description: 'A step-by-step guide to getting out of debt and building wealth through the "Baby Steps" method.',
    keyTakeaways: [
      'Baby Step 1: Save $1,000 mini emergency fund.',
      'Baby Step 2: Pay off all non-mortgage debt using the debt snowball method (smallest balance first).',
      'Baby Step 3: Build a fully funded emergency fund (3-6 months of expenses).',
      'Baby Step 4: Invest 15% of household income for retirement.',
      'Baby Step 5: Save for children\'s college/education.',
      'Baby Step 6: Pay off the home mortgage early.',
      'Baby Step 7: Build wealth and give generously.',
      'Live on less than you make. Debt is not a tool — it\'s a trap.',
    ],
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    category: 'Behavioral Finance',
    description: 'Nobel laureate Kahneman\'s exploration of the two systems of thought that drive our decisions and their impact on judgment and choice.',
    keyTakeaways: [
      'System 1 (Fast): Automatic, intuitive, emotional thinking. Makes most daily decisions but is prone to biases.',
      'System 2 (Slow): Deliberate, logical, analytical thinking. Required for complex decisions but is lazy and easily fatigued.',
      'Loss aversion: Losses are psychologically about twice as painful as equivalent gains are pleasurable.',
      'Anchoring effect: Initial information disproportionately influences subsequent judgments and decisions.',
      'Overconfidence bias: People systematically overestimate their knowledge and predictive abilities.',
      'Prospect Theory: People evaluate outcomes relative to a reference point and are risk-averse for gains but risk-seeking for losses.',
      'What you see is all there is (WYSIATI): We make judgments based on available information, ignoring what we don\'t know.',
    ],
  },
  {
    title: 'One Up on Wall Street',
    author: 'Peter Lynch',
    category: 'Valuation',
    description: 'Legendary fund manager Peter Lynch explains how ordinary investors can beat the professionals by using what they already know.',
    keyTakeaways: [
      'Invest in what you know — use your everyday experience and industry knowledge to find investment opportunities.',
      'Six categories of stocks: Slow growers, stalwarts, fast growers, cyclicals, turnarounds, and asset plays.',
      'Do your homework — understand the company\'s story, financials, and growth potential before investing.',
      'The P/E ratio is a useful but incomplete tool. PEG ratio (P/E ÷ Growth Rate) gives a better picture. PEG < 1 is attractive.',
      'Behind every stock is a company. Find out what it\'s doing.',
      'Long-term investing in well-researched stocks beats market timing and short-term trading.',
    ],
  },
  {
    title: 'Economics in One Lesson',
    author: 'Henry Hazlitt',
    category: 'Economics',
    description: 'A clear, concise introduction to economics emphasizing the importance of looking at both the seen and unseen effects of economic policies.',
    keyTakeaways: [
      'The one lesson: The art of economics consists in looking not merely at the immediate but at the longer effects of any act or policy.',
      'Consider effects on ALL groups, not just the intended beneficiaries of a policy.',
      'The broken window fallacy: Destruction does not create net economic benefit — it diverts resources from productive use.',
      'Price controls (ceilings and floors) create shortages or surpluses by distorting market signals.',
      'Government spending must come from somewhere — taxes, borrowing, or inflation — each with its own consequences.',
      'Free trade benefits both parties. Tariffs and protectionism harm consumers to benefit specific producers.',
    ],
  },
  {
    title: 'The Bogleheads\' Guide to Investing',
    author: 'Taylor Larimore, Mel Lindauer & Michael LeBoeuf',
    category: 'Tax & Estate',
    description: 'Practical, no-nonsense investing advice inspired by Vanguard founder John Bogle\'s philosophy of low-cost, diversified investing.',
    keyTakeaways: [
      'Start early and invest regularly — the power of compounding is your greatest ally.',
      'Minimize costs — every dollar spent on fees is a dollar less of return. Choose low-cost index funds.',
      'Diversify broadly — own the whole market through total market index funds.',
      'Stay the course — don\'t panic sell during downturns or chase performance during bull markets.',
      'Asset allocation matters most — determine the right stock/bond mix for your risk tolerance and time horizon.',
      'Tax-efficient investing: Use tax-advantaged accounts, place tax-inefficient assets in tax-sheltered accounts.',
      'Keep it simple — a three-fund portfolio (US stocks, international stocks, bonds) can serve most investors well.',
    ],
  },
  {
    title: 'Common Stocks and Uncommon Profits',
    author: 'Philip Fisher',
    category: 'Advanced Investing',
    description: 'Growth investing classic that introduces the "scuttlebutt" method of researching companies through industry contacts and qualitative analysis.',
    keyTakeaways: [
      'The 15 points to look for in a common stock: Sales growth, R&D effectiveness, sales organization, profit margins, maintenance of margins, labor relations, executive depth, long-range planning, and more.',
      'Scuttlebutt method: Gather information from customers, suppliers, competitors, and employees to evaluate a company.',
      'Buy outstanding companies and hold them for a very long time.',
      'Don\'t sell a stock just because it seems overpriced if the company is still growing.',
      'Focus on company management quality — great companies are built by great managers.',
      'Conservative investments are those that are well-researched, even if they are unconventional choices.',
    ],
  },
  {
    title: 'Let\'s Talk Money',
    author: 'Monika Halan',
    category: 'Indian Markets',
    description: 'A practical guide to personal finance for Indian readers, covering everything from insurance to investments in the Indian context.',
    keyTakeaways: [
      'Three-account framework: Income account → Spending account + Saving account. Automate the separation.',
      'Buy only term insurance. Avoid ULIPs, endowment plans, and money-back policies for investment purposes.',
      'Health insurance is essential — get adequate coverage (minimum ₹5 lakh) for your family.',
      'EPF and PPF are excellent debt instruments for Indian investors. Maximize PPF contributions.',
      'Mutual funds are the best equity investment vehicle for most Indian investors. Use SIPs in direct plans.',
      'Avoid real estate as an investment unless you have specific expertise — it\'s illiquid and returns are often overstated.',
      'Keep it simple: Term insurance + health insurance + EPF/PPF + equity mutual funds covers 90% of needs.',
    ],
  },
  {
    title: 'The Little Book of Common Sense Investing',
    author: 'John C. Bogle',
    category: 'Financial Independence',
    description: 'Vanguard founder John Bogle makes the definitive case for low-cost index investing as the optimal strategy for the vast majority of investors.',
    keyTakeaways: [
      'The stock market is a giant distraction from the business of investing. Focus on owning businesses, not trading stocks.',
      'The average fund investor earns far less than the market return due to fees, expenses, and poor timing.',
      'The cost matters hypothesis: After costs, the average actively managed dollar must underperform the average passively managed dollar.',
      'Own the entire stock market through a total market index fund for the broadest diversification at the lowest cost.',
      'Reversion to the mean: Funds that outperform tend to underperform in subsequent periods. Past performance doesn\'t predict future results.',
      'Keep costs low: Expense ratios, transaction costs, and taxes are the three enemies of investment returns.',
      'Don\'t look for the needle in the haystack. Just buy the haystack.',
    ],
  },
];

export const webResources: WebResource[] = [
  {
    name: 'Investopedia',
    url: 'https://www.investopedia.com',
    purpose: 'Market News & Analysis',
    description: 'The world\'s leading source of financial content. Comprehensive articles, tutorials, dictionary, and market news covering all aspects of finance and investing.',
  },
  {
    name: 'CFP Board',
    url: 'https://www.cfp.net',
    purpose: 'Financial Planning Education',
    description: 'The Certified Financial Planner Board of Standards. Find certified financial planners, learn about the CFP certification, and access financial planning resources.',
  },
  {
    name: 'Moneycontrol',
    url: 'https://www.moneycontrol.com',
    purpose: 'Indian Market Data',
    description: 'India\'s leading financial platform for market data, stock quotes, mutual fund NAVs, financial news, and portfolio tracking.',
  },
  {
    name: 'SEBI',
    url: 'https://www.sebi.gov.in',
    purpose: 'Indian Securities Regulations',
    description: 'Securities and Exchange Board of India. Access regulations, circulars, investor complaints portal (SCORES), and intermediary information.',
  },
  {
    name: 'SEC EDGAR',
    url: 'https://www.sec.gov/edgar',
    purpose: 'US Securities Filings & Regulations',
    description: 'Electronic Data Gathering, Analysis, and Retrieval system. Access all public company filings including 10-K, 10-Q, and insider transactions.',
  },
  {
    name: 'Morningstar',
    url: 'https://www.morningstar.com',
    purpose: 'Investment Research',
    description: 'Independent investment research covering stocks, mutual funds, and ETFs. Known for their star rating system and comprehensive fund analysis.',
  },
  {
    name: 'Trading Economics',
    url: 'https://tradingeconomics.com',
    purpose: 'Economic Data',
    description: 'Global economic data covering GDP, inflation, interest rates, employment, and forecasts for 196 countries. Excellent for macroeconomic research.',
  },
  {
    name: 'ClearTax',
    url: 'https://cleartax.in',
    purpose: 'Tax Planning (India)',
    description: 'India\'s largest tax filing platform. Comprehensive tax guides, calculators, and e-filing services for Indian taxpayers.',
  },
  {
    name: 'Coursera',
    url: 'https://www.coursera.org',
    purpose: 'Financial Courses',
    description: 'Online learning platform with financial courses from top universities including Yale\'s Financial Markets course, Wharton\'s specializations, and more.',
  },
  {
    name: 'Khan Academy',
    url: 'https://www.khanacademy.org/economics-finance-domain',
    purpose: 'Free Financial Education',
    description: 'Free, world-class education in economics and finance. Excellent for building foundational knowledge in investing, economics, and personal finance.',
  },
  {
    name: 'Value Research',
    url: 'https://www.valueresearchonline.com',
    purpose: 'Mutual Fund Research (India)',
    description: 'India\'s premier mutual fund research platform. Fund ratings, performance data, portfolio analysis, and recommendation tools.',
  },
  {
    name: 'Bloomberg',
    url: 'https://www.bloomberg.com',
    purpose: 'Global Markets',
    description: 'Global business, financial information, and news. Real-time market data, analysis, and breaking financial news coverage.',
  },
  {
    name: 'r/personalfinance',
    url: 'https://www.reddit.com/r/personalfinance',
    purpose: 'Community & Discussion',
    description: 'Reddit community dedicated to personal finance advice, discussions, and resources. Active community with practical advice and real-world experiences.',
  },
  {
    name: 'Zerodha Varsity',
    url: 'https://zerodha.com/varsity',
    purpose: 'Free Stock Market Education (India)',
    description: 'Comprehensive, free stock market education covering everything from basics to options trading. One of the best resources for Indian market education.',
  },
  {
    name: 'AMFI India',
    url: 'https://www.amfiindia.com',
    purpose: 'Mutual Fund Industry Data (India)',
    description: 'Association of Mutual Funds in India. Daily NAVs, industry AUM data, investor resources, and mutual fund distributor information.',
  },
];

export const booksAndResourcesContext = `
RECOMMENDED BOOKS FOR FINANCIAL EDUCATION:

INVESTING FOUNDATIONS:
- "The Intelligent Investor" by Benjamin Graham — Value investing bible. Key concept: Margin of safety.
- "A Random Walk Down Wall Street" by Burton Malkiel — Case for index investing and efficient markets.
- "Common Stocks and Uncommon Profits" by Philip Fisher — Growth investing and the scuttlebutt method.
- "One Up on Wall Street" by Peter Lynch — Invest in what you know. PEG ratio analysis.

PERSONAL FINANCE:
- "Rich Dad Poor Dad" by Robert Kiyosaki — Assets vs liabilities, financial literacy.
- "The Total Money Makeover" by Dave Ramsey — Debt elimination through Baby Steps.
- "Let's Talk Money" by Monika Halan — Practical personal finance for Indian readers.

WEALTH & PSYCHOLOGY:
- "The Psychology of Money" by Morgan Housel — Behavioral aspects of money decisions.
- "Thinking, Fast and Slow" by Daniel Kahneman — Cognitive biases affecting financial decisions.

INDEX INVESTING:
- "The Little Book of Common Sense Investing" by John C. Bogle — Definitive case for index funds.
- "The Bogleheads' Guide to Investing" by Larimore, Lindauer & LeBoeuf — Practical low-cost investing.

ECONOMICS:
- "Economics in One Lesson" by Henry Hazlitt — Clear introduction to economic thinking.

KEY WEBSITES:
- Investopedia (investopedia.com) — Financial education and market news
- Moneycontrol (moneycontrol.com) — Indian market data
- Morningstar (morningstar.com) — Investment research
- Value Research (valueresearchonline.com) — Indian mutual fund research
- ClearTax (cleartax.in) — Indian tax planning
- Zerodha Varsity (zerodha.com/varsity) — Free stock market education (India)
- Trading Economics (tradingeconomics.com) — Global economic data
- Khan Academy — Free financial education
- CFP Board (cfp.net) — Financial planning standards
`;
