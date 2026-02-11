const CENSUS_API_KEY = process.env.CENSUS_API_KEY

const propertyService = {

  async getZipData(zipcode: string) {
    const res = await fetch(
      `https://api.zippopotam.us/us/${zipcode}`
    )

    if (!res.ok) throw new Error("Invalid zipcode")

    return res.json()
  },

  async getCensusData(zipcode: string) {
    const res = await fetch(
      `https://api.census.gov/data/2022/acs/acs5?get=B01003_001E,B19013_001E&for=zip%20code%20tabulation%20area:${zipcode}&key=${CENSUS_API_KEY}`
    )

    if (!res.ok) throw new Error("Census fetch failed")

    const data = await res.json()

    return {
      population: data[1][0],
      medianIncome: data[1][1]
    }
  },

  calculateInvestmentScore(medianIncome: number) {
    if (medianIncome > 120000) return "A"
    if (medianIncome > 90000) return "B"
    if (medianIncome > 70000) return "C"
    return "D"
  }

}

export default propertyService
