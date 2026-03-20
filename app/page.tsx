'use client'

import { useEffect, useState } from 'react'
import type { Game } from '@/types'
import { formatDate, formatGameTime, getStatusLabel, formatSeed } from '@/lib/utils'

export default function Home() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [liveGames, setLiveGames] = useState<Game[]>([])

  useEffect(() => {
    fetchGames()
    // 每 60 秒刷新一次数据
    const interval = setInterval(fetchGames, 60000)
    return () => clearInterval(interval)
  }, [])

  async function fetchGames() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/games?date=${today}`)
      const data: Game[] = await res.json()
      
      setGames(data)
      setLiveGames(data.filter(g => g.status === 'live'))
    } catch (error) {
      console.error('Failed to fetch games:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-ncaa-blue to-blue-900">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            🏀 March Madness Hub
          </h1>
          <p className="text-blue-200">
            NCAA 男子篮球锦标赛赛程中心
          </p>
          <p className="text-blue-300 text-sm mt-2">
            {new Date().toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </header>

        {/* Live Score Banner */}
        {liveGames.length > 0 && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 animate-pulse">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">🔴</span>
              <span className="font-bold">LIVE: </span>
              <span>
                {liveGames.map(game => 
                  `${game.awayTeam.abbreviation} ${game.score?.away} - ${game.score?.home} ${game.homeTeam.abbreviation}`
                ).join(' | ')}
              </span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-gray-600">加载赛程数据中...</p>
          </div>
        )}

        {/* No Games */}
        {!loading && games.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-4xl mb-4">📅</div>
            <p className="text-gray-600">今日无比赛</p>
            <p className="text-sm text-gray-500 mt-2">锦标赛期间会显示每日赛程</p>
          </div>
        )}

        {/* Games List */}
        {!loading && games.length > 0 && (
          <>
            {/* 今日赛程 */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-white">
                📅 今日赛程
                <span className="text-sm font-normal text-blue-200">
                  共 {games.length} 场比赛
                </span>
              </h2>
              
              <div className="space-y-4">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* 功能导航 */}
        <section className="grid md:grid-cols-3 gap-4 mb-8">
          <a 
            href="/bracket" 
            className="bg-white/10 backdrop-blur p-6 rounded-lg hover:bg-white/20 transition border border-white/20"
          >
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-bold text-lg text-white">完整对阵图</h3>
            <p className="text-sm text-blue-200">查看 68 支球队晋级路径</p>
          </a>
          <div className="bg-white/10 backdrop-blur p-6 rounded-lg border border-white/20 opacity-50">
            <div className="text-3xl mb-2">📺</div>
            <h3 className="font-bold text-lg text-white">直播导航</h3>
            <p className="text-sm text-blue-200">即将上线</p>
          </div>
          <div className="bg-white/10 backdrop-blur p-6 rounded-lg border border-white/20 opacity-50">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-lg text-white">赔率对比</h3>
            <p className="text-sm text-blue-200">即将上线</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-blue-300 text-sm">
          <p>🚧 开发中 - Phase 1: 赛程中心</p>
          <p className="mt-2">
            <a 
              href="https://github.com/zhiliao666/march-madness-hub" 
              className="text-white hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </p>
          <p className="mt-2 text-xs text-blue-400">
            数据来源：ESPN
          </p>
        </footer>
      </div>
    </main>
  )
}

function GameCard({ game }: { game: Game }) {
  const status = getStatusLabel(game.status)
  const timeInfo = game.status === 'scheduled' 
    ? formatGameTime(game.tipoff)
    : game.status === 'live'
    ? `${game.clock} - 第${game.period}节`
    : '已结束'

  return (
    <div className="bg-white/95 backdrop-blur rounded-lg shadow-md p-4 md:p-5 hover:shadow-lg transition border border-white/20">
      {/* 状态标签 + 轮次 */}
      <div className="flex justify-between items-center mb-3">
        <span className={`px-2 py-1 rounded text-xs font-bold ${status.color}`}>
          {status.label}
        </span>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {game.round}
          {game.bracket?.region && ` · ${game.bracket.region} Region`}
        </span>
      </div>

      {/* 对阵信息 */}
      <div className="space-y-2">
        {/* 客队 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {game.awayTeam.logo && (
              <img 
                src={game.awayTeam.logo} 
                alt={game.awayTeam.name}
                className="w-8 h-8 object-contain"
              />
            )}
            <div>
              <p className="font-bold text-sm md:text-base">
                {formatSeed(game.awayTeam.seed)} {game.awayTeam.name}
              </p>
              {game.awayTeam.record && (
                <p className="text-xs text-gray-500">{game.awayTeam.record}</p>
              )}
            </div>
          </div>
          {game.score !== undefined && (
            <span className="text-xl font-bold">{game.score.away}</span>
          )}
        </div>

        {/* VS 分隔线 */}
        <div className="text-center text-gray-400 text-xs py-1 border-t border-b border-gray-100">
          {timeInfo}
        </div>

        {/* 主队 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {game.homeTeam.logo && (
              <img 
                src={game.homeTeam.logo} 
                alt={game.homeTeam.name}
                className="w-8 h-8 object-contain"
              />
            )}
            <div>
              <p className="font-bold text-sm md:text-base">
                {formatSeed(game.homeTeam.seed)} {game.homeTeam.name}
              </p>
              {game.homeTeam.record && (
                <p className="text-xs text-gray-500">{game.homeTeam.record}</p>
              )}
            </div>
          </div>
          {game.score !== undefined && (
            <span className="text-xl font-bold">{game.score.home}</span>
          )}
        </div>
      </div>

      {/* 比赛信息 */}
      <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
        <div className="flex flex-wrap gap-2 justify-between">
          <div className="flex gap-3">
            {game.tv && (
              <span className="flex items-center gap-1">
                📺 {game.tv}
              </span>
            )}
            {game.venue && (
              <span className="flex items-center gap-1">
                📍 {game.city}
              </span>
            )}
          </div>
          {game.odds && (
            <span className="text-orange-600 font-medium">
              让分：{game.odds.spread}
            </span>
          )}
        </div>
      </div>

      {/* 直播/详情链接 */}
      {game.status === 'live' && game.gamecastUrl && (
        <div className="mt-3">
          <a 
            href={game.gamecastUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-ncaa-orange text-white text-center py-2 rounded text-sm font-medium hover:bg-orange-600 transition"
          >
            查看直播数据 →
          </a>
        </div>
      )}
    </div>
  )
}
