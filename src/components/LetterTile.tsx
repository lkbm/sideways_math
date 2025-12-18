// Individual letter tile with digit assignment and feedback coloring

import type { FeedbackColor } from '../types';

interface LetterTileProps {
  letter: string;
  digit: number | null;
  isSelected: boolean;
  feedback: FeedbackColor;
  onClick: () => void;
  disabled?: boolean;
}

export function LetterTile({
  letter,
  digit,
  isSelected,
  feedback,
  onClick,
  disabled = false
}: LetterTileProps) {
  const classes = [
    'letter-tile',
    `feedback-${feedback}`,
    isSelected && 'selected',
    disabled && 'disabled'
  ].filter(Boolean).join(' ');

  return (
    <button
      class={classes}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      <span class="letter">{letter}</span>
      {digit !== null && <span class="digit">{digit}</span>}
    </button>
  );
}
