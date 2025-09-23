# ASX Stock Analyzer - Cursor Development Guide

## 🚀 **Quick Start for Cursor**

This package contains the complete ASX Stock Analyzer application ready for development in Cursor IDE.

### **Project Structure**
```
asx-analyzer-dev-package/
├── asx_backend/                 # Flask Python backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── stock_yahoo.py      # Real Yahoo Finance API (local dev)
│   │   │   ├── stock_production.py # Demo data (production)
│   │   │   └── user.py             # User management
│   │   ├── models/                 # Database models
│   │   ├── static/                 # Built React frontend
│   │   └── main.py                 # Flask app entry point
│   ├── venv/                       # Python virtual environment
│   ├── requirements.txt            # Python dependencies
│   └── README.md                   # Backend documentation
├── asx-stock-analyzer/             # React frontend
│   ├── src/
│   │   ├── App.jsx                 # Main React component
│   │   └── App.css                 # Styles
│   ├── package.json                # Node.js dependencies
│   └── vite.config.js              # Vite configuration
└── CURSOR_DEVELOPMENT_GUIDE.md     # This file
```

## 🛠️ **Development Setup**

### **1. Open in Cursor**
```bash
# Open the entire package in Cursor
cursor asx-analyzer-dev-package/
```

### **2. Backend Setup (Flask)**
```bash
# Navigate to backend
cd asx_backend

# Activate virtual environment
source venv/bin/activate

# Install dependencies (if needed)
pip install -r requirements.txt

# Start development server
python src/main.py
# Server runs on http://localhost:5000
```

### **3. Frontend Setup (React)**
```bash
# Navigate to frontend (in new terminal)
cd asx-stock-analyzer

# Install dependencies
pnpm install

# Start development server
pnpm run dev
# Frontend runs on http://localhost:5173
```

### **4. Full-Stack Development**
- **Backend**: http://localhost:5000 (API endpoints)
- **Frontend**: http://localhost:5173 (React dev server)
- **Production**: Frontend calls backend API directly

## 🔧 **Key Files to Edit in Cursor**

### **Frontend (React)**
- **`asx-stock-analyzer/src/App.jsx`** - Main UI component
- **`asx-stock-analyzer/src/App.css`** - Styling and animations
- **`asx-stock-analyzer/package.json`** - Dependencies and scripts

### **Backend (Flask)**
- **`asx_backend/src/routes/stock_yahoo.py`** - Real Yahoo Finance integration
- **`asx_backend/src/routes/stock_production.py`** - Demo data for production
- **`asx_backend/src/main.py`** - Flask app configuration

## 📊 **Data Integration Options**

### **Option 1: Yahoo Finance API (Recommended)**
**File**: `asx_backend/src/routes/stock_yahoo.py`

```python
# Uses Manus sandbox API client (works locally)
from data_api import ApiClient
yahoo_client = ApiClient()

# For external deployment, replace with:
import yfinance as yf
stock = yf.Ticker("CBA.AX")
```

### **Option 2: Alpha Vantage API**
```python
import requests

API_KEY = "your_alpha_vantage_key"
url = f"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=CBA.AX&apikey={API_KEY}"
response = requests.get(url)
```

### **Option 3: Financial Modeling Prep**
```python
import requests

API_KEY = "your_fmp_key"
url = f"https://financialmodelingprep.com/api/v3/quote/CBA.AX?apikey={API_KEY}"
response = requests.get(url)
```

## 🎨 **UI/UX Enhancement Ideas**

### **Easy Wins**
1. **Add Charts**: Integrate Chart.js or Recharts for price charts
2. **More Metrics**: Add technical indicators (RSI, MACD, Moving Averages)
3. **News Feed**: Integrate news API for company-specific news
4. **Watchlist**: Allow users to save favorite stocks
5. **Export**: PDF reports or CSV data download

### **Advanced Features**
1. **Portfolio Tracking**: Track multiple stocks and performance
2. **Alerts**: Price/volume alerts via email or push notifications
3. **Comparison Tool**: Compare multiple ASX stocks side-by-side
4. **Historical Analysis**: Show price history and trends
5. **Sector Analysis**: Industry comparisons and sector performance

## 🔄 **Development Workflow**

