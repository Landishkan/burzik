import { useEffect, useState } from 'react'
import { db, type LessonProgress } from '../db'
import { allLessons } from '../content'
import { useStore } from '../store'

export function Profile() {
  const { setScreen } = useStore()
  const [progress, setProgress] = useState<LessonProgress[]>([])

  useEffect(() => {
    db.progress.toArray().then(setProgress)
  }, [])

  const totalXP = progress.reduce((sum, p) => sum + p.score * 10, 0)
  const completedCount = progress.length

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col pb-24">
      {/* Шапка */}
      <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-4">
        <h1 className="text-2xl font-bold text-white">Профиль</h1>
      </header>

      <main className="flex-1 p-4 space-y-6 overflow-y-auto">
        {/* Статистика */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col items-center">
            <span className="text-3xl mb-2">🔥</span>
            <p className="text-2xl font-bold text-white">1</p>
            <p className="text-xs text-slate-400">Дней подряд</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex flex-col items-center">
            <span className="text-3xl mb-2">⚡</span>
            <p className="text-2xl font-bold text-yellow-400">{totalXP}</p>
            <p className="text-xs text-slate-400">Всего XP</p>
          </div>
        </div>

        {/* Пройденные уроки */}
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Пройденные уроки</h2>
          {progress.length === 0 ? (
            <p className="text-slate-500 text-center py-4">Пока ничего не пройдено. Начни обучение!</p>
          ) : (
            <div className="space-y-2">
              {progress.map((p) => {
                const lesson = allLessons.find((l) => l.id === p.id)
                if (!lesson) return null
                return (
                  <div key={p.id} className="bg-slate-800 p-3 rounded-xl border border-slate-700 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-white">{lesson.title}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(p.completedAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <span className="text-yellow-400 font-bold">+{p.score * 10} XP</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {/* Нижняя навигация */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-3 z-20">
        <button 
          onClick={() => setScreen({ name: 'home' })}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-xs font-bold">Учить</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-sky-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text-xs font-bold">Профиль</span>
        </button>
             {/* Кнопка восстановления */}
        <button
          onClick={() => setScreen({ name: 'recovery' })}
          className="w-full py-3 mt-4 bg-slate-800 hover:bg-slate-700 text-sky-400 font-bold rounded-2xl border border-slate-700 transition-all"
        >
          🔑 Восстановить прогресс по коду
        </button>
      </nav>
    </div>
  )
}