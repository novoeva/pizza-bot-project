import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import { GameActionsProvider } from './components/GameActions.jsx'
import Landing from './screens/Landing.jsx'
import Workshop from './screens/Workshop.jsx'
import ProgressScreen from './screens/ProgressScreen.jsx'
import GameScreen from './screens/GameScreen.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <GameActionsProvider>
        <div className="h-full bg-bg text-text">
          <Routes>
            {/* The landing page is the entry point: it sets up the premise
                (you're the pizzeria owner building a bot) before anyone reaches
                the Workshop. It lives outside <Layout> so it has no app tab bar —
                it's a front door, not a tab. */}
            <Route path="/" element={<Landing />} />
            <Route element={<Layout />}>
              <Route path="/workshop" element={<Workshop />} />
              <Route path="/progress" element={<ProgressScreen />} />
              <Route path="/game/:termId" element={<GameScreen />} />
            </Route>
          </Routes>
        </div>
      </GameActionsProvider>
    </BrowserRouter>
  )
}
