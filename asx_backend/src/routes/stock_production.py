from flask import Blueprint, jsonify, request
import requests
import os
from datetime import datetime, timedelta

stock_prod_bp = Blueprint('stock_prod', __name__)

@stock_prod_bp.route('/analyze/<ticker>', methods=['GET'])
def analyze_stock_production(ticker):
    """
    Analyze an ASX stock using publicly available APIs
    This version works in production environments
    """
    try:
        # Convert ticker to ASX format (add .AX suffix if not present)
        asx_ticker = ticker.upper()
        if not asx_ticker.endswith('.AX'):
            asx_ticker += '.AX'
        
        # For production, we'll provide realistic demo data based on the ticker
        # In a real production environment, you would integrate with:
        # - Alpha Vantage API (free tier available)
        # - Yahoo Finance unofficial API
        # - Financial Modeling Prep API
        # - IEX Cloud API
        
        # Demo data that looks realistic for different ASX stocks
        demo_data = get_demo_data_for_ticker(ticker.upper())
        
        response_data = {
            'ticker': ticker.upper(),
            'asx_ticker': asx_ticker,
            'profile': demo_data['profile'],
            'quote': demo_data['quote'],
            'financials': demo_data['financials'],
            'sentiment': demo_data['sentiment'],
            'timestamp': datetime.now().isoformat(),
            'data_source': 'Demo Data (Production)',
            'note': 'This is demo data. For real data, integrate with Alpha Vantage, Yahoo Finance, or similar APIs.'
        }
        
        return jsonify(response_data)
    
    except Exception as e:
        return jsonify({
            'error': f'Failed to analyze stock {ticker}',
            'message': str(e)
        }), 500

def get_demo_data_for_ticker(ticker):
    """
    Generate realistic demo data for different ASX tickers
    """
    
    # Base data templates for different stock types
    stock_profiles = {
        'CBA': {
            'name': 'Commonwealth Bank of Australia',
            'shortName': 'CWLTH BANK FPO [CBA]',
            'base_price': 166.17,
            'sector': 'Banking',
            'market_cap': 280000000000
        },
        'BHP': {
            'name': 'BHP Group Limited',
            'shortName': 'BHP GROUP LTD [BHP]',
            'base_price': 42.85,
            'sector': 'Mining',
            'market_cap': 215000000000
        },
        'CSL': {
            'name': 'CSL Limited',
            'shortName': 'CSL LIMITED [CSL]',
            'base_price': 285.50,
            'sector': 'Healthcare',
            'market_cap': 130000000000
        },
        'WBC': {
            'name': 'Westpac Banking Corporation',
            'shortName': 'WESTPAC BANK [WBC]',
            'base_price': 28.45,
            'sector': 'Banking',
            'market_cap': 95000000000
        },
        'ANZ': {
            'name': 'Australia and New Zealand Banking Group',
            'shortName': 'ANZ GROUP HOLD [ANZ]',
            'base_price': 31.20,
            'sector': 'Banking',
            'market_cap': 85000000000
        }
    }
    
    # Get stock info or use default
    stock_info = stock_profiles.get(ticker, {
        'name': f'{ticker} Limited',
        'shortName': f'{ticker} [ASX]',
        'base_price': 50.00,
        'sector': 'General',
        'market_cap': 10000000000
    })
    
    # Generate realistic price variations
    import random
    base_price = stock_info['base_price']
    daily_change_percent = random.uniform(-3.0, 3.0)  # -3% to +3% daily change
    daily_change = base_price * (daily_change_percent / 100)
    current_price = base_price + daily_change
    
    # Generate other realistic metrics
    high_price = current_price + random.uniform(0, current_price * 0.02)
    low_price = current_price - random.uniform(0, current_price * 0.02)
    open_price = current_price + random.uniform(-current_price * 0.01, current_price * 0.01)
    previous_close = current_price - daily_change
    
    volume = random.randint(1000000, 10000000)  # 1M to 10M shares
    
    return {
        'profile': {
            'name': stock_info['name'],
            'shortName': stock_info['shortName'],
            'country': 'AU',
            'currency': 'AUD',
            'exchange': 'ASX',
            'fullExchangeName': 'Australian Securities Exchange',
            'instrumentType': 'EQUITY',
            'timezone': 'AEST',
            'marketCapitalization': stock_info['market_cap'],
            'shareOutstanding': int(stock_info['market_cap'] / current_price),
            'logo': '',
            'weburl': '',
            'finnhubIndustry': stock_info['sector']
        },
        'quote': {
            'c': round(current_price, 2),  # current price
            'd': round(daily_change, 2),  # change
            'dp': round(daily_change_percent, 2),  # percent change
            'h': round(high_price, 2),  # high
            'l': round(low_price, 2),  # low
            'o': round(open_price, 2),  # open
            'pc': round(previous_close, 2),  # previous close
            't': int(datetime.now().timestamp())
        },
        'financials': {
            'metric': {
                '10DayAverageTradingVolume': volume * 0.8,
                '52WeekHigh': round(current_price * random.uniform(1.1, 1.5), 2),
                '52WeekLow': round(current_price * random.uniform(0.6, 0.9), 2),
                'beta': round(random.uniform(0.5, 1.5), 2),
                'dividendYieldIndicatedAnnual': round(random.uniform(2.0, 6.0), 2),
                'epsInclExtraItemsTTM': round(current_price / random.uniform(12, 25), 2),
                'marketCapitalization': stock_info['market_cap'],
                'peInclExtraTTM': round(random.uniform(12, 25), 2),
                'pbAnnual': round(random.uniform(1.0, 3.0), 2),
                'roaeTTM': round(random.uniform(8.0, 20.0), 2),
                'roeTTM': round(random.uniform(10.0, 25.0), 2),
                'regularMarketVolume': volume
            }
        },
        'sentiment': {
            'buzz': {
                'articlesInLastWeek': random.randint(5, 50),
                'buzz': round(random.uniform(0.5, 2.0), 2),
                'weeklyAverage': round(random.uniform(0.8, 1.5), 2)
            },
            'companyNewsScore': round(random.uniform(0.3, 0.8), 2),
            'sectorAverageBullishPercent': round(random.uniform(40, 70), 1),
            'sectorAverageNewsScore': round(random.uniform(0.4, 0.7), 2),
            'sentiment': {
                'bearishPercent': round(random.uniform(20, 40), 1),
                'bullishPercent': round(random.uniform(40, 70), 1)
            },
            'symbol': ticker.upper()
        }
    }

