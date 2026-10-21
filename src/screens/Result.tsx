import { useState } from 'react'
import { useStore } from '../store'
import { db } from '../db'
import { generateCode } from '../recovery'

export function Result() {
  const { screen, setScreen } = useStore()
  if (screen.name !== 'result') return null

  const { correct, total } = screen
  const [code, setCode] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

   async function handleGetCode() {
    const all = await db.progress.toArray()
    const newCode = generateCode(all)
    setCode(newCode)
  }

  function handleCopy() {
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const percentage = Math.round((correct / total) * 100)

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 text-center">
      {/* Бурзик */}
      <img src="/burzik.png" alt="Бурзик" className="w-32 h-32 mb-6 animate-bounce" />
      
      <h1 className="text-3xl font-bold text-emerald-400 mb-2">Урок пройден!</h1>
      <p className="text-slate-400 mb-8">Ты отлично справился с заданиями</p>

      {/* Статистика */}
      <div className="flex gap-4 mb-8 w-full max-w-sm">
        <div className="flex-1 bg-slate-800 p-4 rounded-2xl border border-slate-700">
          <p className="text-sm text-slate-400 mb-1">Точность</p>
          <p className="text-2xl font-bold text-white">{percentage}%</p>
        </div>
        <div className="flex-1 bg-slate-800 p-4 rounded-2xl border border-slate-700">
          <p className="text-sm text-slate-400 mb-1">Опыт (XP)</p>
          <p className="text-2xl font-bold text-yellow-400">+{correct * 10}</p>
        </div>
      </div>

      {/* Блок с кодом восстановления */}
      <div className="w-full max-w-sm bg-slate-800 p-4 rounded-2xl border border-slate-700 mb-8">
        <p className="text-sm text-slate-400 mb-3">
          🔑 Код восстановления прогресса
        </p>
        {code ? (
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-slate-900 p-3 rounded-lg text-sky-400 font-mono text-lg break-all">
              {code}
            </code>
            <button
              onClick={handleCopy}
              className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white"
            >
              {copied ? '✓' : '📋'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleGetCode}
            className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl border-b-4 border-sky-800 active:border-b-0 active:translate-y-1 transition-all"
          >
            Получить код
          </button>
        )}
        <p className="text-xs text-slate-500 mt-3 text-left">
          Сохрани этот код в заметках. Если удалишь приложение, он поможет вернуть прогресс.
        </p>
      </div>

      <button
        onClick={() => setScreen({ name: 'home' })}
        className="w-full max-w-sm py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-lg rounded-2xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all uppercase"
      >
        Продолжить
      </button>
    </div>
  )
}