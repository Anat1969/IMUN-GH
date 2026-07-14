import { useCallback } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getLessonById } from '../data/loadLessons.js'
import { useLessonStatus } from '../context/LessonStatusContext.jsx'
import BackButton from '../components/BackButton.jsx'
import LayerSection from '../components/LayerSection.jsx'
import RulesList from '../components/RulesList.jsx'
import KnowledgeSection from '../components/KnowledgeSection.jsx'
import PracticeCard from '../components/PracticeCard.jsx'
import styles from './LessonScreen.module.css'

export default function LessonScreen() {
  const { id } = useParams()
  const lesson = getLessonById(id)
  const { markCompleted } = useLessonStatus()

  const handleComplete = useCallback(() => {
    if (lesson) markCompleted(lesson.id)
  }, [lesson, markCompleted])

  if (!lesson) return <Navigate to="/" replace />

  const hasKnowledge = Array.isArray(lesson.knowledge) && lesson.knowledge.length > 0

  return (
    <main className="container">
      <BackButton />

      <header className={styles.header}>
        <h1 className={styles.title}>{lesson.title}</h1>
        {lesson.titleEn && <p className={styles.subtitle}>{lesson.titleEn}</p>}
        <span className={styles.duration}>{lesson.duration}</span>
      </header>

      <LayerSection label="עיקרון">
        <p className={styles.principle}>{lesson.principle}</p>
      </LayerSection>

      <LayerSection label="כללי פעולה">
        <RulesList rules={lesson.rules ?? []} />
      </LayerSection>

      {hasKnowledge && (
        <LayerSection label="מאגר מידע">
          <KnowledgeSection paragraphs={lesson.knowledge} />
        </LayerSection>
      )}

      <LayerSection label="תרגול">
        <PracticeCard scenarios={lesson.scenarios ?? []} onComplete={handleComplete} />
      </LayerSection>
    </main>
  )
}
