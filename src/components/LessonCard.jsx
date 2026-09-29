import { Link, useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'
import ImageSlot from './ImageSlot.jsx'
import styles from './LessonCard.module.css'

// התמונה בכרטיס היא תמונת הנושא של השיעור (אותו מפתח כמו בראש דף השיעור).
// היא אחות של הקישור ולא בתוכו, כדי שלחיצה על "+" לא תפתח את השיעור.
export default function LessonCard({ lesson, status, index }) {
  const navigate = useNavigate()
  const to = `/lesson/${lesson.id}`

  return (
    <div className={styles.wrap}>
      <Link to={to} className={styles.card}>
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
      <ImageSlot
        storageKey={`lesson-${lesson.id}-cover`}
        label={`תמונה לשיעור ${index}`}
        className={styles.image}
        onFilledClick={() => navigate(to)}
      />
    </div>
  )
}
