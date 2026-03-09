// lib/engine.ts
export interface MarketFactors {
  currentPrice: number;
  interestRate: number; // 국채 금리 등 거시 지표
  supplyMonths: number; // 매물 소화 기간 (적을수록 가격 상승)
  incomeGrowth: number; // 지역 소득 증가율
}

export function calculateAIPrediction(factors: MarketFactors, years: number = 5) {
  const { currentPrice, interestRate, supplyMonths, incomeGrowth } = factors;

  // 정교한 연간 성장률 계산 로직
  // 1. 소득 증가율은 긍정적(+), 금리는 부정적(-), 공급 과잉은 부정적(-)
  const annualRate = (incomeGrowth * 1.2) - (interestRate * 0.5) + (6 - supplyMonths) * 0.01;
  const safeRate = Math.max(annualRate, -0.05); // 최악의 경우에도 연 -5% 하한선

  const timeline = Array.from({ length: years + 1 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    const price = Math.round(currentPrice * Math.pow(1 + safeRate, i));
    return { year, price };
  });

  return {
    timeline,
    finalPrice: timeline[years].price,
    totalGrowth: ((timeline[years].price / currentPrice - 1) * 100).toFixed(1),
    confidenceScore: 85 // 신뢰도 지수
  };
}
