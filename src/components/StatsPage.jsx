import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import personalities from '../data/personalities'
import { getLocalResults, fetchGlobalStats } from '../utils/analytics'

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
}

export default function StatsPage({ onBack }) {
  const [globalStats, setGlobalStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const localResults = getLocalResults()

  useEffect(() => {
    fetchGlobalStats().then((stats) => {
      setGlobalStats(stats)
      setLoading(false)
    })
  }, [])

  return (
    <motion.div
      className="min-h-screen px-4 py-8 max-w-lg mx-auto"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">数据看板</h1>
          <p className="text-xs text-slate-500 mt-1">股商测试 MBTI 运行数据</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-slate-600 text-slate-400 hover:text-white text-sm transition-colors"
        >
          ← 返回
        </button>
      </motion.div>

      {/* ── 全局统计卡片 ── */}
      <motion.div variants={fadeUp} className="mb-4">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          全局统计 {loading && '(加载中...)'}
        </h3>
        {globalStats?.note && (
          <div className="glass-card rounded-xl p-3 mb-3 bg-gold/5 border border-gold/20">
            <p className="text-xs text-gold/80">{globalStats.note}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-2.5">
          <StatCard
            icon="👀"
            label="总访问量"
            value={globalStats?.totalVisits ?? '-'}
            color="text-blue-400"
          />
          <StatCard
            icon="🚀"
            label="开始测试"
            value={globalStats?.totalStarts ?? '-'}
            color="text-gold"
          />
          <StatCard
            icon="✅"
            label="完成测试"
            value={globalStats?.totalCompletes ?? '-'}
            color="text-green-400"
          />
          <StatCard
            icon="📊"
            label="完成率"
            value={globalStats?.completionRate != null ? `${globalStats.completionRate}%` : '-'}
            color="text-purple-400"
          />
        </div>
        {globalStats?.avgDuration > 0 && (
          <div className="glass-card rounded-xl p-3.5 mt-2.5 text-center">
            <span className="text-xs text-slate-500">平均测试时长：</span>
            <span className="text-sm text-slate-300 font-medium">
              {globalStats.avgDurationFormatted}
            </span>
          </div>
        )}
      </motion.div>

      {/* ── 人格类型分布 ── */}
      {globalStats?.typeDistribution && Object.keys(globalStats.typeDistribution).length > 0 && (
        <motion.div variants={fadeUp} className="mb-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            人格类型分布
          </h3>
          <div className="glass-card rounded-2xl p-4">
            <div className="space-y-2">
              {Object.entries(globalStats.typeDistribution)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 10)
                .map(([code, count]) => {
                  const p = personalities[code]
                  const maxCount = Math.max(...Object.values(globalStats.typeDistribution))
                  const barW = (count / maxCount) * 100
                  return (
                    <div key={code} className="flex items-center gap-2">
                      <span className="text-sm w-8 shrink-0">{p?.emoji || '❓'}</span>
                      <span className="text-xs text-slate-300 w-20 shrink-0 truncate">
                        {p?.name || code}
                      </span>
                      <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${barW}%`,
                            backgroundColor: p?.color || '#64748B',
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 w-8 text-right">{count}</span>
                    </div>
                  )
                })}
            </div>
          </div>
        </motion.div>
      )}

      {/* ── 今日统计 ── */}
      {globalStats?.today && (
        <motion.div variants={fadeUp} className="mb-4">
          <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
            今日数据
          </h3>
          <div className="grid grid-cols-3 gap-2.5">
            <StatCard icon="👀" label="访问" value={globalStats.today.visits} color="text-blue-400" small />
            <StatCard icon="🚀" label="开始" value={globalStats.today.starts} color="text-gold" small />
            <StatCard icon="✅" label="完成" value={globalStats.today.completes} color="text-green-400" small />
          </div>
        </motion.div>
      )}

      {/* ── 你的测试记录 ── */}
      <motion.div variants={fadeUp}>
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          你的测试记录
        </h3>
        {localResults.length === 0 ? (
          <div className="glass-card rounded-xl p-5 text-center">
            <p className="text-sm text-slate-500">还没有测试记录</p>
            <button
              onClick={onBack}
              className="mt-2 px-4 py-2 rounded-xl bg-gold/20 text-gold text-sm hover:bg-gold/30 transition-colors"
            >
              去测试
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {localResults
              .slice()
              .reverse()
              .map((r, i) => {
                const p = personalities[r.typeCode]
                return (
                  <div key={i} className="glass-card rounded-xl p-3 flex items-center gap-3">
                    <span className="text-2xl">{p?.emoji || '🧠'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200">
                        {p?.name || r.typeCode}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(r.timestamp).toLocaleString('zh-CN')} · 用时 {formatDuration(r.duration)}
                      </p>
                    </div>
                    <span
                      className="text-xs px-2 py-0.5 rounded-md font-mono"
                      style={{ backgroundColor: (p?.color || '#64748B') + '20', color: p?.color }}
                    >
                      {r.typeCode}
                    </span>
                  </div>
                )
              })}
          </div>
        )}
      </motion.div>

      <div className="pb-12" />
    </motion.div>
  )
}

function StatCard({ icon, label, value, color = 'text-slate-300', small = false }) {
  return (
    <div className="glass-card rounded-xl p-3 text-center">
      <div className={`text-lg mb-1`}>{icon}</div>
      <div className={`font-bold ${small ? 'text-lg' : 'text-2xl'} ${color}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}

function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '--'
  if (seconds < 60) return `${seconds}秒`
  const min = Math.floor(seconds / 60)
  const sec = seconds % 60
  return sec > 0 ? `${min}分${sec}秒` : `${min}分钟`
}
