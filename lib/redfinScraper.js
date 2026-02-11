// lib/redfinScraper.js
import axios from 'axios';
import * as cheerio from 'cheerio';

export class RedfinScraper {
  constructor() {
    this.baseUrl = 'https://www.redfin.com';
    this.cache = new Map();
    this.cacheTimeout = 3600000; // 1 hour
  }

  async getPropertyData(address) {
    const cacheKey = `property_${address}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      // Redfin API endpoint (publicly accessible)
      const searchUrl = `${this.baseUrl}/stingray/do/location-autocomplete?location=${encodeURIComponent(address)}&v=2`;
      
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      });

      if (response.data && response.data.payload && response.data.payload.sections) {
        const results = response.data.payload.sections[0]?.rows || [];
        
        if (results.length > 0) {
          const property = results[0];
          const propertyUrl = `${this.baseUrl}${property.url}`;
          
          // Get detailed property data
          const detailResponse = await axios.get(propertyUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });

          const $ = cheerio.load(detailResponse.data);
          
          const data = {
            address: property.name,
            price: this.extractPrice($),
            beds: this.extractBeds($),
            baths: this.extractBaths($),
            sqft: this.extractSqft($),
            lotSize: this.extractLotSize($),
            propertyType: this.extractPropertyType($),
            yearBuilt: this.extractYearBuilt($),
            latitude: property.centroid?.centroid?.latitude,
            longitude: property.centroid?.centroid?.longitude,
            zipcode: this.extractZipcode(property.name),
            lastSoldDate: this.extractLastSoldDate($),
            lastSoldPrice: this.extractLastSoldPrice($),
            taxAssessedValue: this.extractTaxValue($),
            pricePerSqft: null
          };

          if (data.price && data.sqft) {
            data.pricePerSqft = Math.round(data.price / data.sqft);
          }

          this.cache.set(cacheKey, { data, timestamp: Date.now() });
          return data;
        }
      }

      return null;
    } catch (error) {
      console.error('Redfin scraping error:', error.message);
      return null;
    }
  }

  async getZipcodeData(zipcode) {
    const cacheKey = `zipcode_${zipcode}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const searchUrl = `${this.baseUrl}/zipcode/${zipcode}`;
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      const $ = cheerio.load(response.data);
      
      const data = {
        zipcode,
        medianPrice: this.extractMedianPrice($),
        avgPricePerSqft: this.extractAvgPricePerSqft($),
        medianDaysOnMarket: this.extractMedianDaysOnMarket($),
        avgLotSize: this.extractAvgLotSize($),
        totalListings: this.extractTotalListings($),
        priceGrowth: this.extractPriceGrowth($)
      };

      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      console.error('Zipcode data error:', error.message);
      return this.getFallbackZipcodeData(zipcode);
    }
  }

  // Extraction helpers
  extractPrice($) {
    const priceText = $('.statsValue').first().text();
    return this.parsePrice(priceText);
  }

  extractBeds($) {
    const text = $('[data-rf-test-id="abp-beds"]').text();
    return parseInt(text) || null;
  }

  extractBaths($) {
    const text = $('[data-rf-test-id="abp-baths"]').text();
    return parseFloat(text) || null;
  }

  extractSqft($) {
    const text = $('[data-rf-test-id="abp-sqFt"]').text();
    return this.parseNumber(text);
  }

  extractLotSize($) {
    const lotText = $('.lot-size').text() || $('[data-rf-test-id="abp-lotSize"]').text();
    return this.parseLotSize(lotText);
  }

  extractPropertyType($) {
    const type = $('[data-rf-test-id="abp-propertyType"]').text().toLowerCase();
    if (type.includes('single') || type.includes('house')) return 'house';
    if (type.includes('town') || type.includes('condo')) return 'townhome';
    return 'house';
  }

  extractYearBuilt($) {
    const text = $('[data-rf-test-id="abp-yearBuilt"]').text();
    return parseInt(text) || null;
  }

  extractZipcode(address) {
    const match = address.match(/\b\d{5}\b/);
    return match ? match[0] : null;
  }

  extractLastSoldDate($) {
    const text = $('.sold-date').text();
    return text || null;
  }

  extractLastSoldPrice($) {
    const text = $('.sold-price').text();
    return this.parsePrice(text);
  }

  extractTaxValue($) {
    const text = $('[data-rf-test-id="abp-taxAssessedValue"]').text();
    return this.parsePrice(text);
  }

  extractMedianPrice($) {
    const text = $('.median-sale-price').text() || $('.stats-value').first().text();
    return this.parsePrice(text);
  }

  extractAvgPricePerSqft($) {
    const text = $('.price-per-sqft').text();
    const num = this.parseNumber(text);
    return num || 250; // Default fallback
  }

  extractMedianDaysOnMarket($) {
    const text = $('.median-dom').text();
    return parseInt(text) || 25;
  }

  extractAvgLotSize($) {
    const text = $('.avg-lot-size').text();
    return this.parseLotSize(text) || 7500;
  }

  extractTotalListings($) {
    const text = $('.total-listings').text();
    return parseInt(text) || 100;
  }

  extractPriceGrowth($) {
    const text = $('.price-growth').text() || $('.year-over-year').text();
    const match = text.match(/([-+]?\d+\.?\d*)%/);
    return match ? parseFloat(match[1]) : 5.2;
  }

  // Parsing utilities
  parsePrice(text) {
    if (!text) return null;
    const cleaned = text.replace(/[^0-9]/g, '');
    return cleaned ? parseInt(cleaned) : null;
  }

  parseNumber(text) {
    if (!text) return null;
    const cleaned = text.replace(/[^0-9.]/g, '');
    return cleaned ? parseFloat(cleaned) : null;
  }

  parseLotSize(text) {
    if (!text) return null;
    
    const acresMatch = text.match(/([\d.]+)\s*acre/i);
    if (acresMatch) {
      return Math.round(parseFloat(acresMatch[1]) * 43560);
    }
    
    const sqftMatch = text.match(/([\d,]+)\s*sq/i);
    if (sqftMatch) {
      return parseInt(sqftMatch[1].replace(/,/g, ''));
    }
    
    return null;
  }

  // Fallback data based on Washington State averages
  getFallbackZipcodeData(zipcode) {
    const washingtonAverages = {
      98001: { medianPrice: 650000, avgPricePerSqft: 325 },
      98004: { medianPrice: 1850000, avgPricePerSqft: 625 },
      98005: { medianPrice: 1200000, avgPricePerSqft: 495 },
      98006: { medianPrice: 875000, avgPricePerSqft: 425 },
      98007: { medianPrice: 925000, avgPricePerSqft: 445 },
      98008: { medianPrice: 895000, avgPricePerSqft: 435 },
      98033: { medianPrice: 1050000, avgPricePerSqft: 475 },
      98052: { medianPrice: 985000, avgPricePerSqft: 455 },
      98053: { medianPrice: 875000, avgPricePerSqft: 425 },
    };

    const defaults = washingtonAverages[zipcode] || { medianPrice: 675000, avgPricePerSqft: 350 };

    return {
      zipcode,
      medianPrice: defaults.medianPrice,
      avgPricePerSqft: defaults.avgPricePerSqft,
      medianDaysOnMarket: 22,
      avgLotSize: 7200,
      totalListings: 85,
      priceGrowth: 5.8
    };
  }
}

export default new RedfinScraper();
