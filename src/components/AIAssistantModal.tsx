import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, X, Bot, User, Loader2, ArrowRight } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistantModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { user } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello ${
        user?.name ? user.name.split(' ')[0] : 'there'
      }! I am your LearnX AI Assistant. I can help you find compatible mentors, structure reciprocal learning sessions, or create a study outline. How can I help you today?`
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          userContext: user
            ? {
                name: user.name,
                canTeach: user.canTeach,
                wantsToLearn: user.wantsToLearn,
                timeCredits: user.timeCredits
              }
            : null
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'AI request failed');
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.reply
        }
      ]);
    } catch (err: any) {
      console.error('AI chat error:', err);
      setError(err.message || 'Unable to connect to AI server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'How do I earn my first Time Credit?',
    'What should I teach if I know Python?',
    'Help me prepare a 45-minute lesson agenda'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[600px] max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#18050e] to-[#340b20] text-white flex items-center justify-between border-b border-pink-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">LearnX AI Assistant</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-950 text-pink-300 border border-pink-800 font-semibold">
                  OpenAI Active
                </span>
              </div>
              <p className="text-[11px] text-pink-200/80">Skill exchange advisor & session coach</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-pink-200/70 hover:text-white hover:bg-pink-900/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-tr-xs shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
              <Loader2 className="w-4 h-4 animate-spin text-pink-600" />
              <span>OpenAI is analyzing your learning journey...</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 bg-slate-100/70 border-t border-slate-200 flex flex-wrap gap-1.5">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white hover:bg-pink-50 border border-slate-200 hover:border-pink-300 text-slate-700 hover:text-pink-700 transition-colors flex items-center gap-1 text-left"
              >
                <span>{prompt}</span>
                <ArrowRight className="w-2.5 h-2.5 opacity-60" />
              </button>
            ))}
          </div>
        )}

        {/* Chat Input */}
        <div className="p-3 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about skills, mentors, or session prep..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-pink-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-sm"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>Model: gpt-4o-mini (OpenAI API Active)</span>
            <span>Real database matching</span>
          </div>
        </div>

      </div>
    </div>
  );
};
