import { useMemo } from 'react';
import { buildGrid, cellKey, type PuzzleConfig } from '../config/puzzle';

interface Props {
  config: PuzzleConfig;
  solvedIds: Set<string>;
  revealed: boolean;
  /** Word whose cells are outlined so the player sees its length and position */
  activeWordId?: string;
  /** Click a filled cell to jump to its question; omit to keep the grid inert */
  onSelectWord?: (wordIds: string[]) => void;
}

export default function CrosswordGrid({
  config,
  solvedIds,
  revealed,
  activeWordId,
  onSelectWord,
}: Props) {
  const grid = useMemo(() => buildGrid(config), [config]);

  // Reveal cells light up in word order during the finale
  const revealOrder = useMemo(() => {
    const order = new Map<string, number>();
    config.words.forEach((w, i) => order.set(w.id, i));
    return order;
  }, [config]);

  const interactive = !revealed && onSelectWord !== undefined;

  const rows = [];
  for (let r = 0; r < grid.rows; r++) {
    for (let c = 0; c < grid.cols; c++) {
      const cell = grid.cells.get(cellKey(r, c));
      if (!cell) {
        rows.push(<div key={cellKey(r, c)} className="cell cell--void" aria-hidden="true" />);
        continue;
      }
      const solved = cell.wordIds.some((id) => solvedIds.has(id));
      const isReveal = revealed && cell.revealOf !== undefined;
      const isActive = activeWordId !== undefined && cell.wordIds.includes(activeWordId);
      const classes = [
        'cell',
        solved ? 'cell--solved' : 'cell--blank',
        isReveal ? 'cell--reveal' : '',
        isActive ? 'cell--focus' : '',
        interactive ? 'cell--btn' : '',
      ]
        .filter(Boolean)
        .join(' ');
      const delay = isReveal ? `${(revealOrder.get(cell.revealOf!) ?? 0) * 0.35}s` : undefined;
      const style = delay ? { animationDelay: delay } : undefined;
      const content = solved ? cell.letter : '';

      if (interactive) {
        const numbers = cell.wordIds
          .map((id) => config.words.findIndex((w) => w.id === id) + 1)
          .filter((n) => n > 0);
        rows.push(
          <button
            key={cellKey(r, c)}
            type="button"
            className={classes}
            style={style}
            aria-label={`Question ${numbers.join(' or ')}`}
            onClick={() => onSelectWord!(cell.wordIds)}
          >
            {content}
          </button>,
        );
        continue;
      }

      rows.push(
        <div key={cellKey(r, c)} className={classes} style={style}>
          {content}
        </div>,
      );
    }
  }

  return (
    <div
      className="grid"
      role={interactive ? undefined : 'img'}
      aria-label={
        interactive
          ? 'Crossword grid — tap a square to jump to its clue'
          : 'Crossword grid'
      }
      style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}
    >
      {rows}
    </div>
  );
}
