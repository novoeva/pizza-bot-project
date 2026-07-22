import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Workshop from './screens/Workshop.jsx'
import ProgressScreen from './screens/ProgressScreen.jsx'
import GameScreen from './screens/GameScreen.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg text-text">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Workshop />} />
            <Route path="/progress" element={<ProgressScreen />} />
            <Route path="/game/:termId" element={<GameScreen />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}
