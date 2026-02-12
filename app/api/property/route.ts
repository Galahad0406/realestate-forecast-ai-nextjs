import { NextResponse } from 'next/server'
import rentcastService from '@/lib/rentcastService'
import propertyService from '@/lib/propertyService'
import investmentCalculator from '@/lib/investmentCalculator'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address')
    const zipcode = searchParams.get('zipcode')

    // Validate inputs
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

    // Fetch property data
    let property, rent, census

    try {
      property = await rentcastService.getProperty(address)
    } catch (err: any) {
      return NextResponse.json(
        { error: 'Failed to fetch property data. Please check the address.' }, 
        { status: 400 }
      )
    }

    if (!property || !property.price) {
      return NextResponse.json(
        { error: 'Property not found. Please check the address.' }, 
        { status: 404 }
      )
    }

    try {
      rent = await rentcastService.getRent(address)
    } catch (err: any) {
      return NextResponse.json(
        { error: 'Failed to fetch rent data for this property.' }, 
        { status: 400 }
      )
    }

    if (!rent || !rent.rent) {
      return NextResponse.json(
        { error: 'Rent data not available for this property.' }, 
        { status: 404 }
      )
    }

    try {
      census = await propertyService.getCensusData(zipcode)
    } catch (err: any) {
      // Census data is optional, use defaults if not available
      census = {
        population: 0,
        medianIncome: 0
      }
    }

    // Calculate projections
    const growth = propertyService.predictGrowth(property.price, 0.05)
    const roi = investmentCalculator.calculate(property.price, rent.rent)

    return NextResponse.json({
      property,
      rent,
      census,
      growth,
      roi
    })

  } catch (err: any) {
    console.error('API Error:', err)
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred' }, 
      { status: 500 }
    )
  }
}
