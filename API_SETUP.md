# 🚀 Quick API Setup for Real ASX Data

## Step 1: Get Your Free Alpha Vantage API Key (2 minutes)

1. Go to: https://www.alphavantage.co/support/#api-key
2. Enter your email and click "GET FREE API KEY"
3. Copy your API key from the email

## Step 2: Add to Vercel (3 minutes)

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your `asx-stock-analyzer` project
3. Go to **Settings** → **Environment Variables**
4. Add new variable:
   - **Name:** `ALPHA_VANTAGE_API_KEY`
   - **Value:** `[paste your API key here]`
   - **Environment:** Select all (Production, Preview, Development)
5. Click **Save**

## Step 3: Redeploy (1 minute)

1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Click **Redeploy**
4. Wait ~1 minute for deployment

## Step 4: Test It!

Visit your app and try these ASX tickers:
- **CBA** - Commonwealth Bank (should show ~$110)
- **BHP** - BHP Group (should show ~$45)
- **CSL** - CSL Limited (should show ~$290)
- **WBC** - Westpac (should show ~$28)

## 🎉 That's It!

Your app now shows **REAL ASX stock prices** that update with the market!

## API Limits

- **Free tier:** 25 requests per day
- **Resets:** Daily at midnight EST
- **Tip:** The app falls back to realistic demo data if limit is reached

## Want More Requests?

### Option 1: Multiple Free Keys
- Use different emails for multiple free keys
- Rotate between them in your code

### Option 2: Premium Plan
- $49.99/month for 500 requests/day
- $99.99/month for unlimited

### Option 3: Alternative Free APIs
```javascript
// Can add these later as fallbacks:
- Yahoo Finance (unofficial, unlimited)
- Twelve Data (800 requests/day free)
- Finnhub (60 requests/minute free)
```

## Troubleshooting

**Not seeing real data?**
1. Check if API key is added to Vercel
2. Make sure you redeployed after adding key
3. Check browser console for errors
4. API might be at daily limit (resets at midnight EST)

**Getting "API limit" message?**
- You've hit the 25 request daily limit
- App will show realistic demo data instead
- Real data returns tomorrow

## Next Steps

Once this is working, you can:
1. Add price charts (using historical data)
2. Add more detailed company info
3. Add technical indicators
4. Cache data to reduce API calls

---

**Need help?** The app works with demo data even without an API key, so you can test everything while waiting for your key!
