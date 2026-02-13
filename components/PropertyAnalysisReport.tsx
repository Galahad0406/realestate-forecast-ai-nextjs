'use client'

import { useState } from 'react'
import { PropertyAnalysisResult } from '@/types'
import OverviewTab from './tabs/OverviewTab'
import FinancialsTab from './tabs/FinancialsTab'
import ProjectionsTab from './tabs/ProjectionsTab'
import ScenariosTab from './tabs/ScenariosTab'
import MarketTab from './tabs/MarketTab'

interface Props {
  result: PropertyAnalysisResult
}

export default function PropertyAnalysisReport({ result }: Props) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'financials', label: 'Financial Analysis' },
    { id: 'projections', label: '10-Year Projections' },
    { id: 'scenarios', label: 'Scenario Analysis' },
    { id: 'market', label: 'Market Data' }
  ]

  return (
    <div>
      <div className="card">
        <div className="tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && <OverviewTab result={result} />}
        {activeTab === 'financials' && <FinancialsTab result={result} />}
        {activeTab === 'projections' && <ProjectionsTab result={result} />}
        {activeTab === 'scenarios' && <ScenariosTab result={result} />}
        {activeTab === 'market' && <MarketTab result={result} />}
      </div>
    </div>
  )
}
