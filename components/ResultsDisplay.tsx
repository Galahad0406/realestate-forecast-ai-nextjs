'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

export default function ResultsDisplay({ data }: any) {
  if (!data || !data.roi || !data.growth) {
    return null
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
    <div style={{ marginTop: '3rem' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#1a1a1a' }}>
          Investment Analysis
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              ROI
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0070f3' }}>
              {data.roi.roi}%
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              Annual Rent
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {formatCurrency(data.roi.annualRent)}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              Net Income
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {formatCurrency(data.roi.net)}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              Annual Expenses
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>
              {formatCurrency(data.roi.expenses)}
            </div>
          </div>
        </div>

        {data.property && (
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            marginTop: '1rem'
          }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
              Property Value
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
              {formatCurrency(data.property.price)}
            </div>
          </div>
        )}
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '1.5rem', color: '#1a1a1a' }}>
          5-Year Value Projection
        </h2>
        
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data.growth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="year" 
              label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
              stroke="#6b7280"
            />
            <YAxis 
              tickFormatter={(value) => formatCurrency(value)}
              stroke="#6b7280"
            />
            <Tooltip 
              formatter={(value: any) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="projectedValue" 
              stroke="#0070f3"
              strokeWidth={3}
              dot={{ fill: '#0070f3', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        <div style={{ 
          marginTop: '1rem', 
          fontSize: '0.9rem', 
          color: '#666',
          textAlign: 'center' 
        }}>
          Based on 5% annual appreciation rate
        </div>
      </div>

      {data.census && (data.census.population > 0 || data.census.medianIncome > 0) && (
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '2rem'
        }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#1a1a1a' }}>
            Area Demographics
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            {data.census.population > 0 && (
              <div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  Population
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {data.census.population.toLocaleString()}
                </div>
              </div>
            )}
            
            {data.census.medianIncome > 0 && (
              <div>
                <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                  Median Income
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                  {formatCurrency(data.census.medianIncome)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
