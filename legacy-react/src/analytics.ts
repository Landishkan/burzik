// src/analytics.ts

type AnalyticsEvent = 
  | 'lesson_started'
  | 'lesson_completed'
  | 'task_answered'
  | 'progress_reset'
  | 'track_changed'

interface AnalyticsPayload {
  event: AnalyticsEvent
  lessonId?: string
  taskType?: string
  isCorrect?: boolean
  track?: string
  timestamp: number
}

// Флаг: если false, данные даже не пытаются уйти с устройства
const ANALYTICS_ENABLED = import.meta.env.VITE_ENABLE_ANALYTICS === 'true' || false

export function trackEvent(payload: Omit<AnalyticsPayload, 'timestamp'>) {
  if (!ANALYTICS_ENABLED) {
    // В режиме разработки или без согласия просто пишем в консоль
    console.log('[Analytics Mock]', payload)
    return
  }

  const data: AnalyticsPayload = {
    ...payload,
    timestamp: Date.now(),
  }

  // Здесь в будущем будет fetch к твоему агрегирующему бэкенду
  // fetch('https://api.burzik.app/track', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // }).catch(err => console.error('Analytics send failed', err))
  
  console.log('[Analytics Sent]', data)
}