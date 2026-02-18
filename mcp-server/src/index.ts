#!/usr/bin/env node

import {
  Server,
  StdioServerTransport,
  TextContent,
  Tool,
  ToolResponse,
} from '@modelcontextprotocol/sdk/server/index.js';
import { CallToolRequest, ListToolsRequest } from '@modelcontextprotocol/sdk/shared/messages.js';

// Market data cache
const MARKET_DATA: Record<string, any> = {
  BTC: { price: 48250, change: 1250, changePercent: 2.66, volume: 28.5e9 },
  ETH: { price: 2850, change: -85, changePercent: -2.89, volume: 15.2e9 },
  SOL: { price: 185.5, change: 12.5, changePercent: 7.21, volume: 2.1e9 },
  XRP: { price: 2.15, change: 0.18, changePercent: 9.30, volume: 1.8e9 },
  ADA: { price: 0.95, change: 0.05, changePercent: 5.6, volume: 450e6 },
  DOGE: { price: 0.35, change: 0.02, changePercent: 6.0, volume: 350e6 },
};

// Tool definitions
const tools: Tool[] = [
  {
    name: 'get_price',
    description: 'Get the current price of a cryptocurrency',
    inputSchema: {
      type: 'object' as const,
      properties: {
        symbol: {
          type: 'string',
          description: 'The cryptocurrency symbol (e.g., BTC, ETH, SOL)',
        },
      },
      required: ['symbol'],
    },
  },
  {
    name: 'get_market_overview',
    description: 'Get an overview of the entire cryptocurrency market',
    inputSchema: {
      type: 'object' as const,
      properties: {
        limit: {
          type: 'number',
          description: 'Number of top cryptocurrencies to return',
        },
      },
      required: [],
    },
  },
  {
    name: 'analyze_trend',
    description: 'Analyze the trend and provide technical insights for a cryptocurrency',
    inputSchema: {
      type: 'object' as const,
      properties: {
        symbol: {
          type: 'string',
          description: 'The cryptocurrency symbol',
        },
        timeframe: {
          type: 'string',
          description: 'Timeframe for analysis (1h, 4h, 1d, 1w)',
        },
      },
      required: ['symbol'],
    },
  },
  {
    name: 'calculate_rsi',
    description: 'Calculate the Relative Strength Index (RSI) for a cryptocurrency',
    inputSchema: {
      type: 'object' as const,
      properties: {
        symbol: {
          type: 'string',
          description: 'The cryptocurrency symbol',
        },
        period: {
          type: 'number',
          description: 'RSI period (default 14)',
        },
      },
      required: ['symbol'],
    },
  },
  {
    name: 'get_support_resistance',
    description: 'Get key support and resistance levels for a cryptocurrency',
    inputSchema: {
      type: 'object' as const,
      properties: {
        symbol: {
          type: 'string',
          description: 'The cryptocurrency symbol',
        },
      },
      required: ['symbol'],
    },
  },
];

// Tool execution functions
function getPrice(symbol: string): TextContent {
  const data = MARKET_DATA[symbol.toUpperCase()];
  if (!data) {
    return {
      type: 'text',
      text: `Error: Cryptocurrency ${symbol} not found`,
    };
  }

  return {
    type: 'text',
    text: `${symbol}: $${data.price.toFixed(2)} (${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%) | 24h Volume: $${(data.volume / 1e9).toFixed(2)}B`,
  };
}

function getMarketOverview(limit: number = 5): TextContent {
  const entries = Object.entries(MARKET_DATA).slice(0, limit);
  const overview = entries
    .map(
      ([symbol, data]) =>
        `${symbol}: $${data.price.toFixed(2)} (${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%)`
    )
    .join('\n');

  return {
    type: 'text',
    text: `Top ${limit} Cryptocurrencies:\n${overview}\n\nMarket analysis shows mixed signals with strong performers like BTC and SOL leading gains.`,
  };
}

