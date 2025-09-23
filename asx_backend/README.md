# ASX Stock Analyzer

A comprehensive web application for analyzing Australian Stock Exchange (ASX) securities, providing real-time financial data, sentiment analysis, and market insights.

## Features

- **Real-time Stock Data**: Current prices, daily changes, and trading volumes
- **Company Profiles**: Detailed company information and key metrics
- **Financial Analysis**: P/E ratios, market cap, dividend yields, and profitability metrics
- **Sentiment Analysis**: News sentiment and market buzz indicators
- **Modern UI**: Responsive design with smooth animations and professional styling
- **ASX-Specific**: Tailored specifically for Australian Stock Exchange securities

## Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** components for consistent UI
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Flask** Python web framework
- **Finnhub API** for financial data
- **SQLite** database (optional)

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd asx-stock-analyzer
   ```

2. **Set up the backend**
   ```bash
   cd asx_backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend** (for development)
   ```bash
   cd ../asx-stock-analyzer
   pnpm install
   ```

4. **Get a Finnhub API key**
   - Sign up at [finnhub.io](https://finnhub.io/)
   - Replace the demo key in `src/routes/stock.py` with your API key

### Running the Application

#### Production Mode (Recommended)
```bash
cd asx_backend
source venv/bin/activate
python src/main.py
```
The application will be available at `http://localhost:5000`

#### Development Mode
For frontend development with hot reload:
```bash
# Terminal 1 - Backend
cd asx_backend
source venv/bin/activate
python src/main.py

# Terminal 2 - Frontend
cd asx-stock-analyzer
pnpm run dev
```

## API Endpoints

### Stock Analysis
- `GET /api/analyze/<ticker>` - Get comprehensive analysis for an ASX stock
- `GET /api/search/<query>` - Search for ASX stocks by name or ticker
- `GET /api/health` - Health check endpoint

### Example Response
```json
{
  "ticker": "CBA",
  "asx_ticker": "CBA.AX",
  "profile": {
    "name": "Commonwealth Bank of Australia",
    "country": "AU",
    "currency": "AUD",
    "exchange": "ASX",
    "marketCapitalization": 150000
  },
  "quote": {
    "c": 105.50,
    "d": 2.30,
    "dp": 2.23
  },
  "financials": {
    "metric": {
      "peInclExtraTTM": 15.2,
      "dividendYieldIndicatedAnnual": 4.5
    }
  },
  "sentiment": {
    "companyNewsScore": 0.8,
    "sentiment": {
      "bullishPercent": 0.75
    }
  }
}
```

## Usage

1. **Enter an ASX ticker symbol** (e.g., CBA, BHP, CSL) in the search field
2. **Click "Analyze"** to fetch comprehensive data
3. **View results** including:
   - Company overview and profile
   - Current stock price and daily performance
   - Key financial metrics and ratios
   - Market sentiment and news analysis

## Supported ASX Tickers

The application supports all ASX-listed securities. Popular examples include:
- **CBA** - Commonwealth Bank of Australia
- **BHP** - BHP Group Limited
- **CSL** - CSL Limited
- **WBC** - Westpac Banking Corporation
- **ANZ** - Australia and New Zealand Banking Group

## Configuration

### Environment Variables
- `FINNHUB_API_KEY` - Your Finnhub API key (recommended for production)
- `FLASK_ENV` - Set to `production` for production deployment

### API Rate Limits
- Free Finnhub tier: 60 calls/minute
- Paid tiers available for higher limits and more data

## Deployment

### Vercel Deployment
1. Build the React frontend:
   ```bash
   cd asx-stock-analyzer
   pnpm run build
   cp -r dist/* ../asx_backend/src/static/
   ```

2. Deploy the Flask backend to Vercel with the built frontend

### Other Platforms
The application can be deployed to any platform supporting Python Flask applications:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS Elastic Beanstalk

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is for educational and informational purposes only. It should not be used as the sole basis for investment decisions. Always consult with qualified financial advisors before making investment choices.

## Data Sources

- **Financial Data**: Powered by [Finnhub.io](https://finnhub.io/)
- **Market Data**: Real-time and historical ASX data
- **Sentiment Analysis**: News sentiment from multiple sources

## Support

For support, please open an issue on GitHub or contact the development team.
