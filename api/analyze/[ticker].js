// Vercel serverless function for demo data
export default function handler(req, res) {
  const { ticker } = req.query;
  
  // Demo data generator for ASX stocks
  const stockProfiles = {
    'CBA': {
      name: 'Commonwealth Bank of Australia',
      shortName: 'CWLTH BANK FPO [CBA]',
      basePrice: 166.17,
      sector: 'Banking',
      marketCap: 280000
    },
    'BHP': {
      name: 'BHP Group Limited',
      shortName: 'BHP GROUP LTD [BHP]',
      basePrice: 42.85,
      sector: 'Mining',
      marketCap: 215000
    },
    'CSL': {
      name: 'CSL Limited',
      shortName: 'CSL LIMITED [CSL]',
      basePrice: 285.50,
      sector: 'Healthcare',
      marketCap: 130000
    },
    'WBC': {
      name: 'Westpac Banking Corporation',
      shortName: 'WESTPAC BANK [WBC]',
      basePrice: 28.45,
      sector: 'Banking',
      marketCap: 95000
    },
    'ANZ': {
      name: 'Australia and New Zealand Banking Group',
      shortName: 'ANZ GROUP HOLD [ANZ]',
      basePrice: 31.20,
      sector: 'Banking',
      marketCap: 85000
    }
  };

  const stockInfo = stockProfiles[ticker.toUpperCase()] || {
    name: `${ticker.toUpperCase()} Limited`,
    shortName: `${ticker.toUpperCase()} [ASX]`,
    basePrice: 50.00,
    sector: 'General',
    marketCap: 10000
  };

  // Generate realistic variations
  const basePrice = stockInfo.basePrice;
  const dailyChangePercent = (Math.random() - 0.5) * 6; // -3% to +3%
  const dailyChange = basePrice * (dailyChangePercent / 100);
  const currentPrice = basePrice + dailyChange;
  
  const high = currentPrice + Math.random() * (currentPrice * 0.02);
  const low = currentPrice - Math.random() * (currentPrice * 0.02);
  const open = currentPrice + (Math.random() - 0.5) * (currentPrice * 0.02);
  const previousClose = currentPrice - dailyChange;
  const volume = Math.floor(Math.random() * 9000000) + 1000000;

  const response = {
    ticker: ticker.toUpperCase(),
    asx_ticker: `${ticker.toUpperCase()}.AX`,
    profile: {
      name: stockInfo.name,
      shortName: stockInfo.shortName,
      country: 'AU',
      currency: 'AUD',
      exchange: 'ASX',
      fullExchangeName: 'Australian Securities Exchange',
      instrumentType: 'EQUITY',
      timezone: 'AEST',
      marketCapitalization: stockInfo.marketCap,
      shareOutstanding: Math.floor(stockInfo.marketCap / currentPrice),
      logo: '',
      weburl: '',
      finnhubIndustry: stockInfo.sector
    },
    quote: {
      c: Number(currentPrice.toFixed(2)),
      d: Number(dailyChange.toFixed(2)),
      dp: Number(dailyChangePercent.toFixed(2)),
      h: Number(high.toFixed(2)),
      l: Number(low.toFixed(2)),
      o: Number(open.toFixed(2)),
      pc: Number(previousClose.toFixed(2)),
      t: Math.floor(Date.now() / 1000)
    },
    financials: {
      metric: {
        '10DayAverageTradingVolume': volume * 0.8,
        '52WeekHigh': Number((currentPrice * (1.2 + Math.random() * 0.3)).toFixed(2)),
        '52WeekLow': Number((currentPrice * (0.6 + Math.random() * 0.3)).toFixed(2)),
        'beta': Number((0.5 + Math.random()).toFixed(2)),
        'dividendYieldIndicatedAnnual': Number((2 + Math.random() * 4).toFixed(2)),
        'epsInclExtraItemsTTM': Number((currentPrice / (12 + Math.random() * 13)).toFixed(2)),
        'marketCapitalization': stockInfo.marketCap,
        'peInclExtraTTM': Number((12 + Math.random() * 13).toFixed(2)),
        'pbAnnual': Number((1 + Math.random() * 2).toFixed(2)),
        'roaeTTM': Number((8 + Math.random() * 12).toFixed(2)),
        'roeTTM': Number((10 + Math.random() * 15).toFixed(2)),
        'regularMarketVolume': volume
      }
    },
    sentiment: {
      buzz: {
        articlesInLastWeek: Math.floor(Math.random() * 45) + 5,
        buzz: Number((0.5 + Math.random() * 1.5).toFixed(2)),
        weeklyAverage: Number((0.8 + Math.random() * 0.7).toFixed(2))
      },
      companyNewsScore: Number((0.3 + Math.random() * 0.5).toFixed(2)),
      sectorAverageBullishPercent: Number((40 + Math.random() * 30).toFixed(1)),
      sectorAverageNewsScore: Number((0.4 + Math.random() * 0.3).toFixed(2)),
      sentiment: {
        bearishPercent: Number((0.2 + Math.random() * 0.2).toFixed(2)),
        bullishPercent: Number((0.4 + Math.random() * 0.3).toFixed(2))
      },
      symbol: ticker.toUpperCase()
    },
    timestamp: new Date().toISOString(),
    data_source: 'Demo Data (Vercel)',
    note: 'This is demo data for demonstration purposes'
  };

  res.status(200).json(response);
}