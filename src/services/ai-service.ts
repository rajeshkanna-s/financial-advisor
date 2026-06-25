import type { Message, AppSettings } from '../types';
import { getEngineContext, detectCategory } from '../engines';

const SYSTEM_PROMPT = `You are the **world's best Financial Advisor AI** — an elite-level expert across every domain of personal and corporate finance, with deep specialization in both Indian 🇮🇳 and US 🇺🇸 financial systems.

## ⛔ STRICT BOUNDARY — FINANCE ONLY:
You MUST ONLY answer questions related to finance, money, economics, investing, banking, taxes, insurance, budgeting, debt, credit, retirement, financial planning, or financial literacy.

If a user asks about ANYTHING non-financial (movies, actors, politics, sports, celebrities, recipes, general knowledge, coding, science, history unrelated to finance, entertainment, etc.), you MUST respond with:

"🚫 **Off-Topic Request**

I'm your **Financial Advisor AI** — I can only help with finance-related topics.

💡 **Try asking me about:**
- 💰 Budgeting & Financial Planning
- 📈 Investments (Stocks, Mutual Funds, SIPs, ETFs)
- 🧾 Tax Planning & Savings (Section 80C, HRA, Capital Gains)
- 🏖️ Retirement Planning (PPF, NPS, 401k, IRA)
- 🛡️ Insurance & Risk Management
- 💳 Debt Management & Credit Scores
- 🌍 Economics & Market Analysis

**Ask me anything about money and finance!** 🎯"

Do NOT answer non-financial questions even partially. Do NOT try to connect non-financial topics to finance. Simply decline and redirect.

## Your Expertise Covers:
💰 Financial Planning & Budgeting | 📈 Investment Management (Stocks, Mutual Funds, ETFs, Bonds, SIPs, IPOs) | 🏖️ Retirement Planning (401k, IRA, PPF, NPS, EPF, FIRE) | 🧾 Tax Planning (Section 80C/80D, HRA, LTCG/STCG, ITR filing, US tax brackets, capital gains) | 🛡️ Insurance & Risk Management | 📜 Estate Planning & Wealth Transfer | 💳 Debt Management & Credit Scores (CIBIL/FICO) | 🧠 Behavioral Finance & Investor Psychology | ⚖️ Regulatory & Compliance (SEBI, SEC, RBI, AMFI) | 🌍 Economics & Market Analysis | 📚 Financial Literacy & Education

## Response Length — MATCH THE USER:
- **Simple question** (e.g., "What is SIP?"): Give a clear, well-structured answer with key points, a brief explanation, and a quick example. Use 1-2 headers, bullet points, and emojis. Around 150-250 words.
- **Detailed question** (e.g., "Build me a financial plan", "Compare X vs Y in detail"): Give a comprehensive response with multiple headers, tables, numbered steps, and full breakdowns. Go as detailed as needed.
- **If user says "short" or "brief"**: Then keep it minimal — 2-3 sentences only.

## Response Format Rules:
1. **Always use headers (##)** to organize your response — even short answers benefit from structure
2. **Use emojis liberally** as visual markers: ✅ for tips, ⚠️ for warnings, 💡 for insights, 📌 for key points, 🎯 for goals, 📊 for data, 🔑 for important concepts, ❌ for don'ts, ✨ for highlights
3. **Use bullet points and numbered lists** to break down information clearly
4. **Bold key terms** and important numbers
5. **Use tables** for comparisons (e.g., PPF vs NPS, term vs whole life)
6. **Keep paragraphs short** — 2-3 sentences max per paragraph
7. **Use both Indian (₹/INR) and US ($/USD) examples** when relevant
8. **Include a disclaimer** when giving specific financial guidance

## Important Rules:
- ⚠️ You are NOT a licensed financial advisor. Remind users this is educational guidance.
- Never provide specific stock tips or guarantee returns
- Present balanced views covering both risks and benefits
- If you don't know something, say so honestly

## CRITICAL — Follow-up Suggestions:
At the very END of EVERY response (including off-topic rejections), you MUST include exactly 3 follow-up questions the user might want to ask. Format them EXACTLY like this (with the exact delimiter):

---suggestions---
What are the tax benefits of investing in ELSS funds?
How do I calculate my ideal emergency fund size?
What's the difference between direct and regular mutual funds?
---end-suggestions---

These suggestions must always be finance-related.`;

export type StreamCallback = (chunk: string) => void;

export async function sendMessage(
  messages: Message[],
  settings: AppSettings,
  category: string,
  onStream?: StreamCallback,
  signal?: AbortSignal,
): Promise<string> {
  if (!settings.apiKey) {
    return '⚠️ **API Key Required**\n\nPlease set your API key in Settings (click the ⚙️ gear icon in the sidebar) to start chatting.\n\n**Supported Providers:**\n- 🟢 **FreeModel API** (default): Pre-configured and ready\n- 🔵 **Google Gemini**: Free API key at Google AI Studio\n- 🟣 **OpenAI**: API key at OpenAI Platform\n- 🟠 **Custom API**: Any OpenAI-compatible endpoint\n\n🔒 Your API key is stored locally and never sent anywhere except the AI provider.';
  }

  const detectedCategory = category === 'general' ? detectCategory(messages[messages.length - 1]?.content || '') : category;
  const engineContext = getEngineContext(detectedCategory);

  try {
    if (settings.apiProvider === 'gemini') {
      return await callGemini(messages, settings, engineContext);
    } else if (settings.apiProvider === 'claude') {
      return await callClaude(messages, settings, engineContext, onStream, signal);
    } else {
      return await callOpenAICompatible(messages, settings, engineContext, onStream, signal);
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error;
    }

    // Fallback to free Supabase AI API if primary provider fails
    if (settings.apiProvider === 'freemodel') {
      try {
        return await callFallbackAI(messages, engineContext, signal);
      } catch {
        // Fallback also failed, show original error
      }
    }

    if (error.message?.includes('API key') || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      return '❌ **Invalid API Key**\n\nPlease check your API key in Settings. Make sure you\'ve copied the entire key correctly.';
    }
    if (error.message?.includes('quota') || error.message?.includes('rate') || error.message?.includes('429')) {
      return '⏳ **Rate Limited**\n\nYou\'ve hit the API rate limit. Please wait a moment and try again.';
    }
    return `❌ **Error**\n\n${error.message || 'Failed to get response. Please check your API key and internet connection.'}`;
  }
}

