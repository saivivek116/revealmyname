import { maxGuesses, evaluateGuess } from '../lib/game'
import { Tile } from './Tile'

interface BoardProps {
  answer: string
  guesses: string[]
  current: string
  shaking: boolean
}

export function Board({ answer, guesses, current, shaking }: BoardProps) {
  const cols = answer.length
  const rows = []

  for (let row = 0; row < maxGuesses(answer); row++) {
    const isCurrent = row === guesses.length
    const guess = guesses[row]
    const states = guess ? evaluateGuess(guess, answer) : undefined
    const letters = guess ?? (isCurrent ? current : '')

    const tiles = []
    for (let col = 0; col < cols; col++) {
      tiles.push(
        <Tile
          key={col}
          letter={letters[col] ?? ''}
          state={states?.[col]}
          revealDelay={col * 250}
        />,
      )
    }

    rows.push(
      <div
        key={row}
        className={`board-row${isCurrent && shaking ? ' shake' : ''}`}
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {tiles}
      </div>,
    )
  }

  return (
    <div className="board" style={{ '--cols': cols } as React.CSSProperties}>
      {rows}
    </div>
  )
}
