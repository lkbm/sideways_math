// Panel showing letter-to-digit mappings as an alternative input method

import type { FeedbackColor } from '../types';

interface MappingPanelProps {
  letters: string[];
  currentGuess: Record<string, number | null>;
  feedback: Record<string, FeedbackColor>;
  selectedLetter: string | null;
  onLetterClick: (letter: string) => void;
  disabled?: boolean;
}

export function MappingPanel({
  letters,
  currentGuess,
  feedback,
  selectedLetter,
  onLetterClick,
  disabled = false
}: MappingPanelProps) {
  return (
    <div class="mapping-panel">
      {letters.map(letter => {
        const color = feedback[letter] || 'none';
        const isSelected = selectedLetter === letter;
        const digit = currentGuess[letter];

        const classes = [
          'mapping-row',
          `feedback-${color}`,
          isSelected && 'selected',
          disabled && 'disabled'
        ].filter(Boolean).join(' ');

        return (
          <button
            key={letter}
            class={classes}
            onClick={() => onLetterClick(letter)}
            disabled={disabled}
            type="button"
          >
            <span class="mapping-letter">{letter}</span>
            <span class="mapping-equals">=</span>
            <span class="mapping-digit">{digit !== null ? digit : '?'}</span>
          </button>
        );
      })}
    </div>
  );
}
