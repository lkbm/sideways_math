// Displays the puzzle equation vertically like traditional arithmetic

import type { Puzzle, FeedbackColor } from '../types';
import { LetterTile } from './LetterTile';

interface EquationDisplayProps {
  puzzle: Puzzle;
  currentGuess: Record<string, number | null>;
  selectedLetter: string | null;
  primaryTileId: string | null;
  feedback: Record<string, FeedbackColor>;
  onLetterClick: (letter: string, tileId: string) => void;
  disabled?: boolean;
}

export function EquationDisplay({
  puzzle,
  currentGuess,
  selectedLetter,
  primaryTileId,
  feedback,
  onLetterClick,
  disabled = false
}: EquationDisplayProps) {
  // Find the maximum width needed (result is usually longest due to carry)
  const maxLength = Math.max(
    ...puzzle.operands.map(op => op.length),
    puzzle.result.length
  );

  // Render a word right-aligned with padding
  const renderWord = (word: string, wordIndex: number, showOperator?: string) => {
    const padding = maxLength - word.length;
    const paddedLetters = Array(padding).fill(null);

    return (
      <div class="equation-row">
        {showOperator && <span class="vertical-operator">{showOperator}</span>}
        {!showOperator && <span class="vertical-operator-spacer" />}
        <div class="word">
          {paddedLetters.map((_, i) => (
            <div key={`pad-${i}`} class="letter-tile-spacer" />
          ))}
          {word.split('').map((letter, charIndex) => {
            const tileId = `${wordIndex}-${charIndex}`;
            return (
              <LetterTile
                key={tileId}
                letter={letter}
                digit={currentGuess[letter] ?? null}
                isSelected={selectedLetter === letter}
                isPrimary={primaryTileId === tileId}
                feedback={feedback[letter] || 'none'}
                onClick={() => onLetterClick(letter, tileId)}
                disabled={disabled}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div class="equation-vertical">
      {puzzle.operands.map((word, i) => (
        renderWord(word, i, i === puzzle.operands.length - 1 ? '+' : undefined)
      ))}
      <div class="equation-line" />
      {renderWord(puzzle.result, puzzle.operands.length)}
    </div>
  );
}
