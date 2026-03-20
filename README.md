# 🏀 March Madness Hub

March Madness 赛程中心 - 实时比分、对阵图、资源导航

## 🎯 项目定位

为 NCAA 男子篮球锦标赛（March Madness）提供一站式信息聚合服务：
- 📅 完整赛程表
- 📊 实时比分更新
- 🏆 交互式对阵图
- 🔗 资源导航（直播、博彩、专家预测）

## 🗓️ 开发计划

### Phase 1: 赛程中心 (MVP)
- [ ] 数据源接入（ESPN API / NCAA Stats）
- [ ] 今日赛程展示
- [ ] 实时比分更新
- [ ] 完整对阵图

### Phase 2: 资源导航
- [ ] 直播链接汇总
- [ ] 博彩赔率对比
- [ ] 专家预测聚合

### Phase 3: 互动功能
- [ ] 用户投票预测
- [ ] 邮件订阅
- [ ] 社交分享

## 🛠️ 技术栈

- **Frontend**: Next.js 14 + Tailwind CSS
- **Backend**: Supabase (数据库 + 实时订阅)
- **Deployment**: Vercel
- **Data Sources**: ESPN API, The Odds API

## 📦 项目结构

```
march-madness-hub/
├── app/                    # Next.js 14 App Router
│   ├── page.tsx           # 首页（赛程中心）
│   ├── bracket/           # 对阵图页面
│   ├── games/             # 比赛详情页
│   └── api/               # API 路由
├── components/             # React 组件
│   ├── ScheduleCard.tsx   # 赛程卡片
│   ├── Bracket.tsx        # 对阵图
│   └── LiveScore.tsx      # 实时比分
├── lib/                    # 工具函数
│   ├── espn-api.ts        # ESPN API 封装
│   └── utils.ts
├── types/                  # TypeScript 类型定义
└── supabase/              # Supabase 配置
```

## 🚀 快速开始

```bash
# 克隆项目
git clone https://github.com/zhiliao666/march-madness-hub.git
cd march-madness-hub

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的 API keys

# 开发模式
npm run dev

# 构建
npm run build
```

## 📄 License

MIT

---

🏀 Let's fill out that bracket!
