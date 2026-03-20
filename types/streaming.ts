// 直播源相关类型

export interface StreamingSource {
  id: string
  name: string // ESPN, CBS, TNT, etc.
  type: 'tv' | 'streaming' | 'official'
  url?: string
  logo?: string
  requiresAuth?: boolean // 是否需要登录
  requiresSubscription?: boolean // 是否需要订阅
  freeTrial?: boolean // 有免费试用
  quality?: 'HD' | '4K'
  region?: string // 地区限制
}

export interface GameStreaming {
  gameId: string
  homeTeam: string
  awayTeam: string
  tipoff: string
  sources: StreamingSource[]
}

export interface StreamingPackage {
  id: string
  name: string // e.g., "ESPN+", "Paramount+"
  price?: string // e.g., "$9.99/month"
  url: string
  logo?: string
  freeTrial?: string // e.g., "7 days free"
  channels: string[]
  description?: string
}