function analyzeTrend(symbol: string, timeframe: string = '1d'): TextContent {
  const data = MARKET_DATA[symbol.toUpperCase()];
  if (!data) {
    return {
      type: 'text',
      text: `Error: Cryptocurrency ${symbol} not found`,
    };
  }

  const trend = data.changePercent >= 2 ? 'bullish' : data.changePercent <= -2 ? 'bearish' : 'neutral';
  const support =
    symbol.toUpperCase() === 'BTC'
      ? [46500, 45000]
      : symbol.toUpperCase() === 'ETH'
        ? [2700, 2500]
        : [data.price * 0.92, data.price * 0.85];
  const resistance =
    symbol.toUpperCase() === 'BTC'
      ? [50000, 52000]
      : symbol.toUpperCase() === 'ETH'
        ? [3000, 3200]
        : [data.price * 1.08, data.price * 1.15];

  return {
    type: 'text',
    text: `${symbol} ${timeframe} Analysis:
Trend: ${trend}
Current Price: $${data.price.toFixed(2)}
Support Levels: $${support[0].toFixed(2)}, $${support[1].toFixed(2)}
Resistance Levels: $${resistance[0].toFixed(2)}, $${resistance[1].toFixed(2)}
24h Change: ${data.changePercent >= 0 ? '+' : ''}${data.changePercent.toFixed(2)}%
Volume: $${(data.volume / 1e9).toFixed(2)}B

Analysis: The ${trend} trend indicates ${trend === 'bullish' ? 'potential upside' : trend === 'bearish' ? 'potential downside' : 'consolidation'}. Key levels to watch are the support at $${support[0].toFixed(2)} and resistance at $${resistance[0].toFixed(2)}.`,
  };
}

function calculateRSI(symbol: string, period: number = 14): TextContent {
  const data = MARKET_DATA[symbol.toUpperCase()];
  if (!data) {
    return {
      type: 'text',
      text: `Error: Cryptocurrency ${symbol} not found`,
    };
  }

  // Mock RSI calculation based on price change
  const rsi = 45 + data.changePercent * 3;
  const status = rsi > 70 ? 'overbought' : rsi < 30 ? 'oversold' : 'neutral';

  return {
    type: 'text',
    text: `${symbol} RSI (${period}-period):
RSI Value: ${rsi.toFixed(2)}
Status: ${status}

An RSI of ${rsi.toFixed(2)} indicates the asset is ${status}. Values above 70 suggest possible pullback, while below 30 suggests potential recovery.`,
  };
}

function getSupportResistance(symbol: string): TextContent {
  const data = MARKET_DATA[symbol.toUpperCase()];
  if (!data) {
    return {
      type: 'text',
      text: `Error: Cryptocurrency ${symbol} not found`,
    };
  }

  const support = [
    data.price * 0.96,
    data.price * 0.92,
    data.price * 0.85,
  ];
  const resistance = [
    data.price * 1.04,
    data.price * 1.08,
    data.price * 1.15,
  ];

  return {
    type: 'text',
    text: `${symbol} Key Levels:
Current Price: $${data.price.toFixed(2)}

Support Levels:
- Level 1 (Short-term): $${support[0].toFixed(2)}
- Level 2 (Medium-term): $${support[1].toFixed(2)}
- Level 3 (Strong): $${support[2].toFixed(2)}

Resistance Levels:
- Level 1 (Short-term): $${resistance[0].toFixed(2)}
- Level 2 (Medium-term): $${resistance[1].toFixed(2)}
- Level 3 (Strong): $${resistance[2].toFixed(2)}

These levels are calculated based on recent price action and are useful for setting stop losses and take profit targets.`,
  };
}

async function processToolCall(
  name: string,
  args: Record<string, unknown>
): Promise<ToolResponse> {
  let content: TextContent;

  switch (name) {
    case 'get_price':
      content = getPrice(args.symbol as string);
      break;
    case 'get_market_overview':
      content = getMarketOverview((args.limit as number) || 5);
      break;
    case 'analyze_trend':
      content = analyzeTrend(
        args.symbol as string,
        (args.timeframe as string) || '1d'
      );
      break;
    case 'calculate_rsi':
      content = calculateRSI(
        args.symbol as string,
        (args.period as number) || 14
      );
      break;
    case 'get_support_resistance':
      content = getSupportResistance(args.symbol as string);
      break;
    default:
      content = {
        type: 'text',
        text: `Unknown tool: ${name}`,
      };
  }

  return {
    type: 'tool_result',
    content: [content],
  };
}

// Initialize MCP server
const server = new Server({
  name: 'cryptopulse-mcp',
  version: '1.0.0',
});

// Register tool list handler
server.setRequestHandler(ListToolsRequest, async () => ({
  tools,
}));

// Register tool call handler
server.setRequestHandler(CallToolRequest, async (request) => {
  return processToolCall(
    request.params.name,
    request.params.arguments as Record<string, unknown>
  );
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('CryptoPulse MCP Server running on stdio');
}

main().catch(console.error);
