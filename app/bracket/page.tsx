export default function BracketPage() {
  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <a href="/" className="text-ncaa-blue hover:underline mb-4 inline-block">
            ← 返回首页
          </a>
          <h1 className="text-3xl md:text-4xl font-bold text-ncaa-blue mb-2">
            🏆 完整对阵图
          </h1>
          <p className="text-gray-600">
            2026 NCAA 男子篮球锦标赛 - 68 支球队晋级之路
          </p>
        </header>

        {/* 对阵图占位 */}
        <section className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🌳</div>
          <h2 className="text-2xl font-bold mb-2">对阵图加载中</h2>
          <p className="text-gray-500 mb-4">
            即将接入 ESPN API 数据，展示完整晋级树
          </p>
          <div className="bg-bracket-bg rounded-lg p-6 mt-6">
            <p className="text-sm text-gray-600 mb-4">功能预览：</p>
            <ul className="text-left text-sm text-gray-500 space-y-2">
              <li>✓ 四个分区对阵（East, West, South, Midwest）</li>
              <li>✓ 点击球队查看详情</li>
              <li>✓ 实时更新比赛结果</li>
              <li>✓ 可下载/分享你的预测</li>
            </ul>
          </div>
        </section>

        {/* 分区导航 */}
        <section className="grid md:grid-cols-4 gap-4 mt-8">
          {['East', 'West', 'South', 'Midwest'].map((region) => (
            <div 
              key={region}
              className="bg-white p-4 rounded-lg shadow text-center opacity-50"
            >
              <h3 className="font-bold text-lg">{region}</h3>
              <p className="text-sm text-gray-500">即将上线</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  )
}
