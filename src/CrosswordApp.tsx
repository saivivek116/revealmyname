import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CrosswordGrid from './components/CrosswordGrid';
import QuestionCarousel from './components/QuestionCarousel';
import { defaultPuzzle, getFinalName } from './config/puzzle';
import './crossword.css';

const puzzle = defaultPuzzle;

export default function CrosswordApp() {
  const [solvedIds, setSolvedIds] = useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = useState(0);
  const finalName = useMemo(() => getFinalName(puzzle), []);
  const revealed = solvedIds.size === puzzle.words.length;
  const activeWordId = puzzle.words[activeIndex]?.id;

  function handleSolve(id: string) {
    setSolvedIds((prev) => new Set(prev).add(id));
  }

  return (
    <div className="app">
      <header className="header">
        <Link className="home-link" to="/">
          ← Games
        </Link>
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
            onSolve={handleSolve}
            onActiveChange={setActiveIndex}
          />
        </section>
      </main>
    </div>
  );
}
