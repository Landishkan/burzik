import { useState } from 'react'
import type { SpotTheFlagTask, FlagPhrase } from '../content'

interface SpotTheFlagProps {
  task: SpotTheFlagTask
  onAnswer: (isCorrect: boolean) => void
}

export function SpotTheFlag({ task, onAnswer }: SpotTheFlagProps) {
  const [foundFlags, setFoundFlags] = useState<Set<string>>(new Set())
  const [wrongClicks, setWrongClicks] = useState<Set<string>>(new Set())
  const [showFeedback, setShowFeedback] = useState(false)

  const totalFlags = task.phrases.filter((p) => p.isFlag).length
 

  const handlePhraseClick = (phrase: FlagPhrase) => {
    if (foundFlags.has(phrase.id) || wrongClicks.has(phrase.id)) return

    if (phrase.isFlag) {
      const newFound = new Set(foundFlags)
      newFound.add(phrase.id)
      setFoundFlags(newFound)

      if (newFound.size === totalFlags) {
        setShowFeedback(true)
        setTimeout(() => onAnswer(true), 2000)
      }
    } else {
      const newWrong = new Set(wrongClicks)
      newWrong.add(phrase.id)
      setWrongClicks(newWrong)
    }
  }

  return (
    <div className="flex flex-col h-full max-w-md mx-auto gap-6">
      <h3 className="text-xl font-bold text-white text-center">{task.title}</h3>

      {/* Текст с кликабельными фразами */}
      <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 text-lg text-slate-200 leading-relaxed">
        {task.phrases.map((phrase) => {
          const isFound = foundFlags.has(phrase.id)
          const isWrong = wrongClicks.has(phrase.id)

          return (
            <span
              key={phrase.id}
              onClick={() => handlePhraseClick(phrase)}
              className={`cursor-pointer transition-all duration-200 ${
                isFound
                  ? 'bg-red-500/30 text-red-300 border-b-2 border-red-500'
                  : isWrong
                  ? 'bg-slate-600/30 text-slate-400 line-through'
                  : 'hover:bg-sky-500/20 hover:text-sky-300'
              }`}
            >
              {phrase.text}{' '}
            </span>
          )
        })}
      </div>

      {/* Прогресс */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-slate-400">
          Найдено флагов: {foundFlags.size} из {totalFlags}
        </p>
        {wrongClicks.size > 0 && (
          <p className="text-sm text-red-400">Ошибок: {wrongClicks.size}</p>
        )}
      </div>

      {/* Фидбек */}
      {showFeedback && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 animate-in fade-in slide-in-from-bottom-2">
          <p className="font-bold mb-2">✅ Все маркеры найдены!</p>
          <p className="text-sm">{task.feedbackCorrect}</p>
        </div>
      )}

      {/* Подсказка */}
      {!showFeedback && (
        <p className="text-center text-sm text-slate-500">
          Кликай на фразы, которые кажутся подозрительными
        </p>
      )}
    </div>
  )
}