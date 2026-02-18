// Market Data Types
export interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  changePercent24h: number;
  dominance?: number;
}

export interface MarketOverview {
  data: CryptoAsset[];
  timestamp: string;
  totalMarketCap: number;
}

// Technical Analysis Types
export interface TechnicalAnalysis {
  symbol: string;
  timeframe: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  support: number[];
  resistance: number[];
  indicators: {
    rsi: number;
    macd: {
      value: number;
      signal: number;
      histogram: number;
    };
    movingAverages: {
      sma20: number;
      sma50: number;
      sma200: number;
    };
  };
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  strength: number;
  confidence: number;
}

// Price Prediction Types
export interface PricePrediction {
  symbol: string;
  hoursAhead: number;
  currentPrice: number;
  predictedPrice: number;
  changePercent: number;
  direction: 'up' | 'down' | 'neutral';
  confidence: number;
  scenarioAnalysis: {
    bearishCase: number;
    baseCase: number;
    bullishCase: number;
  };
  supportingFactors: string[];
  riskFactors: string[];
}

// Trading Signal Types
export interface TradingSignal {
  id: string;
  symbol: string;
  signal: 'buy' | 'sell' | 'hold';
  strength: 'strong' | 'moderate' | 'weak';
  reason: string;
  targetPrice?: number;
  stopLoss?: number;
  timestamp: Date;
}

// Chart Data Types
export interface ChartDataPoint {
  time: string;
  price: number;
  volume?: number;
}

// User Settings Types
export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  priceAlerts: boolean;
  priceThreshold: number;
  chartType: 'area' | 'line' | 'candlestick';
  rsiPeriod: number;
  smaPeriods: number[];
  advancedIndicators: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  error?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  parts?: Array<{
    type: 'text';
    text: string;
  }>;
  timestamp: Date;
}

// Tool Types
export interface ToolInput {
  [key: string]: string | number | boolean | string[] | undefined;
}

export interface ToolResult {
  symbol?: string;
  price?: number;
  [key: string]: any;
}
