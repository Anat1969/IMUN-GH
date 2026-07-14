// מנוע התוכן: טוען אוטומטית את כל קבצי ה-JSON מתיקיית lessons.
// הוספת שיעור = הוספת קובץ lessonN.json — ללא שינוי קוד.

const modules = import.meta.glob('./lessons/*.json', { eager: true })

export const lessons = Object.values(modules)
  .map((m) => m.default ?? m)
  .filter((l) => l && l.id != null)
  .sort((a, b) => a.id - b.id)

export function getLessonById(id) {
  return lessons.find((l) => String(l.id) === String(id))
}
