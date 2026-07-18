import type { LetterState } from '../lib/game'

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

interface KeyboardProps {
  letterStates: Record<string, LetterState>
  onKey: (key: string) => void
}

export function Keyboard({ letterStates, onKey }: KeyboardProps) {
  return (
    <div className="keyboard">
      {ROWS.map((row, i) => (
        <div key={row} className="keyboard-row">
          {i === 2 && (
            <button
              className="key key-wide"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onKey('ENTER')}
            >
              Enter
            </button>
          )}
          {row.split('').map((letter) => (
            <button
              key={letter}
              className={`key ${letterStates[letter] ?? ''}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onKey(letter)}
            >
              {letter}
            </button>
          ))}
          {i === 2 && (
            <button
              className="key key-wide"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onKey('BACKSPACE')}
            >
              ⌫
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
