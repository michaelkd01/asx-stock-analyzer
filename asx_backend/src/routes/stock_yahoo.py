from flask import Blueprint, jsonify, request
import sys
import os
sys.path.append('/opt/.manus/.sandbox-runtime')
from data_api import ApiClient
from datetime import datetime, timedelta

stock_yahoo_bp = Blueprint('stock_yahoo', __name__)

# Initialize Yahoo Finance API client
yahoo_client = ApiClient()

@stock_yahoo_bp.route('/analyze/<ticker>', methods=['GET'])
def analyze_stock_yahoo(ticker):
    """
    Analyze an ASX stock using Yahoo Finance API
    Returns comprehensive analysis including company profile, financials, and real-time data
    """
    try:
        # Convert ticker to ASX format (add .AX suffix if not present)
        asx_ticker = ticker.upper()
        if not asx_ticker.endswith('.AX'):
            asx_ticker += '.AX'
        
        # Fetch stock data from Yahoo Finance
        try:
            response = yahoo_client.call_api('YahooFinance/get_stock_chart', query={
                'symbol': asx_ticker,
                'region': 'AU',
                'interval': '1d',
                'range': '1y',  # Get 1 year of data for better analysis
                'includeAdjustedClose': True,
                'events': 'div,split'
            })
            
            if not response or 'chart' not in response or not response['chart']['result']:
                raise Exception(f"No data found for {asx_ticker}")
            
            result = response['chart']['result'][0]
            meta = result['meta']
            
            # Extract current price data
            current_price = meta.get('regularMarketPrice', 0)
            chart_previous_close = meta.get('chartPreviousClose', current_price)
            
            # Calculate daily change
            daily_change = current_price - chart_previous_close
            daily_change_percent = (daily_change / chart_previous_close * 100) if chart_previous_close > 0 else 0
            
            # Get historical data for additional metrics
            timestamps = result.get('timestamp', [])
            quotes = result.get('indicators', {}).get('quote', [{}])[0]
            
            # Calculate average volume (last 10 days)
            volumes = [v for v in quotes.get('volume', []) if v is not None]
            avg_volume = sum(volumes[-10:]) / len(volumes[-10:]) if volumes else 0
            
            # Structure the response to match our frontend expectations
            response_data = {
                'ticker': ticker.upper(),
                'asx_ticker': asx_ticker,
                'profile': {
                    'name': meta.get('longName', f"{ticker.upper()} Limited"),
                    'shortName': meta.get('shortName', ticker.upper()),
                    'country': 'AU',
                    'currency': meta.get('currency', 'AUD'),
                    'exchange': meta.get('exchangeName', 'ASX'),
                    'fullExchangeName': meta.get('fullExchangeName', 'Australian Securities Exchange'),
                    'instrumentType': meta.get('instrumentType', 'EQUITY'),
                    'timezone': meta.get('timezone', 'AEST'),
                    'firstTradeDate': meta.get('firstTradeDate'),
                    'marketCapitalization': 0,  # Not available in basic Yahoo Finance
                    'shareOutstanding': 0,  # Not available in basic Yahoo Finance
                    'logo': '',  # Not available in Yahoo Finance
                    'weburl': '',  # Not available in Yahoo Finance
                    'finnhubIndustry': 'N/A'
                },
                'quote': {
                    'c': current_price,  # current price
                    'd': daily_change,  # change
                    'dp': daily_change_percent,  # percent change
                    'h': meta.get('regularMarketDayHigh', current_price),  # high
                    'l': meta.get('regularMarketDayLow', current_price),  # low
                    'o': quotes.get('open', [])[-1] if quotes.get('open') and quotes['open'] else current_price,  # open
                    'pc': chart_previous_close,  # previous close
                    't': meta.get('regularMarketTime', int(datetime.now().timestamp()))
                },
                'financials': {
                    'metric': {
                        '10DayAverageTradingVolume': avg_volume,
                        '52WeekHigh': meta.get('fiftyTwoWeekHigh', current_price),
                        '52WeekLow': meta.get('fiftyTwoWeekLow', current_price),
                        'beta': 0,  # Not available in basic Yahoo Finance
                        'dividendYieldIndicatedAnnual': 0,  # Not available in basic Yahoo Finance
                        'epsInclExtraItemsTTM': 0,  # Not available in basic Yahoo Finance
                        'marketCapitalization': 0,  # Not available in basic Yahoo Finance
                        'peInclExtraTTM': 0,  # Not available in basic Yahoo Finance
                        'pbAnnual': 0,  # Not available in basic Yahoo Finance
                        'roaeTTM': 0,  # Not available in basic Yahoo Finance
                        'roeTTM': 0,  # Not available in basic Yahoo Finance
                        'regularMarketVolume': meta.get('regularMarketVolume', 0)
                    }
                },
                'sentiment': {
                    'buzz': {
                        'articlesInLastWeek': 0,  # Not available in Yahoo Finance
                        'buzz': 0,  # Not available in Yahoo Finance
                        'weeklyAverage': 0  # Not available in Yahoo Finance
                    },
                    'companyNewsScore': 0,  # Not available in Yahoo Finance
                    'sectorAverageBullishPercent': 0,  # Not available in Yahoo Finance
                    'sectorAverageNewsScore': 0,  # Not available in Yahoo Finance
                    'sentiment': {
                        'bearishPercent': 0,  # Not available in Yahoo Finance
                        'bullishPercent': 0  # Not available in Yahoo Finance
                    },
                    'symbol': ticker.upper()
                },
                'timestamp': datetime.now().isoformat(),
                'data_source': 'Yahoo Finance'
            }
            
            return jsonify(response_data)
            
        except Exception as e:
            print(f"Error fetching data for {asx_ticker}: {e}")
            return jsonify({
                'error': f'Failed to fetch data for {ticker}',
                'message': str(e),
                'ticker': ticker.upper(),
                'asx_ticker': asx_ticker
            }), 500
    
    except Exception as e:
        return jsonify({
            'error': f'Failed to analyze stock {ticker}',
            'message': str(e)
        }), 500

