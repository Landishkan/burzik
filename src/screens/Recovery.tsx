import { useState } from 'react'
import { useStore } from '../store'
import { db } from '../db'
import { restoreCode } from '../recovery'

export function Recovery() {
  const { setScreen } = useStore()
  const [code, setCode] = useState('')
const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'empty'>('idle')

  async function handleRestore() {
    const progress = restoreCode(code)
    if (progress === null) {
      // Код вообще не декодировался — битый
      setStatus('error')
    } else if (progress.length === 0) {
      // Код валидный, но прогресс пустой
      setStatus('empty')
    } else {
      // Всё ок — восстанавливаем
      await db.progress.clear()
      await db.progress.bulkAdd(progress)
      setStatus('success')
      setTimeout(() => setScreen({ name: 'home' }), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col p-6">
      {/* Шапка */}
      <header className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setScreen({ name: 'profile' })} 
          className="text-slate-400 hover:text-white p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 className="text-2xl font-bold text-white">Восстановление</h1>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full">
        <img src="/burzik.png" alt="Бурзик" className="w-24 h-24 mb-6" />
        
        <h2 className="text-xl font-bold text-white mb-2 text-center">Введи код восстановления</h2>
        <p className="text-slate-400 text-center mb-8">
          Если ты менял устройство или очищал браузер, введи свой код, чтобы вернуть прогресс.
        </p>

        {/* Поле ввода */}
    <input
  type="text"
  value={code}
  onChange={(e) => {
    setCode(e.target.value) // Убрали .toUpperCase()
    setStatus('idle')
  }}
  placeholder="BUR-xxxx-xxxx"
  className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl p-4 text-white text-center text-lg font-mono tracking-wider focus:border-sky-500 focus:outline-none mb-4"
/>

        {/* Сообщения об ошибках/успехе */}
               {status === 'error' && (
          <p className="text-rose-400 mb-4 text-center font-medium">Неверный код. Проверь правильность ввода.</p>
        )}
        {status === 'empty' && (
          <p className="text-amber-400 mb-4 text-center font-medium">Код верный, но в нём нет сохранённого прогресса.</p>
        )}
        {status === 'success' && (
          <p className="text-emerald-400 mb-4 text-center font-bold">Прогресс восстановлен! Возвращаем домой...</p>
        )}

        {/* Кнопка */}
        <button
          onClick={handleRestore}
          disabled={code.length < 5 || status === 'success'}
          className="w-full py-4 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-lg rounded-2xl border-b-4 border-sky-800 disabled:border-slate-800 active:border-b-0 active:translate-y-1 transition-all uppercase"
        >
          Восстановить
        </button>
      </div>
    </div>
  )
}