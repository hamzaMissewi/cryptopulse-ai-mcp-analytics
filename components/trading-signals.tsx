import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';

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

interface TradingSignalsProps {
  signals: TradingSignal[];
}

export function TradingSignals({ signals }: TradingSignalsProps) {
  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'text-green-400 bg-green-400/10';
      case 'sell':
        return 'text-red-400 bg-red-400/10';
      case 'hold':
        return 'text-blue-400 bg-blue-400/10';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy':
        return <TrendingUp className="w-4 h-4" />;
      case 'sell':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStrengthLabel = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'Strong';
      case 'moderate':
        return 'Moderate';
      case 'weak':
        return 'Weak';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Trading Signals</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {signals.length === 0 ? (
          <Card className="bg-secondary border-border p-4">
            <p className="text-sm text-muted-foreground text-center py-4">No active signals</p>
          </Card>
        ) : (
          signals.map((signal) => (
            <Card key={signal.id} className="bg-secondary border-border p-3 hover:bg-secondary/80 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-full ${getSignalColor(signal.signal)}`}>
                    {getSignalIcon(signal.signal)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{signal.symbol}</p>
                    <p className="text-xs text-muted-foreground">
                      {signal.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <div className={`text-xs font-semibold px-2 py-1 rounded-full ${getSignalColor(signal.signal)}`}>
                  {signal.signal.toUpperCase()}
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-2">{signal.reason}</p>

              <div className="text-xs grid grid-cols-2 gap-2 text-muted-foreground">
                <div>
                  <span className="font-medium">Strength:</span> {getStrengthLabel(signal.strength)}
                </div>
                {signal.targetPrice && (
                  <div>
                    <span className="font-medium">Target:</span> ${signal.targetPrice.toLocaleString()}
                  </div>
                )}
                {signal.stopLoss && (
                  <div>
                    <span className="font-medium">Stop Loss:</span> ${signal.stopLoss.toLocaleString()}
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
