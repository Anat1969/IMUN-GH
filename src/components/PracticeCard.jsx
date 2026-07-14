import { useState } from 'react'
import { usePractice } from '../hooks/usePractice.js'
import styles from './PracticeCard.module.css'

export default function PracticeCard({ scenarios, onComplete }) {
  const { scenario, index, total, isLast, showExample, revealExample, nextScenario, finished } =
    usePractice(scenarios, onComplete)

  if (total === 0) {
    return <p className={styles.empty}>אין תרחישי תרגול בשיעור זה עדיין.</p>
  }

  if (finished) {
    return (
      <div className={styles.done}>
        <h3 className={styles.doneTitle}>כל הכבוד — סיימת את התרגול!</h3>
        <p className={styles.doneText}>השיעור סומן כהושלם. אפשר לחזור לרשימה ולהמשיך לשיעור הבא.</p>
      </div>
    )
  }

  return (
    <div className={styles.card}>
      <div className={styles.counter}>
        תרחיש {index + 1} מתוך {total}
      </div>

      <p className={styles.situation}>{scenario.situation}</p>
      <p className={styles.prompt}>{scenario.prompt}</p>

      {/* key={index} מאפס את הטקסט בכל מעבר תרחיש */}
      <ResponseArea key={index} />

      {showExample ? (
        <div className={styles.example}>
          <div className={styles.exampleLabel}>דוגמה לתגובה טובה</div>
          <p className={styles.exampleText}>{scenario.example}</p>
        </div>
      ) : (
        <button className={styles.primary} onClick={revealExample}>
          הצג דוגמה
        </button>
      )}

      {showExample && (
        <button className={styles.ghost} onClick={nextScenario}>
          {isLast ? 'סיום התרגול' : 'עוד תרחיש'}
        </button>
      )}
    </div>
  )
}

function ResponseArea() {
  const [value, setValue] = useState('')
  return (
    <textarea
      className={styles.textarea}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="כתבי כאן את התגובה שלך..."
      rows={4}
    />
  )
}
