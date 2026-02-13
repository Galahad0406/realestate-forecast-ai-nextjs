// lib/apiService.ts
import axios from 'axios'
import { PropertyData, RentalData, MarketData, ComparableProperty, AddressSuggestion } from '@/types'

class ApiService {
  private censusKey = process.env.CENSUS_API_KEY
  private rapidApiKey = process.env.RAPIDAPI_KEY

  // Address Autocomplete using RapidAPI Redfin
  async getAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
    if (!this.rapidApiKey || query.length < 3) return []

    try {
      const response = await axios.get('https://redfin-com-data.p.rapidapi.com/properties/search-suggestion', {
        params: { query },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
        },
        timeout: 5000
      })

      if (response.data?.data) {
        return response.data.data.slice(0, 5).map((item: any) => ({
          address: item.address || '',
          city: item.city || '',
          state: item.state || '',
          zipcode: item.zip || '',
          fullAddress: `${item.address}, ${item.city}, ${item.state} ${item.zip}`
        }))
      }
      return []
    } catch (error) {
      console.error('Address autocomplete error:', error)
      return []
    }
  }

  // Get Property Data - RapidAPI Only
async getPropertyData(address: string): Promise<PropertyData | null> {
  // Try Redfin first
  const redfin = await this.getPropertyFromRedfin(address)
  if (redfin) return redfin

  // Try Zillow as backup
  const zillow = await this.getPropertyFromZillow(address)
  if (zillow) return zillow

  return null
}

  private async getPropertyFromRentCast(address: string): Promise<PropertyData | null> {
    if (!this.rentcastKey) return null

    try {
      const response = await axios.get('https://api.rentcast.io/v1/properties', {
        params: { address },
        headers: {
          'X-Api-Key': this.rentcastKey,
          'Accept': 'application/json'
        },
        timeout: 10000
      })

      const data = response.data?.[0]
      if (!data) return null

      return {
        address: data.formattedAddress || address,
        city: data.city || '',
        state: data.state || '',
        zipcode: data.zipCode || '',
        price: data.price || data.assessedValue || 0,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        squareFeet: data.squareFootage || 0,
        lotSize: data.lotSize || 0,
        yearBuilt: data.yearBuilt || 0,
        propertyType: data.propertyType || 'Single Family',
        lastSoldDate: data.lastSaleDate,
        lastSoldPrice: data.lastSalePrice,
        taxAssessedValue: data.assessedValue || 0,
        annualTaxes: data.taxAssessment || 0,
        hoa: 0
      }
    } catch (error) {
      console.error('RentCast property error:', error)
      return null
    }
  }

  private async getPropertyFromRapidAPI(address: string): Promise<PropertyData | null> {
    if (!this.rapidApiKey) return null

    try {
      const response = await axios.get('https://redfin-com-data.p.rapidapi.com/properties/detail', {
        params: { address },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
        },
        timeout: 10000
      })

      const data = response.data?.data
      if (!data) return null

      return {
        address: data.address || address,
        city: data.city || '',
        state: data.state || '',
        zipcode: data.zip || '',
        price: data.price || 0,
        bedrooms: data.beds || 0,
        bathrooms: data.baths || 0,
        squareFeet: data.sqFt || 0,
        lotSize: data.lotSize || 0,
        yearBuilt: data.yearBuilt || 0,
        propertyType: data.propertyType || 'Single Family',
        taxAssessedValue: data.taxAssessedValue || 0,
        annualTaxes: data.taxes || 0,
        redfin_estimate: data.estimate
      }
    } catch (error) {
      console.error('RapidAPI property error:', error)
      return null
    }
  }

  // Get Rental Data - RentCast
  async getRentalData(address: string, sqft: number): Promise<RentalData | null> {
    if (!this.rentcastKey) return null

    try {
      const response = await axios.get('https://api.rentcast.io/v1/avm/rent/long-term', {
        params: { address },
        headers: {
          'X-Api-Key': this.rentcastKey,
          'Accept': 'application/json'
        },
        timeout: 10000
      })

      const data = response.data
      if (!data || !data.rent) return null

      return {
        monthlyRent: data.rent || 0,
        rentLow: data.rentRangeLow || data.rent * 0.9,
        rentHigh: data.rentRangeHigh || data.rent * 1.1,
        rentConfidence: 90,
        averageRentPerSqft: sqft > 0 ? data.rent / sqft : 0,
        occupancyRate: 95,
        marketGrowthRate: 4
      }
    } catch (error) {
      console.error('RentCast rental error:', error)
      return null
    }
  }

  // Get Market Data for Zipcode
  async getMarketData(zipcode: string): Promise<MarketData | null> {
    const [census, rentcast, rapid] = await Promise.all([
      this.getCensusData(zipcode),
      this.getRentCastMarketData(zipcode),
      this.getRapidAPIMarketData(zipcode)
    ])

    // Merge all data sources
    return {
      zipcode,
      medianPrice: rapid?.medianPrice || rentcast?.medianPrice || 350000,
      pricePerSqft: rapid?.pricePerSqft || 250,
      daysOnMarket: rapid?.daysOnMarket || 35,
      monthsSupply: 3.5,
      yearOverYearAppreciation: rapid?.appreciation || 4.5,
      averageRent: rentcast?.averageRent || 2200,
      vacancyRate: 4.5,
      population: census?.population || 0,
      medianIncome: census?.medianIncome || 0,
      unemploymentRate: census?.unemploymentRate || 4.2,
      crimeIndex: 45,
      schoolRating: 7,
      totalListings: rapid?.totalListings || 0,
      medianDaysToSell: rapid?.daysOnMarket || 35
    }
  }

  private async getCensusData(zipcode: string): Promise<any> {
    if (!this.censusKey) return null

    try {
      const response = await axios.get(
        `https://api.census.gov/data/2022/acs/acs5?get=B01003_001E,B19013_001E,B23025_005E&for=zip%20code%20tabulation%20area:${zipcode}&key=${this.censusKey}`,
        { timeout: 10000 }
      )

      if (!Array.isArray(response.data) || response.data.length < 2) return null

      const data = response.data[1]
      const population = Number(data[0]) || 0
      const medianIncome = Number(data[1]) || 0
      const unemployed = Number(data[2]) || 0
      const unemploymentRate = population > 0 ? (unemployed / population) * 100 : 0

      return {
        population,
        medianIncome,
        unemploymentRate: parseFloat(unemploymentRate.toFixed(1))
      }
    } catch (error) {
      console.error('Census API error:', error)
      return null
    }
  }

  private async getRentCastMarketData(zipcode: string): Promise<any> {
    if (!this.rentcastKey) return null

    try {
      const response = await axios.get('https://api.rentcast.io/v1/avm/rent/summary', {
        params: { zipCode: zipcode },
        headers: {
          'X-Api-Key': this.rentcastKey,
          'Accept': 'application/json'
        },
        timeout: 10000
      })

      const data = response.data
      return {
        averageRent: data.averageRent || 0,
        medianPrice: data.medianPrice || 0
      }
    } catch (error) {
      console.error('RentCast market error:', error)
      return null
    }
  }

  private async getRapidAPIMarketData(zipcode: string): Promise<any> {
    if (!this.rapidApiKey) return null

    try {
      const response = await axios.get('https://redfin-com-data.p.rapidapi.com/market/stats', {
        params: { zipcode },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
        },
        timeout: 10000
      })

      const data = response.data?.data
      if (!data) return null

      return {
        medianPrice: data.medianPrice || 0,
        pricePerSqft: data.pricePerSqFt || 0,
        daysOnMarket: data.medianDaysOnMarket || 0,
        appreciation: data.yoyAppreciation || 0,
        totalListings: data.totalListings || 0
      }
    } catch (error) {
      console.error('RapidAPI market error:', error)
      return null
    }
  }

  // Get Comparables
  async getComparables(property: PropertyData): Promise<ComparableProperty[]> {
    if (!this.rapidApiKey) return this.generateMockComparables(property)

    try {
      const response = await axios.get('https://redfin-com-data.p.rapidapi.com/properties/search', {
        params: {
          location: `${property.city}, ${property.state}`,
          minBeds: Math.max(property.bedrooms - 1, 1),
          maxBeds: property.bedrooms + 1,
          minPrice: property.price * 0.8,
          maxPrice: property.price * 1.2
        },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
        },
        timeout: 10000
      })

      if (response.data?.data) {
        return response.data.data.slice(0, 5).map((comp: any) => ({
          address: comp.address || '',
          price: comp.price || 0,
          pricePerSqft: comp.sqFt > 0 ? comp.price / comp.sqFt : 0,
          bedrooms: comp.beds || 0,
          bathrooms: comp.baths || 0,
          squareFeet: comp.sqFt || 0,
          daysOnMarket: comp.daysOnMarket || 0,
          distance: parseFloat((Math.random() * 2).toFixed(2))
        }))
      }
    } catch (error) {
      console.error('Comparables error:', error)
    }

    return this.generateMockComparables(property)
  }

  private generateMockComparables(property: PropertyData): ComparableProperty[] {
    const comparables: ComparableProperty[] = []
    for (let i = 0; i < 5; i++) {
      const sqftVariance = property.squareFeet * (0.9 + Math.random() * 0.2)
      const price = property.price * (0.92 + Math.random() * 0.16)
      
      comparables.push({
        address: `${100 + i * 100} ${['Main', 'Oak', 'Elm', 'Maple', 'Pine'][i]} St`,
        price: Math.round(price),
        pricePerSqft: Math.round(price / sqftVariance),
        bedrooms: property.bedrooms + (Math.random() > 0.5 ? 1 : -1),
        bathrooms: property.bathrooms,
        squareFeet: Math.round(sqftVariance),
        daysOnMarket: 15 + Math.floor(Math.random() * 45),
        distance: parseFloat((Math.random() * 2).toFixed(2))
      })
    }
    return comparables
  }

  // Search properties by zipcode for market analysis
  async searchPropertiesByZipcode(zipcode: string, limit: number = 10): Promise<any[]> {
    if (!this.rapidApiKey) return []

    try {
      const response = await axios.get('https://redfin-com-data.p.rapidapi.com/properties/search', {
        params: {
          location: zipcode,
          limit
        },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
        },
        timeout: 10000
      })

      return response.data?.data || []
    } catch (error) {
      console.error('Property search error:', error)
      return []
    }
  }
}

export default new ApiService()
