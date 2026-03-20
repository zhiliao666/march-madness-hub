import type { Game, Team, EspnScoreboardResponse, EspnEvent, EspnCompetition } from '@/types'

const ESPN_BASE_URL = 'https://site.api.espn.com/apis/site/v2/sports/basketball/mens-college-basketball'

/**
 * 从 ESPN API 获取赛程数据
 */
export async function fetchScoreboard(date?: string): Promise<Game[]> {
  const url = date 
    ? `${ESPN_BASE_URL}/scoreboard?dates=${date}`
    : `${ESPN_BASE_URL}/scoreboard`

  try {
    const res = await fetch(url, { 
      next: { revalidate: 60 } // 60 秒缓存
    })
    
    if (!res.ok) {
      throw new Error(`ESPN API error: ${res.status}`)
    }

    const data: EspnScoreboardResponse = await res.json()
    return parseEspnEvents(data.events)
  } catch (error) {
    console.error('Failed to fetch scoreboard:', error)
    return []
  }
}

/**
 * 解析 ESPN API 响应为我们的 Game 类型
 */
function parseEspnEvents(events: EspnEvent[]): Game[] {
  return events.map(event => {
    const competition = event.competitions[0]
    const homeCompetitor = competition.competitors.find(c => c.homeAway === 'home')
    const awayCompetitor = competition.competitors.find(c => c.homeAway === 'away')

    const statusMap: Record<string, Game['status']> = {
      'pre': 'scheduled',
      'in': 'live',
      'post': 'final',
      'final': 'final',
    }

    return {
      id: competition.id,
      round: getRoundFromEvent(event),
      homeTeam: parseTeam(homeCompetitor!),
      awayTeam: parseTeam(awayCompetitor!),
      tipoff: competition.date,
      venue: competition.venue?.fullName,
      city: competition.venue?.address?.city,
      tv: competition.broadcast?.[0]?.names?.[0]?.shortName,
      status: statusMap[competition.status.type.state] || 'scheduled',
      score: competition.status.type.completed ? {
        home: parseInt(homeCompetitor?.score || '0'),
        away: parseInt(awayCompetitor?.score || '0'),
      } : undefined,
      period: competition.status.period,
      clock: competition.status.displayClock,
    }
  })
}

/**
 * 解析球队信息
 */
function parseTeam(competitor: any): Team {
  return {
    id: competitor.team.id,
    name: competitor.team.name,
    abbreviation: competitor.team.abbreviation,
    logo: competitor.team.logo,
    color: competitor.team.color,
    record: competitor.record?.[0]?.summary,
  }
}

/**
 * 从事件信息推断比赛轮次
 */
function getRoundFromEvent(event: EspnEvent): string {
  const name = event.shortName.toLowerCase()
  
  if (name.includes('championship')) return 'Championship'
  if (name.includes('final four')) return 'Final Four'
  if (name.includes('elite eight')) return 'Elite Eight'
  if (name.includes('sweet 16')) return 'Sweet 16'
  if (name.includes('round of 32')) return 'Round of 32'
  if (name.includes('round of 64')) return 'Round of 64'
  if (name.includes('first four')) return 'First Four'
  
  return 'Tournament'
}

/**
 * 获取当前赛季的赛程
 */
export async function fetchSeasonSchedule(year: number = new Date().getFullYear()): Promise<Game[]> {
  // ESPN 的赛季年份是结束年份，例如 2024 赛季实际上是 2023-2024
  const url = `${ESPN_BASE_URL}/scoreboard?season=${year}&seasonType=3` // 3 = 季后赛
  
  try {
    const res = await fetch(url, { 
      next: { revalidate: 300 } // 5 分钟缓存
    })
    
    if (!res.ok) {
      throw new Error(`ESPN API error: ${res.status}`)
    }

    const data: EspnScoreboardResponse = await res.json()
    return parseEspnEvents(data.events)
  } catch (error) {
    console.error('Failed to fetch season schedule:', error)
    return []
  }
}
