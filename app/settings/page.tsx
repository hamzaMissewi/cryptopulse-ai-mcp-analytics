'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Eye, Zap } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [alerts, setAlerts] = useState(true);
  const [priceThreshold, setPriceThreshold] = useState('5');

  const handleSaveSettings = () => {
    // Save settings logic here
    console.log({
      notifications,
      darkMode,
      alerts,
      priceThreshold,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-accent" />
            <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
          </div>
          <p className="text-muted-foreground">Configure your CryptoPulse experience</p>
        </div>

        {/* Notification Settings */}
        <Card className="bg-secondary border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold">Notifications</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-medium">Enable Notifications</p>
                <p className="text-sm text-muted-foreground">Receive market alerts and updates</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-medium">Price Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when prices move significantly</p>
              </div>
              <Switch checked={alerts} onCheckedChange={setAlerts} />
            </div>

            {alerts && (
              <div className="p-4 bg-background rounded-lg border border-border">
                <Label htmlFor="threshold" className="text-sm mb-2 block">
                  Price Change Threshold (%)
                </Label>
                <Input
                  id="threshold"
                  type="number"
                  value={priceThreshold}
                  onChange={(e) => setPriceThreshold(e.target.value)}
                  placeholder="Enter percentage"
                  className="bg-card border-border text-foreground"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Display Settings */}
        <Card className="bg-secondary border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold">Display</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">Use dark theme (currently on)</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} disabled />
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-medium">Chart Type</p>
                <p className="text-sm text-muted-foreground">Default chart visualization style</p>
              </div>
              <select className="bg-card border border-border rounded px-3 py-2 text-foreground text-sm">
                <option>Area Chart</option>
                <option>Line Chart</option>
                <option>Candlestick</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Analysis Settings */}
        <Card className="bg-secondary border-border p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-bold">Analysis</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg border border-border">
              <Label htmlFor="rsi-period" className="text-sm mb-2 block">
                RSI Period
              </Label>
              <Input
                id="rsi-period"
                type="number"
                defaultValue="14"
                className="bg-card border-border text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-2">Standard: 14 (recommended)</p>
            </div>

            <div className="p-4 bg-background rounded-lg border border-border">
              <Label htmlFor="sma-periods" className="text-sm mb-2 block">
                SMA Periods
              </Label>
              <Input
                id="sma-periods"
                type="text"
                defaultValue="20, 50, 200"
                className="bg-card border-border text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-2">Comma-separated values</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-medium">Use Advanced Indicators</p>
                <p className="text-sm text-muted-foreground">Show MACD, Bollinger Bands, etc.</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Data & Privacy */}
        <Card className="bg-secondary border-border p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Data & Privacy</h2>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong>Data Storage:</strong> Your preferences are stored locally. No personal data is sent to external
              servers.
            </p>
            <p>
              <strong>Market Data:</strong> Price data is fetched from public APIs and cached for performance.
            </p>
            <p>
              <strong>Chat History:</strong> Conversations are stored locally in your browser and can be cleared anytime.
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleSaveSettings} className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Save Settings
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
