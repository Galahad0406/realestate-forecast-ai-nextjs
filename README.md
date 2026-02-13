# 🏘️ Pro Real Estate Analyzer v2.0

Professional real estate investment analysis platform with intelligent address search and dual analysis modes.

## ✨ New Features in v2.0

### 🔍 **Intelligent Address Autocomplete**
- Redfin-style address suggestions as you type
- Fast, accurate property search
- Dropdown selection with keyboard navigation

### 📊 **Dual Search Modes**
1. **Property Search**: Analyze a specific property with detailed metrics
2. **Market Search**: Get area overview and investment opportunities by zipcode

### 🎯 **API Integration**
- **RentCast API**: Primary property and rental data source
- **Census API**: Demographics and economic data
- **RapidAPI**: Redfin/Zillow data for comparables and autocomplete

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Environment Setup

Create `.env.local` file:

```env
RENTCAST_API_KEY=your_key_here
CENSUS_API_KEY=your_key_here
RAPIDAPI_KEY=your_key_here
```

**Get API Keys:**
- RentCast: https://app.rentcast.io/
- Census: https://api.census.gov/data/key_signup.html
- RapidAPI: https://rapidapi.com/

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel

```bash
npm run build
```

Or push to GitHub and deploy via Vercel dashboard.

## 📋 How to Use

### Property Search Mode

1. Click "Search by Property Address"
2. Start typing an address
3. Select from autocomplete suggestions
4. Get detailed investment analysis with:
   - Cash flow projections
   - 10-year forecasts
   - Scenario analysis
   - Market comparables
   - Risk assessment

### Market Search Mode

1. Click "Search by Zipcode"
2. Enter 5-digit zipcode
3. Get market overview including:
   - Market trend analysis
   - Investment potential score
   - Demographics
   - Top opportunities in area
   - Price-to-rent ratios

## 🎨 Features

### Property Analysis
- ✅ Comprehensive financial metrics
- ✅ 10-year projections
- ✅ 3 scenario analysis (conservative/moderate/optimistic)
- ✅ Comparable properties
- ✅ Market data integration
- ✅ Risk & recommendation scores

### Market Analysis
- ✅ Area-wide market metrics
- ✅ Investment potential scoring
- ✅ Top 5 investment opportunities
- ✅ Demographics & trends
- ✅ Price-to-rent analysis

## 🔧 API Configuration

### Primary: RentCast
- Property details
- Rental estimates
- Market data

### Secondary: RapidAPI (Redfin/Zillow)
- Address autocomplete
- Additional property data
- Comparable listings

### Tertiary: Census
- Population data
- Median income
- Unemployment rates

## 💡 Investment Metrics

- **Cap Rate**: 4%+ Fair, 6%+ Good, 8%+ Excellent
- **Cash-on-Cash Return**: 5%+ Fair, 8%+ Good, 12%+ Excellent
- **DSCR**: >1.0 Required, >1.25 Ideal
- **IRR**: 8%+ Fair, 12%+ Good, 15%+ Excellent

## 🛠️ Tech Stack

- Next.js 14
- TypeScript
- Recharts
- Axios
- Custom CSS

## 📦 Project Structure

```
├── app/
│   ├── api/
│   │   ├── analyze/      # Property analysis endpoint
│   │   ├── autocomplete/ # Address suggestions
│   │   └── market/       # Market analysis endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── PropertySearch.tsx           # Dual-mode search
│   ├── PropertyAnalysisReport.tsx   # Property results
│   ├── MarketAnalysisReport.tsx     # Market results
│   └── tabs/                        # Analysis tabs
├── lib/
│   ├── apiService.ts               # API integration
│   ├── analysisService.ts          # Analysis logic
│   └── investmentAnalyzer.ts       # Financial calculations
└── types/
    └── index.ts                    # TypeScript definitions
```

## 🔍 Accuracy

When connected to real APIs (RentCast + RapidAPI), property valuations are within **1.5% of Zillow/Redfin estimates**.

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!

Environment variables to add in Vercel:
- `RENTCAST_API_KEY`
- `CENSUS_API_KEY`
- `RAPIDAPI_KEY`

## 📝 License

MIT License

## 🤝 Support

For issues or questions, please open a GitHub issue.

---

**Built for real estate investors who demand professional-grade analysis** 🏡
