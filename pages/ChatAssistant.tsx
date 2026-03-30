import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Send, Shield, User, Mic, MicOff, ShieldCheck } from 'lucide-react';
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
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
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
      setIsSpeechSupported(true);
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
    { emoji: '🌊', label: 'Tanda-tanda tsunami?' },
    { emoji: '🏃', label: 'Cara evakuasi saat gempa' },
    { emoji: '🌧️', label: 'Persiapan musim hujan' },
    { emoji: '🎒', label: 'Isi tas siaga bencana' },
    { emoji: '📞', label: 'Nomor darurat bencana' },
  ], []);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-screen">
      {/* Chat Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-red-600 p-2 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white dark:ring-slate-900"></div>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">SIGAP</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Asisten Keselamatan AI · <span className="text-green-500">Online</span></p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 custom-scrollbar bg-slate-50 dark:bg-slate-950">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full animate-fade-in ${
              msg.role === MessageRole.USER ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`flex max-w-[85%] md:max-w-[70%] ${
                msg.role === MessageRole.USER ? 'flex-row-reverse' : 'flex-row'
              } gap-2 items-end`}
            >
              <div
                className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
                  msg.role === MessageRole.USER
                    ? 'bg-slate-700 text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {msg.role === MessageRole.USER ? (
                  <User size={14} />
                ) : (
                  <Shield size={13} />
                )}
              </div>
              <div className="min-w-0">
                <div
                  className={`px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === MessageRole.USER
                      ? 'bg-slate-800 dark:bg-slate-700 text-white rounded-2xl rounded-br-sm'
                      : msg.isError 
                        ? 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 rounded-2xl rounded-bl-sm'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl rounded-bl-sm'
                  }`}
                >
                  <MessageContent
                    content={msg.text}
                    isUser={msg.role === MessageRole.USER}
                  />
                </div>
                <p className={`text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 ${
                  msg.role === MessageRole.USER ? 'text-right' : ''
                }`}>
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Quick Actions - show only when there's just the greeting */}
        {messages.length === 1 && !isLoading && (
          <div className="flex flex-col items-center gap-5 mt-4 animate-slide-up">
            <SigapMascot mood="idle" size={100} label="SIGAP siap membantu" />
            <div className="w-full max-w-md space-y-2 px-2">
              <p className="text-xs text-slate-400 dark:text-slate-500 text-center font-medium mb-2">Coba tanyakan:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickActions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setInput(`${action.emoji} ${action.label}`); }}
                    className="text-xs bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 px-3 py-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-800 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    {action.emoji} {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex justify-start w-full animate-fade-in">
            <div className="flex flex-row gap-2 items-end">
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-red-600 flex items-center justify-center">
                <Shield size={13} className="text-white" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  <span className="ml-1.5 text-xs text-slate-400">Mengetik...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          {isSpeechSupported && (
            <button
              onClick={toggleListening}
              disabled={isLoading}
              className={`p-2.5 rounded-xl transition-colors flex-shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse-soft'
                  : 'text-slate-400 dark:text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800'
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
            placeholder={isListening ? '🎙️ Mendengarkan...' : 'Tulis pesan...'}
            className={`flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 dark:focus:border-red-600 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors ${
              isListening ? 'border-red-300 dark:border-red-600' : 'border-transparent'
            }`}
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl transition-colors flex-shrink-0 ${
              !input.trim() || isLoading
                ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
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