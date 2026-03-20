import { NextResponse } from 'next/server'

const BRACKET_API = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball/bracket'

export async function GET() {
  try {
    const year = new Date().getFullYear()
    const res = await fetch(`${BRACKET_API}?season=${year}`, {
      next: { revalidate: 300 } // 5 分钟缓存
    })

    if (!res.ok) {
      console.error(`Bracket API error: ${res.status}`)
      // Return empty bracket data instead of 500
      return NextResponse.json({
        year,
        regions: [],
        rounds: [],
        message: '锦标赛尚未开始或数据暂不可用'
      })
    }

    const data = await res.json()
    return NextResponse.json(parseBracketData(data))
  } catch (error: any) {
    console.error('Bracket API error:', error?.message || error)
    // Return empty bracket data instead of 500
    return NextResponse.json({
      year: new Date().getFullYear(),
      regions: [],
      rounds: [],
      message: '数据加载失败，请稍后重试'
    })
  }
}

function parseBracketData(data: any) {
  if (!data) {
    return {
      year: new Date().getFullYear(),
      regions: [],
      rounds: [],
    }
  }

  const regions = data.tournament?.regions || []
  const events = data.events || []
  
  return {
    year: data.season?.year || new Date().getFullYear(),
    regions: (Array.isArray(regions) ? regions : []).map((region: any) => ({
      id: region.id || '',
      name: region.name || 'Unknown',
      seed: 1,
      teams: (Array.isArray(region.teams) ? region.teams : []).map((team: any) => ({
        id: team.team?.id || '',
        name: team.team?.displayName || '',
        seed: parseInt(team.seed?.value || '0'),
        logo: team.team?.logo,
        record: team.team?.record?.summary,
        won: false,
        eliminated: false,
      })),
    })),
    rounds: parseRounds(events),
  }
}

function parseRounds(events: any[]) {
  if (!Array.isArray(events) || events.length === 0) {
    return []
  }

  const rounds = []
  
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
    if (Array.isArray(games)) {
      rounds.push({
        name: roundName,
        games: games.map((game: any) => parseGame(game)).filter((g: any) => g !== null),
      })
    }
  })

  return rounds
}

function parseGame(game: any) {
  try {
    const competition = game?.competitions?.[0]
    if (!competition) return null

    const homeComp = competition.competitors?.find((c: any) => c.homeAway === 'home')
    const awayComp = competition.competitors?.find((c: any) => c.homeAway === 'away')
    
    const regionMatch = competition.notes?.[0]?.headline?.match(/(\w+) Region/)
    const region = regionMatch ? regionMatch[1] : ''

    return {
      id: competition?.id || '',
      round: 1,
      region,
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
  } catch (error) {
    console.error('Error parsing game:', error)
    return null
  }
}

function getGameStatus(state: string): 'scheduled' | 'live' | 'final' {
  if (state === 'in') return 'live'
  if (state === 'post' || state === 'final') return 'final'
  return 'scheduled'
}
