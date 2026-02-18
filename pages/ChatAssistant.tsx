import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage, MessageRole } from '../types';
import { sendMessageToGemini } from '../services/gemini';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: MessageRole.MODEL,
      text: 'Halo! Saya CegahBot. Ada yang bisa saya bantu terkait kesiapsiagaan bencana atau pertolongan pertama?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      text: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for context
      const history = messages.map(m => ({
        role: m.role === MessageRole.USER ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const responseText = await sendMessageToGemini(userMsg.text, history);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: MessageRole.MODEL,
        text: "Maaf, terjadi kesalahan jaringan. Silakan coba lagi.",
        timestamp: new Date(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
            <div
                key={msg.id}
                className={`flex w-full ${
                msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'
                }`}
            >
                <div
                className={`flex max-w-[85%] ${
                    msg.role === MessageRole.USER
                    ? 'flex-row-reverse'
                    : 'flex-row'
                } gap-2`}
                >
                <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === MessageRole.USER
                        ? 'bg-slate-700 text-white'
                        : 'bg-red-100 text-red-600'
                    }`}
                >
                    {msg.role === MessageRole.USER ? (
                    <User size={16} />
                    ) : (
                    <Bot size={16} />
                    )}
                </div>
                <div
                    className={`p-3 rounded-2xl text-base leading-relaxed shadow-sm ${
                    msg.role === MessageRole.USER
                        ? 'bg-slate-700 text-white rounded-tr-none'
                        : msg.isError 
                            ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-none'
                            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                    }`}
                >
                    {msg.text}
                </div>
                </div>
            </div>
            ))}
            {isLoading && (
            <div className="flex justify-start w-full">
                <div className="flex flex-row gap-2 max-w-[85%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                    <Bot size={16} />
                </div>
                <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center">
                    <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                    <span className="ml-2 text-sm text-slate-400">Sedang berpikir...</span>
                </div>
                </div>
            </div>
            )}
            <div ref={messagesEndRef} />
        </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tanya tentang banjir, gempa..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-base"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 p-2 rounded-full transition-colors ${
              !input.trim() || isLoading
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 shadow-sm'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;