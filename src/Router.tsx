import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from './App.tsx'

const WordleApp = lazy(() => import('./WordleApp.tsx'))
const CrosswordApp = lazy(() => import('./CrosswordApp.tsx'))

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<CrosswordApp />} />
          <Route path="/games" element={<App />} />
          <Route path="/wordle" element={<WordleApp />} />
          <Route path="/crossword" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
