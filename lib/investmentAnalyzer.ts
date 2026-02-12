// lib/investmentAnalyzer.ts
import {
  PropertyData,
  RentalData,
  MarketData,
  InvestmentAnalysis,
  YearlyProjection,
  YearlyEquity,
  ScenarioAnalysis
} from '@/types'

interface AnalysisParams {
  property: PropertyData
  rental: RentalData
  market: MarketData
  downPaymentPercent?: number
  interestRate?: number
  loanTerm?: number
  maintenancePercent?: number
  vacancyPercent?: number
  propertyManagementPercent?: number
  appreciationRate?: number
}

class InvestmentAnalyzer {
  
  calculateMortgage(principal: number, annualRate: number, years: number): number {
    const monthlyRate = annualRate / 12 / 100
    const numPayments = years * 12
    
    if (monthlyRate === 0) return principal / numPayments
    
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    
    return monthlyPayment
  }

  calculateNOI(
    annualRent: number,
    propertyTax: number,
    insurance: number,
    maintenance: number,
    hoa: number,
    propertyManagement: number,
    utilities: number,
    vacancy: number
  ): number {
    const effectiveIncome = annualRent - vacancy
    const totalExpenses = propertyTax + insurance + maintenance + hoa + 
                          propertyManagement + utilities
    return effectiveIncome - totalExpenses
  }

  calculateCapRate(noi: number, purchasePrice: number): number {
    return (noi / purchasePrice) * 100
  }

  calculateCashOnCashReturn(annualCashFlow: number, totalInvestment: number): number {
    return (annualCashFlow / totalInvestment) * 100
  }

  calculateGRM(purchasePrice: number, annualRent: number): number {
    return purchasePrice / annualRent
  }

  calculateDSCR(noi: number, annualDebtService: number): number {
    return noi / annualDebtService
  }

  calculateYearlyProjections(
    params: AnalysisParams,
    analysis: InvestmentAnalysis,
    years: number = 10
  ): YearlyProjection[] {
    const projections: YearlyProjection[] = []
    const { property, rental, market } = params
    const appreciationRate = params.appreciationRate || market.yearOverYearAppreciation / 100
    const rentGrowthRate = rental.marketGrowthRate / 100
    
    let cumulativeCashFlow = 0
    let loanBalance = analysis.loanAmount
    const monthlyRate = analysis.interestRate / 12 / 100
    
    for (let year = 1; year <= years; year++) {
      // Property appreciation
      const propertyValue = property.price * Math.pow(1 + appreciationRate, year)
      const appreciation = propertyValue - property.price
      
      // Rental income growth
      const rentalIncome = analysis.annualRent * Math.pow(1 + rentGrowthRate, year - 1)
      
      // Expenses (assume they grow with inflation at 3%)
      const expenses = analysis.totalExpenses * Math.pow(1.03, year - 1)
      
      // Calculate principal paid this year
      let principalPaid = 0
      for (let month = 1; month <= 12; month++) {
        const interest = loanBalance * monthlyRate
        const principal = analysis.monthlyMortgage - interest
        principalPaid += principal
        loanBalance -= principal
      }
      
      // Cash flow
      const cashFlow = rentalIncome - expenses - (analysis.monthlyMortgage * 12)
      cumulativeCashFlow += cashFlow
      
      // Equity
      const equity = propertyValue - loanBalance
      
      // Total return (cash flow + appreciation + principal paid)
      const totalReturn = cumulativeCashFlow + appreciation + (analysis.loanAmount - loanBalance)
      
      projections.push({
        year,
        propertyValue: Math.round(propertyValue),
        appreciation: Math.round(appreciation),
        rentalIncome: Math.round(rentalIncome),
        expenses: Math.round(expenses),
        cashFlow: Math.round(cashFlow),
        principalPaid: Math.round(principalPaid),
        equity: Math.round(equity),
        totalReturn: Math.round(totalReturn),
        cumulativeCashFlow: Math.round(cumulativeCashFlow)
      })
    }
    
    return projections
  }

  calculateEquityBuildUp(
    params: AnalysisParams,
    analysis: InvestmentAnalysis,
    years: number = 10
  ): YearlyEquity[] {
    const equity: YearlyEquity[] = []
    const { property, market } = params
    const appreciationRate = params.appreciationRate || market.yearOverYearAppreciation / 100
    
    let loanBalance = analysis.loanAmount
    const monthlyRate = analysis.interestRate / 12 / 100
    
    for (let year = 1; year <= years; year++) {
      const propertyValue = property.price * Math.pow(1 + appreciationRate, year)
      
      // Calculate principal paid this year
      for (let month = 1; month <= 12; month++) {
        const interest = loanBalance * monthlyRate
        const principal = analysis.monthlyMortgage - interest
        loanBalance -= principal
      }
      
      const equityValue = propertyValue - loanBalance
      const equityPercentage = (equityValue / propertyValue) * 100
      
      equity.push({
        year,
        loanBalance: Math.round(loanBalance),
        propertyValue: Math.round(propertyValue),
        equity: Math.round(equityValue),
        equityPercentage: parseFloat(equityPercentage.toFixed(2))
      })
    }
    
    return equity
  }

