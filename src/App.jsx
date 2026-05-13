import { useState, useCallback, useRef, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Analytics } from '@vercel/analytics/react'
import WelcomePage from './components/WelcomePage'
import QuizPage from './components/QuizPage'
import ResultPage from './components/ResultPage'
import StatsPage from './components/StatsPage'
import { calculateScores } from './utils/scoring'
import { trackPageView, trackTestStart, trackTestComplete } from './utils/analytics'
import personalities from './data/personalities'

const PAGES = { WELCOME: 'welcome', QUIZ: 'quiz', RESULT: 'result', STATS: 'stats' }

export default function App() {
  const [page, setPage] = useState(PAGES.WELCOME)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const startTimeRef = useRef(null)

  // 记录页面浏览
  useEffect(() => {
    trackPageView()
  }, [])

  const handleStart = useCallback(() => {
    startTimeRef.current = Date.now()
    trackTestStart()
    setPage(PAGES.QUIZ)
  }, [])

  const handleComplete = useCallback((finalAnswers) => {
    const duration = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 0
    const scores = calculateScores(finalAnswers)
    setAnswers(finalAnswers)
    setResult(scores)
    setPage(PAGES.RESULT)

    // 追踪测试完成
    const p = personalities[scores.typeCode]
    trackTestComplete(scores.typeCode, p?.name || '', duration)
  }, [])

  const handleRestart = useCallback(() => {
    setAnswers({})
    setResult(null)
    startTimeRef.current = null
    setPage(PAGES.WELCOME)
  }, [])

  const handleViewStats = useCallback(() => {
    setPage(PAGES.STATS)
  }, [])

  const handleBackFromStats = useCallback(() => {
    setPage(PAGES.WELCOME)
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg">
      <AnimatePresence mode="wait">
        {page === PAGES.WELCOME && (
          <WelcomePage
            key="welcome"
            onStart={handleStart}
            onViewStats={handleViewStats}
          />
        )}
        {page === PAGES.QUIZ && (
          <QuizPage key="quiz" onComplete={handleComplete} />
        )}
        {page === PAGES.RESULT && result && (
          <ResultPage
            key="result"
            result={result}
            onRestart={handleRestart}
          />
        )}
        {page === PAGES.STATS && (
          <StatsPage key="stats" onBack={handleBackFromStats} />
        )}
      </AnimatePresence>
      <Analytics />
    </div>
  )
}
