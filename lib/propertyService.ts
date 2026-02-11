const CENSUS_API_KEY = process.env.CENSUS_API_KEY

const propertyService = {

  async getCensusData(zipcode: string) {
    const res = await fetch(
      `https://api.census.gov/data/2022/acs/acs5?get=B01003_001E,B19013_001E&for=zip%20code%20tabulation%20area:${zipcode}&key=${CENSUS_API_KEY}`
    )

    if (!res.ok) throw new Error("Census fetch failed")

    const data = await res.json()

    return {
      population: Number(data[1][0]),
      medianIncome: Number(data[1][1])
    }
  },

  predictGrowth(basePrice: number, rate: number) {
    const results = []
    for (let year = 1; year <= 5; year++) {
      results.push({
        year,
        projectedValue: Math.round(basePrice * Math.pow(1 + rate, year))
      })
    }
    return results
  }

}

export default propertyService
