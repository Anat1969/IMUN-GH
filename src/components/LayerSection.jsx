import styles from './LayerSection.module.css'

export default function LayerSection({ label, children }) {
  return (
    <section className={styles.section}>
      <div className={styles.label}>{label}</div>
      {children}
    </section>
  )
}
