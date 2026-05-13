/**
 * OG 分享卡片图片 API
 * 返回内嵌 SVG（零原生依赖，社交平台兼容）
 */

export default function handler(req, res) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>
    <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#EF4444"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <g opacity="0.04">
    <line x1="0" y1="200" x2="1200" y2="200" stroke="white" stroke-width="1"/>
    <line x1="0" y1="400" x2="1200" y2="400" stroke="white" stroke-width="1"/>
    <line x1="400" y1="0" x2="400" y2="630" stroke="white" stroke-width="1"/>
    <line x1="800" y1="0" x2="800" y2="630" stroke="white" stroke-width="1"/>
  </g>
  <g opacity="0.15">
    <rect x="60" y="350" width="6" height="160" rx="1" fill="#EF4444"/>
    <line x1="63" y1="340" x2="63" y2="520" stroke="#EF4444" stroke-width="1"/>
    <rect x="80" y="380" width="6" height="100" rx="1" fill="#10B981"/>
    <line x1="83" y1="370" x2="83" y2="490" stroke="#10B981" stroke-width="1"/>
    <rect x="100" y="320" width="6" height="200" rx="1" fill="#EF4444"/>
    <line x1="103" y1="310" x2="103" y2="530" stroke="#EF4444" stroke-width="1"/>
    <rect x="1080" y="360" width="6" height="150" rx="1" fill="#10B981"/>
    <line x1="1083" y1="350" x2="1083" y2="520" stroke="#10B981" stroke-width="1"/>
    <rect x="1100" y="330" width="6" height="180" rx="1" fill="#EF4444"/>
    <line x1="1103" y1="320" x2="1103" y2="520" stroke="#EF4444" stroke-width="1"/>
    <rect x="1140" y="310" width="6" height="200" rx="1" fill="#EF4444"/>
    <line x1="1143" y1="300" x2="1143" y2="520" stroke="#EF4444" stroke-width="1"/>
  </g>
  <text x="600" y="170" text-anchor="middle" font-size="72" font-weight="900" fill="white" font-family="system-ui,sans-serif">股商测试 MBTI</text>
  <text x="600" y="245" text-anchor="middle" font-size="28" fill="url(#g1)" font-weight="700" font-family="system-ui,sans-serif">测测你的投资人格</text>
  <text x="600" y="310" text-anchor="middle" font-size="18" fill="#94A3B8" font-family="system-ui,sans-serif">4大维度 · 16型人格 · 24道高能题目</text>
  <g transform="translate(380, 355)">
    <rect x="0" y="0" width="130" height="36" rx="18" fill="none" stroke="#F59E0B" stroke-width="1.5" opacity="0.4"/>
    <text x="65" y="25" text-anchor="middle" font-size="14" fill="#F59E0B" font-family="system-ui,sans-serif">🧠 独立vs跟风</text>
  </g>
  <g transform="translate(530, 355)">
    <rect x="0" y="0" width="130" height="36" rx="18" fill="none" stroke="#3B82F6" stroke-width="1.5" opacity="0.4"/>
    <text x="65" y="25" text-anchor="middle" font-size="14" fill="#3B82F6" font-family="system-ui,sans-serif">📊 技术vs价值</text>
  </g>
  <g transform="translate(380, 405)">
    <rect x="0" y="0" width="130" height="36" rx="18" fill="none" stroke="#EF4444" stroke-width="1.5" opacity="0.4"/>
    <text x="65" y="25" text-anchor="middle" font-size="14" fill="#EF4444" font-family="system-ui,sans-serif">⚔️ 纪律vs情绪</text>
  </g>
  <g transform="translate(530, 405)">
    <rect x="0" y="0" width="130" height="36" rx="18" fill="none" stroke="#10B981" stroke-width="1.5" opacity="0.4"/>
    <text x="65" y="25" text-anchor="middle" font-size="14" fill="#10B981" font-family="system-ui,sans-serif">⚡ 短线vs长期</text>
  </g>
  <text x="600" y="500" text-anchor="middle" font-size="22" fill="#64748B" font-family="system-ui,sans-serif">看看你是「巴菲特分特」还是「韭菜特种兵」？</text>
  <text x="600" y="555" text-anchor="middle" font-size="16" fill="#475569" font-family="system-ui,sans-serif">gushang-mbti.vercel.app</text>
  <text x="60" y="80" font-size="36" opacity="0.3">📈</text>
  <text x="1120" y="80" font-size="36" opacity="0.3">📉</text>
</svg>`

  res.setHeader('Content-Type', 'image/svg+xml')
  res.setHeader('Cache-Control', 'public, max-age=86400')
  return res.send(svg)
}
