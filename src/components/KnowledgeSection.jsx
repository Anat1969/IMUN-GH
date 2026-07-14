import styles from './KnowledgeSection.module.css'

export default function KnowledgeSection({ paragraphs }) {
  return (
    <div className={styles.box}>
      {paragraphs.map((p, i) => (
        <p key={i} className={styles.para}>
          {p}
        </p>
      ))}
    </div>
  )
}
