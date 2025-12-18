// Modal shown when game ends (win or lose)

import type { Puzzle, Difficulty } from '../types';

interface GameEndModalProps {
  isWin: boolean;
  puzzle: Puzzle;
  guessCount: number;
  onNewGame: (difficulty: Difficulty) => void;
  onClose: () => void;
}

export function GameEndModal({
  isWin,
  puzzle,
  guessCount,
  onNewGame,
  onClose
}: GameEndModalProps) {
  // Format solution for display
  const solutionDisplay = puzzle.letters
    .map(l => `${l}=${puzzle.solution[l]}`)
    .join(', ');

  return (
    <div class="modal-overlay" onClick={onClose}>
      <div class="modal" onClick={e => e.stopPropagation()}>
        <h2>{isWin ? 'You got it!' : 'Game Over'}</h2>

        {isWin ? (
          <p class="win-message">
            Solved in {guessCount} {guessCount === 1 ? 'guess' : 'guesses'}!
          </p>
        ) : (
          <div class="lose-message">
            <p>The solution was:</p>
            <p class="solution">{solutionDisplay}</p>
          </div>
        )}

        <div class="modal-buttons">
          <button
            class="btn btn-primary"
            onClick={() => onNewGame(puzzle.difficulty)}
            type="button"
          >
            Play Again ({puzzle.difficulty})
          </button>
          <button
            class="btn btn-secondary"
            onClick={onClose}
            type="button"
          >
            Change Difficulty
          </button>
        </div>
      </div>
    </div>
  );
}
