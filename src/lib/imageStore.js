// אחסון תמונות בענן: Supabase (פרויקט cultura-GH), bucket נפרד "imun-images".
// קריאה ציבורית לכולם; כתיבה רק דרך הפונקציה imun-images עם סיסמת מנהלת.
// שם כל קובץ הוא המפתח שלו, למשל "lesson-1-cover" או "lesson-3-rule-2".

import { readJSON, writeJSON } from './storage.js'

const SUPABASE_URL = 'https://ktqmwpbzcnzkhjskqisy.supabase.co'
// מפתח ציבורי (anon) — מיועד לדפדפן, מאפשר רק מה שהמדיניות מתירה
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0cW13cGJ6Y256a2hqc2txaXN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxODM4OTgsImV4cCI6MjEwNTc1OTg5OH0.uPKn4hrLk16jhDoajMjPl4OmV5j1b3bMIECVmOdhWGI'
const BUCKET = 'imun-images'
const FN_URL = `${SUPABASE_URL}/functions/v1/imun-images`
const PUBLIC_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`
const ADMIN_KEY = 'uyc-admin'
const MAX_BYTES = 1_000_000

// ---- מצב משותף + מנויים ----
let index = new Map() // key -> גרסה (זמן עדכון)
let admin = readJSON(ADMIN_KEY, null)
const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())

export function subscribe(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

// רשימת כל התמונות נטענת פעם אחת (בקשה אחת לכל האתר)
let indexPromise = null
export function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch(`${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`, {
      method: 'POST',
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ prefix: '', limit: 1000 }),
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows) => {
        index = new Map(rows.filter((r) => r.id).map((r) => [r.name, Date.parse(r.updated_at) || 1]))
        emit()
      })
      .catch(() => {})
  }
  return indexPromise
}

export function imageUrl(key) {
  const v = index.get(key)
  return v ? `${PUBLIC_URL}${key}?v=${v}` : null
}

// ---- מנהלת ----
export const isAdmin = () => !!admin

async function callFn(action, password, { key, body, type } = {}) {
  const qs = new URLSearchParams({ action, ...(key ? { key } : {}) })
  const res = await fetch(`${FN_URL}?${qs}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ANON_KEY}`,
      'x-admin-key': password,
      ...(type ? { 'Content-Type': type } : {}),
    },
    body,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(data.error || 'error'), { code: data.error, status: res.status })
  return data
}

// התחברות: אם עוד לא הוגדרה סיסמה — הסיסמה הזו נקבעת כסיסמת המנהלת
export async function login(password) {
  try {
    await callFn('check', password)
  } catch (e) {
    if (e.code !== 'not-setup') throw e
    await callFn('setup', password)
  }
  admin = password
  writeJSON(ADMIN_KEY, password)
  emit()
  migrateLocal()
}

export function logout() {
  admin = null
  writeJSON(ADMIN_KEY, null)
  emit()
}

// ---- העלאה / מחיקה ----
export async function uploadImage(key, file) {
  const blob = await prepareImage(file, key.endsWith('cover') ? 1200 : 600)
  const { updated } = await callFn('upload', admin, { key, body: blob, type: blob.type })
  index.set(key, updated || Date.now())
  emit()
}

export async function deleteImage(key) {
  await callFn('delete', admin, { key })
  index.delete(key)
  emit()
}

// מקטין לגודל התצוגה ודוחס ל-WebP (או JPEG בדפדפנים שלא יודעים WebP)
export async function prepareImage(file, maxSide) {
  if (file.type === 'image/gif' && file.size <= MAX_BYTES) return file
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  const encode = (type, q) => new Promise((r) => canvas.toBlob(r, type, q))
  let q = 0.8
  let blob = await encode('image/webp', q)
  const type = blob?.type === 'image/webp' ? 'image/webp' : 'image/jpeg'
  if (type !== 'image/webp') blob = await encode(type, q)
  while (blob && blob.size > MAX_BYTES && q > 0.4) {
    q -= 0.15
    blob = await encode(type, q)
  }
  return blob
}

// ---- העברת תמונות ישנות שנשמרו בדפדפן (IndexedDB) לענן, פעם אחת ----
let migrating = false
export async function migrateLocal() {
  if (!admin || migrating || typeof indexedDB === 'undefined') return
  migrating = true
  try {
    if (indexedDB.databases) {
      const dbs = await indexedDB.databases()
      if (!dbs.some((d) => d.name === 'uyc-images')) return
    }
    const db = await new Promise((resolve, reject) => {
      const req = indexedDB.open('uyc-images', 1)
      req.onupgradeneeded = () => req.result.createObjectStore('images')
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
    const tx = (mode, fn) =>
      new Promise((resolve, reject) => {
        const t = db.transaction('images', mode)
        const req = fn(t.objectStore('images'))
        t.oncomplete = () => resolve(req.result)
        t.onerror = () => reject(t.error)
      })
    await loadIndex()
    const keys = await tx('readonly', (s) => s.getAllKeys())
    for (const key of keys) {
      const blob = await tx('readonly', (s) => s.get(key))
      // תמונה שכבר קיימת בענן לא נדרסת; מוחקים מקומית רק אחרי העלאה מוצלחת
      if (!index.has(key) && blob) await uploadImage(key, blob)
      await tx('readwrite', (s) => s.delete(key))
    }
    db.close()
  } catch {
    // ננסה שוב בטעינה הבאה
  } finally {
    migrating = false
  }
}

loadIndex()
if (admin) migrateLocal()
