import MarketChart from '@/components/MarketChart';
import { calculateAIPrediction } from '@/lib/engine';

export default async function Dashboard() {
  // 서버 사이드에서 초기 데이터 계산
  const data = calculateAIPrediction({
    currentPrice: 620000,
    interestRate: 0.065,
    supplyMonths: 3.2,
    incomeGrowth: 0.045
  }, 5);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Real Estate <span className="text-blue-500">AI Forecast</span></h1>
          <p className="text-slate-400">Advanced 5-Year Price Projection Engine</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <p className="text-sm text-slate-400 mb-1">Current Value</p>
            <h2 className="text-3xl font-bold">$620,000</h2>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <p className="text-sm text-slate-400 mb-1">5Y Predicted</p>
            <h2 className="text-3xl font-bold text-blue-400">${data.finalPrice.toLocaleString()}</h2>
          </div>
          <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <p className="text-sm text-slate-400 mb-1">Total Growth</p>
            <h2 className="text-3xl font-bold text-green-400">+{data.totalGrowth}%</h2>
          </div>
        </div>

        <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Price Trend Forecast</h3>
            <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
              AI Confidence: {data.confidenceScore}%
            </span>
          </div>
          <MarketChart data={data.timeline} />
        </div>
      </div>
    </main>
  );
}
