// 对阵图相关类型

export interface BracketRegion {
  id: string
  name: string // "East", "West", "South", "Midwest"
  seed: number // 1-16
  teams: BracketTeam[]
}

export interface BracketTeam {
  id: string
  name: string
  seed: number
  logo?: string
  record?: string
  won?: boolean // 是否晋级
  eliminated?: boolean // 是否被淘汰
}

export interface BracketRound {
  name: string // "First Four", "Round of 64", "Round of 32", etc.
  games: BracketGame[]
}

export interface BracketGame {
  id: string
  round: number // 1=Round of 64, 2=Round of 32, etc.
  region: string
  homeTeam: BracketTeam | null
  awayTeam: BracketTeam | null
  winner?: string // team id
  game?: {
    id: string
    status: 'scheduled' | 'live' | 'final'
    score?: { home: number; away: number }
    tipoff: string
  }
}

export interface TournamentBracket {
  year: number
  regions: BracketRegion[]
  rounds: BracketRound[]
  champion?: BracketTeam
}
