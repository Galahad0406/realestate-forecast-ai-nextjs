'use client'

import { PropertyAnalysisResult } from '@/types'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'

interface Props {
  result: PropertyAnalysisResult
}

export default function ProjectionsTab({ result }: Props) {
  const { analysis } = result

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
      <h2>10-Year Investment Projections</h2>

      {/* Property Value Growth */}
      <div className="card">
        <h3>Property Value Appreciation</h3>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={analysis.yearlyProjections}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Area
              type="monotone"
              dataKey="propertyValue"
              stroke="#667eea"
              fill="#667eea"
              fillOpacity={0.6}
              name="Property Value"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Cash Flow Projection */}
      <div className="card">
        <h3>Annual Cash Flow</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={analysis.yearlyProjections}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Bar dataKey="cashFlow" fill={analysis.annualCashFlow > 0 ? '#10b981' : '#ef4444'} name="Annual Cash Flow" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Equity Build-up */}
      <div className="card">
        <h3>Equity Build-up</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={analysis.equityBuildUp}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} />
            <Tooltip formatter={(value, name) => {
              if (name === 'Equity %') return `${Number(value).toFixed(2)}%`
              return formatCurrency(Number(value))
            }} />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="equity"
              stroke="#10b981"
              strokeWidth={3}
              name="Equity"
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="loanBalance"
              stroke="#ef4444"
              strokeWidth={2}
              name="Loan Balance"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="equityPercentage"
              stroke="#667eea"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Equity %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Total Return */}
      <div className="card">
        <h3>Cumulative Returns</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={analysis.yearlyProjections}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalReturn"
              stroke="#10b981"
              strokeWidth={3}
              name="Total Return"
            />
            <Line
              type="monotone"
              dataKey="cumulativeCashFlow"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Cumulative Cash Flow"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Projections Table */}
      <div className="card">
        <h3>Detailed Year-by-Year Projections</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Property Value</th>
                <th>Rental Income</th>
                <th>Expenses</th>
                <th>Cash Flow</th>
                <th>Principal Paid</th>
                <th>Equity</th>
                <th>Total Return</th>
              </tr>
            </thead>
            <tbody>
              {analysis.yearlyProjections.map((year) => (
                <tr key={year.year}>
                  <td><strong>{year.year}</strong></td>
                  <td>{formatCurrency(year.propertyValue)}</td>
                  <td>{formatCurrency(year.rentalIncome)}</td>
                  <td>{formatCurrency(year.expenses)}</td>
                  <td style={{ color: year.cashFlow > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                    {formatCurrency(year.cashFlow)}
                  </td>
                  <td>{formatCurrency(year.principalPaid)}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(year.equity)}</td>
                  <td style={{ color: '#667eea', fontWeight: 700 }}>{formatCurrency(year.totalReturn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)' }}>
        <h3>10-Year Summary</h3>
        <div className="metric-grid">
          <div className="metric-card">
            <div className="metric-label">Final Property Value</div>
            <div className="metric-value positive">
              {formatCurrency(analysis.yearlyProjections[9]?.propertyValue || 0)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Total Cash Flow</div>
            <div className="metric-value positive">
              {formatCurrency(analysis.yearlyProjections[9]?.cumulativeCashFlow || 0)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Total Equity Built</div>
            <div className="metric-value positive">
              {formatCurrency(analysis.yearlyProjections[9]?.equity || 0)}
            </div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Total Return</div>
            <div className="metric-value positive">
              {formatCurrency(analysis.yearlyProjections[9]?.totalReturn || 0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
