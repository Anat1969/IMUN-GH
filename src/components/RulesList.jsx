import styles from './RulesList.module.css'

export default function RulesList({ rules }) {
  return (
    <ol className={styles.list}>
      {rules.map((rule, i) => (
        <li key={i} className={styles.item}>
          <span className={styles.num}>{i + 1}</span>
          <span className={styles.text}>{rule}</span>
        </li>
      ))}
    </ol>
  )
}
