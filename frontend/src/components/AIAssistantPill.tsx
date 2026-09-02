import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Shirt, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface QuickPrompt {
  id: string;
  icon: React.ReactNode;
  label: string;
  response: string;
}

const quickPrompts: QuickPrompt[] = [
  {
    id: 'size',
    icon: <Shirt className="w-3.5 h-3.5 text-[var(--color-accent)]" />,
    label: 'Size & Fit Guide',
    response: 'Our silhouettes feature a relaxed, contemporary drape. If you prefer a tailored fit, we recommend ordering your standard size. For an oversized aesthetic, choose one size up.'
  },
  {
    id: 'fabric',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />,
    label: 'Fabric & Linen Care',
    response: 'All garments are tailored from 100% natural fibers (French Flax Linen, Egyptian Giza Cotton, and Raw Selvedge Denim). Wash cold on delicate cycle and line dry in shade.'
  },
  {
    id: 'delivery',
    icon: <Truck className="w-3.5 h-3.5 text-blue-600" />,
    label: 'Delivery & COD',
    response: 'We offer nationwide Cash on Delivery (COD) across Pakistan. Orders over Rs. 5,000 enjoy complimentary express shipping with 2–4 business days delivery.'
  },
  {
    id: 'exchange',
    icon: <RotateCcw className="w-3.5 h-3.5 text-amber-600" />,
    label: '7-Day Exchanges',
    response: 'We provide hassle-free 7-day doorstep size exchanges. Our courier collects the item directly from your doorstep when delivering your new size.'
  }
];

export default function AIAssistantPill() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your Atelier Garments Concierge. How can I assist you with sizing, fabric care, or order questions today?'
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInputMessage('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `Thank you for asking about "${userText}". Our atelier pieces are crafted with breathable natural fabrics. If you need immediate assistance with orders or custom measurements, our client support team is also active nationwide!`
        }
      ]);
    }, 600);
  };

  const handlePromptClick = (prompt: QuickPrompt) => {
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: prompt.label },
      { sender: 'ai', text: prompt.response }
    ]);
  };

  return (
    <>
      {/* Floating Pill Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group bg-[var(--color-primary)] text-white px-4 py-3 rounded-full shadow-xl border border-stone-700/60 flex items-center space-x-2.5 transition-all"
          aria-label="Atelier AI Concierge"
        >
          {/* Animated Glow Ring */}
          <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-amber-500/40 via-stone-400/30 to-indigo-500/40 blur-xs opacity-75 group-hover:opacity-100 transition duration-500 animate-pulse" />

          <div className="relative flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs uppercase tracking-wider font-bold text-stone-100">
              Atelier AI Assistant
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </motion.button>
      </div>

      {/* Floating Concierge Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="fixed bottom-20 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-96 bg-white/98 backdrop-blur-xl border border-stone-200/90 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden max-h-[520px]"
          >
            {/* Header */}
            <div className="p-4 bg-[var(--color-primary)] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Atelier Concierge
                  </h3>
                  <p className="text-[10px] text-stone-400 font-medium flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    <span>Garment & Fit AI Online</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--color-background)]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-[var(--color-primary)] text-white rounded-br-none shadow-xs font-medium'
                        : 'bg-white border border-stone-200/80 text-stone-800 rounded-bl-none shadow-2xs font-normal'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Prompt Pills */}
            <div className="p-2.5 bg-white border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {quickPrompts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePromptClick(p)}
                  className="shrink-0 px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200/90 text-[10px] font-bold text-stone-700 hover:text-stone-950 flex items-center space-x-1.5 transition active:scale-95"
                >
                  <span>{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200/80 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask about sizes, fabrics, or delivery..."
                className="flex-1 px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-[var(--color-primary)]"
              />
              <button
                type="submit"
                className="p-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white rounded-xl transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
