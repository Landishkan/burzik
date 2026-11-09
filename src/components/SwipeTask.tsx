import { useState } from 'react'
import type { SwipeTask, SwipeCard } from '../content'

interface SwipeTaskProps {
  task: SwipeTask
  onAnswer: (isCorrect: boolean) => void
}

export function SwipeTask({ task, onAnswer }: SwipeTaskProps) {
  const [cardIndex, setCardIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastCardResult, setLastCardResult] = useState<{ correct: boolean; explanation: string } | null>(null)

  const currentCard = task.cards[cardIndex]

  const handleSwipe = (swipeDirection: 'left' | 'right') => {
    if (direction) return // блокируем повторные свайпы

    setDirection(swipeDirection)
    const isCorrect = 
      (swipeDirection === 'left' && currentCard.isRedFlag) ||
      (swipeDirection === 'right' && !currentCard.isRedFlag)

    const newCorrect = correctCount + (isCorrect ? 1 : 0)
    setCorrectCount(newCorrect)
    setLastCardResult({ correct: isCorrect, explanation: currentCard.explanation })
    setShowFeedback(true)

    // Через 2 секунды — переход к следующей карточке
    setTimeout(() => {
      const nextIndex = cardIndex + 1
      if (nextIndex >= task.cards.length) {
        const isOverallCorrect = newCorrect >= Math.ceil(task.cards.length / 2)
        onAnswer(isOverallCorrect)
      } else {
        setCardIndex(nextIndex)
        setDirection(null)
        setShowFeedback(false)
        setLastCardResult(null)
      }
    }, 2000)
  }

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto gap-6">
      {/* Заголовок */}
      <h3 className="text-xl font-bold text-white text-center">{task.title}</h3>

      {/* Карточка */}
      <div
        className={`relative w-full aspect-[3/4] bg-slate-800 rounded-3xl border-2 border-slate-700 p-6 flex flex-col justify-center items-center text-center shadow-2xl transition-all duration-300 ${
          direction === 'left' ? '-translate-x-full rotate-[-20deg] opacity-0' : ''
        } ${direction === 'right' ? 'translate-x-full rotate-[20deg] opacity-0' : ''}`}
      >
        <p className="text-lg text-slate-200 leading-relaxed">{currentCard.statement}</p>
        
        {/* Индикатор свайпа */}
        {direction && (
          <div className={`absolute top-4 ${direction === 'left' ? 'left-4' : 'right-4'} text-4xl`}>
            {direction === 'left' ? '🚩' : '✅'}
          </div>
        )}
      </div>

      {/* Фидбек после свайпа */}
      {showFeedback && lastCardResult && (
        <div
          className={`p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300 ${
            lastCardResult.correct
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border border-red-500/30 text-red-300'
          }`}
        >
          <p className="font-bold mb-1">
            {lastCardResult.correct ? '✅ Верно!' : '❌ Мимо!'}
          </p>
          <p className="text-sm">{lastCardResult.explanation}</p>
        </div>
      )}

      {/* Кнопки свайпа */}
      {!direction && (
        <div className="flex gap-6 w-full">
          <button
            onClick={() => handleSwipe('left')}
            className="flex-1 py-4 bg-red-500/20 hover:bg-red-500/30 border-2 border-red-500 text-red-400 font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">🚩</span>
            <span>Красный флаг</span>
          </button>
          <button
            onClick={() => handleSwipe('right')}
            className="flex-1 py-4 bg-emerald-500/20 hover:bg-emerald-500/30 border-2 border-emerald-500 text-emerald-400 font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span className="text-2xl">✅</span>
            <span>Безопасно</span>
          </button>
        </div>
      )}

      {/* Прогресс */}
      <p className="text-sm text-slate-400">
        Карточка {cardIndex + 1} из {task.cards.length}
      </p>
    </div>
  )
}