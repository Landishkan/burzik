import type { LessonProgress } from './db'

export function generateCode(progress: LessonProgress[]): string {
  try {
    const json = JSON.stringify(progress)
    console.log('Original JSON:', json)
    
    const base64 = btoa(json)
    const chunks = base64.match(/.{1,4}/g) || []
    return 'BUR-' + chunks.join('-') // Убрали toUpperCase()
  } catch (e) {
    console.error('generateCode error:', e)
    return 'BUR-ERROR'
  }
}

export function restoreCode(code: string): LessonProgress[] | null {
  try {
    const cleanCode = code.replace('BUR-', '').replace(/-/g, '').trim()
    if (!cleanCode) return null

    // Добавляем padding до кратности 4
    const padded = cleanCode + '='.repeat((4 - (cleanCode.length % 4)) % 4)
    console.log('Padded base64:', padded)
    
    const json = atob(padded)
    console.log('Decoded JSON:', json)

    const progress = JSON.parse(json)

    if (Array.isArray(progress)) {
      return progress
    }
    return null
  } catch (e) {
    console.error('restoreCode error:', e)
    return null
  }
}