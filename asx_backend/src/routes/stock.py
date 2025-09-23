from flask import Blueprint, jsonify, request
import finnhub
import os
from datetime import datetime, timedelta

stock_bp = Blueprint('stock', __name__)

# Initialize Finnhub client
# For now, we'll use a demo API key. In production, this should be an environment variable
finnhub_client = finnhub.Client(api_key="demo")

@stock_bp.route('/analyze/<ticker>', methods=['GET'])
def analyze_stock(ticker):
    """
    Analyze an ASX stock by ticker symbol
    Returns comprehensive analysis including company profile, financials, and sentiment
    """
    try:
        # Convert ticker to ASX format (add .AX suffix if not present)
        asx_ticker = ticker.upper()
        if not asx_ticker.endswith('.AX'):
            asx_ticker += '.AX'
        
        # Fetch company profile
        try:
            profile = finnhub_client.company_profile2(symbol=asx_ticker)
        except Exception as e:
            print(f"Error fetching profile for {asx_ticker}: {e}")
            profile = {}
        
        # Fetch current quote
        try:
            quote = finnhub_client.quote(asx_ticker)
        except Exception as e:
            print(f"Error fetching quote for {asx_ticker}: {e}")
            quote = {}
        
        # Fetch basic financials
        try:
            financials = finnhub_client.company_basic_financials(asx_ticker, 'all')
        except Exception as e:
            print(f"Error fetching financials for {asx_ticker}: {e}")
            financials = {'metric': {}}
        
        # Fetch news sentiment
        try:
            # Get sentiment for the past week
            end_date = datetime.now()
            start_date = end_date - timedelta(days=7)
            sentiment = finnhub_client.news_sentiment(asx_ticker)
        except Exception as e:
            print(f"Error fetching sentiment for {asx_ticker}: {e}")
            sentiment = {}
        
        # Structure the response
        response_data = {
            'ticker': ticker.upper(),
            'asx_ticker': asx_ticker,
            'profile': profile,
            'quote': quote,
            'financials': financials,
            'sentiment': sentiment,
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        return jsonify({
            'error': f'Failed to analyze stock {ticker}',
            'message': str(e)
        }), 500

@stock_bp.route('/search/<query>', methods=['GET'])
def search_stocks(query):
    """
    Search for stocks by company name or ticker
    """
    try:
        # Use Finnhub symbol lookup
        results = finnhub_client.symbol_lookup(query)
        
        # Filter for ASX stocks only
        asx_results = []
        if 'result' in results:
            for result in results['result']:
                if result.get('type') == 'Common Stock' and '.AX' in result.get('symbol', ''):
                    asx_results.append(result)
        
        return jsonify({
            'query': query,
            'results': asx_results[:10]  # Limit to top 10 results
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Failed to search for {query}',
            'message': str(e)
        }), 500

@stock_bp.route('/health', methods=['GET'])
def health_check():
    """
    Health check endpoint
    """
    return jsonify({
        'status': 'healthy',
        'service': 'ASX Stock Analyzer API',
        'timestamp': datetime.now().isoformat()
    })
