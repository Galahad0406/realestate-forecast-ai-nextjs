// app/api/analyze/route.ts
import { NextResponse } from 'next/server'
import analysisService from '@/lib/analysisService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { address, zipcode } = body

    if (!address || !zipcode) {
      return NextResponse.json(
        { error: 'Address and zipcode are required' },
        { status: 400 }
      )
    }

    if (!/^\d{5}$/.test(zipcode)) {
      return NextResponse.json(
        { error: 'Invalid zipcode format. Please enter 5 digits.' },
        { status: 400 }
      )
    }

    const result = await analysisService.analyzeProperty(address, zipcode)

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error.message || 'Analysis failed' },
      { status: 500 }
    )
  }
}