### **Making Changes**
1. **Frontend Changes**: Edit React components, see live reload
2. **Backend Changes**: Modify Flask routes, restart server
3. **API Integration**: Update data sources in route files
4. **Styling**: Modify Tailwind classes in React components

### **Testing**
```bash
# Test API endpoints
curl http://localhost:5000/api/analyze/CBA
curl http://localhost:5000/api/search/bank

# Test different ASX stocks
# CBA, BHP, CSL, WBC, ANZ, NAB, WOW, COL, TLS, RIO
```

### **Building for Production**
```bash
# Build React frontend
cd asx-stock-analyzer
pnpm run build

# Copy to Flask static directory
cp -r dist/* ../asx_backend/src/static/

# Deploy backend (Flask serves the built React app)
cd ../asx_backend
# Deploy to your preferred platform
```

## 🚀 **Deployment Options**

### **Option 1: Vercel (Frontend) + Railway (Backend)**
- Deploy React to Vercel
- Deploy Flask to Railway
- Update API URLs in frontend

### **Option 2: Single Platform (Heroku/Railway)**
- Deploy Flask app with built React frontend
- Single URL serves both frontend and API

### **Option 3: AWS/GCP/Azure**
- Use cloud platforms for scalable deployment
- Consider containerization with Docker

## 🔐 **Environment Variables**

Create `.env` files for API keys:

**Backend (.env)**
```
ALPHA_VANTAGE_API_KEY=your_key_here
YAHOO_FINANCE_API_KEY=your_key_here
FLASK_ENV=development
SECRET_KEY=your_secret_key
```

**Frontend (.env)**
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_ENVIRONMENT=development
```

## 📈 **Performance Optimization**

### **Frontend**
- Use React.memo for expensive components
- Implement lazy loading for large datasets
- Add loading states and error boundaries
- Optimize bundle size with code splitting

### **Backend**
- Add caching layer (Redis) for API responses
- Implement rate limiting for external API calls
- Use database for storing historical data
- Add background jobs for data updates

## 🐛 **Common Issues & Solutions**

### **CORS Issues**
```python
# In Flask main.py
from flask_cors import CORS
CORS(app)
```

### **API Rate Limits**
```python
# Add caching and rate limiting
import time
from functools import wraps

def rate_limit(calls_per_minute=60):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Implement rate limiting logic
            return func(*args, **kwargs)
        return wrapper
    return decorator
```

### **Data Validation**
```python
# Validate ticker symbols
import re

def validate_asx_ticker(ticker):
    pattern = r'^[A-Z]{2,4}$'
    return re.match(pattern, ticker.upper()) is not None
```

## 🎯 **Next Steps Recommendations**

### **Phase 1: Data Enhancement**
1. Integrate real API (Alpha Vantage/Yahoo Finance)
2. Add error handling and retry logic
3. Implement data caching

### **Phase 2: UI/UX Improvements**
1. Add interactive price charts
2. Implement responsive design improvements
3. Add loading animations and better error states

### **Phase 3: Advanced Features**
1. User authentication and watchlists
2. Portfolio tracking and performance metrics
3. News integration and sentiment analysis

### **Phase 4: Production Readiness**
1. Add comprehensive testing
2. Implement monitoring and logging
3. Set up CI/CD pipeline

## 📚 **Useful Resources**

### **APIs**
- [Alpha Vantage](https://www.alphavantage.co/) - Free tier available
- [Yahoo Finance](https://pypi.org/project/yfinance/) - Unofficial Python library
- [Financial Modeling Prep](https://financialmodelingprep.com/) - Comprehensive financial data

### **Libraries**
- [Chart.js](https://www.chartjs.org/) - Charts and graphs
- [Recharts](https://recharts.org/) - React chart library
- [React Query](https://tanstack.com/query) - Data fetching and caching
- [Zustand](https://github.com/pmndrs/zustand) - State management

### **Deployment**
- [Vercel](https://vercel.com/) - Frontend deployment
- [Railway](https://railway.app/) - Backend deployment
- [Heroku](https://heroku.com/) - Full-stack deployment

## 🎊 **You're All Set!**

The ASX Stock Analyzer is ready for development in Cursor. The codebase is well-structured, documented, and ready for enhancement. Start by exploring the existing code, then implement your desired features step by step.

**Happy coding!** 🚀
