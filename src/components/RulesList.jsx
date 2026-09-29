import ImageSlot from './ImageSlot.jsx'
import styles from './RulesList.module.css'

export default function RulesList({ rules, lessonId }) {
  return (
    <ol className={styles.list}>
      {rules.map((rule, i) => (
        <li key={i} className={styles.item}>
          <span className={styles.num}>{i + 1}</span>
          <span className={styles.text}>{rule}</span>
          <ImageSlot storageKey={`lesson-${lessonId}-rule-${i}`} label={`תמונה לשלב ${i + 1}`} />
        </li>
      ))}
    </ol>
  )
}
