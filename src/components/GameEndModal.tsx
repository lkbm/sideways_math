// Modal shown when game ends (win or lose)

import type { Puzzle, Difficulty } from '../types';
import { WinCelebration } from './WinCelebration';
import { Modal } from './Modal';
import { cn } from '../utils/classNames';

const DIFFICULTY_PROGRESSION: Record<Difficulty, Difficulty | null> = {
  easy: 'medium',
  medium: 'hard',
  hard: null
};

function formatDifficulty(diff: Difficulty): string {
  return diff.charAt(0).toUpperCase() + diff.slice(1);
}

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
  const solutionDisplay = puzzle.letters
    .map(l => `${l}=${puzzle.solution[l]}`)
    .join(', ');

  const nextInProgression = DIFFICULTY_PROGRESSION[puzzle.difficulty];
  const nextDifficulty = nextInProgression && unlockedDifficulties.includes(nextInProgression)
    ? nextInProgression
    : null;

  const modalClass = cn(isWin && `modal-win-${puzzle.difficulty}`);

  return (
    <Modal onOverlayClick={onShowDifficulty} className={modalClass}>
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
    </Modal>
  );
}
