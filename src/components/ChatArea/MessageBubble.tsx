import { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { BsPersonCircle, BsRobot, BsClipboard, BsCheck2 } from 'react-icons/bs';
import type { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

function stripSuggestions(content: string): string {
  const marker = '---suggestions---';
  const idx = content.indexOf(marker);
  if (idx === -1) return content;
  return content.slice(0, idx).trim();
}

export default function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const displayContent = useMemo(() => {
    if (isUser) return message.content;
    return stripSuggestions(message.content);
  }, [message.content, isUser]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(displayContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = displayContent;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="message-avatar">
        {isUser ? <BsPersonCircle size={28} /> : <BsRobot size={28} />}
      </div>
      <div className="message-body">
        <div className="message-header">
          <span className="message-sender">{isUser ? 'You' : 'Financial Advisor'}</span>
          <span className="message-time">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={`message-content ${isStreaming ? 'streaming' : ''}`}>
          {isUser ? (
            <p>{displayContent}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children, ...props }) => (
                  <div className="table-wrapper">
                    <table className="md-table" {...props}>{children}</table>
                  </div>
                ),
                code: ({ children, className, ...props }) => {
                  const isBlock = className?.includes('language-');
                  if (isBlock) {
                    return (
                      <pre className="code-block">
                        <code className={className} {...props}>{children}</code>
                      </pre>
                    );
                  }
                  return <code className="inline-code" {...props}>{children}</code>;
                },
                a: ({ children, href, ...props }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
                ),
              }}
            >
              {displayContent}
            </ReactMarkdown>
          )}
          {isStreaming && <span className="streaming-cursor">▊</span>}
        </div>
        {!isUser && !isStreaming && (
          <div className="message-actions">
            <button className="action-btn" onClick={handleCopy} title="Copy response">
              {copied ? <BsCheck2 /> : <BsClipboard />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
