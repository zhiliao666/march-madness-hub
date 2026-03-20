// 球队信息
export interface Team {
  id: string
  name: string
  abbreviation: string
  seed?: number
  logo?: string
  record?: string // e.g., "28-5"
  color?: string
}

// 比赛信息
export interface Game {
  id: string
  round: string // "Round of 64", "Sweet 16", etc.
  homeTeam: Team
  awayTeam: Team
  tipoff: string // ISO 8601 date
  venue?: string
  city?: string
  tv?: string // 电视台
  status: 'scheduled' | 'live' | 'final' | 'canceled'
  score?: {
    home: number
    away: number
  }
  period?: number // 当前节数
  clock?: string // 剩余时间
  bracket?: {
    region: string // "East", "West", "South", "Midwest"
    position: string
  }
  odds?: {
    spread: string // e.g., "ALA -12.5"
    overUnder: number
    provider: string
  }
  gamecastUrl?: string
}

// 比赛轮次
export type Round = 
  | 'First Four'
  | 'Round of 64'
  | 'Round of 32'
  | 'Sweet 16'
  | 'Elite Eight'
  | 'Final Four'
  | 'Championship'

// ESPN API 响应类型
export interface EspnScoreboardResponse {
  events: EspnEvent[]
}

export interface EspnEvent {
  id: string
  uid: string
  date: string
  name: string
  shortName: string
  season: {
    year: number
    type: number
  }
  competitions: EspnCompetition[]
}

export interface EspnCompetition {
  id: string
  uid: string
  date: string
  attendance?: number
  type: {
    id: string
    abbreviation: string
  }
  timeValid: boolean
  recent: boolean
  venue: {
    id: string
    fullName: string
    address: {
      city: string
      state: string
    }
  }
  competitors: EspnCompetitor[]
  status: {
    clock: number
    displayClock: string
    period: number
    type: {
      id: string
      name: string
      state: string
      completed: boolean
      description: string
      detail: string
      shortDetail: string
    }
  }
  broadcast: Array<{
    market: string
    names: Array<{
      shortName: string
    }>
  }>
}

export interface EspnCompetitor {
  id: string
  uid: string
  type: string
  order: number
  homeAway: 'home' | 'away'
  team: {
    id: string
    uid: string
    location: string
    name: string
    abbreviation: string
    displayName: string
    shortDisplayName: string
    color: string
    alternateColor: string
    logo: string
  }
  score: string
  record: Array<{
    name: string
    abbreviation: string
    type: string
    summary: string
  }>
}

export interface EspnOdds {
  provider: {
    id: string
    name: string
  }
  details: string
  overUnder: number
  spread: number
  awayTeamOdds: {
    favorite: boolean
    team: {
      id: string
      abbreviation: string
    }
  }
  homeTeamOdds: {
    favorite: boolean
    team: {
      id: string
      abbreviation: string
    }
  }
}
