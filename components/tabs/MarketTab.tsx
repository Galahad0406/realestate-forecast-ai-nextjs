'use client'

import { AnalysisResult } from '@/types'

interface Props {
  result: AnalysisResult
}

export default function MarketTab({ result }: Props) {
  const { market, property, comparables, rental } = result

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const pricePerSqft = property.price / property.squareFeet
  const priceVsMarket = ((pricePerSqft / market.pricePerSqft - 1) * 100).toFixed(1)

  return (
    <div>
      <h2>Market Analysis</h2>

      {/* Market Overview */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)' }}>
        <h3>Market Overview - {property.zipcode}</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Median Home Price</div>
            <div className="metric-value">{formatCurrency(market.medianPrice)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Price Per Sq Ft</div>
            <div className="metric-value">{formatCurrency(market.pricePerSqft)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Days on Market</div>
            <div className={`metric-value ${market.daysOnMarket < 30 ? 'positive' : market.daysOnMarket < 60 ? 'warning' : 'negative'}`}>
              {market.daysOnMarket}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Months of Supply</div>
            <div className={`metric-value ${market.monthsSupply < 4 ? 'positive' : market.monthsSupply < 6 ? 'warning' : 'negative'}`}>
              {market.monthsSupply.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      {/* Price Comparison */}
      <div className="card">
        <h3>Price Analysis</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Subject Property Price/Sq Ft</div>
            <div className="metric-value">{formatCurrency(pricePerSqft)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Market Average Price/Sq Ft</div>
            <div className="metric-value">{formatCurrency(market.pricePerSqft)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Variance from Market</div>
            <div className={`metric-value ${parseFloat(priceVsMarket) < 0 ? 'positive' : parseFloat(priceVsMarket) < 10 ? 'warning' : 'negative'}`}>
              {parseFloat(priceVsMarket) > 0 ? '+' : ''}{priceVsMarket}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Zestimate</div>
            <div className="metric-value">
              {property.zestimate ? formatCurrency(property.zestimate) : 'N/A'}
            </div>
          </div>
        </div>
        {parseFloat(priceVsMarket) < -10 && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#ecfdf5', borderRadius: '8px', border: '2px solid #10b981' }}>
            <strong style={{ color: '#059669' }}>✅ Great Deal!</strong>
            <p style={{ marginTop: '8px', color: '#065f46' }}>
              This property is priced {Math.abs(parseFloat(priceVsMarket))}% below market average - excellent value opportunity!
            </p>
          </div>
        )}
        {parseFloat(priceVsMarket) > 15 && (
          <div style={{ marginTop: '16px', padding: '16px', background: '#fef2f2', borderRadius: '8px', border: '2px solid #ef4444' }}>
            <strong style={{ color: '#dc2626' }}>⚠️ Overpriced</strong>
            <p style={{ marginTop: '8px', color: '#991b1b' }}>
              This property is priced {priceVsMarket}% above market average - consider negotiating or looking for better value.
            </p>
          </div>
        )}
      </div>

      {/* Appreciation & Demographics */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)' }}>
        <h3>Appreciation & Growth</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Year-over-Year Appreciation</div>
            <div className={`metric-value ${market.yearOverYearAppreciation > 5 ? 'positive' : market.yearOverYearAppreciation > 3 ? 'warning' : 'negative'}`}>
              {market.yearOverYearAppreciation.toFixed(1)}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Average Rent</div>
            <div className="metric-value">{formatCurrency(market.averageRent)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Vacancy Rate</div>
            <div className={`metric-value ${market.vacancyRate < 5 ? 'positive' : market.vacancyRate < 8 ? 'warning' : 'negative'}`}>
              {market.vacancyRate.toFixed(1)}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Rent Growth Rate</div>
            <div className="metric-value positive">{rental.marketGrowthRate.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Demographics */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
        <h3>Area Demographics</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Population</div>
            <div className="metric-value">{market.population.toLocaleString()}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Median Income</div>
            <div className="metric-value">{formatCurrency(market.medianIncome)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Unemployment Rate</div>
            <div className={`metric-value ${market.unemploymentRate < 4 ? 'positive' : market.unemploymentRate < 6 ? 'warning' : 'negative'}`}>
              {market.unemploymentRate.toFixed(1)}%
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">School Rating</div>
            <div className={`metric-value ${market.schoolRating >= 8 ? 'positive' : market.schoolRating >= 6 ? 'warning' : 'negative'}`}>
              {market.schoolRating}/10
            </div>
          </div>
        </div>
      </div>

      {/* Comparable Properties */}
      <div className="card">
        <h3>Comparable Properties</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Address</th>
                <th>Price</th>
                <th>$/Sq Ft</th>
                <th>Beds/Baths</th>
                <th>Sq Ft</th>
                <th>Days on Market</th>
                <th>Distance</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ background: '#eff6ff', fontWeight: 600 }}>
                <td>{property.address} (Subject)</td>
                <td>{formatCurrency(property.price)}</td>
                <td>{formatCurrency(pricePerSqft)}</td>
                <td>{property.bedrooms}/{property.bathrooms}</td>
                <td>{property.squareFeet.toLocaleString()}</td>
                <td>-</td>
                <td>-</td>
              </tr>
              {comparables.map((comp, index) => {
                const variance = ((comp.pricePerSqft / pricePerSqft - 1) * 100).toFixed(1)
                return (
                  <tr key={index}>
                    <td>{comp.address}</td>
                    <td>{formatCurrency(comp.price)}</td>
                    <td>
                      {formatCurrency(comp.pricePerSqft)}
                      <span style={{ 
                        fontSize: '0.875rem', 
                        color: parseFloat(variance) > 0 ? '#ef4444' : '#10b981',
                        marginLeft: '8px'
                      }}>
                        ({parseFloat(variance) > 0 ? '+' : ''}{variance}%)
                      </span>
                    </td>
                    <td>{comp.bedrooms}/{comp.bathrooms}</td>
                    <td>{comp.squareFeet.toLocaleString()}</td>
                    <td>{comp.daysOnMarket}</td>
                    <td>{comp.distance} mi</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Insights */}
      <div className="card">
        <h3>Market Insights</h3>
        <ul className="insight-list">
          {market.daysOnMarket < 30 && (
            <li className="insight-item">
              ✅ Hot market - properties sell quickly ({market.daysOnMarket} days average). Strong demand for rentals expected.
            </li>
          )}
          {market.yearOverYearAppreciation > 5 && (
            <li className="insight-item">
              ✅ Strong appreciation rate of {market.yearOverYearAppreciation.toFixed(1)}% - property values trending upward.
            </li>
          )}
          {market.vacancyRate < 5 && (
            <li className="insight-item">
              ✅ Low vacancy rate ({market.vacancyRate.toFixed(1)}%) indicates high rental demand and reliable occupancy.
            </li>
          )}
          {market.medianIncome > 70000 && (
            <li className="insight-item">
              ✅ Above-average median income (${market.medianIncome.toLocaleString()}) suggests quality tenant pool.
            </li>
          )}
          {market.schoolRating >= 8 && (
            <li className="insight-item">
              ✅ Excellent schools (rating {market.schoolRating}/10) attract families and support long-term property values.
            </li>
          )}
          {market.unemploymentRate < 4 && (
            <li className="insight-item">
              ✅ Low unemployment rate ({market.unemploymentRate.toFixed(1)}%) indicates stable local economy.
            </li>
          )}
          
          {market.vacancyRate > 8 && (
            <li className="insight-item warning-item">
              ⚠️ Higher vacancy rate ({market.vacancyRate.toFixed(1)}%) - budget for longer tenant search periods.
            </li>
          )}
          {market.daysOnMarket > 60 && (
            <li className="insight-item warning-item">
              ⚠️ Slower market - properties take {market.daysOnMarket} days to sell on average.
            </li>
          )}
          {market.unemploymentRate > 6 && (
            <li className="insight-item warning-item">
              ⚠️ Higher unemployment ({market.unemploymentRate.toFixed(1)}%) may impact tenant stability.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
