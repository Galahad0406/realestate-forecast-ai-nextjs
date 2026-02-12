'use client'

import { useState } from 'react'
import PropertySearch from '@/components/PropertySearch'
import AnalysisReport from '@/components/AnalysisReport'
import { AnalysisResult } from '@/types'

export default function Home() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (address: string, zipcode: string) => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, zipcode })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Pro Real Estate Analyzer</h1>
        <p>Professional-Grade Investment Analysis Platform</p>
      </div>

      <PropertySearch onAnalyze={handleAnalyze} loading={loading} />

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: 600 }}>
            Analyzing property data from multiple sources...
          </p>
        </div>
      )}

      {error && (
        <div className="error">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && !loading && <AnalysisReport result={result} />}
    </div>
  )
}
