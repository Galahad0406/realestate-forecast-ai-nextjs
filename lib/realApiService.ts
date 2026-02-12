// lib/realApiService.ts
import axios from 'axios'
import { PropertyData, RentalData, MarketData, ComparableProperty } from '@/types'

class RealApiService {
  private rapidApiKey = process.env.RAPIDAPI_KEY
  private attomApiKey = process.env.ATTOM_API_KEY

  // RapidAPI Zillow Integration
  async getPropertyFromZillow(address: string, zipcode: string): Promise<PropertyData | null> {
    if (!this.rapidApiKey) return null

    try {
      const response = await axios.get('https://zillow-com1.p.rapidapi.com/property', {
        params: { address },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        },
        timeout: 10000
      })

      const data = response.data
      return {
        address: data.address?.streetAddress || address,
        city: data.address?.city || '',
        state: data.address?.state || '',
        zipcode: data.address?.zipcode || zipcode,
        price: data.price || 0,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        squareFeet: data.livingArea || 0,
        lotSize: data.lotSize || 0,
        yearBuilt: data.yearBuilt || 0,
        propertyType: data.homeType || 'Unknown',
        lastSoldDate: data.dateSold,
        lastSoldPrice: data.lastSoldPrice,
        taxAssessedValue: data.taxAssessedValue || 0,
        annualTaxes: data.propertyTaxRate || 0,
        hoa: data.hoaFee,
        zestimate: data.zestimate
      }
    } catch (error) {
      console.error('Zillow API error:', error)
      return null
    }
  }

  // Attom Data API Integration
  async getPropertyFromAttom(address: string, zipcode: string): Promise<PropertyData | null> {
    if (!this.attomApiKey) return null

    try {
      const response = await axios.get('https://api.gateway.attomdata.com/propertyapi/v1.0.0/property/address', {
        params: { address1: address, postalcode: zipcode },
        headers: {
          'apikey': this.attomApiKey,
          'Accept': 'application/json'
        },
        timeout: 10000
      })

      const data = response.data?.property?.[0]
      if (!data) return null

      return {
        address: data.address?.oneLine || address,
        city: data.address?.locality || '',
        state: data.address?.countrySubd || '',
        zipcode: data.address?.postal1 || zipcode,
        price: data.sale?.amount?.saleAmt || data.assessment?.assessed?.assdTtlValue || 0,
        bedrooms: data.building?.rooms?.beds || 0,
        bathrooms: data.building?.rooms?.bathsTotal || 0,
        squareFeet: data.building?.size?.livingSize || 0,
        lotSize: data.lot?.lotSize1 || 0,
        yearBuilt: data.summary?.yearBuilt || 0,
        propertyType: data.summary?.propType || 'Unknown',
        lastSoldDate: data.sale?.amount?.saleRecDate,
        lastSoldPrice: data.sale?.amount?.saleAmt,
        taxAssessedValue: data.assessment?.assessed?.assdTtlValue || 0,
        annualTaxes: data.assessment?.tax?.taxAmt || 0
      }
    } catch (error) {
      console.error('Attom API error:', error)
      return null
    }
  }

  // RapidAPI Redfin Integration
  async getPropertyFromRedfin(address: string): Promise<PropertyData | null> {
    if (!this.rapidApiKey) return null

    try {
      const response = await axios.get('https://redfin-com-data.p.rapidapi.com/properties/search', {
        params: { location: address },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
        },
        timeout: 10000
      })

      const data = response.data?.data?.[0]
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
        propertyType: data.propertyType || 'Unknown',
        taxAssessedValue: data.taxAssessedValue || 0,
        annualTaxes: data.taxes || 0,
        redfin_estimate: data.estimate
      }
    } catch (error) {
      console.error('Redfin API error:', error)
      return null
    }
  }

  // Rental Data from RapidAPI
  async getRentalData(address: string, sqft: number, bedrooms: number): Promise<RentalData | null> {
    if (!this.rapidApiKey) return null

    try {
      const response = await axios.get('https://realty-mole-property-api.p.rapidapi.com/rentalPrice', {
        params: { address },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
        },
        timeout: 10000
      })

      const data = response.data
      return {
        monthlyRent: data.rent || 0,
        rentLow: data.rentRangeLow || 0,
        rentHigh: data.rentRangeHigh || 0,
        rentConfidence: 90,
        averageRentPerSqft: sqft > 0 ? data.rent / sqft : 0,
        occupancyRate: 95,
        marketGrowthRate: 4
      }
    } catch (error) {
      console.error('Rental API error:', error)
      return null
    }
  }

  // Market Data
  async getMarketData(zipcode: string): Promise<MarketData | null> {
    // This would integrate with Census API and other market data sources
    return null
  }

  // Comparables
  async getComparables(property: PropertyData): Promise<ComparableProperty[] | null> {
    return null
  }
}

export default new RealApiService()
