'use client'

import { useState } from 'react'

interface Props {
  onAnalyze: (address: string, zipcode: string) => void
  loading: boolean
}

export default function PropertySearch({ onAnalyze, loading }: Props) {
  const [address, setAddress] = useState('')
  const [zipcode, setZipcode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!address.trim() || !zipcode.trim()) {
      alert('Please enter both address and zipcode')
      return
    }

    if (!/^\d{5}$/.test(zipcode)) {
      alert('Please enter a valid 5-digit zipcode')
      return
    }

    onAnalyze(address, zipcode)
  }

  return (
    <div className="search-box">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter property address (e.g., 123 Main St, Los Angeles, CA)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={loading}
        />
        <input
          type="text"
          placeholder="Enter 5-digit zipcode"
          value={zipcode}
          onChange={(e) => setZipcode(e.target.value.replace(/\D/g, '').slice(0, 5))}
          disabled={loading}
          maxLength={5}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Investment'}
        </button>
      </form>
    </div>
  )
}
