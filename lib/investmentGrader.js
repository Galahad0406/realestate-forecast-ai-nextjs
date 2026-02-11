// lib/investmentGrader.js

export class InvestmentGrader {
  constructor() {
    this.weights = {
      priceToRent: 0.25,
      schoolQuality: 0.20,
      appreciation: 0.20,
      marketConditions: 0.15,
      location: 0.10,
      propertyCondition: 0.10
    };
  }

  calculateGrade(propertyData, marketData, schoolData) {
    const scores = {
      priceToRent: this.scorePriceToRent(propertyData, marketData),
      schoolQuality: this.scoreSchools(schoolData),
      appreciation: this.scoreAppreciation(marketData),
      marketConditions: this.scoreMarketConditions(marketData),
      location: this.scoreLocation(propertyData),
      propertyCondition: this.scorePropertyCondition(propertyData)
    };

    const weightedScore = Object.keys(scores).reduce((total, key) => {
      return total + (scores[key] * this.weights[key]);
    }, 0);

    const grade = this.scoreToGrade(weightedScore);
    const explanation = this.generateExplanation(scores, grade);

    return {
      grade,
      score: Math.round(weightedScore * 100) / 100,
      scores,
      explanation,
      recommendation: this.getRecommendation(grade, scores)
    };
  }

  scorePriceToRent(propertyData, marketData) {
    // Calculate rent-to-price ratio (lower is better for investment)
    const estimatedRent = this.estimateRent(propertyData, marketData);
    const monthlyRent = estimatedRent;
    const purchasePrice = propertyData.price || marketData.medianPrice;
    
    const rentToPrice = (monthlyRent * 12) / purchasePrice;
    
    // Industry standard: 1% rule is excellent, 0.7% is decent
    if (rentToPrice >= 0.012) return 100; // 1.2% or better (A+)
    if (rentToPrice >= 0.010) return 90;  // 1.0% (A)
    if (rentToPrice >= 0.008) return 80;  // 0.8% (B+)
    if (rentToPrice >= 0.007) return 70;  // 0.7% (B)
    if (rentToPrice >= 0.006) return 60;  // 0.6% (C)
    if (rentToPrice >= 0.005) return 50;  // 0.5% (D)
    return 40; // Below 0.5% (F)
  }

  scoreSchools(schoolData) {
    if (!schoolData) return 50;
    
    const avgRating = schoolData.averageRating || 7.0;
    const topRating = schoolData.topSchoolRating || 8.0;
    
    // Weight both average and top school
    const combinedScore = (avgRating * 0.6 + topRating * 0.4);
    
    return (combinedScore / 10) * 100;
  }

  scoreAppreciation(marketData) {
    const growth = marketData.priceGrowth || 5.0;
    
    // Score based on historical appreciation
    if (growth >= 8.0) return 100;
    if (growth >= 6.0) return 85;
    if (growth >= 4.0) return 70;
    if (growth >= 2.0) return 55;
    if (growth >= 0) return 40;
    return 25; // Negative appreciation
  }

  scoreMarketConditions(marketData) {
    const dom = marketData.medianDaysOnMarket || 25;
    const listings = marketData.totalListings || 100;
    
    // Lower days on market = better
    let domScore = 100;
    if (dom > 60) domScore = 40;
    else if (dom > 45) domScore = 55;
    else if (dom > 30) domScore = 70;
    else if (dom > 20) domScore = 85;
    
    // Moderate inventory is best
    let inventoryScore = 70;
    if (listings < 50) inventoryScore = 85; // Low inventory
    else if (listings < 100) inventoryScore = 90; // Healthy market
    else if (listings < 200) inventoryScore = 75; // Higher inventory
    else inventoryScore = 60; // Oversupply
    
    return (domScore * 0.6 + inventoryScore * 0.4);
  }

  scoreLocation(propertyData) {
    const zipcode = propertyData.zipcode;
    
    // Washington State premium zipcodes
    const premiumZips = {
      '98004': 100, // Bellevue - Medina
      '98039': 100, // Medina
      '98040': 95,  // Mercer Island
      '98074': 95,  // Sammamish
      '98005': 95,  // Bellevue - Bridle Trails
      '98006': 90,  // Bellevue - Downtown
      '98075': 90,  // Sammamish
      '98033': 90,  // Kirkland
      '98052': 85,  // Redmond
      '98053': 85,  // Redmond
      '98008': 85,  // Bellevue
      '98007': 85,  // Bellevue
    };

    return premiumZips[zipcode] || 70;
  }

