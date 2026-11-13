import Dexie, { type Table } from 'dexie'

// 👈 Экспортируем интерфейс, чтобы он был доступен в других файлах
export interface LessonProgress {
  id: string // lessonId
  completedAt: number
  score: number
  total: number
}

export class BurzikDB extends Dexie {
  progress!: Table<LessonProgress, string>

  constructor() {
    super('BurzikDB')
    this.version(1).stores({
      progress: 'id, completedAt, score, total',
    })
  }

  // Метод для полного сброса прогресса (для тестирования)
  async resetAllProgress() {
    await this.progress.clear()
  }
}

export const db = new BurzikDB()