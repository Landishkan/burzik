import Dexie, { type Table } from 'dexie'

export interface LessonProgress {
  id: string          // id урока
  completedAt: number // timestamp
  score: number       // правильных ответов
  total: number
}

class BurzikDB extends Dexie {
  progress!: Table<LessonProgress, string>

  constructor() {
    super('burzik')
    this.version(1).stores({
      progress: 'id, completedAt',
    })
  }
}

export const db = new BurzikDB()