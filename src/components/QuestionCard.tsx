import { useState, type FocusEvent, type FormEvent } from 'react';
import { normalizeGuess, type PuzzleWord } from '../config/puzzle';

interface Props {
  word: PuzzleWord;
  number: number;
  solved: boolean;
  onSolve: (id: string) => void;
}

export default function QuestionCard({ word, number, solved, onSolve }: Props) {
  const [guess, setGuess] = useState('');
  const [wrong, setWrong] = useState(false);

  // Keep the input visible when the on-screen keyboard opens; the delay lets
  // the keyboard finish resizing the viewport first
  function handleFocus(e: FocusEvent<HTMLInputElement>) {
    const input = e.target;
    setTimeout(() => {
      input.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    }, 300);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (normalizeGuess(guess) === word.answer) {
      onSolve(word.id);
    } else {
      setGuess('');
      setWrong(true);
      setTimeout(() => setWrong(false), 600);
    }
  }

  if (solved) {
    return (
      <div className="card card--solved">
        <span className="card-number card-number--solved">✓</span>
        <div className="card-body">
          <p className="card-clue">{word.clue}</p>
          <p className="card-answer">{word.answer}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card${wrong ? ' card--wrong' : ''}`}>
      <span className="card-number">{number}</span>
      <div className="card-body">
        <p className="card-clue">{word.clue}</p>
        <form className="card-form" onSubmit={handleSubmit}>
          <input
            className="card-input"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="characters"
            enterKeyHint="go"
            placeholder={`${word.answer.length} letters`}
            aria-label={`Answer for question ${number}`}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onFocus={handleFocus}
          />
          <button className="card-check" type="submit" disabled={guess.trim() === ''}>
            Check
          </button>
        </form>
        {wrong && (
          <p className="card-hint" role="alert">
            Not quite — try again
          </p>
        )}
      </div>
    </div>
  );
}
