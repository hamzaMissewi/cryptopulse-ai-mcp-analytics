import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketCardProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap?: string;
  volume?: string;
}

export function MarketCard({
  symbol,
  name,
  price,
  change,
  changePercent,
  marketCap,
  volume,
}: MarketCardProps) {
  const isPositive = changePercent >= 0;

  return (
    <Card className="bg-secondary border-border p-4 hover:bg-secondary/80 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-base">{symbol}</h3>
          <p className="text-xs text-muted-foreground">{name}</p>
        </div>
        <div className={`flex items-center gap-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-2xl font-bold">${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>

        <div className={`text-sm font-medium ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '+' : ''}{changePercent.toFixed(2)}% ({isPositive ? '+' : ''}${Math.abs(change).toFixed(2)})
        </div>

        {marketCap && (
          <div className="text-xs text-muted-foreground pt-2 border-t border-border">
            <p>Market Cap: {marketCap}</p>
          </div>
        )}

        {volume && (
          <div className="text-xs text-muted-foreground">
            <p>24h Volume: {volume}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
