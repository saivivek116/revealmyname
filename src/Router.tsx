import { Suspense, lazy } from 'react'
import App from './App.tsx'

const WordleApp = lazy(() => import('./WordleApp.tsx'))
const CrosswordApp = lazy(() => import('./CrosswordApp.tsx'))

function pageForPath(path: string) {
  if (path === '/wordle' || path.startsWith('/wordle/')) return <WordleApp />
  if (path === '/crossword' || path.startsWith('/crossword/')) return <CrosswordApp />
  return <App />
}

export default function Router() {
  return <Suspense fallback={null}>{pageForPath(window.location.pathname)}</Suspense>
}
