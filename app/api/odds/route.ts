import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || undefined

  try {
    // 从 ESPN API 获取带赔率的比赛数据
    const url = date 
      ? `https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard?dates=${date}`
      : 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/scoreboard'

    const res = await fetch(url, {
      next: { revalidate: 60 }
    })

    if (!res.ok) {
      throw new Error(`ESPN API error: ${res.status}`)
    }

    const data = await res.json()
    const gamesWithOdds = parseGamesWithOdds(data.events || [])

    return NextResponse.json({
      date: date || new Date().toISOString().split('T')[0],
      games: gamesWithOdds,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Odds API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch odds data' },
      { status: 500 }
    )
  }
}

function parseGamesWithOdds(events: any[]) {
  return events
    .filter((event: any) => event.competitions?.[0]?.odds?.length > 0)
    .map((event: any) => {
      const competition = event.competitions[0]
      const homeComp = competition.competitors?.find((c: any) => c.homeAway === 'home')
      const awayComp = competition.competitors?.find((c: any) => c.homeAway === 'away')
      const odds = competition.odds?.[0]

      return {
        id: competition.id,
        homeTeam: {
          id: homeComp?.team?.id,
          name: homeComp?.team?.displayName,
          abbreviation: homeComp?.team?.abbreviation,
          seed: parseInt(homeComp?.seed?.value || '0'),
        },
        awayTeam: {
          id: awayComp?.team?.id,
          name: awayComp?.team?.displayName,
          abbreviation: awayComp?.team?.abbreviation,
          seed: parseInt(awayComp?.seed?.value || '0'),
        },
        tipoff: competition.date,
        status: competition.status?.type?.state === 'in' ? 'live' 
          : competition.status?.type?.completed ? 'final' 
          : 'scheduled',
        odds: {
          spread: odds?.details || '', // e.g., "ALA -12.5"
          overUnder: odds?.overUnder || 0,
          moneyline: {
            home: odds?.homeTeamOdds?.moneyline?.close?.odds || '',
            away: odds?.awayTeamOdds?.moneyline?.close?.odds || '',
          },
          provider: odds?.provider?.name || 'DraftKings',
        },
        gamecastUrl: event.links?.find((l: any) => l.rel?.includes('summary'))?.href,
      }
    })
    .sort((a: any, b: any) => new Date(a.tipoff).getTime() - new Date(b.tipoff).getTime())
}
