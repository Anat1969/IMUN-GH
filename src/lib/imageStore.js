// אחסון תמונות ב-IndexedDB (localStorage קטן מדי לתמונות).
// כל תמונה נשמרת כ-Blob תחת מפתח, למשל "lesson-1-rule-2".

const DB_NAME = 'uyc-images'
const STORE = 'images'
const MAX_SIDE = 1600

let dbPromise = null

function openDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1)
      req.onupgradeneeded = () => req.result.createObjectStore(STORE)
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
  }
  return dbPromise
}

async function run(mode, fn) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode)
    const req = fn(tx.objectStore(STORE))
    tx.oncomplete = () => resolve(req.result)
    tx.onerror = () => reject(tx.error)
  })
}

export const getImage = (key) => run('readonly', (s) => s.get(key))
export const putImage = (key, blob) => run('readwrite', (s) => s.put(blob, key))
export const deleteImage = (key) => run('readwrite', (s) => s.delete(key))

// מקטין תמונות גדולות כדי לחסוך מקום. GIF/SVG נשמרים כמו שהם.
export async function prepareImage(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height))
    if (scale === 1 && file.size < 1_000_000) return file
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const type = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
    const blob = await new Promise((r) => canvas.toBlob(r, type, 0.88))
    return blob ?? file
  } catch {
    return file
  }
}
