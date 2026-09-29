import { useRef, useState } from 'react'
import { useStoredImage } from '../hooks/useStoredImage.js'
import styles from './ImageSlot.module.css'

// מסגרת תמונה: לחיצה לבחירת קובץ, גרירה ושחרור, או הדבקה (Ctrl+V) כשהמסגרת בפוקוס.
export default function ImageSlot({ storageKey, variant = 'side', label = 'הוספת תמונה' }) {
  const { url, save, remove } = useStoredImage(storageKey)
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [busy, setBusy] = useState(false)
  const [zoomed, setZoomed] = useState(false)

  async function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    setBusy(true)
    try {
      await save(file)
    } finally {
      setBusy(false)
    }
  }

  const pick = () => inputRef.current?.click()

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files?.[0])
  }

  function onPaste(e) {
    const item = [...(e.clipboardData?.items ?? [])].find((i) => i.type.startsWith('image/'))
    if (item) {
      e.preventDefault()
      handleFile(item.getAsFile())
    }
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      url ? setZoomed(true) : pick()
    }
  }

  const className = [
    styles.slot,
    styles[variant],
    url ? styles.filled : styles.empty,
    dragging && styles.dragging,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={className}
      data-filled={url ? '' : undefined}
      tabIndex={0}
      role="button"
      aria-label={url ? 'הגדלת תמונה' : label}
      title={url ? undefined : `${label} — לחיצה, גרירה או הדבקה`}
      onClick={() => (url ? setZoomed(true) : pick())}
      onKeyDown={onKeyDown}
      onPaste={onPaste}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.target.value = ''
        }}
      />

      {url ? (
        <>
          <img className={styles.img} src={url} alt="" />
          <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
            <button type="button" className={styles.action} onClick={pick} aria-label="החלפת תמונה" title="החלפה">
              ⟳
            </button>
            <button type="button" className={styles.action} onClick={remove} aria-label="מחיקת תמונה" title="מחיקה">
              ✕
            </button>
          </div>
        </>
      ) : (
        <div className={styles.placeholder}>
          <span className={styles.plus}>{busy ? '…' : '+'}</span>
          <span className={styles.hint}>{variant === 'cover' ? label : 'תמונה'}</span>
        </div>
      )}

      {zoomed && url && (
        <div
          className={styles.lightbox}
          onClick={(e) => {
            e.stopPropagation()
            setZoomed(false)
          }}
        >
          <img src={url} alt="" />
        </div>
      )}
    </div>
  )
}
