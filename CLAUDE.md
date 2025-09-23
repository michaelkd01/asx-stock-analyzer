# Claude Development Guidelines for ASX Stock Analyzer

## Project Context
This is an ASX (Australian Securities Exchange) stock analysis web application built with:
- **Frontend**: React with Vite, TailwindCSS, Shadcn/UI
- **Backend**: Flask (Python), with multiple API route configurations
- **Data Sources**: Yahoo Finance API (via sandbox runtime) and demo data for production

## Key Commands
- **Backend**: `cd asx_backend && source venv/bin/activate && python src/main.py`
- **Frontend**: `cd asx-stock-analyzer && pnpm run dev`
- **Build**: `cd asx-stock-analyzer && pnpm run build`
- **Lint**: `cd asx-stock-analyzer && pnpm run lint`

## Project Structure
```
asx-analyzer-dev-package/
├── asx_backend/              # Flask backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── stock_yahoo.py      # Real Yahoo Finance integration
│   │   │   └── stock_production.py # Demo data for production
│   │   └── main.py                 # Flask app entry point
│   └── venv/                       # Python virtual environment
├── asx-stock-analyzer/             # React frontend
│   ├── src/
│   │   └── App.jsx                 # Main React component
│   └── package.json                # Node dependencies
└── CLAUDE.md                       # This file
```

## Data Flow
1. User enters ASX ticker (e.g., CBA, BHP)
2. Frontend makes API call to `/api/real/{ticker}` (NEW: Real data endpoint)
3. Vercel serverless function:
   - Fetches real data from Alpha Vantage API
   - Falls back to realistic demo data if API limit reached
4. Data is transformed and returned to frontend
5. Frontend displays comprehensive stock analysis

## Known Issues
1. ~~**Data Accuracy**: Currently using demo data in production~~ ✅ FIXED with Alpha Vantage
2. **API Rate Limit**: Free tier limited to 25 requests/day
3. **No Proxy Configuration**: Frontend in dev needs manual proxy setup to connect to backend
4. **Search Functionality**: Limited to hardcoded list of ASX stocks

## Development Best Practices
1. Always check if virtual environment is activated before running backend
2. Use pnpm (not npm) for frontend package management
3. Build frontend before deploying to production
4. Test API endpoints independently before frontend integration
5. Maintain data structure consistency between different data sources

## API Integration Notes
- Yahoo Finance requires `.AX` suffix for ASX stocks
- API responses should maintain consistent structure regardless of data source
- Handle missing data gracefully with default values
- Consider implementing caching to reduce API calls

## Testing Checklist
- [ ] Backend API responds correctly
- [ ] Frontend proxy configuration works
- [ ] Data displays correctly in UI
- [ ] Error handling for invalid tickers
- [ ] Loading states work properly
- [ ] Mobile responsive design functions

## Real Data Integration (NEW!)
- **API:** Alpha Vantage (free tier: 25 requests/day)
- **Endpoint:** `/api/real/{ticker}` - Real ASX stock data
- **Fallback:** Realistic demo data when API limit reached
- **Setup:** Add `ALPHA_VANTAGE_API_KEY` to Vercel environment variables
- **Documentation:** See `API_SETUP.md` for quick setup guide

## Future Enhancements
1. ~~Integrate real financial APIs (Alpha Vantage, IEX Cloud)~~ ✅ DONE
2. Add historical price charts
3. Implement portfolio tracking
4. Add real-time price updates
5. Enhance search with full ASX listing database
6. Add technical indicators (RSI, MACD, etc.)
7. Implement user authentication and watchlists