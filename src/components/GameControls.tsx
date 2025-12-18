// Game control buttons: Submit, Clear, New Game

interface GameControlsProps {
  canSubmit: boolean;
  guessCount: number;
  maxGuesses: number;
  onSubmit: () => void;
  onClear: () => void;
}

export function GameControls({
  canSubmit,
  guessCount,
  maxGuesses,
  onSubmit,
  onClear
}: GameControlsProps) {
  return (
    <div class="game-controls">
      <div class="guess-counter">
        Guess {guessCount + 1} of {maxGuesses}
      </div>
      <div class="control-buttons">
        <button
          class="btn btn-secondary"
          onClick={onClear}
          type="button"
        >
          Clear
        </button>
        <button
          class="btn btn-primary"
          onClick={onSubmit}
          disabled={!canSubmit}
          type="button"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
