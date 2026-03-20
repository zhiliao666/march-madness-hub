import type { Game } from '@/types'
import { formatDate, formatGameTime, getStatusLabel, formatSeed } from '@/lib/utils'

interface ScheduleCardProps {
  game: Game
}

export default function ScheduleCard({ game }: ScheduleCardProps) {
  const status = getStatusLabel(game.status)

  return (
    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 hover:shadow-lg transition-shadow">
      {/* 状态标签 */}
      <div className="flex justify-between items-center mb-4">
        <span className={`px-2 py-1 rounded text-xs font-bold ${status.color}`}>
          {status.label}
        </span>
        <span className="text-sm text-gray-500">
          {game.round}
        </span>
      </div>

      {/* 对阵信息 */}
      <div className="space-y-3">
        {/* 客队 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {game.awayTeam.logo && (
              <img 
                src={game.awayTeam.logo} 
                alt={game.awayTeam.name}
                className="w-10 h-10 object-contain"
              />
            )}
            <div>
              <p className="font-bold text-lg">
                {formatSeed(game.awayTeam.seed)} {game.awayTeam.name}
              </p>
              {game.awayTeam.record && (
                <p className="text-sm text-gray-500">{game.awayTeam.record}</p>
              )}
            </div>
          </div>
          {game.score && (
            <span className="text-2xl font-bold">{game.score.away}</span>
          )}
        </div>

        {/* VS 分隔线 */}
        <div className="text-center text-gray-400 text-sm">
          {game.status === 'live' ? (
            <span className="text-red-500 font-bold">
              {game.clock} - 第{game.period}节
            </span>
          ) : (
            'VS'
          )}
        </div>

        {/* 主队 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {game.homeTeam.logo && (
              <img 
                src={game.homeTeam.logo} 
                alt={game.homeTeam.name}
                className="w-10 h-10 object-contain"
              />
            )}
            <div>
              <p className="font-bold text-lg">
                {formatSeed(game.homeTeam.seed)} {game.homeTeam.name}
              </p>
              {game.homeTeam.record && (
                <p className="text-sm text-gray-500">{game.homeTeam.record}</p>
              )}
            </div>
          </div>
          {game.score && (
            <span className="text-2xl font-bold">{game.score.home}</span>
          )}
        </div>
      </div>

      {/* 比赛信息 */}
      <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
        <div className="flex flex-wrap gap-3 justify-between">
          <span>
            🕐 {formatDate(game.tipoff)}
          </span>
          {game.venue && (
            <span>
              📍 {game.venue}
            </span>
          )}
          {game.tv && (
            <span>
              📺 {game.tv}
            </span>
          )}
        </div>
      </div>

      {/* 直播链接（如果有） */}
      {game.status === 'live' && (
        <div className="mt-4">
          <a 
            href="#"
            className="block w-full bg-ncaa-orange text-white text-center py-2 rounded hover:bg-orange-600 transition"
          >
            观看直播
          </a>
        </div>
      )}
    </div>
  )
}
