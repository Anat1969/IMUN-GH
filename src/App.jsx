import { Routes, Route, Navigate } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen.jsx'
import LessonScreen from './screens/LessonScreen.jsx'
import AdminScreen from './screens/AdminScreen.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/lesson/:id" element={<LessonScreen />} />
      <Route path="/admin" element={<AdminScreen />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
