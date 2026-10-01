import { useState } from 'react'
import styles from './WrapUp.module.css'

// מציין מקום בסוגריים מרובעים ([שם], [א]) מקבל רקע עדין
function Spoken({ text }) {
  return text.split(/(\[[^\]]+\])/).map((part, i) =>
    /^\[[^\]]+\]$/.test(part) ? (
      <span key={i} className={styles.placeholder}>
        {part}
      </span>
    ) : (
      part
    ),
  )
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
}

function CopyLine({ text, quote }) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    await copyText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={quote ? `${styles.line} ${styles.quote}` : styles.line}>
      <span className={styles.lineText}>
        <Spoken text={text} />
      </span>
      <button type="button" className={styles.copy} onClick={onCopy} aria-label={`העתקת המשפט: ${text}`}>
        {copied ? 'הועתק' : 'העתקה'}
      </button>
    </div>
  )
}

function Block({ title, children }) {
  return (
    <details className={styles.block}>
      <summary className={styles.summary}>
        <span>{title}</span>
        <span className={styles.toggle} aria-hidden="true" />
      </summary>
      <div className={styles.blockBody}>{children}</div>
    </details>
  )
}

export default function WrapUp({ data, labels }) {
  const { insight, bodyLanguage, openers = [], phrasings = [], insteadOf = [] } = data

  return (
    <div className={styles.wrap}>
      {insight && (
        <div className={styles.insight}>
          <div className={styles.kicker}>{labels.insight}</div>
          <p className={styles.insightText}>{insight}</p>
        </div>
      )}

      {bodyLanguage && (
        <Block title={labels.bodyLanguage}>
          <div className={styles.sub}>{labels.definition}</div>
          <p>{bodyLanguage.definition}</p>
          {bodyLanguage.cues?.length > 0 && (
            <>
              <div className={styles.sub}>{labels.cues}</div>
              <ul className={styles.cues}>
                {bodyLanguage.cues.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </>
          )}
          {bodyLanguage.avoid && (
            <>
              <div className={styles.sub}>{labels.avoid}</div>
              <p className={styles.muted}>{bodyLanguage.avoid}</p>
            </>
          )}
        </Block>
      )}

      {openers.length > 0 && (
        <Block title={labels.openers}>
          <div className={styles.cards}>
            {openers.map((o, i) => (
              <article key={i} className={styles.card}>
                <h4 className={styles.person}>{o.person}</h4>
                <span className={styles.approach}>{o.approach}</span>
                <div className={styles.lines}>
                  {o.lines.map((l, j) => (
                    <CopyLine key={j} text={l} quote />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Block>
      )}

      {phrasings.length > 0 && (
        <Block title={labels.phrasings}>
          {phrasings.map((p, i) => (
            <div key={i} className={styles.phrasing}>
              <h4 className={styles.move}>{p.move}</h4>
              <div className={styles.lines}>
                {p.lines.map((l, j) => (
                  <CopyLine key={j} text={l} />
                ))}
              </div>
            </div>
          ))}
        </Block>
      )}

      {insteadOf.length > 0 && (
        <Block title={labels.insteadOf}>
          <div className={styles.table}>
            <div className={styles.headRow}>
              <span>{labels.instead}</span>
              <span>{labels.say}</span>
            </div>
            {insteadOf.map((r, i) => (
              <div key={i} className={styles.row}>
                <p className={styles.instead}>
                  <Spoken text={r.instead} />
                </p>
                <CopyLine text={r.say} />
              </div>
            ))}
          </div>
        </Block>
      )}
    </div>
  )
}
