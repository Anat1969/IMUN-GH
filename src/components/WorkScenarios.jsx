import styles from './WorkScenarios.module.css'

// "/" במשפט מסמן שתיקה קצרה — מוצג כסימן מרווח ועדין
function Line({ text }) {
  const parts = text.split('/')
  return parts.map((part, i) => (
    <span key={i}>
      {part.trim()}
      {i < parts.length - 1 && <span className={styles.pause}> / </span>}
    </span>
  ))
}

export default function WorkScenarios({ items, section }) {
  const { fields, legend } = section

  return (
    <>
      {legend && <p className={styles.legend}>{legend}</p>}
      <div className={styles.list}>
        {items.map((s, i) => (
          <article key={i} className={styles.card}>
            <span className={styles.setting}>{s.setting}</span>

            <Field label={fields.situation}>
              <p className={styles.situation}>{s.situation}</p>
            </Field>

            <Field label={fields.body}>
              <p>{s.body}</p>
            </Field>

            <Field label={fields.line}>
              <p className={styles.line}>
                <Line text={s.line} />
              </p>
            </Field>

            <Field label={fields.note}>
              <p>{s.note}</p>
            </Field>

            <Field label={fields.avoid} muted>
              <p className={styles.avoid}>{s.avoid}</p>
            </Field>
          </article>
        ))}
      </div>
    </>
  )
}

function Field({ label, muted, children }) {
  return (
    <div className={styles.field}>
      <div className={muted ? `${styles.label} ${styles.labelMuted}` : styles.label}>{label}</div>
      {children}
    </div>
  )
}
