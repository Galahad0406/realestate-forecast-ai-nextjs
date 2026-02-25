import { NextResponse } from "next/server";
import { getZillowData } from "../../../lib/zillow";
import { getHUDData } from "../../../lib/hud";
import { getCensusData } from "../../../lib/census";
import { forecastMarket } from "../../../lib/forecast";

export async function GET() {
  try {
    const zillow = await getZillowData();
    const hud = await getHUDData();
    const census = await getCensusData();

    const forecast = forecastMarket(zillow, hud, census);

    return NextResponse.json({
      success: true,
      data: forecast,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Market API failed" },
      { status: 500 }
    );
  }
}
