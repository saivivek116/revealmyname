import { useMemo } from 'react';
import { buildGrid, cellKey, type PuzzleConfig } from '../config/puzzle';

interface Props {
  config: PuzzleConfig;
  solvedIds: Set<string>;
  revealed: boolean;
  /** Word whose cells are outlined so the player sees its length and position */
  activeWordId?: string;
}

export default function CrosswordGrid({ config, solvedIds, revealed, activeWordId }: Props) {
  const grid = useMemo(() => buildGrid(config), [config]);

  // Reveal cells light up in word order during the finale
  const revealOrder = useMemo(() => {
    const order = new Map<string, number>();
    config.words.forEach((w, i) => order.set(w.id, i));
    return order;
  }, [config]);

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
      ]
        .filter(Boolean)
        .join(' ');
      const delay = isReveal ? `${(revealOrder.get(cell.revealOf!) ?? 0) * 0.35}s` : undefined;
      rows.push(
        <div
          key={cellKey(r, c)}
          className={classes}
          style={delay ? { animationDelay: delay } : undefined}
        >
          {solved ? cell.letter : ''}
        </div>,
      );
    }
  }

  return (
    <div
      className="grid"
      role="img"
      aria-label="Crossword grid"
      style={{ gridTemplateColumns: `repeat(${grid.cols}, 1fr)` }}
    >
      {rows}
    </div>
  );
}
