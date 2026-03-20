import { NextResponse } from 'next/server'
import { fetchScoreboard } from '@/lib/espn-api'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || undefined

  try {
    const games = await fetchScoreboard(date)
    return NextResponse.json(games)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    )
  }
}
