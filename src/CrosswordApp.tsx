import { useEffect, useMemo, useState } from 'react';
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
  // True once the last letter of the name has finished animating in — then the
  // Arjuna–Subhadra photo fades in over everything.
  const [finaleReady, setFinaleReady] = useState(false);
  const finalName = useMemo(() => getFinalName(puzzle), []);
  const revealed = solvedIds.size === puzzle.words.length;
  const lastLetterIndex = finalName.length - 1;
  const activeWordId = puzzle.words[activeIndex]?.id;
  const finaleImg = `${import.meta.env.BASE_URL}arjunasubhadra.jpeg`;

  // Preload the background artwork so the first paint isn't blank
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 760px)').matches;
    const img = new Image();
    img.src = `${import.meta.env.BASE_URL}${wide ? 'desktopm' : 'mobilem'}.png`;
  }, []);

  // Preload the photo as soon as the puzzle is solved so the fade never shows a
  // half-loaded image.
  useEffect(() => {
    if (!revealed) return;
    const img = new Image();
    img.src = finaleImg;
  }, [revealed, finaleImg]);

  // Fallback in case the last letter's `animationend` never fires (e.g. the tab
  // was backgrounded during the reveal).
  useEffect(() => {
    if (!revealed) return;
    const ms = (puzzle.words.length * 0.35 + (finalName.length - 1) * 0.15 + 0.4) * 1000 + 150;
    const t = setTimeout(() => setFinaleReady(true), ms);
    return () => clearTimeout(t);
  }, [revealed, finalName.length]);

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
      <div className="app-bg" aria-hidden="true" />
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
                    onAnimationEnd={
                      i === lastLetterIndex ? () => setFinaleReady(true) : undefined
                    }
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

      {finaleReady && (
        <div className="finale">
          <img
            className="finale-img"
            src={finaleImg}
            alt="Arjuna and Subhadra, the parents of Abhimanyu"
          />
          <div className="finale-content" role="status">
            <p className="finale-label">The name is</p>
            <div className="finale-name" aria-label={finalName}>
              {finalName.split('').map((letter, i) => (
                <span key={i} className="finale-letter">
                  {letter}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
