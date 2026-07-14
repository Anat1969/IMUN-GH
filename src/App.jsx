import { Routes, Route, Navigate } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen.jsx'
import LessonScreen from './screens/LessonScreen.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/lesson/:id" element={<LessonScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
