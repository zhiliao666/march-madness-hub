import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化日期为本地时间
 */
export function formatDate(dateString: string, options?: Intl.DateTimeFormatOptions): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  })
}

/**
 * 格式化比赛时间（倒计时或已过时间）
 */
export function formatGameTime(dateString: string): string {
  const gameDate = new Date(dateString)
  const now = new Date()
  const diff = gameDate.getTime() - now.getTime()

  if (diff <= 0) {
    return '进行中'
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 24) {
    const days = Math.floor(hours / 24)
    return `${days}天后`
  }

  return `${hours}小时${minutes}分钟后`
}

/**
 * 获取比赛状态标签
 */
export function getStatusLabel(status: string): { label: string; color: string } {
  switch (status) {
    case 'live':
      return { label: '🔴 LIVE', color: 'bg-red-500 text-white' }
    case 'final':
      return { label: '结束', color: 'bg-gray-500 text-white' }
    case 'scheduled':
      return { label: '未开始', color: 'bg-blue-500 text-white' }
    case 'canceled':
      return { label: '取消', color: 'bg-orange-500 text-white' }
    default:
      return { label: status, color: 'bg-gray-400 text-white' }
  }
}

/**
 * 解析种子排名（例如 "1" → "1 号种子"）
 */
export function formatSeed(seed?: number): string {
  if (!seed) return ''
  return `#${seed}`
}
