import { NextRequest, NextResponse } from 'next/server';

interface PricePrediction {
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

const CURRENT_PRICES: Record<string, number> = {
  BTC: 48250,
  ETH: 2850,
  SOL: 185.5,
  XRP: 2.15,
  ADA: 0.95,
};

const PREDICTION_FACTORS: Record<string, { support: string[]; risks: string[] }> = {
  BTC: {
    support: ['Institutional adoption increasing', 'Macro conditions improving', 'Technical breakout pattern'],
    risks: ['Regulatory concerns', 'Geopolitical tensions', 'Profit-taking at resistance'],
  },
  ETH: {
    support: ['Layer 2 scaling success', 'DeFi ecosystem growth', 'NFT market expansion'],
    risks: ['Competition from L1s', 'Regulatory scrutiny', 'Market consolidation'],
  },
  SOL: {
    support: ['Network stability improvements', 'Developer ecosystem growth', 'NFT marketplace adoption'],
    risks: ['Network outages risk', 'Centralization concerns', 'Competition'],
  },
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol')?.toUpperCase() || 'BTC';
  const hoursAhead = parseInt(searchParams.get('hoursAhead') || '24', 10);

  try {
    const currentPrice = CURRENT_PRICES[symbol] || 100;
    const volatilityFactor = 0.05 + (Math.random() - 0.5) * 0.08; // 2-8% volatility
    const trend = Math.random() > 0.5 ? 1 : -1;
    const changePercent = volatilityFactor * trend * (hoursAhead / 24);

    const predictedPrice = currentPrice * (1 + changePercent);
    const factors = PREDICTION_FACTORS[symbol] || {
      support: ['Market momentum', 'Technical analysis', 'Sentiment indicators'],
      risks: ['Market volatility', 'Regulatory changes', 'Economic factors'],
    };

    const prediction: PricePrediction = {
      symbol,
      hoursAhead,
      currentPrice,
      predictedPrice: Math.round(predictedPrice * 100) / 100,
      changePercent: Math.round(changePercent * 10000) / 100,
      direction: changePercent > 0.5 ? 'up' : changePercent < -0.5 ? 'down' : 'neutral',
      confidence: 0.65 + Math.random() * 0.3,
      scenarioAnalysis: {
        bearishCase: Math.round(currentPrice * (1 + changePercent - 0.02) * 100) / 100,
        baseCase: Math.round(predictedPrice * 100) / 100,
        bullishCase: Math.round(currentPrice * (1 + changePercent + 0.02) * 100) / 100,
      },
      supportingFactors: factors.support,
      riskFactors: factors.risks,
    };

    return NextResponse.json(prediction);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch price prediction', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
