import type { LetterState } from '../lib/game'

interface TileProps {
  letter: string
  state?: LetterState
  revealDelay?: number
}

export function Tile({ letter, state, revealDelay = 0 }: TileProps) {
  const classes = ['tile']
  if (state) classes.push('revealed', state)
  else if (letter) classes.push('filled')

  return (
    <div
      className={classes.join(' ')}
      style={state ? { animationDelay: `${revealDelay}ms`, transitionDelay: `${revealDelay}ms` } : undefined}
    >
      {letter}
    </div>
  )
}
