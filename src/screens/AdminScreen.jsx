import { useState, useSyncExternalStore } from 'react'
import { useNavigate } from 'react-router-dom'
import { subscribe, isAdmin, login, logout } from '../lib/imageStore.js'
import BackButton from '../components/BackButton.jsx'
import styles from './AdminScreen.module.css'

// כניסת מנהלת: מאפשרת העלאת תמונות. בפעם הראשונה הסיסמה שמוקלדת נקבעת כסיסמת המנהלת.
export default function AdminScreen() {
  const admin = useSyncExternalStore(subscribe, isAdmin)
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (password.length < 6) return setError('הסיסמה צריכה להיות באורך 6 תווים לפחות.')
    setBusy(true)
    setError('')
    try {
      await login(password)
      navigate('/')
    } catch (err) {
      setError(err.status === 401 ? 'הסיסמה שגויה.' : 'משהו השתבש. נסי שוב בעוד רגע.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="container">
      <BackButton />
      <div className={styles.box}>
        <h1 className={styles.title}>ניהול תמונות</h1>
        {admin ? (
          <>
            <p className={styles.text}>את מחוברת כמנהלת. בכל מסגרת באתר אפשר להוסיף, להחליף ולמחוק תמונות.</p>
            <button className={styles.ghost} onClick={logout}>
              התנתקות בדפדפן הזה
            </button>
          </>
        ) : (
          <form onSubmit={onSubmit}>
            <p className={styles.text}>
              הקלידי את סיסמת המנהלת כדי להעלות תמונות. בכניסה הראשונה — הסיסמה שתקלידי תיקבע כסיסמה.
            </p>
            <input
              className={styles.input}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה"
            />
            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.primary} disabled={busy}>
              {busy ? 'בודקת…' : 'כניסה'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
