import { useState, useEffect, useRef } from 'react'
import type { ChatDialogTask, ChatChoice } from '../content'

interface ChatDialogProps {
  task: ChatDialogTask
  onAnswer: (isCorrect: boolean) => void
}

interface DisplayedMessage {
  id: number
  from: 'other' | 'user'
  text: string
  isCorrectChoice?: boolean
}

export function ChatDialog({ task, onAnswer }: ChatDialogProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [messages, setMessages] = useState<DisplayedMessage[]>([])
  const [isTyping, setIsTyping] = useState(true)
  const [selectedChoice, setSelectedChoice] = useState<ChatChoice | null>(null)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Автоскролл вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  // Появление первого сообщения собеседника
  useEffect(() => {
    if (stepIndex < task.steps.length && messages.length === 0) {
      const timer = setTimeout(() => {
        setMessages([
          {
            id: Date.now(),
            from: 'other',
            text: task.steps[0].incomingMessage,
          },
        ])
        setIsTyping(false)
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleChoice = (choice: ChatChoice) => {
    if (selectedChoice) return

    setSelectedChoice(choice)
    const newCorrect = totalCorrect + (choice.correct ? 1 : 0)
    setTotalCorrect(newCorrect)

    // Добавляем сообщение пользователя
    const userMessage: DisplayedMessage = {
      id: Date.now(),
      from: 'user',
      text: choice.text,
      isCorrectChoice: choice.correct,
    }
    setMessages((prev) => [...prev, userMessage])

    // Через 2.5 секунды — переход к следующему шагу или завершение
    setTimeout(() => {
      const nextStep = stepIndex + 1
      if (nextStep >= task.steps.length) {
        // Сохраняем результат: считаем "правильным", если больше половины ответов верны
        const isOverallCorrect = newCorrect >= Math.ceil(task.steps.length / 2)
        onAnswer(isOverallCorrect)
      } else {
        setStepIndex(nextStep)
        setSelectedChoice(null)
        setIsTyping(true)

        // Имитация "печатает..." и появление следующего сообщения
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              from: 'other',
              text: task.steps[nextStep].incomingMessage,
            },
          ])
          setIsTyping(false)
        }, 1200)
      }
    }, 2500)
  }

  const currentStep = task.steps[stepIndex]

  return (
    <div className="flex flex-col h-full max-w-md mx-auto bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
      {/* Шапка чата */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${task.accentColor} flex items-center justify-center text-white font-bold`}>
          {task.otherAvatar}
        </div>
        <div className="flex-1">
          <p className="font-bold text-white text-sm">{task.otherName}</p>
          <p className="text-xs text-slate-400">{task.title}</p>
        </div>
      </div>

      {/* Лента сообщений */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[300px] max-h-[50vh]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                msg.from === 'other'
                  ? `${task.accentColor} text-white rounded-bl-sm`
                  : msg.isCorrectChoice === false
                  ? 'bg-red-500/20 text-red-200 border border-red-500/40 rounded-br-sm'
                  : 'bg-sky-600 text-white rounded-br-sm'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Индикатор "печатает..." */}
        {isTyping && (
          <div className="flex justify-start">
            <div className={`${task.accentColor} px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1`}>
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}

        {/* Фидбек после выбора */}
        {selectedChoice && (
          <div
            className={`mx-2 p-3 rounded-xl text-sm animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              selectedChoice.correct
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border border-red-500/30 text-red-300'
            }`}
          >
            <p className="font-bold mb-1">{selectedChoice.correct ? '✅ Отличный ход' : '⚠️ Опасный ход'}</p>
            <p>{selectedChoice.feedback}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Варианты ответов */}
      <div className="border-t border-slate-800 p-3 bg-slate-900 space-y-2">
        {!selectedChoice && !isTyping && currentStep ? (
          currentStep.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => handleChoice(choice)}
              className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-500 rounded-xl text-sm text-slate-200 transition-all active:scale-[0.98]"
            >
              {choice.text}
            </button>
          ))
        ) : (
          <p className="text-center text-xs text-slate-500 py-2">
            {selectedChoice ? 'Собеседник печатает...' : 'Ожидайте сообщение...'}
          </p>
        )}
      </div>
    </div>
  )
}