@stock_prod_bp.route('/search/<query>', methods=['GET'])
def search_stocks_production(query):
    """
    Search for ASX stocks by company name or ticker
    """
    try:
        # Common ASX stocks database
        asx_stocks = [
            {'symbol': 'CBA.AX', 'name': 'Commonwealth Bank of Australia', 'sector': 'Banking'},
            {'symbol': 'BHP.AX', 'name': 'BHP Group Limited', 'sector': 'Mining'},
            {'symbol': 'CSL.AX', 'name': 'CSL Limited', 'sector': 'Healthcare'},
            {'symbol': 'WBC.AX', 'name': 'Westpac Banking Corporation', 'sector': 'Banking'},
            {'symbol': 'ANZ.AX', 'name': 'Australia and New Zealand Banking Group', 'sector': 'Banking'},
            {'symbol': 'NAB.AX', 'name': 'National Australia Bank', 'sector': 'Banking'},
            {'symbol': 'WOW.AX', 'name': 'Woolworths Group Limited', 'sector': 'Retail'},
            {'symbol': 'COL.AX', 'name': 'Coles Group Limited', 'sector': 'Retail'},
            {'symbol': 'TLS.AX', 'name': 'Telstra Corporation Limited', 'sector': 'Telecommunications'},
            {'symbol': 'RIO.AX', 'name': 'Rio Tinto Limited', 'sector': 'Mining'},
            {'symbol': 'FMG.AX', 'name': 'Fortescue Metals Group Ltd', 'sector': 'Mining'},
            {'symbol': 'MQG.AX', 'name': 'Macquarie Group Limited', 'sector': 'Financial Services'},
            {'symbol': 'TCL.AX', 'name': 'Transurban Group', 'sector': 'Infrastructure'},
            {'symbol': 'WES.AX', 'name': 'Wesfarmers Limited', 'sector': 'Conglomerate'},
            {'symbol': 'STO.AX', 'name': 'Santos Ltd', 'sector': 'Energy'}
        ]
        
        query_lower = query.lower()
        results = []
        
        for stock in asx_stocks:
            # Search in symbol or company name
            if (query_lower in stock['symbol'].lower() or 
                query_lower in stock['name'].lower() or
                query_lower in stock['sector'].lower()):
                results.append({
                    'symbol': stock['symbol'],
                    'description': f"{stock['name']} - {stock['sector']}",
                    'displaySymbol': stock['symbol'],
                    'type': 'Common Stock'
                })
        
        return jsonify({
            'query': query,
            'results': results[:10]  # Limit to top 10 results
        })
    
    except Exception as e:
        return jsonify({
            'error': f'Failed to search for {query}',
            'message': str(e)
        }), 500

@stock_prod_bp.route('/health', methods=['GET'])
def health_check_production():
    """
    Health check endpoint for production version
    """
    return jsonify({
        'status': 'healthy',
        'service': 'ASX Stock Analyzer API (Production)',
        'data_source': 'Demo Data',
        'note': 'For real data, integrate with Alpha Vantage, Yahoo Finance, or similar APIs',
        'timestamp': datetime.now().isoformat()
    })
