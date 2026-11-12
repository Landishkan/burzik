import { create } from 'zustand'
import type { Lesson, Track } from './content'

type Screen = 
  | { name: 'home' }
  | { name: 'lesson'; lesson: Lesson; taskIndex: number; correct: number }
  | { name: 'result'; lessonId: string; correct: number; total: number }
  | { name: 'profile' }
  | { name: 'recovery' }

interface StoreState {
  screen: Screen
  userTrack: Track // 👈 Добавляем выбор трека
  setScreen: (screen: Screen) => void
  setTrack: (track: Track) => void // 👈 Метод для смены трека
  resetLesson: () => void
}

export const useStore = create<StoreState>((set) => ({
  screen: { name: 'home' },
  userTrack: 'both', // По умолчанию показываем всё, или можно сделать выбор при первом запуске
  setScreen: (screen) => set({ screen }),
  setTrack: (track) => set({ userTrack: track }),
  resetLesson: () => set({ screen: { name: 'home' } }),
}))