import { NAME_POOL } from '../data/names'

export type LetterState = 'correct' | 'present' | 'absent'

export const MIN_GUESSES = 5

export function maxGuesses(answer: string): number {
  return Math.max(MIN_GUESSES, answer.length)
}

export function evaluateGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = new Array(guess.length).fill('absent')
  const remaining: Record<string, number> = {}

  for (let i = 0; i < answer.length; i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct'
    } else {
      remaining[answer[i]] = (remaining[answer[i]] ?? 0) + 1
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === 'correct') continue
    const letter = guess[i]
    if (remaining[letter]) {
      result[i] = 'present'
      remaining[letter]--
    }
  }

  return result
}

export function pickRandomName(): string {
  return NAME_POOL[Math.floor(Math.random() * NAME_POOL.length)]
}

export function getSecretName(search: string = window.location.search): string {
  const param = new URLSearchParams(search).get('name')
  if (param && /^[A-Za-z]{3,10}$/.test(param)) {
    return param.toUpperCase()
  }
  return pickRandomName()
}

export function isValidGuess(guess: string, answer: string): boolean {
  return guess.length === answer.length
}
