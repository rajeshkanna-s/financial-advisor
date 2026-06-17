import { useState, useRef, useEffect, useMemo } from 'react';
import { BsSend, BsStopCircle, BsList, BsArrowDown, BsGraphUpArrow, BsMic, BsMicFill } from 'react-icons/bs';
import type { Chat, Category } from '../../types';
import { categories } from '../../engines';
import MessageBubble from './MessageBubble';
import WelcomeScreen from './WelcomeScreen';
import './ChatArea.css';

interface ChatAreaProps {
  chat: Chat | null;
  isLoading: boolean;
  streamingContent: string;
  onSendMessage: (content: string, category?: string) => void;
  onStopGeneration: () => void;
  onToggleSidebar: () => void;
}

function parseSuggestions(content: string): { cleanContent: string; suggestions: string[] } {
  const marker = '---suggestions---';
  const endMarker = '---end-suggestions---';
  const startIdx = content.indexOf(marker);
  if (startIdx === -1) return { cleanContent: content, suggestions: [] };

  const endIdx = content.indexOf(endMarker);
  const suggestionsBlock = content.slice(startIdx + marker.length, endIdx === -1 ? undefined : endIdx);
  const suggestions = suggestionsBlock
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('---'));

  const cleanContent = content.slice(0, startIdx).trim();
  return { cleanContent, suggestions: suggestions.slice(0, 3) };
}

export default function ChatArea({
  chat, isLoading, streamingContent, onSendMessage, onStopGeneration,
  onToggleSidebar,
}: ChatAreaProps) {
  const [input, setInput] = useState('');
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  async function toggleVoice() {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      alert('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    // Pre-request microphone permission — mobile browsers need this explicit step
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
    } catch {
      alert('Microphone access denied. Please allow microphone permission in browser settings and try again.');
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'en-IN';
      recognition.interimResults = false;
      recognition.continuous = false;
      recognitionRef.current = recognition;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(prev => (prev ? prev + ' ' : '') + transcript);
        }
      };

      recognition.onerror = (event: Event & { error?: string }) => {
        setIsListening(false);
        const err = event.error || 'unknown';
        if (err === 'not-allowed') {
          alert('Microphone permission denied.');
        } else if (err !== 'no-speech' && err !== 'aborted') {
          alert('Voice error: ' + err);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setIsListening(true);
    } catch (e) {
      alert('Voice input failed: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  }

  const currentCategory = categories.find((c: Category) => c.id === chat?.category);

  const lastAssistantMessage = chat?.messages?.filter(m => m.role === 'assistant').slice(-1)[0];
  const suggestions = useMemo(() => {
    if (isLoading || !lastAssistantMessage) return [];
    return parseSuggestions(lastAssistantMessage.content).suggestions;
  }, [lastAssistantMessage, isLoading]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages, streamingContent]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleScroll() {
    const container = messagesContainerRef.current;
    if (!container) return;
    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    setShowScrollBtn(distanceFromBottom > 100);
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    onSendMessage(trimmed, chat?.category);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  function handleSuggestionClick(suggestion: string) {
    if (isLoading) return;
    onSendMessage(suggestion, chat?.category);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!chat || chat.messages.length === 0) {
    return (
      <div className="chat-area">
        <div className="chat-header">
          <button className="menu-btn d-md-none" onClick={onToggleSidebar}>
            <BsList size={24} />
          </button>
          <div className="header-info">
            <h3>Financial Advisor AI</h3>
            <span className="header-subtitle">Your intelligent finance companion</span>
          </div>
        </div>

        <WelcomeScreen onSendMessage={onSendMessage} />

        <div className="input-area">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about finance..."
              rows={1}
              disabled={isLoading}
            />
            <button
              className={`mic-btn ${isListening ? 'mic-active' : ''}`}
              onClick={toggleVoice}
              title={isListening ? 'Stop listening' : 'Voice input'}
            >
              {isListening ? <BsMicFill /> : <BsMic />}
            </button>
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <BsSend />
            </button>
          </div>
          <div className="input-disclaimer">
            AI-generated advice is educational only. Consult a qualified financial advisor for personalized guidance.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="chat-header">
        <button className="menu-btn d-md-none" onClick={onToggleSidebar}>
          <BsList size={24} />
        </button>
        <div className="header-content">
          <div className="header-brand">
            <BsGraphUpArrow className="header-logo" />
            <span className="header-brand-name">FinAdvisor</span>
          </div>
          <span className="header-subtitle" style={{ color: currentCategory?.color }}>
            {currentCategory?.name || 'General'} &middot; {chat.messages.length} messages
          </span>
        </div>
      </div>

      <div
        className="messages-container"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
        {chat.messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && streamingContent && (
          <MessageBubble
            message={{
              id: 'streaming',
              role: 'assistant',
              content: streamingContent,
              timestamp: Date.now(),
            }}
            isStreaming
          />
        )}
        {isLoading && !streamingContent && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        {!isLoading && suggestions.length > 0 && (
          <div className="suggestions-container">
            <div className="suggestions-label">💡 Related questions</div>
            <div className="suggestions-list">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  className="suggestion-btn"
                  onClick={() => handleSuggestionClick(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {showScrollBtn && (
        <button className="scroll-bottom-btn" onClick={scrollToBottom}>
          <BsArrowDown />
        </button>
      )}

      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            rows={1}
            disabled={isLoading}
          />
          <button
            className={`mic-btn ${isListening ? 'mic-active' : ''}`}
            onClick={toggleVoice}
            title={isListening ? 'Stop listening' : 'Voice input'}
          >
            {isListening ? <BsMicFill /> : <BsMic />}
          </button>
          {isLoading ? (
            <button className="stop-btn" onClick={onStopGeneration}>
              <BsStopCircle />
            </button>
          ) : (
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!input.trim()}
            >
              <BsSend />
            </button>
          )}
        </div>
        <div className="input-disclaimer">
          AI-generated advice is educational only. Consult a qualified financial advisor for personalized guidance.
        </div>
      </div>
    </div>
  );
}
