import { useEffect, useRef, useState } from 'react';
import QuestionCard from './QuestionCard';
import type { PuzzleWord } from '../config/puzzle';

interface Props {
  words: PuzzleWord[];
  solvedIds: Set<string>;
  onSolve: (id: string) => void;
  onActiveChange?: (index: number) => void;
}

export default function QuestionCarousel({ words, solvedIds, onSolve, onActiveChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const prevSolvedCount = useRef(solvedIds.size);

  useEffect(() => {
    onActiveChange?.(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  function scrollTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(words.length - 1, index));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: 'smooth' });
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  }

  // After a correct answer, move on to the next unsolved question
  useEffect(() => {
    if (solvedIds.size <= prevSolvedCount.current) {
      prevSolvedCount.current = solvedIds.size;
      return;
    }
    prevSolvedCount.current = solvedIds.size;
    if (solvedIds.size === words.length) return;
    const timer = setTimeout(() => {
      for (let step = 1; step <= words.length; step++) {
        const next = (active + step) % words.length;
        if (!solvedIds.has(words[next].id)) {
          scrollTo(next);
          return;
        }
      }
    }, 700);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solvedIds]);

  return (
    <div className="carousel">
      <div className="carousel-row">
        <button
          className="carousel-arrow carousel-arrow--prev"
          type="button"
          aria-label="Previous question"
          disabled={active === 0}
          onClick={() => scrollTo(active - 1)}
        >
          ‹
        </button>
        <div className="carousel-track" ref={trackRef} onScroll={handleScroll}>
          {words.map((word, i) => (
            <div className="carousel-slide" key={word.id} inert={i !== active}>
              <QuestionCard
                word={word}
                number={i + 1}
                solved={solvedIds.has(word.id)}
                onSolve={onSolve}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-arrow carousel-arrow--next"
          type="button"
          aria-label="Next question"
          disabled={active === words.length - 1}
          onClick={() => scrollTo(active + 1)}
        >
          ›
        </button>
      </div>
      <div className="carousel-dots" role="tablist" aria-label="Questions">
        {words.map((word, i) => (
          <button
            key={word.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Question ${i + 1}${solvedIds.has(word.id) ? ', solved' : ''}`}
            className={[
              'carousel-dot',
              i === active ? 'carousel-dot--active' : '',
              solvedIds.has(word.id) ? 'carousel-dot--solved' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => scrollTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
