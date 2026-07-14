import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { readJSON, writeJSON } from '../lib/storage.js'

const STORAGE_KEY = 'uyc_status_v1'

const LessonStatusContext = createContext(null)

export function LessonStatusProvider({ children }) {
  const [status, setStatus] = useState(() => readJSON(STORAGE_KEY, {}))

  const markCompleted = useCallback((id) => {
    setStatus((prev) => {
      const key = String(id)
      if (prev[key] === 'completed') return prev
      const next = { ...prev, [key]: 'completed' }
      writeJSON(STORAGE_KEY, next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setStatus({})
    writeJSON(STORAGE_KEY, {})
  }, [])

  const getStatus = useCallback(
    (id) => (status[String(id)] === 'completed' ? 'completed' : 'open'),
    [status],
  )

  const value = useMemo(
    () => ({ getStatus, markCompleted, reset }),
    [getStatus, markCompleted, reset],
  )

  return (
    <LessonStatusContext.Provider value={value}>
      {children}
    </LessonStatusContext.Provider>
  )
}

export function useLessonStatus() {
  const ctx = useContext(LessonStatusContext)
  if (!ctx) throw new Error('useLessonStatus must be used within LessonStatusProvider')
  return ctx
}
