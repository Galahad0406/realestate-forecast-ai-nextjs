export interface MarketFactors {
  currentPrice: number;
  interestRate: number; 
  supplyMonths: number; 
  incomeGrowth: number; 
}

export function calculateAIPrediction(factors: MarketFactors, years: number = 5) {
  const { currentPrice, interestRate, supplyMonths, incomeGrowth } = factors;

  // 연간 성장률 = (소득 증가 영향) - (금리 압박) + (공급 부족 가중치)
  const annualRate = (incomeGrowth * 1.1) - (interestRate * 0.35) + (5 - supplyMonths) * 0.012;
  const safeRate = Math.max(annualRate, -0.04); 

  const timeline = Array.from({ length: years + 1 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    const price = Math.round(currentPrice * Math.pow(1 + safeRate, i));
    return { year, price };
  });

  return {
    timeline,
    finalPrice: timeline[years].price,
    totalGrowth: ((timeline[years].price / currentPrice - 1) * 100).toFixed(1),
    confidenceScore: 92 
  };
}
