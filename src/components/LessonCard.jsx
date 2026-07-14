import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'
import styles from './LessonCard.module.css'

export default function LessonCard({ lesson, status, index }) {
  return (
    <Link to={`/lesson/${lesson.id}`} className={styles.card}>
      <span className={styles.number}>שיעור {index}</span>
      <div className={styles.body}>
        <h2 className={styles.title}>{lesson.title}</h2>
        {lesson.titleEn && <p className={styles.subtitle}>{lesson.titleEn}</p>}
      </div>
      <div className={styles.meta}>
        <span className={styles.duration}>{lesson.duration}</span>
        <StatusBadge status={status} />
      </div>
    </Link>
  )
}