  scorePropertyCondition(propertyData) {
    const yearBuilt = propertyData.yearBuilt || 2000;
    const currentYear = 2026;
    const age = currentYear - yearBuilt;
    
    if (age <= 5) return 100;
    if (age <= 10) return 95;
    if (age <= 15) return 90;
    if (age <= 20) return 85;
    if (age <= 30) return 75;
    if (age <= 40) return 65;
    if (age <= 50) return 55;
    return 45;
  }

  scoreToGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  generateExplanation(scores, grade) {
    const explanations = [];

    // Price-to-Rent analysis
    if (scores.priceToRent >= 80) {
      explanations.push('✅ Excellent rent-to-price ratio provides strong cash flow potential');
    } else if (scores.priceToRent >= 60) {
      explanations.push('⚠️ Moderate rent-to-price ratio - acceptable for appreciation play');
    } else {
      explanations.push('❌ Low rent-to-price ratio - cash flow may be challenging');
    }

    // School quality
    if (scores.schoolQuality >= 85) {
      explanations.push('✅ Top-tier school district attracts quality tenants and buyers');
    } else if (scores.schoolQuality >= 70) {
      explanations.push('⚠️ Good school ratings support stable property values');
    } else {
      explanations.push('❌ Below-average schools may impact tenant quality and resale');
    }

    // Appreciation potential
    if (scores.appreciation >= 85) {
      explanations.push('✅ Strong historical appreciation indicates robust market');
    } else if (scores.appreciation >= 60) {
      explanations.push('⚠️ Moderate appreciation - stable market conditions');
    } else {
      explanations.push('❌ Weak appreciation history suggests limited equity growth');
    }

    // Market conditions
    if (scores.marketConditions >= 80) {
      explanations.push('✅ Favorable market dynamics with healthy demand');
    } else if (scores.marketConditions >= 60) {
      explanations.push('⚠️ Balanced market conditions');
    } else {
      explanations.push('❌ Challenging market with extended time on market');
    }

    // Location premium
    if (scores.location >= 90) {
      explanations.push('✅ Premium location with strong long-term value');
    } else if (scores.location >= 75) {
      explanations.push('⚠️ Desirable area with good growth potential');
    } else {
      explanations.push('⚠️ Average location - focus on property-specific value');
    }

    return explanations;
  }

  getRecommendation(grade, scores) {
    switch(grade) {
      case 'A':
        return 'Strong Buy - Excellent investment opportunity with multiple favorable factors';
      case 'B':
        return 'Buy - Good investment with solid fundamentals';
      case 'C':
        return 'Hold - Acceptable investment, carefully evaluate specific factors';
      case 'D':
        return 'Caution - Marginal investment, requires favorable purchase terms';
      case 'F':
        return 'Avoid - Unfavorable investment metrics';
      default:
        return 'Neutral';
    }
  }

  estimateRent(propertyData, marketData) {
    const beds = propertyData.beds || 3;
    const baths = propertyData.baths || 2;
    const sqft = propertyData.sqft || 1800;
    const type = propertyData.propertyType || 'house';
    
    // Base rent on median price and typical rent ratios
    const medianPrice = marketData.medianPrice || 675000;
    const baseRent = medianPrice * 0.0055; // 0.55% rule for WA
    
    // Adjust for size
    const sqftMultiplier = sqft / 1800; // Normalize to 1800 sqft
    
    // Adjust for beds/baths
    const bedroomPremium = (beds - 3) * 150;
    const bathroomPremium = (baths - 2) * 100;
    
    // Type adjustment
    const typeMultiplier = type === 'townhome' ? 0.85 : 1.0;
    
    const estimatedRent = (baseRent * sqftMultiplier * typeMultiplier) + bedroomPremium + bathroomPremium;
    
    return Math.round(estimatedRent);
  }
}

export default new InvestmentGrader();
