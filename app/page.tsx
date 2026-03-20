export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-ncaa-blue mb-2">
            🏀 March Madness Hub
          </h1>
          <p className="text-gray-600">
            NCAA 男子篮球锦标赛赛程中心
          </p>
        </header>

        {/* Live Score Banner (占位) */}
        <div className="bg-ncaa-orange text-white p-3 rounded-lg mb-6 text-center">
          <p className="animate-pulse">🔴 比赛日即将到来 - 敬请期待实时比分</p>
        </div>

        {/* 今日赛程 (占位) */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            📅 今日赛程
            <span className="text-sm font-normal text-gray-500">3 月 21 日</span>
          </h2>
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
            <p>赛程数据加载中...</p>
            <p className="text-sm mt-2">即将接入 ESPN API</p>
          </div>
        </section>

        {/* 功能导航 */}
        <section className="grid md:grid-cols-3 gap-4 mb-8">
          <a href="/bracket" className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <div className="text-3xl mb-2">🏆</div>
            <h3 className="font-bold text-lg">完整对阵图</h3>
            <p className="text-sm text-gray-500">查看 68 支球队晋级路径</p>
          </a>
          <div className="bg-white p-6 rounded-lg shadow opacity-50">
            <div className="text-3xl mb-2">📺</div>
            <h3 className="font-bold text-lg">直播导航</h3>
            <p className="text-sm text-gray-500">即将上线</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow opacity-50">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-bold text-lg">赔率对比</h3>
            <p className="text-sm text-gray-500">即将上线</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm">
          <p>🚧 开发中 - Phase 1: 赛程中心</p>
          <p className="mt-2">
            <a href="https://github.com/zhiliao666/march-madness-hub" 
               className="text-ncaa-blue hover:underline"
               target="_blank"
               rel="noopener noreferrer">
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
