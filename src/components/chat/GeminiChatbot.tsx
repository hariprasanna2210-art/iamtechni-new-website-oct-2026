import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RotateCcw,
  Minimize2,
  Maximize2,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  Bot,
  User,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { COMPANY_CONTACT } from '../../data/companyInfo';
import { PageRoute } from '../../types';
import { IamtechniLogo } from '../common/IamtechniLogo';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface GeminiChatbotProps {
  onNavigate?: (route: PageRoute) => void;
  onOpenProjectModal?: (serviceName?: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: `Hello! I am the **IAMTECHNI AI Solutions Architect**, powered by Gemini.

I can assist you with:
- Evaluating software engineering architectures & modern tech stacks (React, Next.js, Cloud, AI/ML)
- Recommending tailored IAMTECHNI services for your enterprise or startup
- Estimating project feasibility and deployment methodologies
- Connecting you directly with our engineering leadership

How can we help advance your technology roadmap today?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const SUGGESTED_PROMPTS = [
  'What services does IAMTECHNI offer?',
  'Tell me about your AI & LLM solutions',
  'How do you handle Cloud Migration & DevOps?',
  'Can you help build a custom mobile or web app?',
  'How do I schedule a technical consultation?',
];

export const GeminiChatbot: React.FC<GeminiChatbotProps> = ({
  onNavigate,
  onOpenProjectModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('iamtechni_chat_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_MESSAGES;
  });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const messagesRef = useRef<ChatMessage[]>(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const isLoadingRef = useRef<boolean>(isLoading);
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  // Save conversation history to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('iamtechni_chat_history', JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isLoading]);

  // Focus input when opening chat
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      setHasUnread(false);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text || isLoadingRef.current) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentHistory = Array.isArray(messagesRef.current) ? messagesRef.current : INITIAL_MESSAGES;
    const newMessages = [...currentHistory, userMessage];
    messagesRef.current = newMessages;
    setMessages(newMessages);
    setInputValue('');
    isLoadingRef.current = true;
    setIsLoading(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      controller.abort();
    }, 20_000);

    try {
      // Exclude the static initial welcome message ('welcome-1') and any prior fallback/error messages,
      // keep only the last 6 messages, and ensure history starts with a 'user' message.
      const filteredHistory = newMessages.filter(
        (m) =>
          m.id !== 'welcome-1' &&
          !m.id.startsWith('bot-fallback-') &&
          !m.id.startsWith('bot-err-') &&
          !(
            m.role === 'assistant' &&
            (m.content.startsWith('Hello! I am the **IAMTECHNI AI Solutions Architect**') ||
              /temporary (network )?delay|temporary connection issue|took longer than 20 seconds/i.test(
                m.content
              ))
          )
      );
      const lastSixMessages = filteredHistory.slice(-6);
      const firstUserIndex = lastSixMessages.findIndex((m) => m.role === 'user');
      const validHistory =
        firstUserIndex >= 0 ? lastSixMessages.slice(firstUserIndex) : [userMessage];

      const payloadMessages = validHistory.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content,
        parts: [{ text: m.content }],
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: payloadMessages }),
        signal: controller.signal,
      });

      let data: {
        text?: string;
        reply?: string;
        message?: string;
        fallbackText?: string;
        error?: string;
      } | null = null;

      try {
        data = await res.json();
      } catch {
        data = null;
      }

      if (!res.ok) {
        const friendlyServerError =
          data?.fallbackText ||
          data?.text ||
          data?.error ||
          `I am currently experiencing a temporary network delay. You can connect with our team directly:\n- 📞 Phone: **+91-7418120053**\n- ✉️ Email: **info@iamtechni.in**\n- 🌐 Office: Tamil Nadu, India (Global Delivery)`;

        const errorBotMessage: ChatMessage = {
          id: `bot-err-${Date.now()}`,
          role: 'assistant',
          content: friendlyServerError,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorBotMessage]);
        return;
      }

      const replyText =
        data?.text ||
        data?.reply ||
        data?.message ||
        data?.fallbackText ||
        'Thank you for reaching out. Please contact our engineering team directly at +91-7418120053 or info@iamtechni.in.';

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
      if (!isOpen) {
        setHasUnread(true);
      }
    } catch (err: any) {
      const isTimeout = err?.name === 'AbortError';
      const fallbackMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        role: 'assistant',
        content: isTimeout
          ? `The AI advisor took longer than 20 seconds to respond. Please try again with a shorter question, or connect with our team directly:\n- 📞 Phone: **+91-7418120053**\n- ✉️ Email: **info@iamtechni.in**\n- 🌐 Office: Tamil Nadu, India (Global Delivery)`
          : `I am currently experiencing a temporary network delay. You can connect with our team directly:\n- 📞 Phone: **+91-7418120053**\n- ✉️ Email: **info@iamtechni.in**\n- 🌐 Office: Tamil Nadu, India (Global Delivery)`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      window.clearTimeout(timeoutId);
      isLoadingRef.current = false;
      setIsLoading(false);
    }
  };

  // Support global trigger to open chat from any button/link
  useEffect(() => {
    const handleOpenChat = (e: any) => {
      setIsOpen(true);
      setIsMinimized(false);
      if (e?.detail?.prompt) {
        handleSendMessage(e.detail.prompt);
      }
    };
    window.addEventListener('iamtechni:open-chat', handleOpenChat);
    return () => window.removeEventListener('iamtechni:open-chat', handleOpenChat);
  }, []);

  const handleClearHistory = () => {
    if (window.confirm('Reset conversation history?')) {
      setMessages(INITIAL_MESSAGES);
      sessionStorage.removeItem('iamtechni_chat_history');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Simple, robust markdown text formatter
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');

    return (
      <div className="space-y-2 text-sm leading-relaxed">
        {lines.map((line, idx) => {
          const trimmed = line.trim();

          // Header line
          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-bold text-slate-900 text-base mt-2 mb-1">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }
          if (trimmed.startsWith('## ')) {
            return (
              <h3 key={idx} className="font-bold text-slate-900 text-lg mt-3 mb-1.5">
                {trimmed.replace('## ', '')}
              </h3>
            );
          }

          // Bullet list line
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1 my-0.5">
                <span className="text-[#0F52BA] font-bold mt-1 text-xs">•</span>
                <span className="flex-1 text-slate-700">{formatInlineStyles(content)}</span>
              </div>
            );
          }

          // Empty line
          if (!trimmed) {
            return <div key={idx} className="h-1" />;
          }

          // Regular paragraph
          return (
            <p key={idx} className="text-slate-700">
              {formatInlineStyles(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  // Helper for bold and markdown links
  const formatInlineStyles = (content: string) => {
    // Process markdown links [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.substring(lastIndex, match.index));
      }
      const label = match[1];
      const url = match[2];
      parts.push(
        <a
          key={`link-${match.index}`}
          href={url}
          target={url.startsWith('http') ? '_blank' : undefined}
          rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-[#0F52BA] font-semibold underline underline-offset-2 hover:text-blue-700"
        >
          {label}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    // Now format bold tags **text**
    return parts.map((part, pIdx) => {
      if (typeof part !== 'string') return part;

      const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
      return (
        <React.Fragment key={pIdx}>
          {boldParts.map((sub, sIdx) => {
            if (sub.startsWith('**') && sub.endsWith('**')) {
              return (
                <strong key={sIdx} className="font-semibold text-slate-900">
                  {sub.slice(2, -2)}
                </strong>
              );
            }
            return sub;
          })}
        </React.Fragment>
      );
    });
  };

  return (
    <>
      {/* Floating Chat Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 lg:bottom-6 lg:right-6 z-40 flex items-center gap-3">
          {/* Subtle invitation tooltip on desktop only (hidden on mobile & tablet) */}
          <div className="hidden lg:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-slate-200/90 shadow-lg text-xs font-medium text-slate-700 pointer-events-none animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#0F52BA]" />
            <span>Chat with IAMTECHNI AI</span>
          </div>

          <button
            onClick={() => {
              setIsOpen(true);
              setIsMinimized(false);
            }}
            aria-label="Open IAMTECHNI AI Assistant"
            className="relative group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#0A192F] via-[#0F52BA] to-[#1266E8] text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300/50 p-2 sm:p-2.5"
          >
            <IamtechniLogo size="sm" showWordmark={false} className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
            <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-3.5 w-3.5 sm:h-4 sm:w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </button>
        </div>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          className={`fixed z-40 transition-all duration-300 ease-out flex flex-col bg-white border border-slate-200/90 shadow-2xl rounded-2xl overflow-hidden ${
            isMinimized
              ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-80 h-16'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[640px] max-h-[calc(100vh-3rem)]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-slate-900 via-[#0A192F] to-[#0F52BA] text-white border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/20 p-1">
                <IamtechniLogo size="sm" showWordmark={false} className="w-6 h-6" />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-sm tracking-tight text-white">
                    IAMTECHNI AI
                  </h3>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-400/30">
                    Gemini 3.8
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">Solutions Architect & Technical Advisor</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-300">
              <button
                onClick={handleClearHistory}
                title="Reset conversation"
                className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 p-1.5 flex items-center justify-center rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Clear chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 p-1.5 flex items-center justify-center rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Minimize chat"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close chat"
                className="min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 p-1.5 flex items-center justify-center rounded-lg hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body & Input (when not minimized) */}
          {!isMinimized && (
            <>
              {/* Quick Contact Bar */}
              <div className="bg-[#F8FAFC] border-b border-slate-200/80 px-4 py-1.5 md:py-2 flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-3">
                  <a
                    href={COMPANY_CONTACT.phoneTel}
                    className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center gap-1 font-semibold text-[#0F52BA] hover:underline"
                  >
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{COMPANY_CONTACT.phone}</span>
                  </a>
                  <span className="text-slate-300">|</span>
                  <a
                    href={COMPANY_CONTACT.emailMailto}
                    className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center gap-1 hover:text-slate-900"
                  >
                    <Mail className="w-3 h-3 text-slate-400" />
                    <span>info@iamtechni.in</span>
                  </a>
                </div>
                {onOpenProjectModal && (
                  <button
                    onClick={() => onOpenProjectModal()}
                    className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center justify-center text-[10px] font-semibold text-[#0F52BA] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    Book Call
                  </button>
                )}
              </div>

              {/* Messages Thread */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9FBFE]">
                {messages.map((message) => {
                  const isUser = message.role === 'user';
                  return (
                    <div
                      key={message.id}
                      className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-900 border border-slate-800 text-white flex items-center justify-center mt-1 p-0.5 shadow-2xs">
                          <IamtechniLogo size="sm" showWordmark={false} className="w-5 h-5" />
                        </div>
                      )}

                      <div
                        className={`max-w-[85%] rounded-2xl p-3.5 text-sm shadow-2xs ${
                          isUser
                            ? 'bg-gradient-to-r from-[#0F52BA] to-[#0A3D8F] text-white rounded-br-xs'
                            : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                        }`}
                      >
                        {isUser ? (
                          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        ) : (
                          <div>{renderFormattedText(message.content)}</div>
                        )}

                        <div
                          className={`mt-1.5 flex items-center justify-end text-[10px] ${
                            isUser ? 'text-blue-200' : 'text-slate-400'
                          }`}
                        >
                          <span>{message.timestamp}</span>
                        </div>
                      </div>

                      {isUser && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center mt-1 shadow-2xs">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-2.5 justify-start">
                    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center mt-1">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-white border border-slate-200/90 rounded-2xl rounded-bl-xs p-3.5 shadow-2xs">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"></span>
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
                        </span>
                        <span className="font-mono text-[11px]">Analyzing with Gemini...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Prompts */}
              {messages.length <= 2 && (
                <div className="p-3 bg-white border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Quick Inquiries
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_PROMPTS.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(prompt)}
                        className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center text-xs bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-[#0F52BA] px-2.5 py-1 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors text-left font-normal"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-200/90">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about architecture, services, feasibility..."
                    disabled={isLoading}
                    className="flex-1 bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2.5 min-h-[44px] md:min-h-0 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0F52BA] focus:ring-1 focus:ring-[#0F52BA] transition-all disabled:opacity-50"
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isLoading}
                    aria-label="Send message"
                    className="flex-shrink-0 flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] md:w-10 md:h-10 md:min-w-0 md:min-h-0 rounded-xl bg-[#0F52BA] text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-2xs"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Direct hotline: +91-7418120053</span>
                  {onNavigate && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        onNavigate('/contact');
                      }}
                      className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 inline-flex items-center text-[#0F52BA] hover:underline font-medium"
                    >
                      Contact Page →
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