async function callOpenAICompatible(
  messages: Message[],
  settings: AppSettings,
  engineContext: string,
  onStream?: StreamCallback,
  signal?: AbortSignal,
): Promise<string> {
  let model: string;
  if (settings.apiProvider === 'custom') {
    model = settings.customModelName || settings.modelName || 'gpt-4o-mini';
  } else {
    model = settings.modelName || 'FRE-5.5';
  }

  let url: string;
  if (settings.apiProvider === 'freemodel') {
    url = '/api/freemodel/v1/chat/completions';
  } else if (settings.apiProvider === 'openai') {
    url = '/api/openai/v1/chat/completions';
  } else if (settings.apiProvider === 'custom') {
    const baseUrl = settings.apiBaseUrl || 'https://api.openai.com/v1';
    url = `${baseUrl}/chat/completions`;
  } else {
    const baseUrl = settings.apiBaseUrl || 'https://api.openai.com/v1';
    url = `${baseUrl}/chat/completions`;
  }

  const apiMessages = [
    { role: 'system', content: `${SYSTEM_PROMPT}\n\n--- DOMAIN KNOWLEDGE ---\n${engineContext}` },
    ...messages.map(msg => ({
      role: msg.role as string,
      content: msg.content,
    })),
  ];

  const useStream = !!onStream;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: apiMessages,
      temperature: 0.7,
      max_tokens: 4096,
      stream: useStream,
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error: ${response.status} ${response.statusText}`);
  }

  if (useStream && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);
        if (data === '[DONE]') break;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            fullContent += content;
            onStream(fullContent);
          }
        } catch {
          // skip malformed chunks
        }
      }
    }

    return fullContent || 'No response generated.';
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content || 'No response generated.';
}

async function callGemini(
  messages: Message[],
  settings: AppSettings,
  engineContext: string
): Promise<string> {
  const model = settings.modelName || 'gemini-2.0-flash';
  const url = `/api/gemini/v1beta/models/${model}:generateContent?key=${settings.apiKey}`;

  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: `${SYSTEM_PROMPT}\n\n--- DOMAIN KNOWLEDGE ---\n${engineContext}` }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
}

async function callClaude(
  messages: Message[],
  settings: AppSettings,
  engineContext: string,
  onStream?: StreamCallback,
  signal?: AbortSignal,
): Promise<string> {
  const model = settings.modelName || 'claude-sonnet-4-20250514';
  const url = '/api/anthropic/v1/messages';

  const apiMessages = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

  const useStream = !!onStream;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': settings.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      system: `${SYSTEM_PROMPT}\n\n--- DOMAIN KNOWLEDGE ---\n${engineContext}`,
      messages: apiMessages,
      max_tokens: 4096,
      stream: useStream,
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Claude API error: ${response.status} ${response.statusText}`);
  }

  if (useStream && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const data = trimmed.slice(6);

        try {
          const parsed = JSON.parse(data);
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            fullContent += parsed.delta.text;
            onStream(fullContent);
          }
        } catch {
          // skip malformed chunks
        }
      }
    }

    return fullContent || 'No response generated.';
  }

  const data = await response.json();
  return data?.content?.[0]?.text || 'No response generated.';
}

const FALLBACK_API_URL = 'https://wuvgoqjxvnbihwiijzfb.supabase.co/functions/v1/ai-chat';
const FALLBACK_API_KEY = 'sb_publishable_XwfSIwlW4c35Ejv4nwG6Dg_LkXaK4Z_';

const FALLBACK_PROVIDERS = [
  { provider: 'nvidia', modelId: 'a34c3d62-5e7d-4504-a009-b689575bdb37', tokenSlotId: 'b8ee59ec-62ed-42fb-b77a-09654020b8b3' },
  { provider: 'openrouter', modelId: 'eecca7be-5693-4be4-860c-48055729aeb0', tokenSlotId: '877fbe3c-eb52-4b9a-a386-ef97a78eb77c' },
];

async function callFallbackAI(
  messages: Message[],
  engineContext: string,
  signal?: AbortSignal,
): Promise<string> {
  const prompt = `${SYSTEM_PROMPT}\n\n--- DOMAIN KNOWLEDGE ---\n${engineContext}\n\n--- CONVERSATION ---\n${messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')}\n\nAssistant:`;

  for (const config of FALLBACK_PROVIDERS) {
    try {
      const response = await fetch(FALLBACK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': FALLBACK_API_KEY,
          'Authorization': `Bearer ${FALLBACK_API_KEY}`,
        },
        body: JSON.stringify({
          provider: config.provider,
          modelId: config.modelId,
          tokenSlotId: config.tokenSlotId,
          prompt,
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 4096,
          attempt_timeout_ms: 30000,
          stream: false,
        }),
        signal,
      });

      if (!response.ok) continue;

      const data = await response.json();
      const text = data?.content || data?.text || data?.response || data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text;
      if (text) return text;
    } catch {
      continue;
    }
  }

  throw new Error('All fallback providers failed');
}
