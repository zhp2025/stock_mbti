import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts'
import personalities from '../data/personalities'
import { getRadarData } from '../utils/scoring'

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

export default function ResultPage({ result, onRestart }) {
  const { typeCode, percentages } = result
  const personality = personalities[typeCode]
  const radarData = getRadarData(percentages)
  const [shareMsg, setShareMsg] = useState('')

  const shareText = `${personality.emoji} 我的投资人格是「${personality.name}」\n"${personality.tagline}"\n\n测测你是什么类型的股民？`
  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
      setShareMsg('已复制！去朋友圈/炒股群晒一晒 🚀')
      setTimeout(() => setShareMsg(''), 2000)
    } catch {
      setShareMsg('复制失败，请截图分享')
      setTimeout(() => setShareMsg(''), 2000)
    }
  }, [shareText, shareUrl])

  return (
    <motion.div
      className="min-h-screen px-4 py-8 max-w-lg mx-auto"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.1 } } }}
    >
      {/* ── 区段1: 核心结果（3秒获取核心信息）── */}
      <motion.div variants={fadeUp} className="text-center mb-6">
        <div className="text-slate-500 text-sm mb-2">你的投资人格是</div>
        <motion.div
          className="text-7xl mb-3"
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {personality.emoji}
        </motion.div>
        <h1 className="text-3xl font-black mb-2">{personality.name}</h1>
        <div className="inline-block px-3 py-1 rounded-full bg-slate-700/50 text-slate-400 text-xs font-mono mb-3">
          {typeCode}
        </div>
        <p className="text-slate-300 leading-relaxed italic text-sm max-w-sm mx-auto">
          "{personality.tagline}"
        </p>
      </motion.div>

      {/* ── 区段2: 扎心金句 ── */}
      <motion.div
        variants={fadeUp}
        className="glass-card rounded-2xl p-5 mb-5 border-l-4"
        style={{ borderLeftColor: personality.color }}
      >
        <div className="flex items-start gap-2">
          <span className="text-lg">💉</span>
          <div>
            <p className="text-xs text-slate-500 mb-1">扎心真相</p>
            <p className="text-sm text-slate-200 leading-relaxed italic">
              {personality.gutPunch}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── 区段3: 完整描述 ── */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 mb-5">
        <p className="text-sm text-slate-300 leading-relaxed">
          {personality.description}
        </p>
      </motion.div>

      {/* ── 区段4: 投资数据快照 ── */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 mb-5">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
          投资档案
        </h3>
        <div className="space-y-2.5">
          <StatRow icon="⏱️" label="典型持仓周期" value={personality.holdingPeriod} />
          <StatRow icon="📦" label="仓位特征" value={personality.positionStyle} />
          <StatRow icon="💸" label="常见亏损原因" value={personality.lossReason} color="bear-green" />
        </div>
      </motion.div>

      {/* ── 区段5: 雷达图 ── */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl p-4 mb-5">
        <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 text-center">
          四维分析
        </h3>
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
            <PolarGrid stroke="#334155" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: '#64748B', fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="你的倾向"
              dataKey="value"
              stroke={personality.color}
              fill={personality.color}
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-3">
          {Object.entries({
            D1: ['独立分析 ↔ 跟风从众', percentages.D1],
            D2: ['技术博弈 ↔ 价值发现', percentages.D2],
            D3: ['纪律至上 ↔ 情绪驱动', percentages.D3],
            D4: ['短线猎手 ↔ 长期主义', percentages.D4],
          }).map(([key, [label, pct]]) => {
            const leftW = 100 - pct
            const rightW = pct
            return (
              <div key={key} className="bg-slate-800/50 rounded-lg p-2.5">
                <div className="text-xs text-slate-500 mb-1">{label}</div>
                <div className="flex h-2 rounded-full overflow-hidden bg-slate-700">
                  <div
                    className="bg-blue-500 transition-all"
                    style={{ width: `${leftW}%` }}
                  />
                  <div
                    className="bg-orange-500 transition-all"
                    style={{ width: `${rightW}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-0.5">
                  <span className="text-blue-400">{label.split('↔')[0].trim()}</span>
                  <span className="text-orange-400">{label.split('↔')[1].trim()}</span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* ── 区段6: 优势 & 劣势 ── */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 mb-5">
        <div className="glass-card rounded-2xl p-4">
          <h4 className="text-xs font-medium text-bull-red mb-2">优势</h4>
          <ul className="space-y-1.5">
            {personality.strengths.map((s) => (
              <li key={s} className="text-xs text-slate-400 flex items-start gap-1">
                <span className="text-bull-red mt-0.5 shrink-0">+</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card rounded-2xl p-4">
          <h4 className="text-xs font-medium text-bear-green mb-2">劣势</h4>
          <ul className="space-y-1.5">
            {personality.weaknesses.map((w) => (
              <li key={w} className="text-xs text-slate-400 flex items-start gap-1">
                <span className="text-bear-green mt-0.5 shrink-0">-</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* ── 区段7: 适配策略 + 进阶路线 ── */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 mb-5">
        <div className="mb-4">
          <h4 className="text-xs font-medium text-gold mb-1.5">适配策略</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{personality.bestStrategy}</p>
        </div>
        <div className="bg-slate-800/50 rounded-xl p-3.5">
          <h4 className="text-xs font-medium text-blue-400 mb-1.5">进阶路线</h4>
          <p className="text-xs text-slate-400 leading-relaxed">{personality.upgradePath}</p>
        </div>
      </motion.div>

      {/* ── 区段8: 炒股搭子 ── */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 mb-5">
        <h4 className="text-xs font-medium text-slate-500 mb-2">最佳炒股搭子</h4>
        <div className="flex items-start gap-3">
          <span className="text-3xl">
            {personalities[personality.partner.type]?.emoji || '🤝'}
          </span>
          <div>
            <p className="text-sm font-medium text-slate-200">
              {personality.partner.name}
            </p>
            <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
              {personality.partner.reason}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── 区段9: 对标投资者 ── */}
      <motion.div variants={fadeUp} className="glass-card rounded-2xl p-5 mb-6">
        <h4 className="text-xs font-medium text-slate-500 mb-3">对标参考</h4>
        <p className="text-xs text-slate-400 mb-2">{personality.famousMatch}</p>
        <p className="text-xs text-slate-500 leading-relaxed">{personality.localMatch}</p>
        {personality.tip && (
          <div className="mt-3 p-3 rounded-xl bg-gold/5 border border-gold/20">
            <p className="text-xs text-gold/80">{personality.tip}</p>
          </div>
        )}
      </motion.div>

      {/* ── 区段10: 分享 & 重测 ── */}
      <motion.div variants={fadeUp} className="flex gap-3 mb-4">
        <button
          onClick={handleCopyLink}
          className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-gold to-bull-red text-white font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all active:scale-95"
        >
          复制文案 · 晒结果
        </button>
        <button
          onClick={onRestart}
          className="px-5 py-3.5 rounded-xl border border-slate-600 hover:border-slate-400 text-slate-400 hover:text-white transition-colors text-sm"
        >
          再测一次
        </button>
      </motion.div>

      {shareMsg && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-gold text-sm mb-4"
        >
          {shareMsg}
        </motion.div>
      )}

      <p className="text-center text-slate-700 text-xs pb-8">
        本测试仅供娱乐参考，不构成任何投资建议。投资有风险，入市需谨慎。股市有风险，梭哈需三思。
      </p>
    </motion.div>
  )
}

/** 投资档案数据行 */
const COLOR_MAP = { 'slate-300': '#CBD5E1', 'bear-green': '#10B981' }

function StatRow({ icon, label, value, color = 'slate-300' }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="text-sm shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <span className="text-xs text-slate-500">{label}</span>
        <p className="text-xs leading-relaxed" style={{ color: COLOR_MAP[color] || '#CBD5E1' }}>
          {value}
        </p>
      </div>
    </div>
  )
}
