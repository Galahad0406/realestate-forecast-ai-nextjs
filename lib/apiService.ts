// lib/apiService.ts
import axios from 'axios'
import { PropertyData, RentalData, MarketData, ComparableProperty, AddressSuggestion, GeocodeResult } from '@/types'

class ApiService {
  private censusKey = process.env.CENSUS_API_KEY
  private rapidApiKey = process.env.RAPIDAPI_KEY
  private googleMapsKey = process.env.GOOGLE_MAPS_API_KEY

  // ========================================
  // GOOGLE GEOCODING - ADDRESS VERIFICATION
  // ========================================
  
  async geocodeAddress(address: string): Promise<GeocodeResult | null> {
    if (!this.googleMapsKey) {
      console.log('⚠️ Google Maps API key not configured')
      return null
    }

    try {
      console.log('🌍 Geocoding address with Google:', address)
      
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address: address,
          key: this.googleMapsKey
        },
        timeout: 5000
      })

      if (response.data.status !== 'OK' || !response.data.results || response.data.results.length === 0) {
        console.log('❌ Geocoding failed:', response.data.status)
        return null
      }

      const result = response.data.results[0]
      const components = result.address_components

      // Extract address components
      const getComponent = (type: string, useShort: boolean = false) => {
        const component = components.find((c: any) => c.types.includes(type))
        return component ? (useShort ? component.short_name : component.long_name) : ''
      }

      const geocoded: GeocodeResult = {
        formattedAddress: result.formatted_address,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        streetNumber: getComponent('street_number'),
        street: getComponent('route'),
        city: getComponent('locality') || getComponent('sublocality') || getComponent('administrative_area_level_3'),
        county: getComponent('administrative_area_level_2'),
        state: getComponent('administrative_area_level_1'),
        stateCode: getComponent('administrative_area_level_1', true),
        zipcode: getComponent('postal_code'),
        country: getComponent('country'),
        placeId: result.place_id
      }

      console.log('✅ Geocoded:', geocoded.formattedAddress)
      console.log('📍 Location:', `${geocoded.latitude}, ${geocoded.longitude}`)
      
      return geocoded
    } catch (error: any) {
      console.error('❌ Google Geocoding error:', error.response?.data || error.message)
      return null
    }
  }

  // Reverse geocode from lat/lng
  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult | null> {
    if (!this.googleMapsKey) return null

    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          latlng: `${lat},${lng}`,
          key: this.googleMapsKey
        },
        timeout: 5000
      })

      if (response.data.status !== 'OK' || !response.data.results || response.data.results.length === 0) {
        return null
      }

      const result = response.data.results[0]
      const components = result.address_components

      const getComponent = (type: string, useShort: boolean = false) => {
        const component = components.find((c: any) => c.types.includes(type))
        return component ? (useShort ? component.short_name : component.long_name) : ''
      }

      return {
        formattedAddress: result.formatted_address,
        latitude: result.geometry.location.lat,
        longitude: result.geometry.location.lng,
        streetNumber: getComponent('street_number'),
        street: getComponent('route'),
        city: getComponent('locality') || getComponent('sublocality'),
        county: getComponent('administrative_area_level_2'),
        state: getComponent('administrative_area_level_1'),
        stateCode: getComponent('administrative_area_level_1', true),
        zipcode: getComponent('postal_code'),
        country: getComponent('country'),
        placeId: result.place_id
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      return null
    }
  }

  // ========================================
  // ADDRESS AUTOCOMPLETE
  // ========================================

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

  // ========================================
  // PROPERTY DATA
  // ========================================

  async getPropertyData(address: string): Promise<PropertyData | null> {
    console.log('🔍 Searching for property:', address)
    
    // Step 1: Geocode the address for accuracy
    const geocoded = await this.geocodeAddress(address)
    let searchAddress = address
    
    if (geocoded) {
      // Use the standardized Google address
      searchAddress = geocoded.formattedAddress
      console.log('✅ Using standardized address:', searchAddress)
    } else {
      console.log('⚠️ Geocoding unavailable, using original address')
    }

    // Step 2: Try multiple data sources in parallel
    const [redfin, zillow] = await Promise.all([
      this.getPropertyFromRedfin(searchAddress, geocoded),
      this.getPropertyFromZillow(searchAddress, geocoded)
    ])

    // Step 3: Prefer the one with more complete data
    let propertyData: PropertyData | null = null

    if (redfin && redfin.price > 0 && redfin.squareFeet > 0) {
      console.log('✅ Using Redfin data')
      propertyData = redfin
    } else if (zillow && zillow.price > 0 && zillow.squareFeet > 0) {
      console.log('✅ Using Zillow data')
      propertyData = zillow
    } else if (redfin) {
      propertyData = redfin
    } else if (zillow) {
      propertyData = zillow
    }

    // Step 4: Enhance with geocoded data if available
    if (propertyData && geocoded) {
      propertyData.latitude = geocoded.latitude
      propertyData.longitude = geocoded.longitude
      propertyData.city = propertyData.city || geocoded.city
      propertyData.state = propertyData.state || geocoded.stateCode
      propertyData.zipcode = propertyData.zipcode || geocoded.zipcode
    }

    if (!propertyData) {
      console.error('❌ No property data found from any source')
    }

    return propertyData
  }

  private async getPropertyFromRedfin(address: string, geocoded?: GeocodeResult | null): Promise<PropertyData | null> {
    if (!this.rapidApiKey) {
      console.log('⚠️ RapidAPI key not configured')
      return null
    }

    try {
      console.log('📡 Fetching from Redfin API...')
      
      // Try exact address search first
      let response = await axios.get('https://redfin-com-data.p.rapidapi.com/properties/detail', {
        params: { address },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
        },
        timeout: 10000
      })

      let property = response.data?.data

      // If no exact match, try search with broader criteria
      if (!property || !property.price) {
        console.log('🔄 Exact match failed, trying search...')
        
        // If we have geocoded data, use city/state for better results
        const searchLocation = geocoded 
          ? `${geocoded.city}, ${geocoded.stateCode}`
          : address

        response = await axios.get('https://redfin-com-data.p.rapidapi.com/properties/search', {
          params: { 
            location: searchLocation,
            limit: 5
          },
          headers: {
            'X-RapidAPI-Key': this.rapidApiKey,
            'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
          },
          timeout: 10000
        })

        const properties = response.data?.data || []
        
        // Find the closest match by address similarity
        if (properties.length > 0) {
          if (geocoded && geocoded.streetNumber && geocoded.street) {
            // Try to find exact street number match
            property = properties.find((p: any) => 
              p.address && 
              p.address.toLowerCase().includes(geocoded.streetNumber!.toLowerCase()) &&
              p.address.toLowerCase().includes(geocoded.street!.toLowerCase())
            ) || properties[0]
          } else {
            property = properties[0]
          }
        }
      }

      if (!property) {
        console.log('❌ Redfin: No property found')
        return null
      }

      console.log('✅ Redfin data found:', property.address || address)

      return {
        address: property.address || address,
        city: property.city || (geocoded?.city || ''),
        state: property.state || (geocoded?.stateCode || ''),
        zipcode: property.zip || (geocoded?.zipcode || ''),
        price: property.price || property.listPrice || 0,
        bedrooms: property.beds || 0,
        bathrooms: property.baths || 0,
        squareFeet: property.sqFt || property.squareFeet || 0,
        lotSize: property.lotSize || property.lotSqFt || 0,
        yearBuilt: property.yearBuilt || 0,
        propertyType: property.propertyType || 'Single Family',
        lastSoldDate: property.lastSoldDate,
        lastSoldPrice: property.lastSoldPrice,
        taxAssessedValue: property.taxAssessedValue || property.assessedValue || 0,
        annualTaxes: property.taxes || property.annualTaxes || 0,
        hoa: property.hoa || property.hoaFee || 0,
        redfin_estimate: property.estimate || property.redfin_estimate,
        latitude: geocoded?.latitude,
        longitude: geocoded?.longitude
      }
    } catch (error: any) {
      console.error('❌ Redfin API error:', error.response?.data || error.message)
      return null
    }
  }

  private async getPropertyFromZillow(address: string, geocoded?: GeocodeResult | null): Promise<PropertyData | null> {
    if (!this.rapidApiKey) return null

    try {
      console.log('📡 Fetching from Zillow API...')
      
      const response = await axios.get('https://zillow-com1.p.rapidapi.com/propertyExtendedSearch', {
        params: { 
          location: geocoded ? `${geocoded.city}, ${geocoded.stateCode}` : address,
          status_type: 'ForSale'
        },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
        },
        timeout: 10000
      })

      const properties = response.data?.props || response.data
      if (!properties || properties.length === 0) {
        console.log('❌ Zillow: No property found')
        return null
      }

      // If we have geocoded data, find closest match
      let data = properties[0]
      if (geocoded && geocoded.streetNumber && geocoded.street) {
        const match = properties.find((p: any) => 
          p.address && 
          p.address.toLowerCase().includes(geocoded.streetNumber!.toLowerCase()) &&
          p.address.toLowerCase().includes(geocoded.street!.toLowerCase())
        )
        if (match) data = match
      }

      console.log('✅ Zillow data found:', data.address || address)

      return {
        address: data.address || address,
        city: data.addressCity || (geocoded?.city || ''),
        state: data.addressState || (geocoded?.stateCode || ''),
        zipcode: data.addressZipcode || (geocoded?.zipcode || ''),
        price: data.price || data.unformattedPrice || 0,
        bedrooms: data.bedrooms || 0,
        bathrooms: data.bathrooms || 0,
        squareFeet: data.livingArea || 0,
        lotSize: data.lotAreaValue || 0,
        yearBuilt: data.yearBuilt || 0,
        propertyType: data.homeType || 'Single Family',
        lastSoldDate: data.dateSold,
        lastSoldPrice: data.lastSoldPrice,
        taxAssessedValue: data.taxAssessedValue || 0,
        annualTaxes: data.annualHomeownerInsurance || data.propertyTaxRate || 0,
        hoa: data.monthlyHoaFee || 0,
        zestimate: data.zestimate,
        latitude: geocoded?.latitude || data.latitude,
        longitude: geocoded?.longitude || data.longitude
      }
    } catch (error: any) {
      console.error('❌ Zillow API error:', error.response?.data || error.message)
      return null
    }
  }

  // ========================================
  // RENTAL DATA
  // ========================================

  async getRentalData(address: string, sqft: number): Promise<RentalData | null> {
    if (!this.rapidApiKey) {
      console.log('⚠️ Using estimated rental data')
      return this.getEstimatedRentalData(sqft)
    }

    try {
      console.log('📡 Fetching rental data...')
      
      const response = await axios.get('https://realty-mole-property-api.p.rapidapi.com/rentalPrice', {
        params: { address },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'realty-mole-property-api.p.rapidapi.com'
        },
        timeout: 10000
      })

      const data = response.data
      if (!data || !data.rent) {
        console.log('⚠️ No rental data, using estimate')
        return this.getEstimatedRentalData(sqft)
      }

      console.log('✅ Rental data found:', data.rent)

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
      console.error('❌ Rental API error:', error)
      return this.getEstimatedRentalData(sqft)
    }
  }

  private getEstimatedRentalData(sqft: number): RentalData {
    // Industry standard: 0.8-1.2% of property value or $1.5-$2 per sqft
    const estimatedRent = sqft * 1.75
    return {
      monthlyRent: Math.round(estimatedRent),
      rentLow: Math.round(estimatedRent * 0.9),
      rentHigh: Math.round(estimatedRent * 1.1),
      rentConfidence: 70,
      averageRentPerSqft: 1.75,
      occupancyRate: 95,
      marketGrowthRate: 4
    }
  }

  // ========================================
  // MARKET DATA
  // ========================================

  async getMarketData(zipcode: string): Promise<MarketData | null> {
    console.log('📊 Fetching market data for:', zipcode)
    
    const [census, rapid] = await Promise.all([
      this.getCensusData(zipcode),
      this.getRapidAPIMarketData(zipcode)
    ])

    console.log('Census data:', census ? '✅ Found' : '❌ Not found')
    console.log('Market data:', rapid ? '✅ Found' : '❌ Not found')

    return {
      zipcode,
      medianPrice: rapid?.medianPrice || 350000,
      pricePerSqft: rapid?.pricePerSqft || 250,
      daysOnMarket: rapid?.daysOnMarket || 35,
      monthsSupply: rapid?.monthsSupply || 3.5,
      yearOverYearAppreciation: rapid?.appreciation || 4.5,
      averageRent: rapid?.averageRent || 2200,
      vacancyRate: rapid?.vacancyRate || 4.5,
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
    if (!this.censusKey) {
      console.log('⚠️ Census API key not configured')
      return null
    }

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
        medianPrice: data.medianPrice || data.median_sale_price || 0,
        pricePerSqft: data.pricePerSqFt || data.median_ppsf || 0,
        daysOnMarket: data.medianDaysOnMarket || data.median_dom || 0,
        appreciation: data.yoyAppreciation || 0,
        totalListings: data.totalListings || data.inventory || 0,
        averageRent: data.averageRent || 0,
        monthsSupply: data.monthsSupply || 0,
        vacancyRate: data.vacancyRate || 0
      }
    } catch (error) {
      console.error('RapidAPI market error:', error)
      return null
    }
  }

  // ========================================
  // COMPARABLES
  // ========================================

  async getComparables(property: PropertyData): Promise<ComparableProperty[]> {
    if (!this.rapidApiKey) return this.generateMockComparables(property)

    try {
      console.log('🔍 Finding comparable properties...')
      
      const response = await axios.get('https://redfin-com-data.p.rapidapi.com/properties/search', {
        params: {
          location: `${property.city}, ${property.state} ${property.zipcode}`,
          minBeds: Math.max(property.bedrooms - 1, 1),
          maxBeds: property.bedrooms + 1,
          minPrice: Math.round(property.price * 0.8),
          maxPrice: Math.round(property.price * 1.2),
          limit: 10
        },
        headers: {
          'X-RapidAPI-Key': this.rapidApiKey,
          'X-RapidAPI-Host': 'redfin-com-data.p.rapidapi.com'
        },
        timeout: 10000
      })

      if (response.data?.data && response.data.data.length > 0) {
        const comps = response.data.data
          .filter((comp: any) => comp.price > 0 && comp.sqFt > 0)
          .slice(0, 5)
          .map((comp: any) => {
            // Calculate distance if we have coordinates
            let distance = parseFloat((Math.random() * 2).toFixed(2))
            if (property.latitude && property.longitude && comp.latitude && comp.longitude) {
              distance = this.calculateDistance(
                property.latitude, 
                property.longitude, 
                comp.latitude, 
                comp.longitude
              )
            }

            return {
              address: comp.address || '',
              price: comp.price || 0,
              pricePerSqft: comp.sqFt > 0 ? Math.round(comp.price / comp.sqFt) : 0,
              bedrooms: comp.beds || 0,
              bathrooms: comp.baths || 0,
              squareFeet: comp.sqFt || 0,
              daysOnMarket: comp.daysOnMarket || 0,
              distance
            }
          })
        
        console.log(`✅ Found ${comps.length} comparable properties`)
        return comps
      }
    } catch (error) {
      console.error('Comparables error:', error)
    }

    return this.generateMockComparables(property)
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    // Haversine formula for distance in miles
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    return parseFloat(distance.toFixed(2))
  }

  private generateMockComparables(property: PropertyData): ComparableProperty[] {
    console.log('⚠️ Using mock comparable data')
    const comparables: ComparableProperty[] = []
    for (let i = 0; i < 5; i++) {
      const sqftVariance = property.squareFeet * (0.9 + Math.random() * 0.2)
      const price = property.price * (0.92 + Math.random() * 0.16)
      
      comparables.push({
        address: `${100 + i * 100} ${['Main', 'Oak', 'Elm', 'Maple', 'Pine'][i]} St, ${property.city}`,
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

  // ========================================
  // PROPERTY SEARCH
  // ========================================

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
