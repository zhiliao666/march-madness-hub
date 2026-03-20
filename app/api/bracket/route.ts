import { NextResponse } from 'next/server'

const BRACKET_API = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/bracket'

export async function GET() {
  try {
    const year = new Date().getFullYear()
    const res = await fetch(`${BRACKET_API}?season=${year}`, {
      next: { revalidate: 300 } // 5 分钟缓存
    })

    if (!res.ok) {
      throw new Error(`Bracket API error: ${res.status}`)
    }

    const data = await res.json()
    return NextResponse.json(parseBracketData(data))
  } catch (error) {
    console.error('Bracket API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bracket data' },
      { status: 500 }
    )
  }
}

function parseBracketData(data: any) {
  const regions = data.tournament?.regions || []
  
  return {
    year: data.season?.year || new Date().getFullYear(),
    regions: regions.map((region: any) => ({
      id: region.id,
      name: region.name,
      seed: 1,
      teams: region.teams?.map((team: any) => ({
        id: team.team?.id || '',
        name: team.team?.displayName || '',
        seed: team.seed?.value || 0,
        logo: team.team?.logo,
        record: team.team?.record?.summary,
        won: false,
        eliminated: false,
      })) || [],
    })),
    rounds: parseRounds(data),
  }
}

function parseRounds(data: any) {
  const rounds = []
  const events = data.events || []
  
  // 按轮次分组
  const roundsMap = new Map<string, any[]>()
  events.forEach((event: any) => {
    const roundName = event.name?.split('-')[0]?.trim() || 'Unknown'
    if (!roundsMap.has(roundName)) {
      roundsMap.set(roundName, [])
    }
    roundsMap.get(roundName)!.push(event)
  })

  roundsMap.forEach((games, roundName) => {
    rounds.push({
      name: roundName,
      games: games.map((game: any) => {
        const competition = game.competitions?.[0]
        const homeComp = competition?.competitors?.find((c: any) => c.homeAway === 'home')
        const awayComp = competition?.competitors?.find((c: any) => c.homeAway === 'away')
        
        return {
          id: competition?.id || '',
          round: 1,
          region: competition?.notes?.[0]?.headline?.match(/(\w+) Region/)?.[1] || '',
          homeTeam: homeComp ? {
            id: homeComp.team?.id || '',
            name: homeComp.team?.displayName || '',
            seed: parseInt(homeComp.seed?.value || '0'),
            logo: homeComp.team?.logo,
          } : null,
          awayTeam: awayComp ? {
            id: awayComp.team?.id || '',
            name: awayComp.team?.displayName || '',
            seed: parseInt(awayComp.seed?.value || '0'),
            logo: awayComp.team?.logo,
          } : null,
          winner: competition?.status?.type?.completed 
            ? (parseInt(homeComp?.score || '0') > parseInt(awayComp?.score || '0') 
                ? homeComp?.team?.id 
                : awayComp?.team?.id)
            : undefined,
          game: {
            id: competition?.id || '',
            status: getGameStatus(competition?.status?.type?.state),
            score: competition?.status?.type?.completed ? {
              home: parseInt(homeComp?.score || '0'),
              away: parseInt(awayComp?.score || '0'),
            } : undefined,
            tipoff: competition?.date || '',
          },
        }
      }),
    })
  })

  return rounds
}

function getGameStatus(state: string): 'scheduled' | 'live' | 'final' {
  if (state === 'in') return 'live'
  if (state === 'post' || state === 'final') return 'final'
  return 'scheduled'
}
