'use client'

import { useEffect, useState } from 'react'
import type { Game } from '@/types'
import type { StreamingSource, StreamingPackage } from '@/types/streaming'

// 预定义的直播源
const TV_NETWORKS: Record<string, StreamingSource> = {
  'CBS': {
    id: 'cbs',
    name: 'CBS',
    type: 'tv',
    url: 'https://www.cbs.com/live/',
    requiresAuth: true,
    requiresSubscription: true,
  },
  'TBS': {
    id: 'tbs',
    name: 'TBS',
    type: 'tv',
    url: 'https://www.tbs.com/watchtbs',
    requiresAuth: true,
    requiresSubscription: true,
  },
  'TNT': {
    id: 'tnt',
    name: 'TNT',
    type: 'tv',
    url: 'https://www.tntdrama.com/watchtnt',
    requiresAuth: true,
    requiresSubscription: true,
  },
  'truTV': {
    id: 'trutv',
    name: 'truTV',
    type: 'tv',
    url: 'https://www.trutv.com/watchtrutv',
    requiresAuth: true,
    requiresSubscription: true,
  },
}

const STREAMING_PACKAGES: StreamingPackage[] = [
  {
    id: 'paramount-plus',
    name: 'Paramount+',
    price: '$5.99/月',
    url: 'https://www.paramountplus.com/',
    freeTrial: '7 天免费试用',
    channels: ['CBS'],
    description: '观看 CBS 直播的所有比赛',
  },
  {
    id: 'youtube-tv',
    name: 'YouTube TV',
    price: '$72.99/月',
    url: 'https://tv.youtube.com/',
    freeTrial: '免费试用',
    channels: ['CBS', 'TBS', 'TNT', 'truTV'],
    description: '包含所有转播频道',
  },
  {
    id: 'hulu-live',
    name: 'Hulu + Live TV',
    price: '$76.99/月',
    url: 'https://www.hulu.com/live-tv',
    freeTrial: '3 天免费试用',
    channels: ['CBS', 'TBS', 'TNT', 'truTV'],
  },
  {
    id: 'fubo',
    name: 'FuboTV',
    price: '$79.99/月',
    url: 'https://www.fubo.tv/',
    freeTrial: '7 天免费试用',
    channels: ['CBS', 'TBS', 'TNT', 'truTV'],
    description: '体育直播专长',
  },
  {
    id: 'directv-stream',
    name: 'DIRECTV STREAM',
    price: '$84.99/月',
    url: 'https://www.directv.com/stream/',
    channels: ['CBS', 'TBS', 'TNT', 'truTV'],
  },
]

