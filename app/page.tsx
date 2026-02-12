'use client'

import { useState } from 'react'
import PropertySearch from '@/components/PropertySearch'
import ResultsDisplay from '@/components/ResultsDisplay'

export default function Home() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleResults = (data: any) => {
    setResults(data)
    setLoading(false)
    if (data.error) {
      setError(data.error)
    } else {
      setError(null)
    }
  }

  const handleSearch = () => {
    setLoading(true)
    setError(null)
  }

  return (
    <div>
      <h1>Real Estate Forecast AI</h1>
      <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#666' }}>
        Analyze real estate investments with AI-powered insights
      </p>
      
      <PropertySearch 
        onResults={handleResults} 
        onSearch={handleSearch}
      />
      
      {loading && (
        <div style={{ marginTop: '2rem', fontSize: '1.1rem', color: '#0070f3' }}>
          Analyzing property data...
        </div>
      )}
      
      {error && (
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c33'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {results && !error && !loading && <ResultsDisplay data={results} />}
    </div>
  )
}
