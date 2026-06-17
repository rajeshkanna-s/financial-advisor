import { useState } from 'react';
import {
  BsPlus, BsSearch, BsTrash, BsChatDots, BsGraphUpArrow,
  BsBarChartLine, BsHouseDoor, BsCalculator, BsShieldCheck,
  BsFileEarmarkText, BsCreditCard2Back, BsLightbulb, BsBank,
  BsGlobe2, BsBook, BsGear, BsChevronDown, BsChevronRight,
  BsDownload, BsUpload, BsX, BsPeople, BsLaptop, BsJournalBookmark
} from 'react-icons/bs';
import type { Chat, Category } from '../../types';
import { categories } from '../../engines';
import './Sidebar.css';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onNewChat: (category?: string) => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onOpenSettings: () => void;
  onExport: () => void;
  onImport: () => void;
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  BsGraphUpArrow: <BsGraphUpArrow />,
  BsBarChartLine: <BsBarChartLine />,
  BsHouseDoor: <BsHouseDoor />,
  BsCalculator: <BsCalculator />,
  BsShieldCheck: <BsShieldCheck />,
  BsFileEarmarkText: <BsFileEarmarkText />,
  BsCreditCard2Back: <BsCreditCard2Back />,
  BsLightbulb: <BsLightbulb />,
  BsBank: <BsBank />,
  BsGlobe2: <BsGlobe2 />,
  BsBook: <BsBook />,
  BsPeople: <BsPeople />,
  BsLaptop: <BsLaptop />,
  BsJournalBookmark: <BsJournalBookmark />,
  BsChatDots: <BsChatDots />,
};

export default function Sidebar({
  chats, activeChatId, onNewChat, onSelectChat,
  onDeleteChat, onOpenSettings, onExport, onImport,
  isOpen, onClose,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showCategories, setShowCategories] = useState(true);

  const filteredChats = searchQuery
    ? chats.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : chats;

  const groupedChats: Record<string, Chat[]> = {};
  for (const chat of filteredChats) {
    const day = getRelativeDate(chat.updatedAt);
    if (!groupedChats[day]) groupedChats[day] = [];
    groupedChats[day].push(chat);
  }

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <h2 className="sidebar-title">
          <BsGraphUpArrow className="title-icon" />
          FinAdvisor
        </h2>
        <button className="close-btn d-md-none" onClick={onClose}>
          <BsX />
        </button>
      </div>

      <button className="new-chat-btn" onClick={() => { onNewChat(); onClose(); }}>
        <BsPlus size={20} />
        <span>New Chat</span>
      </button>

      <div className="search-box">
        <BsSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button className="clear-search" onClick={() => setSearchQuery('')}>
            <BsX />
          </button>
        )}
      </div>

      <div className="sidebar-content">
        <div className="section-header" onClick={() => setShowCategories(!showCategories)}>
          {showCategories ? <BsChevronDown /> : <BsChevronRight />}
          <span>Categories</span>
        </div>

        {showCategories && (
          <div className="categories-grid">
            {categories.map((cat: Category) => (
              <button
                key={cat.id}
                className="category-chip"
                style={{ '--cat-color': cat.color } as React.CSSProperties}
                onClick={() => { onNewChat(cat.id); onClose(); }}
                title={cat.description}
              >
                <span className="category-icon">{iconMap[cat.icon]}</span>
                <span className="category-name">{cat.name}</span>
              </button>
            ))}
          </div>
        )}

        <div className="section-header">
          <BsChatDots />
          <span>Recent Chats</span>
        </div>

        <div className="chat-list">
          {Object.entries(groupedChats).map(([day, dayChats]) => (
            <div key={day}>
              <div className="date-label">{day}</div>
              {dayChats.map(chat => {
                const cat = categories.find(c => c.id === chat.category);
                return (
                  <div
                    key={chat.id}
                    className={`chat-item ${chat.id === activeChatId ? 'active' : ''}`}
                    onClick={() => { onSelectChat(chat.id); onClose(); }}
                  >
                    <div className="chat-item-icon" style={{ color: cat?.color || '#009688' }}>
                      {iconMap[cat?.icon || 'BsChatDots']}
                    </div>
                    <div className="chat-item-content">
                      <div className="chat-item-title">{chat.title}</div>
                      <div className="chat-item-meta">
                        {cat?.name || 'General'} &middot; {chat.messages.length} msgs
                      </div>
                    </div>
                    <button
                      className="chat-delete-btn"
                      onClick={e => { e.stopPropagation(); onDeleteChat(chat.id); }}
                      title="Delete chat"
                    >
                      <BsTrash />
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
          {filteredChats.length === 0 && (
            <div className="empty-chats">
              {searchQuery ? 'No matching chats found' : 'No chats yet. Start a new conversation!'}
            </div>
          )}
        </div>
      </div>

      <div className="sidebar-footer">
        <button className="footer-btn" onClick={onExport} title="Export chats">
          <BsDownload /> <span>Export</span>
        </button>
        <button className="footer-btn" onClick={onImport} title="Import chats">
          <BsUpload /> <span>Import</span>
        </button>
        <button className="footer-btn" onClick={onOpenSettings} title="Settings">
          <BsGear /> <span>Settings</span>
        </button>
      </div>
    </div>
  );
}

function getRelativeDate(timestamp: number): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return 'This Week';
  if (diffDays < 30) return 'This Month';
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}
