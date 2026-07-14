import { lessons } from '../data/loadLessons.js'
import { useLessonStatus } from '../context/LessonStatusContext.jsx'
import LessonCard from '../components/LessonCard.jsx'
import styles from './HomeScreen.module.css'

export default function HomeScreen() {
  const { getStatus } = useLessonStatus()

  return (
    <main className="container">
      <header className={styles.header}>
        <h1 className={styles.title}>שחרר את הכריזמה</h1>
        <p className={styles.tagline}>אימון מעשי ליכולות ורבליות — שיעור אחר שיעור</p>
      </header>

      {lessons.length === 0 ? (
        <p className={styles.empty}>עדיין לא נוספו שיעורים.</p>
      ) : (
        <div className={styles.list}>
          {lessons.map((lesson, i) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              index={i + 1}
              status={getStatus(lesson.id)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