export default function StreamingPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGames()
  }, [])

  async function fetchGames() {
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await fetch(`/api/games?date=${today}`)
      const data: Game[] = await res.json()
      setGames(data.filter(g => g.tv))
    } catch (error) {
      console.error('Failed to fetch games:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-ncaa-blue to-blue-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <a href="/" className="text-blue-200 hover:text-white hover:underline mb-4 inline-block">
            ← 返回首页
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            📺 直播导航
          </h1>
          <p className="text-blue-200">
            找到观看比赛的 best 方式
          </p>
        </header>

        {/* 流媒体套餐推荐 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">🎁 流媒体套餐推荐</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {STREAMING_PACKAGES.map((pkg) => (
              <StreamingPackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        </section>

        {/* 今日比赛直播源 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            🏀 今日比赛直播源
            {loading && <span className="text-sm font-normal text-blue-200 ml-2">加载中...</span>}
          </h2>

          {loading && (
            <div className="text-center py-8 text-blue-200">
              加载比赛数据中...
            </div>
          )}

          {!loading && games.length === 0 && (
            <div className="bg-white/10 backdrop-blur rounded-lg p-8 text-center">
              <div className="text-4xl mb-4">📅</div>
              <p className="text-blue-200">今日无比赛或直播信息暂未更新</p>
            </div>
          )}

          <div className="space-y-4">
            {games.map((game) => (
              <GameStreamingCard key={game.id} game={game} />
            ))}
          </div>
        </section>

        {/* 观看指南 */}
        <section className="bg-white/10 backdrop-blur rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">📖 观看指南</h2>
          <div className="space-y-3 text-blue-200 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-white font-bold">1.</span>
              <span>
                <strong className="text-white">CBS 比赛</strong> - 可在 Paramount+ 观看，或通过天线免费接收本地 CBS 信号
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-white font-bold">2.</span>
              <span>
                <strong className="text-white">TBS/TNT/truTV 比赛</strong> - 需要有线电视订阅或 YouTube TV/Hulu Live 等流媒体服务
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-white font-bold">3.</span>
              <span>
                <strong className="text-white">免费选项</strong> - 部分比赛可通过电视台官网免费观看（需有线电视账号登录）
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-white font-bold">4.</span>
              <span>
                <strong className="text-white">免费试用</strong> - 利用流媒体服务的免费试用期观看比赛（记得取消订阅）
              </span>
            </div>
          </div>
        </section>

        {/* 外部链接 */}
        <section className="bg-white/10 backdrop-blur rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">🔗 官方资源</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a
              href="https://www.ncaa.com/march-madness"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition block"
            >
              <h3 className="font-bold text-white mb-1">🏀 NCAA 官方</h3>
              <p className="text-sm text-blue-200">ncaa.com/march-madness</p>
            </a>
            <a
              href="https://www.espn.com/mens-college-basketball/bracket"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 hover:bg-white/20 rounded-lg p-4 transition block"
            >
              <h3 className="font-bold text-white mb-1">📊 ESPN Bracket</h3>
              <p className="text-sm text-blue-200">espn.com/mens-college-basketball/bracket</p>
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}

function StreamingPackageCard({ pkg }: { pkg: StreamingPackage }) {
  return (
    <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20 hover:border-white/40 transition">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-white text-lg">{pkg.name}</h3>
        {pkg.freeTrial && (
          <span className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded font-medium">
            {pkg.freeTrial}
          </span>
        )}
      </div>
      
      {pkg.price && (
        <div className="text-2xl font-bold text-white mb-2">{pkg.price}</div>
      )}
      
      {pkg.description && (
        <p className="text-sm text-blue-200 mb-3">{pkg.description}</p>
      )}
      
      <div className="flex flex-wrap gap-1 mb-3">
        {pkg.channels.map((ch) => (
          <span key={ch} className="bg-white/20 text-white text-xs px-2 py-1 rounded">
            {ch}
          </span>
        ))}
      </div>
      
      <a
        href={pkg.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full bg-white text-ncaa-blue text-center py-2 rounded font-medium hover:bg-blue-50 transition"
      >
        查看详情 →
      </a>
    </div>
  )
}

function GameStreamingCard({ game }: { game: Game }) {
  const tvNetwork = game.tv
  const source = tvNetwork ? TV_NETWORKS[tvNetwork] : null

  return (
    <div className="bg-white/95 backdrop-blur rounded-lg p-4 border border-white/20">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div>
          <div className="font-bold text-gray-900">
            {game.awayTeam.name} @ {game.homeTeam.name}
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
        
        {tvNetwork && (
          <div className="bg-ncaa-orange text-white px-3 py-1 rounded font-bold">
            📺 {tvNetwork}
          </div>
        )}
      </div>

      {source && (
        <div className="flex flex-wrap gap-2">
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition"
          >
            观看直播 →
          </a>
          {source.requiresSubscription && (
            <span className="text-xs text-gray-500 flex items-center">
              ⚠️ 需要订阅
            </span>
          )}
        </div>
      )}

      {game.gamecastUrl && (
        <div className="mt-2">
          <a
            href={game.gamecastUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ncaa-blue hover:underline"
          >
            ESPN Gamecast（免费数据追踪）→
          </a>
        </div>
      )}
    </div>
  )
}
