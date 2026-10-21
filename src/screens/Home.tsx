import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { modules, allLessons } from '../content'
import { db, type LessonProgress } from '../db'

export function Home() {
  const { setScreen } = useStore()
  const [progress, setProgress] = useState<LessonProgress[]>([])

  useEffect(() => {
    db.progress.toArray().then(setProgress)
  }, [])

  // Собираем ID пройденных уроков
  const completedIds = new Set(progress.map((p) => p.id))
  
  // Находим глобальный индекс первого непройденного урока
  const activeIndex = allLessons.findIndex((l) => !completedIds.has(l.id))

  // Смещения для эффекта "змейки"
  const offsets = [0, 45, 70, 45, 0, -45, -70, -45]

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col pb-24">
      {/* Шапка */}
      <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/burzik.png" alt="Бурзик" className="w-8 h-8 rounded-full" />
          <h1 className="text-xl font-bold text-white">Бурзик</h1>
        </div>
        <div className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          <span className="text-orange-500">🔥</span>
          <span className="font-bold text-white">1</span>
        </div>
      </header>

      {/* Список разделов */}
      <main className="flex-1 overflow-y-auto py-6">
        {modules.map((module) => (
          <div key={module.id} className="mb-12">
            {/* Шапка раздела */}
            <div className={`${module.color} mx-4 p-4 rounded-2xl mb-8 flex justify-between items-center shadow-lg`}>
              <div>
                <h2 className="text-xl font-bold text-white">{module.title}</h2>
                <p className="text-white/80 text-sm mt-1">{module.description}</p>
              </div>
              {/* Иконка книги */}
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
            </div>

            {/* Дорожка уроков внутри раздела */}
            <div className="flex flex-col items-center gap-6">
              {module.lessons.map((lesson, indexInModule) => {
                // Находим глобальный индекс урока во всём приложении
                const globalIndex = allLessons.findIndex((l) => l.id === lesson.id)
                
                const isCompleted = completedIds.has(lesson.id)
                const isActive = globalIndex === activeIndex
                const isLocked = globalIndex > activeIndex && activeIndex !== -1

                const offset = offsets[indexInModule % offsets.length]

                return (
                  <div
                    key={lesson.id}
                    className="relative flex flex-col items-center"
                    style={{ transform: `translateX(${offset}px)` }}
                  >
                    {/* Подсказка "НАЧАТЬ" */}
                    {isActive && (
                      <div className="absolute -top-12 bg-white text-slate-900 text-xs font-bold px-3 py-1 rounded-lg shadow-lg animate-bounce z-10">
                        НАЧАТЬ
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45"></div>
                      </div>
                    )}

                    {/* Кружок урока */}
                    <button
                      onClick={() => {
                        if (isLocked) return
                        setScreen({
                          name: 'lesson',
                          lesson,
                          taskIndex: 0,
                          correct: 0,
                        })
                      }}
                      disabled={isLocked}
                      className={`
                        w-20 h-20 rounded-full flex items-center justify-center text-3xl
                        border-b-4 transition-all active:border-b-0 active:translate-y-1
                        ${
                          isCompleted
                            ? 'bg-yellow-500 border-yellow-700 text-yellow-900'
                            : isActive
                            ? 'bg-sky-500 border-sky-700 text-white shadow-[0_0_20px_rgba(14,165,233,0.5)]'
                            : 'bg-slate-700 border-slate-800 text-slate-500 cursor-not-allowed'
                        }
                      `}
                    >
                      {isCompleted ? '★' : isLocked ? '' : '▶'}
                    </button>

                    {/* Название урока */}
                    <p
                      className={`
                        mt-2 text-sm font-medium text-center max-w-[120px]
                        ${isLocked ? 'text-slate-600' : 'text-slate-300'}
                      `}
                    >
                      {lesson.title}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </main>

      {/* Нижняя навигация */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-3 z-20">
        <button className="flex flex-col items-center gap-1 text-sky-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-xs font-bold">Учить</span>
        </button>
        <button 
          onClick={() => setScreen({ name: 'profile' })}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span className="text-xs font-bold">Профиль</span>
        </button>
      </nav>
    </div>
  )
}