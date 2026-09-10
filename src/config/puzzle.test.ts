import { describe, expect, it } from 'vitest';
import { cellKey, cellsOf, defaultPuzzle, getFinalName, validateConfig } from './puzzle';

describe('defaultPuzzle', () => {
  it('has a valid, non-conflicting grid', () => {
    expect(() => validateConfig(defaultPuzzle)).not.toThrow();
  });

  it('reveals ABHIMANYU', () => {
    expect(getFinalName(defaultPuzzle)).toBe('ABHIMANYU');
  });

  it('has one question per letter', () => {
    expect(defaultPuzzle.words).toHaveLength(9);
  });

  it('has no oversized entry', () => {
    for (const word of defaultPuzzle.words) {
      expect(word.answer.length).toBeLessThanOrEqual(8);
    }
  });

  it('never gives the hidden name away as an answer', () => {
    for (const word of defaultPuzzle.words) {
      expect(['ABHIMANYU', 'ABHIMANYUDU']).not.toContain(word.answer);
    }
  });

  it('stays a balanced crossword (>= 4 words each direction)', () => {
    const across = defaultPuzzle.words.filter((w) => w.direction === 'across').length;
    expect(across).toBeGreaterThanOrEqual(4);
    expect(defaultPuzzle.words.length - across).toBeGreaterThanOrEqual(4);
  });

  it('words only touch at real crossings (no side-by-side or head-to-tail runs)', () => {
    const at = new Map<string, Set<string>>();
    for (const word of defaultPuzzle.words) {
      for (const cell of cellsOf(word)) {
        const key = cellKey(cell.row, cell.col);
        let ids = at.get(key);
        if (!ids) at.set(key, (ids = new Set()));
        ids.add(word.id);
      }
    }
    for (const [key, ids] of at) {
      const [row, col] = key.split(',').map(Number);
      for (const [dr, dc] of [
        [0, 1],
        [1, 0],
      ]) {
        const neighbour = at.get(cellKey(row + dr, col + dc));
        if (neighbour && ![...ids].some((id) => neighbour.has(id))) {
          throw new Error(`illegal adjacency between different words at ${key}`);
        }
      }
    }
  });
});
