# CryptoPulse - AI-Powered Crypto Analytics Platform

A comprehensive cryptocurrency market analysis platform powered by AI, featuring real-time market data, technical analysis tools, and an intelligent chat assistant.

## Features

### 1. AI Chat Assistant
- Real-time cryptocurrency market analysis
- Powered by Google Gemini 2.0 Flash
- Tool-based interaction for market data, trend analysis, and price predictions
- Conversational interface for natural language queries

### 2. Market Analytics Dashboard
- Real-time cryptocurrency prices and market data
- 24/7 market overview with key metrics
- Technical analysis charts (candlestick, line, area)
- Support and resistance level calculations
- RSI indicator analysis

### 3. Advanced Tools & Features
- **Price Predictions**: AI-powered price forecasting with confidence scores
- **Technical Analysis**: RSI, MACD, moving averages
- **Market Trends**: Bullish/bearish trend identification
- **Trading Signals**: Automated signal generation based on technical indicators
- **Multi-timeframe Analysis**: 1h, 4h, 1d, 1w timeframes

### 4. MCP Server Integration
- Model Context Protocol (MCP) server for extensible tool integration
- Real-time market data queries
- Technical analysis calculations
- Trend analysis and predictions

## Project Structure

```
cryptopulse/
├── app/
│   ├── page.tsx                    # Main chat dashboard
│   ├── dashboard/
│   │   └── page.tsx               # Analytics dashboard
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts           # AI chat endpoint with Gemini
│   │   ├── market/
│   │   │   └── route.ts           # Market data API
│   │   └── analysis/
│   │       ├── technical/
│   │       │   └── route.ts       # Technical analysis
│   │       └── predict/
│   │           └── route.ts       # Price prediction
│   ├── globals.css                # Dark theme design system
│   └── layout.tsx                 # Root layout
│
├── components/
│   ├── market-card.tsx            # Market data card component
│   ├── price-chart.tsx            # Price chart visualization
│   ├── trading-signals.tsx        # Trading signals display
│   └── ui/                        # shadcn/ui components
│
├── mcp-server/
│   ├── src/
│   │   └── index.ts               # MCP server implementation
│   ├── package.json
│   └── tsconfig.json
│
├── public/                        # Static assets
├── package.json                   # Frontend dependencies
└── README.md                      # This file
```

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend & AI
- **AI SDK**: Vercel AI SDK 6
- **LLM**: Google Gemini 2.0 Flash
- **HTTP Client**: AI SDK built-in
- **API Pattern**: Route Handlers (Next.js)

### Additional Services
- **MCP Server**: Model Context Protocol for tool integration
- **Real-time Data**: Mock cryptocurrency data (ready for live integration)
- **Technical Analysis**: Custom calculations (RSI, MACD, support/resistance)

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Install Frontend Dependencies**
```bash
pnpm install
```

2. **Install MCP Server Dependencies** (Optional)
```bash
cd mcp-server
pnpm install
cd ..
```

### Running the Application

**Development Mode**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

**Build for Production**
```bash
pnpm build
pnpm start
```

### Using the MCP Server (Optional)

The MCP server can be run separately for extended functionality:

```bash
cd mcp-server
pnpm build
pnpm start
```

Or in development:
```bash
cd mcp-server
pnpm dev
```

## API Endpoints

### Chat API
- **POST** `/api/chat` - AI-powered chat with tools
  - Body: `{ messages: UIMessage[] }`
  - Returns: Server-Sent Events stream with chat responses

### Market Data API
- **GET** `/api/market` - Get all market data
- **GET** `/api/market?symbol=BTC` - Get specific cryptocurrency data

### Technical Analysis API
- **GET** `/api/analysis/technical?symbol=BTC&timeframe=1d` - Technical analysis

### Price Prediction API
- **GET** `/api/analysis/predict?symbol=BTC&hoursAhead=24` - Price prediction

## Configuration

### Theme Customization
Edit `app/globals.css` to customize the dark theme design tokens:
- Primary color: Purple (`oklch(0.55 0.22 263)`)
- Accent color: Bright purple (`oklch(0.55 0.22 263)`)
- Background: Deep dark (`oklch(0.08 0 0)`)

### AI Model Configuration
Modify `app/api/chat/route.ts` to change:
- Model: `google('gemini-2.0-flash')`
- System prompt for AI behavior
- Tools and their configurations

## Features Overview

### 1. Chat Dashboard (`/`)
Main interface featuring:
- Conversational AI chat with real-time responses
- Market overview sidebar with quick price checks
- Message history and streaming responses
- Responsive design for mobile and desktop

### 2. Analytics Dashboard (`/dashboard`)
Advanced analytics including:
- Market overview with key metrics
- Interactive price charts
- Technical analysis tools
- RSI indicators
- Support/resistance levels

### 3. AI Tools Available
The chat assistant has access to:
- `getCurrentPrice()` - Real-time cryptocurrency prices
- `getMarketData()` - Comprehensive market data
- `analyzeTrend()` - Technical trend analysis
- `getNews()` - Latest cryptocurrency news
- `predictPrice()` - AI-powered price predictions

## Market Data

Currently uses mock data for demonstration. To integrate real data:

1. **CoinGecko API** (Free tier available)
2. **CoinMarketCap API**
3. **Kraken/Binance APIs**
4. **Polygon.io** (for advanced analytics)

Update endpoints in:
- `app/api/market/route.ts`
- `app/api/analysis/technical/route.ts`
- `app/api/analysis/predict/route.ts`
- `app/api/chat/route.ts` (tool functions)

## Security Considerations

1. API keys are stored in environment variables
2. No sensitive data in client-side code
3. Tool execution happens on the server
4. Rate limiting recommended for production

## Future Enhancements

- [ ] Real-time WebSocket data feeds
- [ ] User authentication and portfolios
- [ ] Telegram bot integration
- [ ] Email alerts for price movements
- [ ] Advanced charting (TradingView integration)
- [ ] Backtesting engine
- [ ] Custom trading strategies
- [ ] Paper trading feature

## Troubleshooting

### Chat Not Responding
1. Check API key configuration
2. Verify Gemini model availability
3. Check network connectivity

### Charts Not Loading
1. Verify Recharts installation
2. Check chart data formatting
3. Look for console errors

### MCP Server Connection Issues
1. Ensure MCP server is running
2. Check stdio transport setup
3. Verify tool definitions

## Contributing

Contributions welcome! Please follow:
1. Next.js best practices
2. Component-based architecture
3. TypeScript for type safety
4. Responsive design patterns

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
1. Check this README
2. Review code comments
3. Open an issue in the repository

---

Built with Next.js, Vercel AI SDK, and Gemini 2.0 Flash
