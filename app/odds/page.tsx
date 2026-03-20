'use client'

import { useEffect, useState } from 'react'

interface GameOdds {
  id: string
  homeTeam: { name: string; abbreviation: string; seed: number }
  awayTeam: { name: string; abbreviation: string; seed: number }
  tipoff: string
  status: 'scheduled' | 'live' | 'final'
  odds: {
    spread: string
    overUnder: number
    moneyline: { home: string; away: string }
    provider: string
  }
  gamecastUrl?: string
}

interface OddsData {
  date: string
  games: GameOdds[]
  lastUpdated: string
}

export default function OddsPage() {
  const [oddsData, setOddsData] = useState<OddsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOdds()
    // 每 2 分钟刷新赔率
    const interval = setInterval(fetchOdds, 120000)
    return () => clearInterval(interval)
  }, [])

  async function fetchOdds() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/odds?date=${today}`)
      const data: OddsData = await res.json()
      setOddsData(data)
    } catch (error) {
      console.error('Failed to fetch odds:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-ncaa-blue to-blue-900">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <a href="/" className="text-blue-200 hover:text-white hover:underline mb-4 inline-block">
            ← 返回首页
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            📊 赔率对比
          </h1>
          <p className="text-blue-200">
            实时追踪各博彩公司赔率变化
          </p>
        </header>

        {/* 更新时间 */}
        {oddsData && (
          <div className="mb-4 text-sm text-blue-300">
            最后更新：{new Date(oddsData.lastUpdated).toLocaleString('zh-CN')}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="bg-white/10 backdrop-blur rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📈</div>
            <p className="text-blue-200">加载赔率数据中...</p>
          </div>
        )}

        {/* No Odds */}
        {!loading && (!oddsData || oddsData.games.length === 0) && (
          <div className="bg-white/10 backdrop-blur rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-blue-200">今日无赔率数据或比赛尚未开盘</p>
          </div>
        )}

        {/* Odds Table */}
        {!loading && oddsData && oddsData.games.length > 0 && (
          <div className="space-y-4">
            {oddsData.games.map((game) => (
              <OddsCard key={game.id} game={game} />
            ))}
          </div>
        )}

        {/* 赔率说明 */}
        <section className="mt-8 bg-white/10 backdrop-blur rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">📖 赔率说明</h2>
          <div className="space-y-4 text-blue-200 text-sm">
            <div>
              <h3 className="font-bold text-white mb-1">让分盘 (Spread)</h3>
              <p>例如 "ALA -12.5" 表示 Alabama 让 12.5 分，需要赢 13 分或以上才算赢盘。</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">大小分 (Over/Under)</h3>
              <p>例如 159.5 表示预测两队总得分，大于为 Over，小于为 Under。</p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-1">独赢盘 (Moneyline)</h3>
              <p>例如 "-750" 表示 favorites（热门），需要下注 $750 才能赢 $100；"+525" 表示 underdog（冷门），下注 $100 可赢 $525。</p>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded p-3">
              <p className="text-yellow-200">
                ⚠️ <strong>免责声明</strong>：赔率数据仅供参考，不构成博彩建议。请遵守当地法律法规，理性购彩，未满 21 岁请勿参与博彩。
              </p>
            </div>
          </div>
        </section>

        {/* 外部链接 */}
        <section className="mt-6 grid md:grid-cols-2 gap-4">
          <a
            href="https://www.vegasinsider.com/college-basketball/odds/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition block"
          >
            <h3 className="font-bold text-white mb-1">🎰 Vegas Insider</h3>
            <p className="text-sm text-blue-200">多博彩公司赔率对比</p>
          </a>
          <a
            href="https://www.actionnetwork.com/ncaab/odds"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition block"
          >
            <h3 className="font-bold text-white mb-1">📱 Action Network</h3>
            <p className="text-sm text-blue-200">赔率走势 + 专家分析</p>
          </a>
        </section>
      </div>
    </main>
  )
}

function OddsCard({ game }: { game: GameOdds }) {
  const isLive = game.status === 'live'

  return (
    <div className={`bg-white/95 backdrop-blur rounded-lg p-4 border ${
      isLive ? 'border-red-500' : 'border-white/20'
    }`}>
      {/* 比赛信息 */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          {isLive && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
              🔴 LIVE
            </span>
          )}
          <div className="font-bold text-gray-900">
            <span>#{game.awayTeam.seed} {game.awayTeam.name}</span>
            <span className="text-gray-500 mx-2">@</span>
            <span>#{game.homeTeam.seed} {game.homeTeam.name}</span>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {new Date(game.tipoff).toLocaleString('zh-CN', {
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>

      {/* 赔率数据 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* 让分盘 */}
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">让分盘</div>
          <div className="font-bold text-gray-900 text-sm">{game.odds.spread}</div>
        </div>

        {/* 大小分 */}
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">大小分</div>
          <div className="font-bold text-gray-900 text-sm">O/U {game.odds.overUnder}</div>
        </div>

        {/* 独赢盘 */}
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 mb-1">独赢盘</div>
          <div className="font-bold text-gray-900 text-xs">
            <div>主：{game.odds.moneyline.home || 'N/A'}</div>
            <div>客：{game.odds.moneyline.away || 'N/A'}</div>
          </div>
        </div>
      </div>

      {/* 博彩公司 */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>数据来源：{game.odds.provider}</span>
        {game.gamecastUrl && (
          <a
            href={game.gamecastUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ncaa-blue hover:underline"
          >
            查看比赛数据 →
          </a>
        )}
      </div>
    </div>
  )
}
