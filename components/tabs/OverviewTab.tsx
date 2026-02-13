'use client'

import { PropertyAnalysisResult } from '@/types'

interface Props {
  result: PropertyAnalysisResult
}

export default function OverviewTab({ result }: Props) {
  const { property, analysis, recommendationScore, riskScore, insights, warnings } = result

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'score-excellent'
    if (score >= 60) return 'score-good'
    if (score >= 40) return 'score-fair'
    return 'score-poor'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div>
      <h2>Investment Overview</h2>

      {/* Property Details */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
        <h3>Property Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <div className="metric-label">Address</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{property.address}</div>
          </div>
          <div>
            <div className="metric-label">City, State</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{property.city}, {property.state}</div>
          </div>
          <div>
            <div className="metric-label">Property Type</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{property.propertyType}</div>
          </div>
          <div>
            <div className="metric-label">Year Built</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{property.yearBuilt}</div>
          </div>
          <div>
            <div className="metric-label">Bedrooms / Bathrooms</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{property.bedrooms} / {property.bathrooms}</div>
          </div>
          <div>
            <div className="metric-label">Square Feet</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 600 }}>{property.squareFeet.toLocaleString()} sq ft</div>
          </div>
        </div>
      </div>

      {/* Recommendation Scores */}
      <div style={{ textAlign: 'center', margin: '32px 0' }}>
        <h3>Investment Scores</h3>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px', marginTop: '20px' }}>
          <div className={`score-badge ${getScoreClass(recommendationScore)}`}>
            Recommendation: {getScoreLabel(recommendationScore)} ({recommendationScore}/100)
          </div>
          <div className={`score-badge ${getScoreClass(100 - riskScore)}`}>
            Risk Level: {getScoreLabel(100 - riskScore)} ({riskScore}/100)
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <h3>Key Investment Metrics</h3>
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-label">Purchase Price</div>
          <div className="metric-value">{formatCurrency(property.price)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Monthly Rent</div>
          <div className="metric-value positive">{formatCurrency(result.rental.monthlyRent)}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Monthly Cash Flow</div>
          <div className={`metric-value ${analysis.monthlyCashFlow > 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(analysis.monthlyCashFlow)}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Cap Rate</div>
          <div className={`metric-value ${analysis.capRate > 6 ? 'positive' : analysis.capRate > 4 ? 'warning' : 'negative'}`}>
            {analysis.capRate}%
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Cash-on-Cash Return</div>
          <div className={`metric-value ${analysis.cashOnCashReturn > 8 ? 'positive' : analysis.cashOnCashReturn > 5 ? 'warning' : 'negative'}`}>
            {analysis.cashOnCashReturn}%
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">10-Year IRR</div>
          <div className={`metric-value ${analysis.irr > 12 ? 'positive' : analysis.irr > 8 ? 'warning' : 'negative'}`}>
            {analysis.irr}%
          </div>
        </div>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div>
          <h3>Key Insights</h3>
          <ul className="insight-list">
            {insights.map((insight, index) => (
              <li key={index} className="insight-item">
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div>
          <h3>Important Considerations</h3>
          <ul className="insight-list">
            {warnings.map((warning, index) => (
              <li key={index} className="insight-item warning-item">
                {warning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
