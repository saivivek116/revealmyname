import { useCallback, useEffect, useRef, useState } from 'react'
import {
  maxGuesses,
  evaluateGuess,
  getSecretName,
  isValidGuess,
  pickRandomName,
  type LetterState,
} from './lib/game'
import { Board } from './components/Board'
import { Keyboard } from './components/Keyboard'
import './wordle.css'

type Status = 'playing' | 'won' | 'lost'

const STATE_RANK: Record<LetterState, number> = {
  absent: 0,
  present: 1,
  correct: 2,
}

function keyboardStates(guesses: string[], answer: string) {
  const states: Record<string, LetterState> = {}
  for (const guess of guesses) {
    const result = evaluateGuess(guess, answer)
    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i]
      const prev = states[letter]
      if (!prev || STATE_RANK[result[i]] > STATE_RANK[prev]) {
        states[letter] = result[i]
      }
    }
  }
  return states
}

export default function WordleApp() {
  const [answer, setAnswer] = useState(() => getSecretName())
  const [guesses, setGuesses] = useState<string[]>([])
  const [current, setCurrent] = useState('')
  const [status, setStatus] = useState<Status>('playing')
  const [shaking, setShaking] = useState(false)
  const [toast, setToast] = useState('')
  const toastTimer = useRef<number | undefined>(undefined)

  const showToast = useCallback((message: string) => {
    setToast(message)
    setShaking(true)
    window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => {
      setToast('')
      setShaking(false)
    }, 1200)
  }, [])

  const resetBoard = useCallback((nextAnswer: string) => {
    setAnswer(nextAnswer)
    setGuesses([])
    setCurrent('')
    setStatus('playing')
    setToast('')
    setShaking(false)
  }, [])

  const handleKey = useCallback(
    (key: string) => {
      if (status !== 'playing') return
      if (key === 'BACKSPACE') {
        setCurrent((c) => c.slice(0, -1))
        return
      }
      if (key === 'ENTER') {
        if (current.length < answer.length) {
          showToast('Not enough letters')
          return
        }
        if (!isValidGuess(current, answer)) {
          showToast('Not enough letters')
          return
        }
        const nextGuesses = [...guesses, current]
        setGuesses(nextGuesses)
        setCurrent('')
        if (current === answer) {
          setStatus('won')
        } else if (nextGuesses.length === maxGuesses(answer)) {
          setStatus('lost')
        }
        return
      }
      if (/^[A-Z]$/.test(key)) {
        setCurrent((c) => (c.length < answer.length ? c + key : c))
      }
    },
    [status, current, answer, guesses, showToast],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === 'Enter') handleKey('ENTER')
      else if (event.key === 'Backspace') handleKey('BACKSPACE')
      else if (/^[a-zA-Z]$/.test(event.key)) handleKey(event.key.toUpperCase())
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleKey])

  return (
    <div className="wordle">
      <header className="wordle-header">
        <a className="wordle-home" href="/">
          ← Games
        </a>
        <h1>Name Wordle</h1>
        <p className="wordle-subtitle">
          Guess the {answer.length}-letter name in {maxGuesses(answer)} tries
        </p>
      </header>

      {toast && <div className="wordle-toast">{toast}</div>}

      <Board answer={answer} guesses={guesses} current={current} shaking={shaking} />

      {status === 'playing' ? (
        <Keyboard letterStates={keyboardStates(guesses, answer)} onKey={handleKey} />
      ) : (
        <div className="wordle-banner">
          {status === 'won' ? (
            <>
              <p className="wordle-banner-title">You got it! 🎉</p>
              <p>The name was {answer}.</p>
              <div className="wordle-banner-actions">
                <button onClick={() => resetBoard(pickRandomName())}>Play again</button>
              </div>
            </>
          ) : (
            <>
              <p className="wordle-banner-title">Out of tries!</p>
              <p>The name stays hidden — want another shot?</p>
              <div className="wordle-banner-actions">
                <button onClick={() => resetBoard(answer)}>Retry same name</button>
                <button className="secondary" onClick={() => resetBoard(pickRandomName())}>
                  New name
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