  calculateIRR(cashFlows: number[], initialInvestment: number): number {
    // Simple IRR calculation using Newton's method
    const flows = [-initialInvestment, ...cashFlows]
    let irr = 0.1 // Initial guess
    
    for (let i = 0; i < 50; i++) {
      let npv = 0
      let dnpv = 0
      
      for (let j = 0; j < flows.length; j++) {
        npv += flows[j] / Math.pow(1 + irr, j)
        dnpv -= j * flows[j] / Math.pow(1 + irr, j + 1)
      }
      
      const newIrr = irr - npv / dnpv
      
      if (Math.abs(newIrr - irr) < 0.0001) {
        return parseFloat((newIrr * 100).toFixed(2))
      }
      
      irr = newIrr
    }
    
    return parseFloat((irr * 100).toFixed(2))
  }

  analyze(params: AnalysisParams): InvestmentAnalysis {
    const { property, rental, market } = params
    
    // Loan details
    const downPaymentPercent = params.downPaymentPercent || 20
    const interestRate = params.interestRate || 7.0
    const loanTerm = params.loanTerm || 30
    
    const downPayment = property.price * (downPaymentPercent / 100)
    const loanAmount = property.price - downPayment
    const monthlyMortgage = this.calculateMortgage(loanAmount, interestRate, loanTerm)
    
    // Income
    const monthlyRent = rental.monthlyRent
    const annualRent = monthlyRent * 12
    const otherIncome = 0
    const grossIncome = annualRent + otherIncome
    
    // Expenses
    const propertyTax = property.annualTaxes
    const insurance = property.price * 0.005 // 0.5% of property value
    const hoa = (property.hoa || 0) * 12
    const maintenancePercent = params.maintenancePercent || 1.5
    const maintenance = property.price * (maintenancePercent / 100)
    const propertyManagementPercent = params.propertyManagementPercent || 8
    const propertyManagement = annualRent * (propertyManagementPercent / 100)
    const utilities = monthlyRent * 0.05 * 12 // 5% of rent
    const vacancyPercent = params.vacancyPercent || 5
    const vacancy = annualRent * (vacancyPercent / 100)
    
    const totalExpenses = propertyTax + insurance + hoa + maintenance + 
                          propertyManagement + utilities + vacancy
    
    // Cash Flow
    const noi = this.calculateNOI(
      annualRent, propertyTax, insurance, maintenance, 
      hoa, propertyManagement, utilities, vacancy
    )
    const annualDebtService = monthlyMortgage * 12
    const annualCashFlow = noi - annualDebtService
    const monthlyCashFlow = annualCashFlow / 12
    
    // Returns
    const capRate = this.calculateCapRate(noi, property.price)
    const totalInvestment = downPayment + (property.price * 0.03) // 3% closing costs
    const cashOnCashReturn = this.calculateCashOnCashReturn(annualCashFlow, totalInvestment)
    const grm = this.calculateGRM(property.price, annualRent)
    const dscr = this.calculateDSCR(noi, annualDebtService)
    const roi = ((annualCashFlow + (property.price * 0.03)) / totalInvestment) * 100
    
    const analysis: InvestmentAnalysis = {
      purchasePrice: property.price,
      downPayment: Math.round(downPayment),
      loanAmount: Math.round(loanAmount),
      interestRate,
      loanTerm,
      monthlyMortgage: Math.round(monthlyMortgage),
      
      monthlyRent: Math.round(monthlyRent),
      annualRent: Math.round(annualRent),
      otherIncome,
      grossIncome: Math.round(grossIncome),
      
      propertyTax: Math.round(propertyTax),
      insurance: Math.round(insurance),
      hoa: Math.round(hoa),
      maintenance: Math.round(maintenance),
      propertyManagement: Math.round(propertyManagement),
      utilities: Math.round(utilities),
      vacancy: Math.round(vacancy),
      totalExpenses: Math.round(totalExpenses),
      
      noi: Math.round(noi),
      monthlyCashFlow: Math.round(monthlyCashFlow),
      annualCashFlow: Math.round(annualCashFlow),
      
      capRate: parseFloat(capRate.toFixed(2)),
      cashOnCashReturn: parseFloat(cashOnCashReturn.toFixed(2)),
      grm: parseFloat(grm.toFixed(2)),
      dscr: parseFloat(dscr.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
      
      totalInvestment: Math.round(totalInvestment),
      yearlyProjections: [],
      irr: 0,
      equityBuildUp: []
    }
    
    // Calculate long-term projections
    analysis.yearlyProjections = this.calculateYearlyProjections(params, analysis)
    analysis.equityBuildUp = this.calculateEquityBuildUp(params, analysis)
    
    // Calculate IRR
    const cashFlows = analysis.yearlyProjections.map(p => p.cashFlow + p.principalPaid)
    analysis.irr = this.calculateIRR(cashFlows, totalInvestment)
    
    return analysis
  }

  analyzeScenarios(params: AnalysisParams): ScenarioAnalysis {
    // Conservative scenario
    const conservative = this.analyze({
      ...params,
      appreciationRate: 0.02, // 2%
      downPaymentPercent: 25,
      interestRate: 7.5,
      maintenancePercent: 2,
      vacancyPercent: 8,
      rental: {
        ...params.rental,
        monthlyRent: params.rental.rentLow,
        marketGrowthRate: 2
      }
    })
    
    // Moderate scenario (realistic)
    const moderate = this.analyze(params)
    
    // Optimistic scenario
    const optimistic = this.analyze({
      ...params,
      appreciationRate: params.market.yearOverYearAppreciation / 100,
      downPaymentPercent: 20,
      interestRate: 6.5,
      maintenancePercent: 1,
      vacancyPercent: 3,
      rental: {
        ...params.rental,
        monthlyRent: params.rental.rentHigh,
        marketGrowthRate: 5
      }
    })
    
    return {
      conservative,
      moderate,
      optimistic
    }
  }
}

export default new InvestmentAnalyzer()
