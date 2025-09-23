# Deployment Instructions

## GitHub Repository ✅
Your code is now available at: https://github.com/michaelkd01/asx-stock-analyzer

## Deploy to Vercel from GitHub

### Step-by-Step Instructions:

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose `asx-stock-analyzer` from your repositories

3. **Configure Project**
   - **Framework Preset**: Vite (should auto-detect)
   - **Root Directory**: `asx-stock-analyzer` (IMPORTANT: Select this subdirectory)
   - **Build Command**: `pnpm install && pnpm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

4. **Environment Variables** (Optional for now)
   - No environment variables needed for demo deployment
   - Will add API keys later for real data

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build and deployment

## What Will Be Deployed

The deployment includes:
- ✅ React frontend (Vite + TailwindCSS)
- ✅ Serverless API endpoint for demo data (`/api/analyze/[ticker]`)
- ✅ All UI components and styling
- ✅ Demo data for ASX stocks (CBA, BHP, CSL, WBC, ANZ, etc.)

## After Deployment

Your app will be available at:
- Production URL: `https://[your-project-name].vercel.app`
- Preview URLs for each git push

## Testing the Deployment

1. Visit your Vercel URL
2. Try these ASX tickers:
   - CBA (Commonwealth Bank)
   - BHP (BHP Group)
   - CSL (CSL Limited)
   - WBC (Westpac)
   - ANZ (ANZ Bank)

## Notes

- Currently using **demo data** (not real stock prices)
- The Flask backend is **not deployed** (Vercel doesn't support Python backends)
- Using Vercel serverless functions for API endpoints
- Real data integration will be added in next phase

## Next Steps

After successful deployment, we can:
1. Add real API integration (Alpha Vantage, Yahoo Finance)
2. Set up environment variables for API keys
3. Add more features (charts, portfolio tracking, etc.)
4. Connect a custom domain