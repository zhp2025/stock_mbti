import { motion } from 'framer-motion'

const tickerSymbols = [
  { name: '贵州茅台', change: '+2.35%', up: true },
  { name: '宁德时代', change: '+5.67%', up: true },
  { name: '比亚迪', change: '-1.23%', up: false },
  { name: '隆基绿能', change: '+3.89%', up: true },
  { name: '中芯国际', change: '-0.56%', up: false },
  { name: '药明康德', change: '+7.12%', up: true },
  { name: '腾讯控股', change: '+1.88%', up: true },
  { name: '美团-W', change: '-2.34%', up: false },
]

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -30 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } },
}

export default function WelcomePage({ onStart, onViewStats }) {
  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      {/* Ticker tape */}
      <div className="ticker-wrap w-full mb-8 opacity-30">
        <div className="ticker-content flex gap-8 text-sm">
          {[...tickerSymbols, ...tickerSymbols].map((s, i) => (
            <span key={i} className={s.up ? 'text-bull-red' : 'text-bear-green'}>
              {s.name} {s.change}
            </span>
          ))}
        </div>
      </div>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="text-center max-w-lg"
      >
        {/* Badge */}
        <motion.div
          variants={fadeUp}
          className="inline-block mb-6 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-sm font-medium"
        >
          2026 最懂散户的投资人格测试
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-6xl font-black mb-4 tracking-tight"
        >
          股商测试
          <span className="gradient-text block text-3xl md:text-4xl mt-2">
            MBTI
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className="text-slate-400 text-lg mb-2"
        >
          24道高能题目 · 精准定位你的投资人格
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="text-slate-500 text-sm mb-10"
        >
          看看你是「巴菲特分特」还是「韭菜特种兵」？
        </motion.p>

        {/* Features */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          {[
            { icon: '🧠', label: '4大维度' },
            { icon: '🎭', label: '16型人格' },
            { icon: '📊', label: '深度分析' },
          ].map((f) => (
            <div key={f.label} className="glass-card rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-xs text-slate-400">{f.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.button
          variants={fadeUp}
          onClick={onStart}
          className="animate-pulse-gold px-10 py-4 rounded-2xl bg-gradient-to-r from-gold to-bull-red text-white text-xl font-bold shadow-2xl hover:scale-105 active:scale-95 transition-transform"
        >
          开始测试
        </motion.button>

        <motion.p
          variants={fadeUp}
          className="text-slate-600 text-xs mt-4"
        >
          大约需要 3-5 分钟 · 全程无广告
        </motion.p>

        {/* Stats link */}
        {onViewStats && (
          <motion.button
            variants={fadeUp}
            onClick={onViewStats}
            className="text-slate-600 hover:text-slate-400 text-xs mt-3 underline underline-offset-4 transition-colors"
          >
            查看数据看板
          </motion.button>
        )}
      </motion.div>

      {/* Bottom K-line decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-16 opacity-10 flex items-end gap-px">
        {Array.from({ length: 60 }).map((_, i) => {
          const h = 20 + Math.sin(i * 0.3) * 15 + Math.random() * 25
          const isUp = Math.random() > 0.45
          return (
            <div
              key={i}
              className={`flex-1 rounded-t-sm ${isUp ? 'bg-bull-red' : 'bg-bear-green'}`}
              style={{ height: `${h}%` }}
            />
          )
        })}
      </div>
    </motion.div>
  )
}
