import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import questions from '../data/questions'

const TOTAL = questions.length

const likertOptions = [
  { value: 1, label: '非常不同意', emoji: '🙅' },
  { value: 2, label: '比较不同意', emoji: '🤔' },
  { value: 3, label: '一般/不确定', emoji: '😐' },
  { value: 4, label: '比较同意', emoji: '👍' },
  { value: 5, label: '非常同意', emoji: '💯' },
]

const slideVariants = {
  enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
}

export default function QuizPage({ onComplete }) {
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [direction, setDirection] = useState(0)
  const [selectedScore, setSelectedScore] = useState(null)

  const question = questions[current]
  const progress = ((current + (answers[question.id] ? 1 : 0)) / TOTAL) * 100

  const goNext = useCallback(() => {
    if (selectedScore === null) return

    const newAnswers = { ...answers, [question.id]: selectedScore }
    setAnswers(newAnswers)

    if (current < TOTAL - 1) {
      setDirection(1)
      setCurrent(current + 1)
      setSelectedScore(newAnswers[questions[current + 1].id] || null)
    } else {
      onComplete(newAnswers)
    }
  }, [current, selectedScore, answers, question.id, onComplete])

  const goPrev = useCallback(() => {
    if (current > 0) {
      setDirection(-1)
      setCurrent(current - 1)
      setSelectedScore(answers[questions[current - 1].id] || null)
    }
  }, [current, answers])

  // 键盘快捷操作
  const handleKeyDown = useCallback((e) => {
    if (e.key >= '1' && e.key <= '5') {
      setSelectedScore(Number(e.key))
    } else if (e.key === 'Enter' && selectedScore !== null) {
      goNext()
    }
  }, [selectedScore, goNext])

  return (
    <div
      className="min-h-screen flex flex-col px-4 py-6 max-w-lg mx-auto"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header: progress + question counter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-500 text-sm">
            第 {current + 1}/{TOTAL} 题
          </span>
          <span className="text-slate-500 text-sm">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gold to-bull-red rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="flex-1"
          >
            {/* Tags */}
            <div className="flex gap-2 mb-4">
              {question.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 rounded-full bg-slate-700/50 text-slate-400 text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Question text */}
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="text-4xl mb-4">{question.emoji}</div>
              <p className="text-lg leading-relaxed text-slate-200">
                {question.text}
              </p>
            </div>

            {/* Likert scale */}
            <div className="space-y-2">
              {likertOptions.map((opt) => {
                const isSelected = selectedScore === opt.value
                return (
                  <motion.button
                    key={opt.value}
                    onClick={() => setSelectedScore(opt.value)}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-gold bg-gold/10 shadow-lg shadow-gold/20'
                        : 'border-slate-700/50 hover:border-slate-500 bg-transparent'
                    }`}
                  >
                    <span className="text-lg">{opt.emoji}</span>
                    <span className={`text-sm ${isSelected ? 'text-gold font-medium' : 'text-slate-400'}`}>
                      {opt.label}
                    </span>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-6 h-6 rounded-full bg-gold flex items-center justify-center text-dark-bg text-xs font-bold"
                      >
                        {opt.value}
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer: navigation */}
      <div className="flex gap-3 mt-6 pb-6">
        {current > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={goPrev}
            className="px-6 py-3 rounded-xl border border-slate-600 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
          >
            ← 上一题
          </motion.button>
        )}

        <motion.button
          onClick={goNext}
          disabled={selectedScore === null}
          whileTap={selectedScore !== null ? { scale: 0.97 } : {}}
          className={`flex-1 py-3 rounded-xl font-bold text-base transition-all ${
            selectedScore !== null
              ? 'bg-gradient-to-r from-gold to-bull-red text-white shadow-lg hover:shadow-xl cursor-pointer'
              : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
          }`}
        >
          {current === TOTAL - 1 ? '查看结果 →' : '下一题 →'}
        </motion.button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-slate-600 text-xs pb-2">
        按 1-5 选择 · Enter 确认
      </p>
    </div>
  )
}
