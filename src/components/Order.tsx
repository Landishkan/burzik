import { useState, useEffect } from 'react'
import type { OrderTask } from '../content'

interface Props {
  task: OrderTask
  onAnswer: (correct: boolean) => void
}


export function Order({ task, onAnswer }: Props) {
  // Перемешиваем шаги при монтировании
  const [bank, setBank] = useState<string[]>([])
  const [answer, setAnswer] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    const shuffled = [...task.steps].sort(() => Math.random() - 0.5)
    setBank(shuffled)
  }, [task])

  function moveToAnswer(step: string) {
    if (checked) return
    setBank(bank.filter((s) => s !== step))
    setAnswer([...answer, step])
  }

  function moveToBank(step: string) {
    if (checked) return
    setAnswer(answer.filter((s) => s !== step))
    setBank([...bank, step])
  }

  function handleCheck() {
    const correct = JSON.stringify(answer) === JSON.stringify(task.steps)
    setIsCorrect(correct)
    setChecked(true)
  }

  function handleContinue() {
    onAnswer(isCorrect)
  }

  return (
    <div className="flex flex-col h-full pb-48 p-6">
      <h2 className="text-2xl font-bold mb-6">{task.prompt}</h2>

      {/* Зона ответа */}
      <div className="min-h-[120px] bg-slate-800/50 rounded-2xl p-3 mb-6 border-2 border-dashed border-slate-700 flex flex-wrap gap-2 content-start">
        {answer.map((step, idx) => (
          <button
            key={idx}
            onClick={() => moveToBank(step)}
            className={`
              px-4 py-2 rounded-xl text-left font-medium border-b-4 active:border-b-0 active:translate-y-1 transition-all
              ${checked 
                ? (isCorrect ? 'bg-emerald-600 border-emerald-800 text-white' : 'bg-rose-600 border-rose-800 text-white') 
                : 'bg-sky-600 border-sky-800 text-white hover:bg-sky-500'}
            `}
          >
            {step}
          </button>
        ))}
      </div>

      {/* Банк шагов */}
      <div className="flex flex-wrap gap-2">
        {bank.map((step, idx) => (
          <button
            key={idx}
            onClick={() => moveToAnswer(step)}
            disabled={checked}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl border-b-4 border-slate-900 active:border-b-0 active:translate-y-1 transition-all font-medium disabled:opacity-50"
          >
            {step}
          </button>
        ))}
      </div>

      {/* Нижняя панель проверки */}
      {checked && (
        <div
          className={`
            fixed bottom-0 left-0 right-0 p-4 border-t-4 
            ${isCorrect ? 'bg-emerald-900/50 border-emerald-500' : 'bg-amber-900/50 border-amber-500'}
          `}
        >
          <div className="max-w-2xl mx-auto flex items-start gap-4 mb-4">
            <img src="/burzik.png" alt="Бурзик" className="w-20 h-20 object-contain flex-shrink-0" />
            <div className="flex-1 pt-2">
              <h3 className={`text-2xl font-bold mb-1 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isCorrect ? 'Всё верно!' : 'Не совсем так'}
              </h3>
              <p className="text-slate-200">
                {isCorrect ? task.feedbackCorrect : task.feedbackWrong}
              </p>
            </div>
          </div>
          <button
            onClick={handleContinue}
            className={`
              w-full py-4 rounded-2xl text-lg font-bold uppercase tracking-wide border-b-4 active:border-b-0 active:translate-y-1 transition-all
              ${isCorrect ? 'bg-emerald-500 border-emerald-700 text-white' : 'bg-amber-500 border-amber-700 text-white'}
            `}
          >
            Продолжить
          </button>
        </div>
      )}

      {/* Кнопка проверки (показывается, когда все шаги использованы) */}
      {!checked && bank.length === 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800">
          <button
            onClick={handleCheck}
            className="w-full max-w-2xl mx-auto py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg rounded-2xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all uppercase"
          >
            Проверить
          </button>
        </div>
      )}
    </div>
  )
}