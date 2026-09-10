export type Direction = 'across' | 'down';

export interface PuzzleWord {
  /** Unique id, also used as React key */
  id: string;
  /** The question shown to the player */
  clue: string;
  /** Answer in A–Z letters only */
  answer: string;
  direction: Direction;
  /** 0-based grid position of the first letter */
  row: number;
  col: number;
  /** 0-based index into `answer` of the letter that joins the final name */
  revealIndex: number;
}

export interface PuzzleConfig {
  title: string;
  subtitle?: string;
  words: PuzzleWord[];
}

export interface GridCell {
  row: number;
  col: number;
  letter: string;
  /** ids of every word passing through this cell */
  wordIds: string[];
  /** id of the word whose reveal letter lives here (if any) */
  revealOf?: string;
}

/**
 * Swap this config to change the whole game. `revealIndex` letters,
 * read in word order, spell the final name.
 */
export const defaultPuzzle: PuzzleConfig = {
  title: 'Reveal My Name',
  subtitle: 'Answer all 9 questions to light up the hidden name',
  // Reveal letters, read in word order, spell ABHIMANYU. The grid interlocks as a
  // balanced crossword — 5 across (BHISHMA, BHIMA, INDRA, VYASA, DRONA) and
  // 4 down (SUBHADRA, HANUMAN, VIRATA, UTTARA) — with every pair of words
  // sharing only a real crossing cell (no side-by-side or head-to-tail adjacency).
  words: [
    {
      id: 'subhadra',
      clue: "Krishna's younger sister, given in marriage to Arjuna",
      answer: 'SUBHADRA',
      direction: 'down',
      row: 0,
      col: 4,
      revealIndex: 7, // A
    },
    {
      id: 'bhima',
      clue: "The second Pandava, whose mace shattered Duryodhana's thigh",
      answer: 'BHIMA',
      direction: 'across',
      row: 2,
      col: 4,
      revealIndex: 0, // B — shared with SUBHADRA's third letter
    },
    {
      id: 'hanuman',
      clue: "The vanara deity who blazed on Arjuna's chariot banner at Kurukshetra",
      answer: 'HANUMAN',
      direction: 'down',
      row: 1,
      col: 8,
      revealIndex: 0, // H
    },
    {
      id: 'indra',
      clue: 'King of the devas and the divine father of Arjuna',
      answer: 'INDRA',
      direction: 'across',
      row: 4,
      col: 0,
      revealIndex: 0, // I
    },
    {
      id: 'bhishma',
      clue: 'The Kuru grandsire who chose to fall on a bed of arrows',
      answer: 'BHISHMA',
      direction: 'across',
      row: 0,
      col: 1,
      revealIndex: 5, // M
    },
    {
      id: 'virata',
      clue: 'The Pandavas spent their 13th year of exile in disguise in his kingdom?King name?',
      answer: 'VIRATA',
      direction: 'down',
      row: 3,
      col: 0,
      revealIndex: 5, // A
    },
    {
      id: 'drona',
      clue: 'Who was the commander associated with the Chakravyuha formation?',
      answer: 'DRONA',
      direction: 'across',
      row: 9,
      col: 2,
      revealIndex: 3, // N
    },
    {
      id: 'vyasa',
      clue: 'The sage who dictated the epic of the Bharatas to Ganesha, who set it down as scribe',
      answer: 'VYASA',
      direction: 'across',
      row: 7,
      col: 2,
      revealIndex: 1, // Y
    },
    {
      id: 'uttara',
      clue: 'Daughter of King Virata',
      answer: 'UTTARA',
      direction: 'down',
      row: 4,
      col: 6,
      revealIndex: 0, // U
    },
  ],
};

export function cellsOf(word: PuzzleWord): Array<{ row: number; col: number; letter: string }> {
  return word.answer.split('').map((letter, i) => ({
    row: word.direction === 'down' ? word.row + i : word.row,
    col: word.direction === 'across' ? word.col + i : word.col,
    letter,
  }));
}

export const cellKey = (row: number, col: number) => `${row},${col}`;

export interface BuiltGrid {
  rows: number;
  cols: number;
  cells: Map<string, GridCell>;
}

/**
 * Throws when two words disagree on a shared cell's letter, an answer is
 * malformed, or a reveal index is out of range — so config edits fail loudly.
 */
export function validateConfig(config: PuzzleConfig): void {
  const seen = new Map<string, { letter: string; wordId: string }>();
  const ids = new Set<string>();
  for (const word of config.words) {
    if (ids.has(word.id)) throw new Error(`Duplicate word id "${word.id}"`);
    ids.add(word.id);
    if (!/^[A-Z]+$/.test(word.answer)) {
      throw new Error(`Answer for "${word.id}" must be uppercase A–Z letters only`);
    }
    if (word.revealIndex < 0 || word.revealIndex >= word.answer.length) {
      throw new Error(`revealIndex out of range for "${word.id}"`);
    }
    if (word.row < 0 || word.col < 0) {
      throw new Error(`Word "${word.id}" starts outside the grid`);
    }
    for (const { row, col, letter } of cellsOf(word)) {
      const key = cellKey(row, col);
      const existing = seen.get(key);
      if (existing && existing.letter !== letter) {
        throw new Error(
          `Cell ${key} conflict: "${existing.wordId}" wants ${existing.letter}, "${word.id}" wants ${letter}`,
        );
      }
      seen.set(key, { letter, wordId: word.id });
    }
  }
}

export function buildGrid(config: PuzzleConfig): BuiltGrid {
  validateConfig(config);
  const cells = new Map<string, GridCell>();
  let rows = 0;
  let cols = 0;
  for (const word of config.words) {
    cellsOf(word).forEach(({ row, col, letter }, i) => {
      const key = cellKey(row, col);
      const cell = cells.get(key) ?? { row, col, letter, wordIds: [] };
      cell.wordIds.push(word.id);
      if (i === word.revealIndex) cell.revealOf = word.id;
      cells.set(key, cell);
      rows = Math.max(rows, row + 1);
      cols = Math.max(cols, col + 1);
    });
  }
  return { rows, cols, cells };
}

/** The hidden name: reveal letters read in word order. */
export function getFinalName(config: PuzzleConfig): string {
  return config.words.map((w) => w.answer[w.revealIndex]).join('');
}

export const normalizeGuess = (guess: string) => guess.replace(/[^a-zA-Z]/g, '').toUpperCase();
