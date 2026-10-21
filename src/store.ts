import { create } from 'zustand'
import type { Lesson, Task } from './content'

type Screen =
  | { name: 'home' }
  | { name: 'lesson'; lesson: Lesson; taskIndex: number; correct: number }
  | { name: 'result'; lessonId: string; correct: number; total: number }
  | { name: 'profile' }
  | { name: 'recovery' }

interface State {
  screen: Screen
  setScreen: (s: Screen) => void
}

export const useStore = create<State>((set) => ({
  screen: { name: 'home' },
  setScreen: (screen) => set({ screen }),
}))