import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Workshop from './screens/Workshop.jsx'
import GameScreen from './screens/GameScreen.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-bg text-text">
        <Routes>
          <Route path="/" element={<Workshop />} />
          <Route path="/game/:termId" element={<GameScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
