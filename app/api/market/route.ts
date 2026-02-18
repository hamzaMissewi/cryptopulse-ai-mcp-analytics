import { NextRequest, NextResponse } from 'next/server';

interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  changePercent24h: number;
  dominance?: number;
}

const MOCK_CRYPTOS: CryptoAsset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 48250,
    marketCap: 950e9,
    volume24h: 28.5e9,
    change24h: 1250,
    changePercent24h: 2.66,
    dominance: 51.2,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2850,
    marketCap: 342e9,
    volume24h: 15.2e9,
    change24h: -85,
    changePercent24h: -2.89,
    dominance: 18.5,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 185.5,
    marketCap: 85e9,
    volume24h: 2.1e9,
    change24h: 12.5,
    changePercent24h: 7.21,
    dominance: 4.6,
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    price: 2.15,
    marketCap: 115e9,
    volume24h: 1.8e9,
    change24h: 0.18,
    changePercent24h: 9.3,
    dominance: 6.2,
  },
  {
    symbol: 'ADA',
    name: 'Cardano',
    price: 0.95,
    marketCap: 34e9,
    volume24h: 450e6,
    change24h: 0.05,
    changePercent24h: 5.6,
    dominance: 1.8,
  },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');

  try {
    if (symbol) {
      const crypto = MOCK_CRYPTOS.find((c) => c.symbol === symbol.toUpperCase());
      if (!crypto) {
        return NextResponse.json({ error: 'Cryptocurrency not found' }, { status: 404 });
      }
      return NextResponse.json(crypto);
    }

    // Return all cryptos if no specific symbol requested
    return NextResponse.json({
      data: MOCK_CRYPTOS,
      timestamp: new Date().toISOString(),
      totalMarketCap: MOCK_CRYPTOS.reduce((sum, c) => sum + c.marketCap, 0),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch market data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
