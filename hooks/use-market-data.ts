import { useState, useEffect } from 'react';

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

interface MarketResponse {
  data: Array<{
    symbol: string;
    price: number;
    change24h: number;
    changePercent24h: number;
    volume24h: number;
  }>;
  timestamp: string;
  totalMarketCap: number;
}

export function useMarketData(refreshInterval: number = 30000) {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/market');
        if (!response.ok) throw new Error('Failed to fetch market data');

        const result: MarketResponse = await response.json();
        const marketData: MarketData[] = result.data.map((item) => ({
          symbol: item.symbol,
          price: item.price,
          change: item.change24h,
          changePercent: item.changePercent24h,
          volume: item.volume24h,
          timestamp: new Date(result.timestamp),
        }));

        setData(marketData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { data, loading, error };
}

export function useMarketPrice(symbol: string) {
  const [price, setPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/market?symbol=${symbol}`);
        if (!response.ok) throw new Error('Failed to fetch price');

        const data = await response.json();
        setPrice(data.price);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  return { price, loading, error };
}
