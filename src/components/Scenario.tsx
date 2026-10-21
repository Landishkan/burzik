import { useState } from 'react'


import type { ScenarioTask } from '../content'

interface Props {
  task: ScenarioTask
  onAnswer: (correct: boolean) => void
}

export function Scenario({ task, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleSelect(id: string) {
    if (selected) return // блокируем повторные нажатия
    setSelected(id)
  }

   function handleContinue() {
    if (!selected) return
    const option = task.options.find((o) => o.id === selected)!
    
    // Воспроизводим звук
    const audio = new Audio(option.correct ? '/correct.mp3' : '/incorrect.mp3')
    audio.volume = 0.5 // Чтобы не оглушить
    audio.play().catch(() => {}) // catch нужен, чтобы не падало, если браузер блокирует

    onAnswer(option.correct)
  }

  const selectedOption = task.options.find((o) => o.id === selected)
  const isCorrect = selectedOption?.correct

  return (
    <div className="flex flex-col h-full pb-48"> {/* отступ снизу, чтобы панель не перекрывала текст */}
      {/* Текст задания */}
      <div className="p-6 flex-1">
        <h2 className="text-2xl font-bold mb-6 leading-snug">
          {task.prompt}
        </h2>

        {/* Варианты ответов */}
        <div className="space-y-3">
          {task.options.map((opt) => {
            const isSelected = selected === opt.id
            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={selected !== null}
                className={`
                  w-full text-left p-4 rounded-2xl text-lg font-medium transition-all
                  border-b-4 active:border-b-0 active:translate-y-1
                  ${
                    isSelected
                      ? 'bg-sky-600 border-sky-800 text-white'
                      : 'bg-slate-800 border-slate-950 text-slate-200 hover:bg-slate-700'
                  }
                  ${selected !== null && !isSelected ? 'opacity-50' : ''}
                `}
              >
                {opt.text}
              </button>
            )
          })}
        </div>
      </div>

      {/* Нижняя панель с фидбеком (как в Дуолинго) */}
      {selected && (
        <div
          className={`
            fixed bottom-0 left-0 right-0 p-4 border-t-4 
            ${isCorrect ? 'bg-emerald-900/50 border-emerald-500' : 'bg-amber-900/50 border-amber-500'}
          `}
        >
          <div className="max-w-2xl mx-auto flex items-start gap-4 mb-4">
            {/* Бурзик */}
            <img 
              src="/burzik.png" 
              alt="Бурзик" 
              className="w-20 h-20 object-contain flex-shrink-0" 
            />
            <div className="flex-1 pt-2">
              <h3
                className={`text-2xl font-bold mb-1 ${
                  isCorrect ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {isCorrect ? 'Верно!' : 'Не совсем'}
              </h3>
              <p className="text-slate-200 leading-relaxed">
                {selectedOption?.feedback}
              </p>
            </div>
          </div>

          <button
            onClick={handleContinue}
            className={`
              w-full py-4 rounded-2xl text-lg font-bold uppercase tracking-wide
              border-b-4 active:border-b-0 active:translate-y-1 transition-all
              ${
                isCorrect
                  ? 'bg-emerald-500 border-emerald-700 text-white hover:bg-emerald-400'
                  : 'bg-amber-500 border-amber-700 text-white hover:bg-amber-400'
              }
            `}
          >
            Продолжить
          </button>
        </div>
      )}
    </div>
  )
}