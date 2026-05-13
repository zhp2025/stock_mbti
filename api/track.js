/**
 * Vercel Serverless Function — 分析事件采集
 *
 * 接收前端上报的事件，写入 Vercel KV。
 * 如果 KV 未配置，降级为仅打印日志。
 *
 * POST /api/track
 * Body: { event: string, data: object, timestamp: number, sessionId: string }
 */

let kv = null
try {
  const { kv: vkv } = require('@vercel/kv')
  kv = vkv
} catch {
  // KV 未配置时降级
}

// 汇总存储的 key 前缀
const STATS_PREFIX = 'gushang:stats:'
// 每日统计 key（自动过期，保留90天）
const DAILY_PREFIX = 'gushang:daily:'

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { event, data, timestamp, sessionId } = req.body || {}

    if (!event) {
      return res.status(400).json({ error: 'Missing event type' })
    }

    // 记录到服务端日志（Vercel 控制台可查）
    console.log(`[Analytics] ${event}`, JSON.stringify({ data, sessionId }))

    if (kv) {
      const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
      const now = Date.now()

      // ── 原子递增总计数器 ──
      const pipeline = kv.pipeline()

      if (event === 'page_view') {
        pipeline.incr(`${STATS_PREFIX}total_visits`)
        pipeline.incr(`${DAILY_PREFIX}${today}:visits`)
      }

      if (event === 'test_start') {
        pipeline.incr(`${STATS_PREFIX}total_starts`)
        pipeline.incr(`${DAILY_PREFIX}${today}:starts`)
      }

      if (event === 'test_complete') {
        pipeline.incr(`${STATS_PREFIX}total_completes`)
        pipeline.incr(`${DAILY_PREFIX}${today}:completes`)

        // 记录测试时长
        if (data?.duration) {
          pipeline.incrby(`${STATS_PREFIX}total_duration`, data.duration)
          pipeline.incr(`${STATS_PREFIX}total_count`)
          pipeline.incrby(`${DAILY_PREFIX}${today}:duration`, data.duration)
          pipeline.incr(`${DAILY_PREFIX}${today}:count`)
        }

        // 记录人格类型分布
        if (data?.typeCode) {
          pipeline.incr(`${STATS_PREFIX}type:${data.typeCode}`)
          pipeline.incr(`${DAILY_PREFIX}${today}:type:${data.typeCode}`)
        }
      }

      // 记录 session
      if (sessionId) {
        pipeline.set(`${STATS_PREFIX}session:${sessionId}`, now, { ex: 86400 })
      }

      await pipeline.exec()
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[Analytics Error]', err)
    return res.status(500).json({ error: 'Internal error', ok: false })
  }
}
