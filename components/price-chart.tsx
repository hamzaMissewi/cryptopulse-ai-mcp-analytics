'use client';

import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface ChartDataPoint {
  time: string;
  price: number;
  volume?: number;
}

interface PriceChartProps {
  title: string;
  symbol: string;
  data: ChartDataPoint[];
  timeframe?: string;
  type?: 'line' | 'area';
}

export function PriceChart({
  title,
  symbol,
  data,
  timeframe = '24h',
  type = 'area',
}: PriceChartProps) {
  const minPrice = Math.min(...data.map((d) => d.price));
  const maxPrice = Math.max(...data.map((d) => d.price));
  const currentPrice = data[data.length - 1]?.price || 0;
  const previousPrice = data[0]?.price || 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(2);

  const ChartComponent = type === 'area' ? AreaChart : LineChart;
  const LineComponent = type === 'area' ? Area : Line;

  return (
    <Card className="bg-secondary border-border p-4 col-span-1 md:col-span-2">
      <div className="mb-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-bold">${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            <p className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChangePercent}% ({timeframe})
            </p>
          </div>
          <p className="text-xs text-muted-foreground">{timeframe} Chart</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
          <XAxis dataKey="time" stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} />
          <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '12px' }} domain={['dataMin - 100', 'dataMax + 100']} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: `1px solid var(--color-border)`,
              borderRadius: '0.5rem',
              color: 'var(--color-foreground)',
            }}
          />
          {type === 'area' ? (
            <Area
              type="monotone"
              dataKey="price"
              stroke="var(--color-accent)"
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          ) : (
            <Line
              type="monotone"
              dataKey="price"
              stroke="var(--color-accent)"
              dot={false}
              strokeWidth={2}
            />
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </Card>
  );
}
