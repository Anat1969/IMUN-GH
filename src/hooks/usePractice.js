import { useCallback, useState } from 'react'

// מכונת-מצב לתרגול: תרחיש נוכחי + האם דוגמה נחשפה.
// כשעוברים מעבר לתרחיש האחרון — finished=true ו-onComplete מופעל.
export function usePractice(scenarios, onComplete) {
  const total = scenarios?.length ?? 0
  const [index, setIndex] = useState(0)
  const [showExample, setShowExample] = useState(false)
  const [finished, setFinished] = useState(false)

  const revealExample = useCallback(() => setShowExample(true), [])

  const nextScenario = useCallback(() => {
    setIndex((prev) => {
      if (prev + 1 >= total) {
        setFinished(true)
        onComplete?.()
        return prev
      }
      return prev + 1
    })
    setShowExample(false)
  }, [total, onComplete])

  return {
    scenario: total > 0 ? scenarios[index] : null,
    index,
    total,
    isLast: index === total - 1,
    showExample,
    revealExample,
    nextScenario,
    finished,
  }
}
