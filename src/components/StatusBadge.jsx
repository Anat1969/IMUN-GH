import styles from './StatusBadge.module.css'

export default function StatusBadge({ status }) {
  const done = status === 'completed'
  return (
    <span className={`${styles.badge} ${done ? styles.done : styles.open}`}>
      {done ? 'הושלם' : 'פתוח'}
    </span>
  )
}
