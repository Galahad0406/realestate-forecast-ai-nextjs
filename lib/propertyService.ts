const CENSUS_API_KEY = process.env.CENSUS_API_KEY

const propertyService = {
  async getCensusData(zipcode: string) {
    if (!CENSUS_API_KEY) {
      console.warn('CENSUS_API_KEY is not configured, using default values')
      return {
        population: 0,
        medianIncome: 0
      }
    }

    try {
      const res = await fetch(
        `https://api.census.gov/data/2022/acs/acs5?get=B01003_001E,B19013_001E&for=zip%20code%20tabulation%20area:${zipcode}&key=${CENSUS_API_KEY}`,
        {
          cache: 'no-store'
        }
      )

      if (!res.ok) {
        console.warn(`Census API error: ${res.status}`)
        return {
          population: 0,
          medianIncome: 0
        }
      }

      const data = await res.json()

      if (!Array.isArray(data) || data.length < 2) {
        console.warn('Invalid census data format')
        return {
          population: 0,
          medianIncome: 0
        }
      }

      const population = Number(data[1][0])
      const medianIncome = Number(data[1][1])

      return {
        population: isNaN(population) ? 0 : population,
        medianIncome: isNaN(medianIncome) ? 0 : medianIncome
      }
    } catch (error) {
      console.warn('Census data fetch failed:', error)
      return {
        population: 0,
        medianIncome: 0
      }
    }
  },

  predictGrowth(basePrice: number, rate: number) {
    if (!basePrice || basePrice <= 0) {
      throw new Error('Invalid base price')
    }

    if (rate < 0 || rate > 1) {
      throw new Error('Growth rate must be between 0 and 1')
    }

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
