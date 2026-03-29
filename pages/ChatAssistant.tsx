import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, Shield, User, Loader2, Sparkles, Mic, MicOff, ShieldCheck } from 'lucide-react';
import { ChatMessage, MessageRole } from '../types';
import { sendMessageToGemini } from '../services/gemini';
import MessageContent from '../components/MessageContent';
import SigapMascot from '../components/SigapMascot';

const ChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: MessageRole.MODEL,
      text: 'Halo! Saya **SIGAP** \u2014 asisten AI keselamatan bencana dari **Cegah.AI** \ud83d\udee1\n\nSaya siap membantu kamu dengan:\n- Panduan evakuasi & kesiapsiagaan bencana\n- Analisis risiko wilayah Indonesia\n- Pertolongan pertama & protokol darurat\n- Informasi dari BMKG, BNPB, dan Basarnas\n\nAda situasi yang perlu diantisipasi? Ceritakan, saya di sini.',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Web Speech API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.lang = 'id-ID';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
      if (navigator.vibrate) navigator.vibrate(50);
    }
  }, [isListening]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async () => {
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
      // Build valid history for Gemini Chat API:
      // 1. Exclude error messages (isError: true)
      // 2. Start from first USER message (skip initial bot greeting)
      // 3. Only include complete user+model pairs (history must end with model)
      const validMessages = messages.filter(m => !m.isError);
      const firstUserIndex = validMessages.findIndex(m => m.role === MessageRole.USER);
      const history: { role: string; parts: { text: string }[] }[] = [];

      if (firstUserIndex >= 0) {
        const conversationMessages = validMessages.slice(firstUserIndex);
        for (let i = 0; i + 1 < conversationMessages.length; i += 2) {
          const userM = conversationMessages[i];
          const modelM = conversationMessages[i + 1];
          if (userM?.role === MessageRole.USER && modelM?.role === MessageRole.MODEL) {
            history.push({ role: 'user', parts: [{ text: userM.text }] });
            history.push({ role: 'model', parts: [{ text: modelM.text }] });
          }
        }
      }

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
  }, [input, isLoading, messages]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }, []);

  const quickActions = useMemo(() => [
    '🌊 Tanda-tanda tsunami?',
    '🏃 Cara evakuasi saat gempa',
    '🌧️ Persiapan musim hujan',
    '🎒 Isi tas siaga bencana',
    '📞 Nomor darurat bencana',
  ], []);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-screen">
      {/* Chat Header */}
      <div className="glass dark:glass-dark border-b border-slate-100 dark:border-slate-700 px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-gradient-to-br from-red-600 to-rose-500 p-2.5 rounded-2xl shadow-lg shadow-red-500/30">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white dark:border-slate-900"></div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              SIGAP
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
            </h3>
            <p className="text-[11px] text-green-500 font-medium">Aktif · Penjaga Keselamatan AI</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-gradient-to-b from-slate-50/50 to-white dark:from-slate-900 dark:to-slate-900">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`flex w-full animate-fade-in ${
              msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex max-w-[80%] md:max-w-[65%] ${
                msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'
              } gap-2.5`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center shadow-sm ${
                  msg.role === MessageRole.USER
                    ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-white'
                    : 'bg-gradient-to-br from-red-600 to-rose-500 text-white shadow-md shadow-red-500/20'
                }`}
              >
                {msg.role === MessageRole.USER ? (
                  <User size={14} />
                ) : (
                  <Shield size={14} />
                )}
              </div>
              <div>
                <div
                  className={`px-4 py-3 text-[15px] leading-relaxed shadow-sm ${
                    msg.role === MessageRole.USER
                      ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-2xl rounded-tr-md'
                      : msg.isError 
                        ? 'bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-300 rounded-2xl rounded-tl-md'
                        : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl rounded-tl-md'
                  }`}
                >
                  <MessageContent
                    content={msg.text}
                    isUser={msg.role === MessageRole.USER}
                  />
                </div>
                <p className={`text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 px-1 ${msg.role === MessageRole.USER ? 'text-right' : ''}`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Quick Actions - show only when there's just the greeting */}
        {messages.length === 1 && !isLoading && (
          <div className="flex flex-col items-center gap-4 mt-2 animate-slide-up">
            <SigapMascot mood="idle" size={130} label="SIGAP siap membantu kamu" />
          <div className="flex flex-wrap gap-2 justify-center">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => { setInput(action); }}
                className="text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/30 hover:border-red-200 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
              >
                {action}
              </button>
            ))}
          </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start w-full animate-fade-in">
            <div className="flex flex-row gap-2.5 max-w-[80%]">
              <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center">
                <SigapMascot mood="thinking" size={36} />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-tl-md shadow-sm flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-red-300 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-red-300 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-red-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
                <span className="ml-1 text-xs text-slate-400 font-medium">SIGAP menganalisis...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass dark:glass-dark border-t border-slate-100 dark:border-slate-700 p-4 md:px-6">
        <div className="relative flex items-center gap-2">
          {/* Voice Input Button */}
          {recognitionRef.current && (
            <button
              onClick={toggleListening}
              disabled={isLoading}
              className={`p-3.5 rounded-2xl transition-all duration-300 flex-shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse-soft shadow-lg shadow-red-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-500'
              }`}
              title={isListening ? 'Berhenti mendengarkan' : 'Bicara untuk mengetik'}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? '🎙️ SIGAP sedang mendengarkan...' : 'Tanya SIGAP tentang kesiapsiagaan bencana...'}
            className={`flex-1 px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-300 dark:focus:border-red-600 text-[15px] text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all duration-200 ${
              isListening ? 'border-red-300 dark:border-red-600 ring-2 ring-red-500/20' : 'border-slate-200 dark:border-slate-700'
            }`}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3.5 rounded-2xl transition-all duration-300 flex-shrink-0 ${
              !input.trim() || isLoading
                ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg hover:shadow-red-500/25 active:scale-95'
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