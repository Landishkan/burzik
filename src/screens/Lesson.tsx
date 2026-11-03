import { useStore } from '../store'
import { Scenario } from '../components/Scenario'
import { Order } from '../components/Order'
import { TrueFalse } from '../components/TrueFalse' // 👈 1. Добавляем импорт
import { db } from '../db'

export function Lesson() {
  const { screen, setScreen } = useStore()
  if (screen.name !== 'lesson') return null

  const { lesson, taskIndex, correct } = screen
  const task = lesson.tasks[taskIndex]

  function handleAnswer(isCorrect: boolean) {
    const nextCorrect = correct + (isCorrect ? 1 : 0)
    const nextIndex = taskIndex + 1

    if (nextIndex >= lesson.tasks.length) {
      db.progress.put({
        id: lesson.id,
        completedAt: Date.now(),
        score: nextCorrect,
        total: lesson.tasks.length,
      })
      setScreen({
        name: 'result',
        lessonId: lesson.id,
        correct: nextCorrect,
        total: lesson.tasks.length,
      })
    } else {
      setScreen({
        name: 'lesson',
        lesson,
        taskIndex: nextIndex,
        correct: nextCorrect,
      })
    }
  }

  // 👈 2. Определяем компонент через switch ДО return
  let TaskComponent
  switch (task.type) {
    case 'scenario':
      TaskComponent = <Scenario key={taskIndex} task={task} onAnswer={handleAnswer} />
      break
    case 'order':
      TaskComponent = <Order key={taskIndex} task={task} onAnswer={handleAnswer} />
      break
    case 'true-false':
      TaskComponent = <TrueFalse key={taskIndex} task={task} onAnswer={handleAnswer} />
      break
    default:
      // TypeScript здесь поймёт, что все типы исчерпаны, но для безопасности:
      TaskComponent = <div className="text-red-400 p-4">Неизвестный тип задания</div>
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col"> {/* 👈 Добавил bg-slate-900 для консистентности темы */}
      <header className="p-4 flex items-center gap-4">
        <button
          onClick={() => setScreen({ name: 'home' })}
          className="text-slate-400 hover:text-white p-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        
        <div className="flex-1 h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${((taskIndex) / lesson.tasks.length) * 100}%`,
            }}
          />
        </div>
      </header>

      {/* 👈 3. Рендерим выбранный компонент */}
      <div className="flex-1 p-4 flex flex-col justify-center">
        {TaskComponent}
      </div>
    </div>
  )
}