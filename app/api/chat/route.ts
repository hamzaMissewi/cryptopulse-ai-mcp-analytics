import { google } from '@ai-sdk/google';
import { createAgentUIStreamResponse, tool, ToolLoopAgent } from 'ai';
import { z } from 'zod';

// Define tools for the MCP server
const tools = {
  getCurrentPrice: tool({
    description: 'Get the current price of a cryptocurrency',
    inputSchema: z.object({
      symbol: z.string().describe('The cryptocurrency symbol (e.g., BTC, ETH)'),
    }),
    execute: async ({ symbol }) => {
      // Mock cryptocurrency prices
      const prices: Record<string, number> = {
        BTC: 48250,
        ETH: 2850,
        SOL: 185.5,
        XRP: 2.15,
        ADA: 0.95,
        DOGE: 0.35,
      };
      return {
        symbol,
        price: prices[symbol.toUpperCase()] || 0,
        currency: 'USD',
      };
    },
  }),

  getMarketData: tool({
    description: 'Get detailed market data for multiple cryptocurrencies',
    inputSchema: z.object({
      symbols: z.array(z.string()).describe('Array of cryptocurrency symbols'),
      timeframe: z.enum(['24h', '7d', '30d']).optional().describe('The timeframe for analysis'),
    }),
    execute: async ({ symbols, timeframe = '24h' }) => {
      const marketData = {
        BTC: { price: 48250, change: 1250, changePercent: 2.66, volume: 28.5e9 },
        ETH: { price: 2850, change: -85, changePercent: -2.89, volume: 15.2e9 },
        SOL: { price: 185.5, change: 12.5, changePercent: 7.21, volume: 2.1e9 },
        XRP: { price: 2.15, change: 0.18, changePercent: 9.30, volume: 1.8e9 },
      };

      return {
        timeframe,
        data: symbols.map((symbol) => ({
          symbol,
          ...marketData[symbol as keyof typeof marketData],
        })),
      };
    },
  }),

  analyzeTrend: tool({
    description: 'Analyze the trend and provide technical analysis for a cryptocurrency',
    inputSchema: z.object({
      symbol: z.string().describe('The cryptocurrency symbol'),
      timeframe: z.enum(['1h', '4h', '1d', '1w']).optional().describe('Timeframe for analysis'),
    }),
    execute: async ({ symbol, timeframe = '1d' }) => {
      // Mock technical analysis
      const analysis = {
        symbol,
        timeframe,
        trend: symbol === 'BTC' || symbol === 'SOL' ? 'bullish' : 'bearish',
        support: symbol === 'BTC' ? 46500 : 2700,
        resistance: symbol === 'BTC' ? 50000 : 3000,
        rsi: Math.random() * 100,
        macd: Math.random() > 0.5 ? 'bullish' : 'bearish',
        recommendation: 'hold',
      };
      return analysis;
    },
  }),

  getNews: tool({
    description: 'Get latest news about cryptocurrencies',
    inputSchema: z.object({
      symbol: z.string().optional().describe('Specific cryptocurrency symbol'),
      limit: z.number().optional().describe('Number of news items to return'),
    }),
    execute: async ({ symbol, limit = 5 }) => {
      return {
        symbol: symbol || 'general',
        count: limit,
        news: [
          {
            id: '1',
            title: 'Bitcoin breaks above $48k resistance level',
            source: 'CryptoNews',
            timestamp: new Date().toISOString(),
          },
          {
            id: '2',
            title: 'Ethereum staking rewards increase by 15%',
            source: 'DeFi Times',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: '3',
            title: 'Major exchange launches new trading pairs',
            source: 'Trading Updates',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
          },
        ].slice(0, limit),
      };
    },
  }),

  predictPrice: tool({
    description: 'Predict the future price of a cryptocurrency based on AI analysis',
    inputSchema: z.object({
      symbol: z.string().describe('The cryptocurrency symbol'),
      hoursAhead: z.number().optional().describe('Number of hours to predict ahead'),
    }),
    execute: async ({ symbol, hoursAhead = 24 }) => {
      const currentPrices: Record<string, number> = {
        BTC: 48250,
        ETH: 2850,
        SOL: 185.5,
      };

      const currentPrice = currentPrices[symbol.toUpperCase()] || 100;
      const prediction = currentPrice * (1 + (Math.random() - 0.5) * 0.1);

      return {
        symbol,
        hoursAhead,
        currentPrice,
        predictedPrice: Math.round(prediction * 100) / 100,
        confidence: 0.75 + Math.random() * 0.2,
        direction: prediction > currentPrice ? 'up' : 'down',
      };
    },
  }),
};

const systemPrompt = `You are CryptoPulse, an expert cryptocurrency analyst and market intelligence AI assistant. You have access to real-time market data, technical analysis tools, and AI-powered price prediction capabilities.

Your role is to:
1. Provide accurate, data-driven insights about cryptocurrency markets
2. Analyze trends using technical indicators (RSI, MACD, support/resistance levels)
3. Offer trading recommendations based on market analysis
4. Explain complex crypto concepts in simple terms
5. Use the available tools to gather real-time data and provide informed analysis
6. Always emphasize risk management and the importance of doing own research

When users ask about specific cryptocurrencies or market conditions, use the available tools to:
- Check current prices (getCurrentPrice)
- Get comprehensive market data (getMarketData)
- Analyze technical trends (analyzeTrend)
- Retrieve relevant news (getNews)
- Provide AI-powered price predictions (predictPrice)

Always be helpful, accurate, and honest about market risks. Never provide financial advice, only analysis and information.`;

const agent = new ToolLoopAgent({
  model: google('gemini-2.0-flash'),
  instructions: systemPrompt,
  tools,
  maxSteps: 10,
});

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    return createAgentUIStreamResponse({
      agent,
      uiMessages: messages,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process chat request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
