'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { MarketCard } from '@/components/market-card';
import { PriceChart } from '@/components/price-chart';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume24h: number;
  marketCap: number;
}

interface ChartData {
  time: string;
  price: number;
}

const MARKET_DATA: MarketData[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 48250,
    change: 1250,
    changePercent: 2.66,
    volume24h: 28.5e9,
    marketCap: 950e9,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2850,
    change: -85,
    changePercent: -2.89,
    volume24h: 15.2e9,
    marketCap: 342e9,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 185.5,
    change: 12.5,
    changePercent: 7.21,
    volume24h: 2.1e9,
    marketCap: 85e9,
  },
  {
    symbol: 'XRP',
    name: 'Ripple',
    price: 2.15,
    change: 0.18,
    changePercent: 9.30,
    volume24h: 1.8e9,
    marketCap: 115e9,
  },
];

const generateChartData = (symbol: string): ChartData[] => {
  const basePrice = MARKET_DATA.find((m) => m.symbol === symbol)?.price || 100;
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      time: `${i}h`,
      price: basePrice * (1 + (Math.random() - 0.5) * 0.05),
    });
  }
  return data;
};

export default function DashboardPage() {
  const [selectedCrypto, setSelectedCrypto] = useState('BTC');
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    setChartData(generateChartData(selectedCrypto));
  }, [selectedCrypto]);

  const totalMarketCap = MARKET_DATA.reduce((sum, m) => sum + m.marketCap, 0);
  const totalVolume = MARKET_DATA.reduce((sum, m) => sum + m.volume24h, 0);
  const gainers = MARKET_DATA.filter((m) => m.changePercent > 0).length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">CryptoPulse Analytics</h1>
          <p className="text-muted-foreground">Real-time cryptocurrency market intelligence</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-secondary border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Total Market Cap</p>
              <Activity className="w-4 h-4 text-accent" />
            </div>
            <p className="text-2xl font-bold">${(totalMarketCap / 1e12).toFixed(2)}T</p>
          </Card>

          <Card className="bg-secondary border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">24h Volume</p>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold">${(totalVolume / 1e9).toFixed(1)}B</p>
          </Card>

          <Card className="bg-secondary border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Market Gainers</p>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold">{gainers}/{MARKET_DATA.length}</p>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-secondary border-border">
            <TabsTrigger value="overview">Market Overview</TabsTrigger>
            <TabsTrigger value="charts">Price Charts</TabsTrigger>
            <TabsTrigger value="analysis">Analysis Tools</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Top Cryptocurrencies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {MARKET_DATA.map((market) => (
                  <MarketCard
                    key={market.symbol}
                    symbol={market.symbol}
                    name={market.name}
                    price={market.price}
                    change={market.change}
                    changePercent={market.changePercent}
                    marketCap={`$${(market.marketCap / 1e9).toFixed(1)}B`}
                    volume={`$${(market.volume24h / 1e9).toFixed(1)}B`}
                  />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {MARKET_DATA.map((market) => (
                  <Button
                    key={market.symbol}
                    onClick={() => setSelectedCrypto(market.symbol)}
                    variant={selectedCrypto === market.symbol ? 'default' : 'outline'}
                    className={selectedCrypto === market.symbol ? 'bg-accent text-accent-foreground' : ''}
                  >
                    {market.symbol}
                  </Button>
                ))}
              </div>

              {chartData.length > 0 && (
                <PriceChart
                  title={`${selectedCrypto} Price Movement (24h)`}
                  symbol={selectedCrypto}
                  data={chartData}
                  timeframe="24h"
                  type="area"
                />
              )}
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <Card className="bg-secondary border-border p-6">
              <h3 className="text-xl font-bold mb-4">Technical Analysis Tools</h3>
              <div className="space-y-4">
                <div className="p-4 bg-background rounded-lg border border-border">
                  <h4 className="font-semibold mb-2">RSI Indicator</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    The Relative Strength Index (RSI) is a momentum oscillator that measures the speed and magnitude of
                    price changes.
                  </p>
                  <div className="space-y-2">
                    {MARKET_DATA.map((market) => {
                      const rsi = 45 + market.changePercent * 3;
                      return (
                        <div
                          key={market.symbol}
                          className="flex justify-between items-center p-2 bg-secondary rounded"
                        >
                          <span className="font-medium">{market.symbol}</span>
                          <span
                            className={`text-sm ${
                              rsi > 70 ? 'text-red-400' : rsi < 30 ? 'text-green-400' : 'text-blue-400'
                            }`}
                          >
                            RSI: {rsi.toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-background rounded-lg border border-border">
                  <h4 className="font-semibold mb-2">Support & Resistance Levels</h4>
                  <p className="text-sm text-muted-foreground">
                    Key price levels where assets tend to find support or face resistance.
                  </p>
                  <div className="mt-4 space-y-2">
                    {MARKET_DATA.map((market) => {
                      const support = market.price * 0.95;
                      const resistance = market.price * 1.05;
                      return (
                        <div key={market.symbol} className="text-sm p-2 bg-secondary rounded">
                          <div className="font-medium mb-1">{market.symbol}</div>
                          <div className="text-xs text-muted-foreground">
                            Support: ${support.toFixed(2)} | Resistance: ${resistance.toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
