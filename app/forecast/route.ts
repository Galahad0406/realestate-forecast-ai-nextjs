import { NextResponse } from 'next/server';
import { calculateAIPrediction } from '../../../lib/engine';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get('zip') || '10001';

  try {
    // 실제 운영 시에는 여기서 외부 API(HUD, Zillow) 데이터를 Fetch 합니다.
    const forecast = calculateAIPrediction({
      currentPrice: 620000,
      interestRate: 0.065,
      supplyMonths: 3.2,
      incomeGrowth: 0.045
    }, 5);

    return NextResponse.json({ zip, ...forecast });
  } catch (error) {
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
