// מנוע התוכן: טוען אוטומטית את כל קבצי ה-JSON מתיקיית lessons.
// הוספת שיעור = הוספת קובץ lessonN.json — ללא שינוי קוד.

import workScenariosData from './workScenarios.json'
import wrapUpData from './lessonWrapUp.json'

const modules = import.meta.glob('./lessons/*.json', { eager: true })

// תרחישי עבודה נשמרים בקובץ נפרד ומצורפים לכל שיעור לפי id (שדה scenarios לא משתנה)
export const workScenariosSection = workScenariosData.section
const workScenariosById = new Map(workScenariosData.lessons.map((l) => [String(l.id), l.workScenarios]))

// סיכום השיעור — גם הוא בקובץ נפרד, מצורף לפי id
export const wrapUpSection = wrapUpData.section
const wrapUpById = new Map(wrapUpData.lessons.map((l) => [String(l.id), l.wrapUp]))

export const lessons = Object.values(modules)
  .map((m) => m.default ?? m)
  .filter((l) => l && l.id != null)
  .map((l) => ({
    ...l,
    workScenarios: workScenariosById.get(String(l.id)) ?? [],
    wrapUp: wrapUpById.get(String(l.id)) ?? null,
  }))
  .sort((a, b) => a.id - b.id)

export function getLessonById(id) {
  return lessons.find((l) => String(l.id) === String(id))
}
