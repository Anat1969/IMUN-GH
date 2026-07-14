import { Link } from 'react-router-dom'
import styles from './BackButton.module.css'

export default function BackButton() {
  return (
    <Link to="/" className={styles.back}>
      חזרה לרשימה
    </Link>
  )
}
