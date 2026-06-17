export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  category?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  category: string;
  createdAt: number;
  updatedAt: number;
}

export interface EngineData {
  category: string;
  title: string;
  description: string;
  topics: Topic[];
  keyTerms: KeyTerm[];
  tips: string[];
  faqs: FAQ[];
}

export interface Topic {
  name: string;
  description: string;
  details: string[];
  subtopics?: SubTopic[];
}

export interface SubTopic {
  name: string;
  description: string;
  details: string[];
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface BookResource {
  title: string;
  author: string;
  category: string;
  description: string;
  keyTakeaways: string[];
}

export interface WebResource {
  name: string;
  url: string;
  purpose: string;
  description: string;
}

export interface AppSettings {
  apiKey: string;
  apiProvider: 'freemodel' | 'gemini' | 'openai' | 'custom';
  apiBaseUrl: string;
  modelName: string;
  customModelName: string;
  theme: 'light' | 'dark';
  storagePath: string;
  fontSize: 'small' | 'medium' | 'large';
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}
