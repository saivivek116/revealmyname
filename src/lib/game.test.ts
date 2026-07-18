import { describe, it, expect } from 'vitest'
import { evaluateGuess, getSecretName, isValidGuess } from './game'

describe('evaluateGuess', () => {
  it('marks every letter correct on an exact match', () => {
    expect(evaluateGuess('SOPHIA', 'SOPHIA')).toEqual([
      'correct',
      'correct',
      'correct',
      'correct',
      'correct',
      'correct',
    ])
  })

  it('marks every letter absent when nothing matches', () => {
    expect(evaluateGuess('BOB', 'KIM')).toEqual(['absent', 'absent', 'absent'])
  })

  it('marks a letter present when it exists elsewhere', () => {
    expect(evaluateGuess('AMOS', 'NOAH')).toEqual([
      'present',
      'absent',
      'present',
      'absent',
    ])
  })

  it('handles duplicate letters in the guess against a single occurrence', () => {
    // ANNA vs NADIA: A@0 present, N@1 present, N@2 absent (only one N), A@3 present
    expect(evaluateGuess('ANNA', 'NADIA')).toEqual([
      'present',
      'present',
      'absent',
      'present',
    ])
  })

  it('does not reuse a letter already consumed by a green match', () => {
    // ELLE vs ELIE: both Es and the first L are green; the answer has no
    // second L left, so L@2 must be absent, not present
    expect(evaluateGuess('ELLE', 'ELIE')).toEqual([
      'correct',
      'correct',
      'absent',
      'correct',
    ])
  })

  it('caps present marks at the number of unmatched occurrences', () => {
    // EEE vs ELI: E@0 correct, no more Es in answer, so E@1 and E@2 absent
    expect(evaluateGuess('EEE', 'ELI')).toEqual(['correct', 'absent', 'absent'])
  })
})

describe('isValidGuess', () => {
  it('rejects guesses of the wrong length', () => {
    expect(isValidGuess('SOPHIA', 'NOAH')).toBe(false)
  })

  it('accepts a known name of the right length', () => {
    expect(isValidGuess('NOAH', 'ANNA')).toBe(true)
  })

  it('accepts any guess of the right length', () => {
    expect(isValidGuess('XQZW', 'NOAH')).toBe(true)
  })

  it('always accepts the answer itself', () => {
    expect(isValidGuess('XQZWY', 'XQZWY')).toBe(true)
  })
})

describe('getSecretName', () => {
  it('uses a valid name from the query string', () => {
    expect(getSecretName('?name=Sophia')).toBe('SOPHIA')
  })

  it('falls back to a random pool name when the param is invalid', () => {
    const name = getSecretName('?name=not-a-name-123')
    expect(name).toMatch(/^[A-Z]{3,10}$/)
  })

  it('returns a random pool name without a param', () => {
    const name = getSecretName('')
    expect(name).toMatch(/^[A-Z]{3,10}$/)
  })
})
