import { useMemo, useState } from 'react';
import CrosswordGrid from './components/CrosswordGrid';
import QuestionCarousel from './components/QuestionCarousel';
import { defaultPuzzle, getFinalName, pickWordForCell } from './config/puzzle';
import './crossword.css';

const puzzle = defaultPuzzle;

export default function CrosswordApp() {
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  // Bumped on each grid tap so the carousel scrolls even to the current slide
  const [jumpTo, setJumpTo] = useState<{ index: number } | null>(null);
  const finalName = useMemo(() => getFinalName(puzzle), []);
  const revealed = solvedIds.size === puzzle.words.length;
  const activeWordId = puzzle.words[activeIndex]?.id;

  function handleSolve(id: string) {
    setSolvedIds((prev) => new Set(prev).add(id));
  }

  function handleSelectWord(wordIds: string[]) {
    const word = pickWordForCell(wordIds, puzzle.words, solvedIds);
    const idx = word ? puzzle.words.indexOf(word) : -1;
    if (idx < 0) return;
    setActiveIndex(idx);
    setJumpTo({ index: idx });
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="title">{puzzle.title}</h1>
        {puzzle.subtitle && <p className="subtitle">{puzzle.subtitle}</p>}
      </header>

      <main className="layout">
        <section className="board">
          <CrosswordGrid
            config={puzzle}
            solvedIds={solvedIds}
            revealed={revealed}
            activeWordId={revealed ? undefined : activeWordId}
            onSelectWord={handleSelectWord}
          />
          {revealed ? (
            <div className="reveal-banner" role="status">
              <p className="reveal-label">The name is</p>
              <div className="reveal-name" aria-label={finalName}>
                {finalName.split('').map((letter, i) => (
                  <span
                    key={i}
                    className="reveal-letter"
                    style={{ animationDelay: `${puzzle.words.length * 0.35 + i * 0.15}s` }}
                  >
                    {letter}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="progress" role="status">
              <span className="progress-count">
                {solvedIds.size} / {puzzle.words.length}
              </span>{' '}
              solved
            </p>
          )}
        </section>

        <section className="questions" aria-label="Questions">
          <QuestionCarousel
            words={puzzle.words}
            solvedIds={solvedIds}
            jumpTo={jumpTo}
            onSolve={handleSolve}
            onActiveChange={setActiveIndex}
          />
        </section>
      </main>
    </div>
  );
}
