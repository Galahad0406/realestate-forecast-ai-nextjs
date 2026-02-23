"use client"

import { useState } from "react"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/components/Map"), { ssr: false })

export default function Home() {
  const [data, setData] = useState<any>(null)

  const analyze = async () => {
    const res = await fetch("/api/market?region=Seattle&zip=98101")
    const json = await res.json()
    setData(json)
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Real Estate AI Forecast</h1>
      <button onClick={analyze}>Analyze Market</button>

      {data && (
        <>
          <h2>Current Price: ${data.currentPrice}</h2>
          <h2>Projected Price: ${data.projectedPrice}</h2>
          <p>Population: {data.population}</p>
          <p>Median Income: ${data.medianIncome}</p>

          <Map lat={47.6062} lng={-122.3321} />
        </>
      )}
    </main>
  )
}