@stock_yahoo_bp.route('/search/<query>', methods=['GET'])
def search_stocks_yahoo(query):
    """
    Search for ASX stocks by company name or ticker
    Note: Yahoo Finance doesn't have a direct search API, so this is a placeholder
    """
    try:
        # For now, return some common ASX stocks that match the query
        common_asx_stocks = {
            'cba': {'symbol': 'CBA.AX', 'name': 'Commonwealth Bank of Australia'},
            'commonwealth': {'symbol': 'CBA.AX', 'name': 'Commonwealth Bank of Australia'},
            'bhp': {'symbol': 'BHP.AX', 'name': 'BHP Group Limited'},
            'csl': {'symbol': 'CSL.AX', 'name': 'CSL Limited'},
            'wbc': {'symbol': 'WBC.AX', 'name': 'Westpac Banking Corporation'},
            'westpac': {'symbol': 'WBC.AX', 'name': 'Westpac Banking Corporation'},
            'anz': {'symbol': 'ANZ.AX', 'name': 'Australia and New Zealand Banking Group'},
            'nab': {'symbol': 'NAB.AX', 'name': 'National Australia Bank'},
            'woolworths': {'symbol': 'WOW.AX', 'name': 'Woolworths Group Limited'},
            'coles': {'symbol': 'COL.AX', 'name': 'Coles Group Limited'},
            'telstra': {'symbol': 'TLS.AX', 'name': 'Telstra Corporation Limited'},
            'rio': {'symbol': 'RIO.AX', 'name': 'Rio Tinto Limited'},
            'fortescue': {'symbol': 'FMG.AX', 'name': 'Fortescue Metals Group Ltd'}
        }
        
        query_lower = query.lower()
        results = []
        
        for key, stock in common_asx_stocks.items():
            if query_lower in key or query_lower in stock['name'].lower():
                results.append({
                    'symbol': stock['symbol'],
                    'description': stock['name'],
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

@stock_yahoo_bp.route('/health', methods=['GET'])
def health_check_yahoo():
    """
    Health check endpoint for Yahoo Finance integration
    """
    return jsonify({
        'status': 'healthy',
        'service': 'ASX Stock Analyzer API (Yahoo Finance)',
        'data_source': 'Yahoo Finance',
        'timestamp': datetime.now().isoformat()
    })
