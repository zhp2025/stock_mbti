/**
 * Vercel Serverless Function — 统计数据查询
 *
 * GET /api/stats
 * 返回汇总统计：总访问量、总测试数、人格分布、平均时长、今日数据
 */

let kv = null
try {
  const { kv: vkv } = require('@vercel/kv')
  kv = vkv
} catch {}

const STATS_PREFIX = 'gushang:stats:'
const DAILY_PREFIX = 'gushang:daily:'
const TYPE_CODES = [
  'ITDS', 'ITDL', 'ITES', 'ITEL',
  'IVDS', 'IVDL', 'IVES', 'IVEL',
  'HTDS', 'HTDL', 'HTES', 'HTEL',
  'HVDS', 'HVDL', 'HVES', 'HVEL',
]

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  const today = new Date().toISOString().slice(0, 10)

  try {
    // 如果没有 KV，返回默认值
    if (!kv) {
      return res.status(200).json({
        totalVisits: 0,
        totalStarts: 0,
        totalCompletes: 0,
        avgDuration: 0,
        typeDistribution: {},
        today: { visits: 0, starts: 0, completes: 0 },
        note: 'Vercel KV 未配置，数据显示为0。部署后请在 Vercel Dashboard 中创建 KV 数据库。',
      })
    }

    // ── 批量读取 ──
    const keys = [
      `${STATS_PREFIX}total_visits`,
      `${STATS_PREFIX}total_starts`,
      `${STATS_PREFIX}total_completes`,
      `${STATS_PREFIX}total_duration`,
      `${STATS_PREFIX}total_count`,
      ...TYPE_CODES.map((t) => `${STATS_PREFIX}type:${t}`),
      `${DAILY_PREFIX}${today}:visits`,
      `${DAILY_PREFIX}${today}:starts`,
      `${DAILY_PREFIX}${today}:completes`,
    ]

    const values = await kv.mget(...keys)

    const totalVisits = Number(values[0]) || 0
    const totalStarts = Number(values[1]) || 0
    const totalCompletes = Number(values[2]) || 0
    const totalDuration = Number(values[3]) || 0
    const totalCount = Number(values[4]) || 0

    const typeDistribution = {}
    TYPE_CODES.forEach((t, i) => {
      const count = Number(values[5 + i]) || 0
      if (count > 0) typeDistribution[t] = count
    })

    // 转换率
    const completionRate = totalStarts > 0
      ? Math.round((totalCompletes / totalStarts) * 100)
      : 0

    // 平均时长（秒）
    const avgDuration = totalCount > 0
      ? Math.round(totalDuration / totalCount)
      : 0

    const todayStats = {
      visits: Number(values[21]) || 0,
      starts: Number(values[22]) || 0,
      completes: Number(values[23]) || 0,
    }

    return res.status(200).json({
      totalVisits,
      totalStarts,
      totalCompletes,
      completionRate,
      avgDuration,
      avgDurationFormatted: formatDuration(avgDuration),
      totalCount,
      typeDistribution,
      today: todayStats,
    })
  } catch (err) {
    console.error('[Stats Error]', err)
    return res.status(500).json({ error: 'Internal error' })
  }
}

function formatDuration(seconds) {
  if (seconds < 60) return `${seconds}秒`
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return `${min}分${sec}秒`
}
