import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import ChatArea from './components/ChatArea/ChatArea';
import Settings from './components/Settings/Settings';
import { useChat } from './hooks/useChat';
import { loadSettings, saveSettings, exportToFile, importFromFile } from './services/storage-service';
import type { AppSettings } from './types';
import './App.css';

const categoryStarters: Record<string, string> = {
  'financial-planning': 'Give me a complete overview of financial planning — budgeting methods, cash flow management, emergency fund, and how to set financial goals effectively.',
  'investment-management': 'What are the best investment options available for beginners? Cover stocks, mutual funds, ETFs, SIPs, and how to build a diversified portfolio.',
  'retirement-planning': 'Guide me through retirement planning — compare 401(k), IRA, PPF, NPS, EPF and help me understand how much I need to retire comfortably.',
  'tax-planning': 'Explain comprehensive tax planning strategies for both India and US — cover deductions like Section 80C, 80D, HRA exemption, capital gains tax, and tax-saving investments.',
  'insurance-risk': 'What types of insurance do I need? Explain life insurance, health insurance, term vs whole life, and how to calculate the right coverage amount.',
  'estate-planning': 'Explain estate planning essentials — wills, trusts, power of attorney, succession planning, and how to protect and transfer wealth effectively.',
  'debt-management': 'Help me understand debt management — how to improve my credit score (CIBIL/FICO), debt avalanche vs snowball method, and strategies to become debt-free.',
  'behavioral-finance': 'What are the common behavioral finance biases that affect investment decisions? How can I make better financial decisions by understanding psychology?',
  'regulatory-compliance': 'Explain key financial regulations — SEBI, SEC, RBI guidelines, fiduciary duty, and what investors should know about compliance and investor protection.',
  'economics-market': 'Give me an overview of how economics affects personal finance — GDP, inflation, interest rates, market cycles, and how to navigate different economic conditions.',
  'advisory-skills': 'What are the essential skills needed to become a successful financial advisor? Cover communication, sales, client management, soft skills, certifications, and practice management.',
  'fintech-tools': 'What are the most important financial technology tools and software? Cover Bloomberg Terminal, Excel modeling, CRM systems, financial planning software, and portfolio management platforms.',
  'accounting-corporate': 'Explain accounting and corporate finance fundamentals — how to read financial statements, key financial ratios, business valuation methods, and corporate structures like LLC, Pvt Ltd, and LLP.',
  'books-resources': 'What are the best books and resources for learning about personal finance and investing? Give me a curated reading list with key takeaways.',
  'general': 'What are the most important financial concepts everyone should know? Give me a comprehensive overview of personal finance essentials.',
};

export default function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    chats, activeChat, isLoading, streamingContent,
    createNewChat, sendUserMessage, selectChat,
    deleteChat, refreshChats, setActiveChat, stopGeneration,
  } = useChat(settings);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    document.documentElement.setAttribute('data-font', settings.fontSize);
  }, [settings.theme, settings.fontSize]);

  function handleSaveSettings(newSettings: AppSettings) {
    setSettings(newSettings);
    saveSettings(newSettings);
  }

  const handleNewChat = useCallback((category?: string) => {
    const cat = category || 'general';
    setSidebarOpen(false);
    const starter = categoryStarters[cat];
    if (starter && category) {
      sendUserMessage(starter, cat);
    } else {
      const chat = createNewChat(cat);
      setActiveChat(chat);
    }
  }, [createNewChat, setActiveChat, sendUserMessage]);

  async function handleExport() {
    await exportToFile();
  }

  async function handleImport() {
    const success = await importFromFile();
    if (success) {
      refreshChats();
      alert('Chats imported successfully!');
    }
  }

  return (
    <div className="app">
      {sidebarOpen && (
        <div className="sidebar-backdrop d-md-none" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        chats={chats}
        activeChatId={activeChat?.id || null}
        onNewChat={handleNewChat}
        onSelectChat={(id) => { selectChat(id); setSidebarOpen(false); }}
        onDeleteChat={deleteChat}
        onOpenSettings={() => setShowSettings(true)}
        onExport={handleExport}
        onImport={handleImport}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <ChatArea
        chat={activeChat}
        isLoading={isLoading}
        streamingContent={streamingContent}
        onSendMessage={sendUserMessage}
        onStopGeneration={stopGeneration}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {showSettings && (
        <Settings
          settings={settings}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}
