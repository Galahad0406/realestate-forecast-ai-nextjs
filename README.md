# 🏡 Pro Real Estate Analyzer v2.2

Professional real estate investment analysis platform with accurate property data and AI-powered insights.

## 🚀 Features

- **✅ Google Geocoding** - Accurate address verification and standardization
- **📊 Multi-Source Data** - Redfin, Zillow, Census Bureau
- **💰 Investment Analysis** - ROI, Cap Rate, Cash Flow, IRR
- **📈 10-Year Projections** - Property value, equity, returns
- **🎯 Scenario Analysis** - Conservative, Moderate, Optimistic
- **🏘️ Market Analysis** - Neighborhood trends and statistics
- **📍 Comparable Properties** - Real distance calculations

## 🔑 API Keys Required

### 1. Google Maps API (Free $200/month credit)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Geocoding API**
4. Create credentials → API Key
5. Add to `.env`: `GOOGLE_MAPS_API_KEY=your_key`

**Free Tier:** 28,500 requests/month

### 2. RapidAPI (Multiple services)
1. Sign up at [RapidAPI](https://rapidapi.com/)
2. Subscribe to these APIs (all have free tiers):
   - [Redfin Data](https://rapidapi.com/letscrape-6bRBa3QguO5/api/redfin-com-data/) - 100 req/month
   - [Zillow API](https://rapidapi.com/apimaker/api/zillow-com1/) - 100 req/month  
   - [Realty Mole](https://rapidapi.com/realtymole/api/realty-mole-property-api/) - 100 req/month
3. Copy your RapidAPI key
4. Add to `.env`: `RAPIDAPI_KEY=your_key`

### 3. US Census API (Free unlimited)
1. Go to [Census API](https://api.census.gov/data/key_signup.html)
2. Request a free key
3. Add to `.env`: `CENSUS_API_KEY=your_key`

## 📦 Installation
```bash
# Clone the repository
git clone <your-repo>
cd realestate-analyzer

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your API keys to .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔧 Environment Variables
```bash
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
RAPIDAPI_KEY=your_rapidapi_key
CENSUS_API_KEY=your_census_api_key
```

## 🎯 How It Works

1. **Address Input** → Google Geocoding validates and standardizes
2. **Property Search** → Searches Redfin & Zillow with exact location
3. **Data Collection** → Gathers property details, rental estimates, market data
4. **Analysis** → Calculates financial metrics and projections
5. **Report** → Displays comprehensive investment analysis

## 📊 Accuracy Improvements

- ✅ Google Geocoding eliminates address errors
- ✅ Standardized address format for API calls
- ✅ Lat/Long coordinates for precise distance calculations
- ✅ Multi-source data validation (Redfin + Zillow)
- ✅ Real-time market data from Census Bureau

## 🚀 Deploy to Vercel

### Step 1: GitHub에 push
```bash
git add .
git commit -m "fix: upgrade Next.js to 15.1.11 (CVE-2025-66478 patch)"
git push
```

### Step 2: Vercel에 연결
1. [vercel.com](https://vercel.com) → **New Project** → GitHub 저장소 import
2. **Deploy** 클릭 (환경변수 없으면 빌드는 되지만 API가 작동 안 함)

### Step 3: 환경변수 추가 ⚠️ 필수
Vercel 대시보드에서 프로젝트 선택 후:
**Settings → Environment Variables** → 아래 3개 추가:

| Key | Value |
|-----|-------|
| `GOOGLE_MAPS_API_KEY` | Google Maps API 키 |
| `RAPIDAPI_KEY` | RapidAPI 키 |
| `CENSUS_API_KEY` | Census API 키 |

Production, Preview, Development 환경 모두 체크할 것!

### Step 4: 재배포
환경변수 추가 후 **Deployments** → **⋯** → **Redeploy**

⚠️ 환경변수를 Vercel에 등록하지 않으면 빌드는 성공해도 모든 API 호출이 실패하고 더미 데이터만 표시됩니다.

## 📝 License

MIT License - Feel free to use for commercial or personal projects
