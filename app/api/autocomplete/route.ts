// app/api/autocomplete/route.ts
import { NextResponse } from 'next/server'
import apiService from '@/lib/apiService'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('query')

    if (!query || query.length < 3) {
      return NextResponse.json({ suggestions: [] })
    }

    const suggestions = await apiService.getAddressSuggestions(query)

    return NextResponse.json({ suggestions })
  } catch (error: any) {
    console.error('Autocomplete error:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
