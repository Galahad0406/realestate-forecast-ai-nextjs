// app/api/zipcode/route.ts

import { NextResponse } from 'next/server'
import redfinScraper from '../../../lib/redfinScraper'
import schoolData from '../../../lib/schoolData'
import investmentGrader from '../../../lib/investmentGrader'

/**
 * ✅ VERCEL FIX
 */
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const zipcode = searchParams.get('zipcode')

    if (!zipcode || !/^\d{5}$/.test(zipcode)) {
      return NextResponse.json(
        { error: 'Valid 5-digit zipcode is required' },
        { status: 400 }
      )
    }

    const marketData = await redfinScraper.getZipcodeData(zipcode)
    const schools = await schoolData.getSchoolGrade(zipcode, null, null)

    const investment = investmentGrader.calculateGrade(
      {
        price: marketData.medianPrice,
        sqft: Math.round(
          marketData.medianPrice / marketData.avgPricePerSqft
        ),
      },
      marketData,
      schools
    )

    return NextResponse.json({
      zipcode,
      marketData,
      schools,
      investment
    })
  } catch (error: any) {
    console.error('Zipcode API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}
