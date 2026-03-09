import MarketChart from '../components/MarketChart';
import { calculateAIPrediction } from '../lib/engine';

export default function Dashboard() {
  const data = calculateAIPrediction({
    currentPrice: 850000,
    interestRate: 0.052,
    supplyMonths: 3.0,
    incomeGrowth: 0.045
  }, 5);

  return (
    <main className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black tracking-tighter italic text-blue-500">REALESTATE.AI</h1>
          <div className="text-xs text-zinc-500 font-mono text-right">SYSTEM ACTIVE // PDX1_NODE</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Current Market" value={`$${data.timeline[0].price.toLocaleString()}`} />
          <StatCard label="5Y AI Forecast" value={`$${data.finalPrice.toLocaleString()}`} highlight />
          <StatCard label="Total Yield" value={`+${data.totalGrowth}%`} color="text-emerald-500" />
        </div>

        <section className="bg-zinc-900/30 border border-white/5 p-8 rounded-[2.5rem]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold tracking-tight text-zinc-200">Growth Projection Analysis</h2>
            <div className="px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-bold text-blue-400">
              CONFIDENCE: {data.confidenceScore}%
            </div>
          </div>
          <MarketChart data={data.timeline} />
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value, highlight, color = "text-white" }: any) {
  return (
    <div className={`p-8 rounded-[2rem] border ${highlight ? 'border-blue-500/20 bg-blue-500/5' : 'border-white/5 bg-zinc-900/20'}`}>
      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-4">{label}</span>
      <span className={`text-4xl font-black tracking-tighter ${highlight ? 'text-blue-400' : color}`}>{value}</span>
    </div>
  );
}
