import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Pro Real Estate Analyzer - Investment Analysis Platform',
  description: 'Professional-grade real estate investment analysis with comprehensive financial metrics, market insights, and predictive modeling',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
