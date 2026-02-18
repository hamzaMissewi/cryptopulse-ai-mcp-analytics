import { NextRequest, NextResponse } from 'next/server';

interface TechnicalAnalysis {
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
  strength: number; // 0-100
  confidence: number; // 0-100
}

const SUPPORT_LEVELS: Record<string, Record<string, number[]>> = {
  BTC: { '1d': [46500, 45000, 43000], '4h': [47500, 46500, 45000] },
  ETH: { '1d': [2700, 2500, 2300], '4h': [2750, 2700, 2600] },
  SOL: { '1d': [170, 150, 130], '4h': [180, 170, 150] },
  XRP: { '1d': [1.95, 1.75, 1.50], '4h': [2.05, 1.95, 1.75] },
};

const RESISTANCE_LEVELS: Record<string, Record<string, number[]>> = {
  BTC: { '1d': [50000, 52000, 55000], '4h': [49000, 50000, 51000] },
  ETH: { '1d': [3000, 3200, 3500], '4h': [2900, 3000, 3100] },
  SOL: { '1d': [200, 220, 250], '4h': [190, 200, 215] },
  XRP: { '1d': [2.35, 2.55, 2.85], '4h': [2.25, 2.35, 2.50] },
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol')?.toUpperCase() || 'BTC';
  const timeframe = searchParams.get('timeframe') || '1d';

  try {
    const supportLevels = SUPPORT_LEVELS[symbol]?.[timeframe] || [40000, 35000, 30000];
    const resistanceLevels = RESISTANCE_LEVELS[symbol]?.[timeframe] || [60000, 70000, 80000];

    const rsi = 45 + Math.random() * 30; // RSI between 45-75
    const macdValue = Math.random() * 2 - 1; // MACD between -1 and 1
    const trendValue = macdValue > 0 ? 'bullish' : macdValue < -0.2 ? 'bearish' : 'neutral';

    const analysis: TechnicalAnalysis = {
      symbol,
      timeframe,
      trend: trendValue as 'bullish' | 'bearish' | 'neutral',
      support: supportLevels,
      resistance: resistanceLevels,
      indicators: {
        rsi,
        macd: {
          value: macdValue,
          signal: macdValue - 0.05,
          histogram: 0.1,
        },
        movingAverages: {
          sma20: 47800 + Math.random() * 1000,
          sma50: 46500 + Math.random() * 2000,
          sma200: 44000 + Math.random() * 3000,
        },
      },
      recommendation: rsi > 70 ? 'sell' : rsi < 30 ? 'buy' : 'hold',
      strength: Math.random() * 50 + 50,
      confidence: Math.random() * 30 + 70,
    };

    return NextResponse.json(analysis);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch technical analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
