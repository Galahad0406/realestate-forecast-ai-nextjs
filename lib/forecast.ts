export function generateForecast(
  zillowData: any[],
  hudData: any,
  censusData: any
) {
  const latest = zillowData[zillowData.length - 1]
  const basePrice = Number(latest?.Value || 0)

  const growthFactor =
    censusData.population * 0.0000001 +
    censusData.medianIncome * 0.000001

  const projected = basePrice * (1 + growthFactor)

  return {
    currentPrice: basePrice,
    projectedPrice: Math.round(projected),
    population: censusData.population,
    medianIncome: censusData.medianIncome
  }
}
