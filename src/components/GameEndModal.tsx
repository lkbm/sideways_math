// Modal shown when game ends (win or lose)

import type { Puzzle, Difficulty } from '../types';
import { WinCelebration } from './WinCelebration';

interface GameEndModalProps {
  isWin: boolean;
  puzzle: Puzzle;
  guessCount: number;
  unlockedDifficulties: Difficulty[];
  onNewGame: (difficulty: Difficulty) => void;
  onShowDifficulty: () => void;
  onShowArchive: () => void;
}

export function GameEndModal({
  isWin,
  puzzle,
  guessCount,
  unlockedDifficulties,
  onNewGame,
  onShowDifficulty,
  onShowArchive
}: GameEndModalProps) {
  // Format solution for display
  const solutionDisplay = puzzle.letters
    .map(l => `${l}=${puzzle.solution[l]}`)
    .join(', ');

  // Determine next difficulty
  const getNextDifficulty = (): Difficulty | null => {
    if (puzzle.difficulty === 'easy' && unlockedDifficulties.includes('medium')) {
      return 'medium';
    }
    if (puzzle.difficulty === 'medium' && unlockedDifficulties.includes('hard')) {
      return 'hard';
    }
    return null;
  };

  const nextDifficulty = getNextDifficulty();

  // Format difficulty for display
  const formatDifficulty = (diff: Difficulty) => {
    return diff.charAt(0).toUpperCase() + diff.slice(1);
  };

  return (
    <div class="modal-overlay" onClick={onShowDifficulty}>
      <div class={`modal ${isWin ? `modal-win-${puzzle.difficulty}` : ''}`} onClick={e => e.stopPropagation()}>
        {isWin && <WinCelebration difficulty={puzzle.difficulty} guessCount={guessCount} />}
        <h2>{isWin ? 'You got it!' : 'Game Over'}</h2>

        {isWin ? (
          <p class="win-message">
            Solved {formatDifficulty(puzzle.difficulty)} level in {guessCount} {guessCount === 1 ? 'guess' : 'guesses'}!
          </p>
        ) : (
          <div class="lose-message">
            <p>The solution was:</p>
            <p class="solution">{solutionDisplay}</p>
          </div>
        )}

        <div class="modal-buttons">
          {nextDifficulty ? (
            <button
              class="btn btn-primary"
              onClick={() => onNewGame(nextDifficulty)}
              type="button"
            >
              Play {formatDifficulty(nextDifficulty)}
            </button>
          ) : (
            <button
              class="btn btn-primary"
              onClick={onShowArchive}
              type="button"
            >
              Play Again Tomorrow
            </button>
          )}
          <button
            class="btn btn-secondary"
            onClick={onShowDifficulty}
            type="button"
          >
            Choose Level
          </button>
          <button
            class="btn btn-secondary"
            onClick={onShowArchive}
            type="button"
          >
            Browse Archive
          </button>
        </div>
      </div>
    </div>
  );
}
