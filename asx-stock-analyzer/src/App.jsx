import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Search, TrendingUp, TrendingDown, DollarSign, Calendar, Building2, Users, BarChart3, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
  const [ticker, setTicker] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!ticker.trim()) return
    
    setLoading(true)
    setError(null)
    setData(null)

    try {
      // Call the new real data API endpoint
      const response = await fetch(`/api/real/${ticker}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const apiData = await response.json()
      
      // Transform API data to match our component structure
      const transformedData = {
        profile: {
          name: apiData.profile?.name || `${ticker.toUpperCase()} Limited`,
          country: apiData.profile?.country || 'AU',
          currency: apiData.profile?.currency || 'AUD',
          exchange: apiData.profile?.exchange || 'ASX',
          ipo: apiData.profile?.ipo || 'N/A',
          marketCapitalization: apiData.profile?.marketCapitalization || apiData.financials?.metric?.marketCapitalization || 0,
          shareOutstanding: apiData.profile?.shareOutstanding || 0,
          logo: apiData.profile?.logo || '',
          weburl: apiData.profile?.weburl || '',
          finnhubIndustry: apiData.profile?.finnhubIndustry || 'N/A'
        },
        quote: {
          c: apiData.quote?.c || 0,
          d: apiData.quote?.d || 0,
          dp: apiData.quote?.dp || 0,
          h: apiData.quote?.h || 0,
          l: apiData.quote?.l || 0,
          o: apiData.quote?.o || 0,
          pc: apiData.quote?.pc || 0,
          t: apiData.quote?.t || Date.now()
        },
        sentiment: {
          buzz: {
            articlesInLastWeek: apiData.sentiment?.buzz?.articlesInLastWeek || 0,
            buzz: apiData.sentiment?.buzz?.buzz || 0,
            weeklyAverage: apiData.sentiment?.buzz?.weeklyAverage || 0
          },
          companyNewsScore: apiData.sentiment?.companyNewsScore || 0,
          sectorAverageBullishPercent: apiData.sentiment?.sectorAverageBullishPercent || 0,
          sectorAverageNewsScore: apiData.sentiment?.sectorAverageNewsScore || 0,
          sentiment: {
            bearishPercent: apiData.sentiment?.sentiment?.bearishPercent || 0,
            bullishPercent: apiData.sentiment?.sentiment?.bullishPercent || 0
          },
          symbol: ticker.toUpperCase()
        },
        financials: {
          metric: {
            '10DayAverageTradingVolume': apiData.financials?.metric?.['10DayAverageTradingVolume'] || 0,
            '52WeekHigh': apiData.financials?.metric?.['52WeekHigh'] || 0,
            '52WeekLow': apiData.financials?.metric?.['52WeekLow'] || 0,
            'beta': apiData.financials?.metric?.beta || 0,
            'dividendYieldIndicatedAnnual': apiData.financials?.metric?.dividendYieldIndicatedAnnual || 0,
            'epsInclExtraItemsTTM': apiData.financials?.metric?.epsInclExtraItemsTTM || 0,
            'marketCapitalization': apiData.financials?.metric?.marketCapitalization || 0,
            'peInclExtraTTM': apiData.financials?.metric?.peInclExtraTTM || 0,
            'pbAnnual': apiData.financials?.metric?.pbAnnual || 0,
            'roaeTTM': apiData.financials?.metric?.roaeTTM || 0,
            'roeTTM': apiData.financials?.metric?.roeTTM || 0
          }
        }
      }
      
      setData(transformedData)
    } catch (err) {
      setError('Failed to fetch data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ASX Stock Analyzer</h1>
          <p className="text-lg text-gray-600">Comprehensive analysis of Australian Stock Exchange securities</p>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search ASX Stock
              </CardTitle>
              <CardDescription>
                Enter an ASX ticker symbol (e.g., CBA, BHP, CSL) to get comprehensive analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter ASX ticker (e.g., CBA)"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={loading}
                />
                <Button 
                  onClick={handleSearch}
                  disabled={loading || !ticker.trim()}
                  className="px-6"
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6"
            >
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Display */}
        <AnimatePresence>
          {data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Company Overview */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold">{data.profile.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary">{data.profile.exchange}</Badge>
                          <Badge variant="outline">{data.profile.finnhubIndustry}</Badge>
                          <Badge variant="outline">{data.profile.country}</Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Market Cap:</span>
                          <p className="font-semibold">${data.profile.marketCapitalization.toFixed(2)}M</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Shares Outstanding:</span>
                          <p className="font-semibold">{data.profile.shareOutstanding.toFixed(1)}M</p>
                        </div>
                        <div>
                          <span className="text-gray-600">IPO Date:</span>
                          <p className="font-semibold">{data.profile.ipo}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Currency:</span>
                          <p className="font-semibold">{data.profile.currency}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center">
                      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                        <Building2 className="h-12 w-12 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock Price */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Current Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-3xl font-bold">${data.quote.c.toFixed(2)}</span>
                        <div className={`flex items-center gap-1 ${data.quote.d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {data.quote.d >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                          <span className="font-semibold">${Math.abs(data.quote.d).toFixed(2)} ({Math.abs(data.quote.dp).toFixed(2)}%)</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Open:</span>
                          <p className="font-semibold">${data.quote.o.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Previous Close:</span>
                          <p className="font-semibold">${data.quote.pc.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">High:</span>
                          <p className="font-semibold">${data.quote.h.toFixed(2)}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Low:</span>
                          <p className="font-semibold">${data.quote.l.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <span className="text-gray-600">52 Week Range:</span>
                        <p className="font-semibold">${data.financials.metric['52WeekLow'].toFixed(2)} - ${data.financials.metric['52WeekHigh'].toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Beta:</span>
                        <p className="font-semibold">{data.financials.metric.beta.toFixed(2)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Dividend Yield:</span>
                        <p className="font-semibold">{data.financials.metric.dividendYieldIndicatedAnnual.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Metrics */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Key Financial Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">Valuation</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">P/E Ratio:</span>
                          <span className="font-semibold">{data.financials.metric.peInclExtraTTM.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">P/B Ratio:</span>
                          <span className="font-semibold">{data.financials.metric.pbAnnual.toFixed(1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">EPS (TTM):</span>
                          <span className="font-semibold">${data.financials.metric.epsInclExtraItemsTTM.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">Profitability</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROE:</span>
                          <span className="font-semibold">{data.financials.metric.roeTTM.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">ROA:</span>
                          <span className="font-semibold">{data.financials.metric.roaeTTM.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-700">Trading</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Avg Volume (10D):</span>
                          <span className="font-semibold">{data.financials.metric['10DayAverageTradingVolume'].toFixed(1)}M</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sentiment Analysis */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Market Sentiment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">News Sentiment</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${data.sentiment.sentiment.bullishPercent * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-green-600">
                            {(data.sentiment.sentiment.bullishPercent * 100).toFixed(0)}% Bullish
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">News Score:</span>
                            <p className="font-semibold">{data.sentiment.companyNewsScore.toFixed(3)}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Sector Avg:</span>
                            <p className="font-semibold">{data.sentiment.sectorAverageNewsScore.toFixed(3)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">News Buzz</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Articles (Last Week):</span>
                            <span className="font-semibold">{data.sentiment.buzz.articlesInLastWeek}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Weekly Average:</span>
                            <span className="font-semibold">{data.sentiment.buzz.weeklyAverage.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Buzz Score:</span>
                            <span className="font-semibold">{data.sentiment.buzz.buzz.toFixed(3)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-gray-500 text-sm"
        >
          <p>Powered by Finnhub API • Data may be delayed • For educational purposes only</p>
        </motion.div>
      </div>
    </div>
  )
}

export default App
