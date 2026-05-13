# 股商测试 MBTI — 部署指南

## 一、一键部署到 Vercel（推荐）

### 1.1 准备工作

```bash
# 确保代码已推到 GitHub
cd D:\gushang_test
git init
git add -A
git commit -m "股商测试MBTI v1.0"
# 在 GitHub 创建仓库，然后：
git remote add origin https://github.com/你的用户名/仓库名.git
git branch -M main
git push -u origin main
```

### 1.2 Vercel 部署

1. 打开 [vercel.com](https://vercel.com)，使用 GitHub 账号登录
2. 点击 **New Project** → 选择你的 GitHub 仓库
3. 框架自动识别为 **Vite**，无需修改配置
4. 点击 **Deploy**，等待 30 秒即可上线
5. 你会得到一个免费域名：`https://gushang-mbti.vercel.app`

### 1.3 配置 Vercel KV（分析数据库）

分析系统需要 Vercel KV 存储统计数据：

1. 进入 Vercel Dashboard → 你的项目 → **Storage** 标签
2. 点击 **Create Database** → 选择 **KV Durable (Redis)**
3. 选择 **Hobby** 计划（免费，256MB 存储）
4. 创建后，Vercel 会自动注入环境变量 `KV_URL`、`KV_REST_API_URL` 等
5. 重新部署一次：`Storage` → 点击 **Connect to Project** → 然后 Redeploy

> **不配置 KV 也能用**：没有 KV 时，分析事件会记录到 Vercel 日志（Vercel Dashboard → Logs），统计页面会显示一条提示信息。个人测试记录始终保存在浏览器 localStorage 中。

---

## 二、Vercel Analytics（零配置页面浏览统计）

Vercel Analytics 已内置在项目中。部署后自动生效：

1. 进入 Vercel Dashboard → 你的项目 → **Analytics** 标签
2. 查看页面浏览量、访问来源、设备类型等

免费额度：2500 events/月。

---

## 三、社交分享设置

### 3.1 微信分享

微信会读取页面的 `og:title`、`og:description`、`og:image` 来生成链接卡片。

**测试方法**：
1. 部署后，在微信中打开你的 Vercel 域名
2. 点击右上角「...」→「分享给朋友」或「分享到朋友圈」
3. 查看链接卡片是否正常显示标题和图片

**微信 JS-SDK（可选高级功能）**：
如需自定义分享文案（不同结果分享不同文案），需要：
1. 注册微信公众平台（需要企业资质）
2. 绑定 JS 安全域名
3. 使用 `wx.config()` 和 `wx.updateTimelineShareData()`

> 对于个人开发者，依靠 Open Graph 标签即可满足基本需求。

### 3.2 小红书分享

小红书不支持直接分享外链，用户需要通过以下方式传播：

**推荐做法**：
1. 测试完成后，点击「复制分享文案」
2. 截图结果页的「人格类型卡」
3. 在小红书发布笔记：贴上截图 + 粘贴文案
4. 加入话题 `#股商测试` `#投资人格` `#MBTI测试`

小红书上最佳流量标签建议：
```
#股商测试 #MBTI #你的16型人格 #投资 #炒股 #韭菜成长史
```

### 3.3 微博分享

微博支持链接卡片预览。复制链接到微博即可自动展开。

---

## 四、自定义域名

在 Vercel Dashboard → Settings → Domains 中添加你的域名：
1. 添加域名（如 `gushang.你的域名.com`）
2. 在域名 DNS 中添加 Vercel 提供的 CNAME 记录
3. 等待 DNS 生效后，Vercel 自动签发 SSL 证书

---

## 五、统计看板

部署后，访问 `https://你的域名/` → 页面底部「查看数据看板」进入。

统计指标包括：
- **总访问量 / 开始测试数 / 完成测试数**
- **完成率**（开始→完成转化）
- **平均测试时长**
- **人格类型分布**（Top 10 + 进度条）
- **今日数据**（访问/开始/完成）
- **你的测试记录**（localStorage，仅本设备可见）

---

## 六、项目结构总览

```
gushang_test/
├── index.html               # 入口 + 社交分享 OG 标签
├── vercel.json              # Vercel 部署配置
├── package.json
├── api/
│   ├── track.js             # 分析事件采集 API（POST）
│   ├── stats.js             # 统计数据查询 API（GET）
│   └── og.jsx               # OG 分享卡片图片生成（GET）
├── public/
│   └── share-card.svg       # 静态分享卡片（备用）
└── src/
    ├── App.jsx              # 主应用 + Vercel Analytics
    ├── components/
    │   ├── WelcomePage.jsx  # 欢迎页
    │   ├── QuizPage.jsx     # 答题页
    │   ├── ResultPage.jsx   # 结果页（10区段）
    │   └── StatsPage.jsx    # 数据看板
    ├── data/
    │   ├── questions.js     # 24道题库
    │   └── personalities.js # 16型人格
    └── utils/
        ├── scoring.js       # 评分引擎
        └── analytics.js     # 前端追踪工具
```

---

## 七、上线前检查清单

- [ ] 代码已推送到 GitHub
- [ ] Vercel 部署成功（域名可访问）
- [ ] Vercel KV 已创建并连接（可选）
- [ ] 在微信中打开链接，确认分享卡片正常显示
- [ ] 在浏览器中完成一次测试，确认统计数据正常
- [ ] OG 图片生成正常：访问 `https://你的域名/api/og` 应看到 1200×630 的分享图
- [ ] 测试「复制分享文案」功能
- [ ] 确认移动端适配（微信内置浏览器/iOS Safari/Android Chrome）

---

## 八、常见问题

**Q: 微信分享只有标题没有图片？**
A: 确保域名未被微信封禁（新 Vercel 域名通常没问题）。如果图片不显示：
1. 访问 `https://你的域名/api/og` 确认图片能正常加载
2. 微信缓存分享卡片，可以加 `?v=2` 参数强制刷新

**Q: 统计数据都是 0？**
A: 检查是否已创建 Vercel KV 数据库并连接项目。如果没有 KV，数据仅记录在 Vercel 日志中，统计页面显示为 0。

**Q: 怎么推广获得更多用户？**
A: 
1. **小红书**：发布测试结果截图 + 话题标签（流量最大）
2. **微信炒股群**：分享链接 + "测完说说你是哪种？"
3. **雪球/淘股吧**：发帖分享结果 + 链接
4. **微博**：发微博附链接 + 热门话题

**Q: Vercel 域名在国内访问慢？**
A: Vercel 的全球 CDN 在国内大部分地区可以访问。如果确实慢：
1. 考虑部署到腾讯云 EdgeOne Pages（国内加速）
2. 或使用 Cloudflare + 自定义域名
3. 或部署到阿里云 OSS + CDN

---

## 九、更新发布

代码有更新时：
```bash
git add -A
git commit -m "描述你的改动"
git push
```

Vercel 会自动检测 GitHub 推送并重新部署（无需手动操作）。
