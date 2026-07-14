// עטיפת localStorage בטוחה. אם האחסון לא זמין (מצב פרטי / חסום) —
// נופלים ל-fallback בזיכרון כדי שהאפליקציה לא תקרוס.

const memory = new Map()

function hasLocalStorage() {
  try {
    const k = '__uyc_test__'
    window.localStorage.setItem(k, '1')
    window.localStorage.removeItem(k)
    return true
  } catch {
    return false
  }
}

const available = typeof window !== 'undefined' && hasLocalStorage()

export function readJSON(key, fallback) {
  try {
    const raw = available ? window.localStorage.getItem(key) : memory.get(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeJSON(key, value) {
  const raw = JSON.stringify(value)
  try {
    if (available) window.localStorage.setItem(key, raw)
    else memory.set(key, raw)
  } catch {
    memory.set(key, raw)
  }
}
