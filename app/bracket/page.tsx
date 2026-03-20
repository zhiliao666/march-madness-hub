'use client'

import { useEffect, useState } from 'react'
import type { TournamentBracket, BracketRound, BracketGame } from '@/types/bracket'

export default function BracketPage() {
  const [bracket, setBracket] = useState<TournamentBracket | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState<string>('all')

  useEffect(() => {
    fetchBracket()
  }, [])

  async function fetchBracket() {
    try {
      const res = await fetch('/api/bracket')
      const data = await res.json()
      setBracket(data)
    } catch (error) {
      console.error('Failed to fetch bracket:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen p-8 bg-gradient-to-b from-ncaa-blue to-blue-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-6xl mb-4">🌳</div>
          <h1 className="text-3xl font-bold text-white mb-2">加载对阵图中...</h1>
          <p className="text-blue-200">正在获取 NCAA 锦标赛完整对阵数据</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-ncaa-blue to-blue-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <a href="/" className="text-blue-200 hover:text-white hover:underline mb-4 inline-block">
            ← 返回首页
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            🏆 {bracket?.year} NCAA 锦标赛对阵图
          </h1>
          <p className="text-blue-200">
            68 支球队晋级之路
          </p>
        </header>

        {/* 赛区筛选 */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedRegion('all')}
            className={`px-4 py-2 rounded font-medium transition ${
              selectedRegion === 'all'
                ? 'bg-white text-ncaa-blue'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            全部
          </button>
          {bracket?.regions.map((region) => (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.name)}
              className={`px-4 py-2 rounded font-medium transition ${
                selectedRegion === region.name
                  ? 'bg-white text-ncaa-blue'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {region.name}
            </button>
          ))}
        </div>

        {/* 轮次展示 */}
        {bracket?.rounds && bracket.rounds.length > 0 ? (
          <div className="space-y-8">
            {bracket.rounds.map((round, roundIndex) => (
              <RoundSection 
                key={round.name} 
                round={round} 
                roundIndex={roundIndex}
                selectedRegion={selectedRegion}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-white mb-2">对阵图即将上线</h2>
            <p className="text-blue-200">
              锦标赛正式开始后将显示完整对阵数据
            </p>
          </div>
        )}

        {/* 图例说明 */}
        <div className="mt-8 bg-white/10 backdrop-blur rounded-lg p-4 text-sm text-blue-200">
          <h3 className="font-bold text-white mb-2">📖 图例说明</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium text-white">#1</span> - 种子排名
            </div>
            <div>
              <span className="font-medium text-white">✓</span> - 已晋级
            </div>
            <div>
              <span className="font-medium text-white">🔴</span> - 进行中
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function RoundSection({ 
  round, 
  roundIndex,
  selectedRegion 
}: { 
  round: BracketRound
  roundIndex: number
  selectedRegion: string
}) {
  const filteredGames = selectedRegion === 'all'
    ? round.games
    : round.games.filter(g => g.region === selectedRegion)

  if (filteredGames.length === 0) return null

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        {getRoundIcon(roundIndex)} {round.name}
        <span className="text-sm font-normal text-blue-200">
          ({filteredGames.length} 场)
        </span>
      </h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredGames.map((game) => (
          <BracketGameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}

function BracketGameCard({ game }: { game: any }) {
  const statusColor = game.game?.status === 'live' 
    ? 'border-red-500 bg-red-500/10' 
    : game.winner
    ? 'border-green-500/50 bg-green-500/5'
    : 'border-white/20 bg-white/5'

  return (
    <div className={`rounded-lg border p-3 backdrop-blur transition ${statusColor}`}>
      {/* 赛区标签 */}
      {game.region && (
        <div className="text-xs text-blue-300 mb-2">{game.region} Region</div>
      )}

      {/* 客队 */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {game.awayTeam?.logo && (
            <img src={game.awayTeam.logo} alt={game.awayTeam.name} className="w-6 h-6" />
          )}
          <span className={`text-sm ${game.winner === game.awayTeam?.id ? 'font-bold text-white' : 'text-blue-100'}`}>
            #{game.awayTeam?.seed} {game.awayTeam?.name}
          </span>
        </div>
        {game.game?.score && (
          <span className={`font-bold ${game.winner === game.awayTeam?.id ? 'text-green-400' : 'text-white'}`}>
            {game.game.score.away}
          </span>
        )}
      </div>

      {/* 主队 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {game.homeTeam?.logo && (
            <img src={game.homeTeam.logo} alt={game.homeTeam.name} className="w-6 h-6" />
          )}
          <span className={`text-sm ${game.winner === game.homeTeam?.id ? 'font-bold text-white' : 'text-blue-100'}`}>
            #{game.homeTeam?.seed} {game.homeTeam?.name}
          </span>
        </div>
        {game.game?.score && (
          <span className={`font-bold ${game.winner === game.homeTeam?.id ? 'text-green-400' : 'text-white'}`}>
            {game.game.score.home}
          </span>
        )}
      </div>

      {/* 状态 */}
      {game.game?.status === 'live' && (
        <div className="mt-2 text-xs text-red-400 font-medium animate-pulse">
          🔴 LIVE
        </div>
      )}
      {game.game?.status === 'scheduled' && game.game?.tipoff && (
        <div className="mt-2 text-xs text-blue-300">
          {new Date(game.game.tipoff).toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </div>
      )}
    </div>
  )
}

function getRoundIcon(index: number): string {
  const icons = ['🎯', '🔥', '⭐', '💎', '👑', '🏆']
  return icons[index] || '🏀'
}
