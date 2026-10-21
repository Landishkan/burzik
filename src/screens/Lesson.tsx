import { useStore } from '../store'
import { Scenario } from '../components/Scenario'
import { db } from '../db'
import { Order } from '../components/Order'
export function Lesson() {
  const { screen, setScreen } = useStore()
  if (screen.name !== 'lesson') return null

  const { lesson, taskIndex, correct } = screen
  const task = lesson.tasks[taskIndex]

  function handleAnswer(isCorrect: boolean) {
    const nextCorrect = correct + (isCorrect ? 1 : 0)
    const nextIndex = taskIndex + 1

    if (nextIndex >= lesson.tasks.length) {
      // сохраняем прогресс
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

  return (
    <div className="min-h-screen flex flex-col">
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

       <div className="flex-1">
  {task.type === 'scenario' && (
    <Scenario key={taskIndex} task={task} onAnswer={handleAnswer} />
  )}
  {task.type === 'order' && (
    <Order key={taskIndex} task={task} onAnswer={handleAnswer} />
  )}
</div>
    </div>
  )
}