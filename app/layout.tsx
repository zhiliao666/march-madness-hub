import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'March Madness Hub | NCAA 篮球锦标赛赛程中心',
  description: '🏀 March Madness 实时比分、完整对阵图、资源导航 - 一站式追踪 NCAA 男子篮球锦标赛',
  keywords: ['March Madness', 'NCAA', '篮球', '赛程', '比分', '对阵图'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
