'use client';

// import { DefaultChatTransport } from 'ai';
import { useRef, useEffect, useState, SubmitEvent } from 'react';
import { useChat } from '@ai-sdk/react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Menu, X, Zap } from 'lucide-react';

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const MOCK_MARKET_DATA: MarketData[] = [
  { symbol: 'BTC', price: 48250, change: 1250, changePercent: 2.66 },
  { symbol: 'ETH', price: 2850, change: -85, changePercent: -2.89 },
  { symbol: 'SOL', price: 185.5, change: 12.5, changePercent: 7.21 },
  { symbol: 'XRP', price: 2.15, change: 0.18, changePercent: 9.30 },
];

function extractMessageText(message: any): string {
  if (typeof message.content === 'string') {
    return message.content;
  }
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((p: any) => p.type === 'text')
      .map((p: any) => p.text)
      .join('');
  }
  return '';
}

export default function Dashboard() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  // const { messages, input, handleInputChange, handleSubmit, status } = useChat();
  const { messages, input, setInput, handleInputChange, handleSubmit: handleChatSubmit, setMessages, append, status } = useChat({
    api: '/api/chat',
    // initialMessages: [
    //   {
    //     role: 'system',
    //     content:
    //       'You are CryptoPulse AI, a professional crypto market analyst. Provide clear, concise, data-driven insights about crypto markets.',
    //   },
    // ],
    // onError(err: string) {
    //   console.error('Chat error:', err);
    // },
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      append({ role: 'user', content: input });
      setInput('');
    }
  };

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? 'w-64' : 'w-0'
          } transition-all duration-300 border-r border-border bg-card hidden md:block overflow-hidden`}
      >
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-6 h-6 text-accent" />
            <h1 className="text-xl font-bold">CryptoPulse</h1>
          </div>
          <p className="text-sm text-muted-foreground">AI-Powered Crypto Analytics</p>
        </div>
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Market Overview</h3>
          {MOCK_MARKET_DATA.map((market) => (
            <div
              key={market.symbol}
              className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium">{market.symbol}</span>
                <span className={market.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%
                </span>
              </div>
              <p className="text-sm text-muted-foreground">${market.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden text-foreground hover:text-accent transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-xl font-bold">Market Analysis Chat</h2>
          </div>
          <div className="text-sm text-muted-foreground">AI-Powered Analysis</div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4 md:p-6">
            <div className="space-y-4 mb-4">
              {messages.length === 0 && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-foreground px-4 py-3 rounded-lg">
                    <p className="text-sm md:text-base">
                      Welcome to CryptoPulse! I&apos;m your AI market analyst. Ask me about real-time cryptocurrency trends, market analysis, or trading insights. I have access to live market data and technical analysis tools.
                    </p>
                  </div>
                </div>
              )}
              {messages.map((message, idx) => {
                const messageText = extractMessageText(message);
                return (
                  <div
                    key={idx}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${message.role === 'user'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-secondary text-foreground'
                        }`}
                    >
                      <p className="text-sm md:text-base whitespace-pre-wrap">{messageText}</p>
                    </div>
                  </div>
                );
              })}
              {status === "streaming" && (
                <div className="flex justify-start">
                  <div className="bg-secondary text-foreground px-4 py-3 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border bg-card p-4">
            <form onSubmit={onSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about Bitcoin, Ethereum, market trends, price predictions..."
                className="flex-1 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                disabled={status === "streaming"}
              />
              <Button
                type="submit"
                disabled={status === "streaming" || !input?.trim()}
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
