// Individual letter tile with digit assignment and feedback coloring

import type { FeedbackColor } from '../types';
import { cn } from '../utils/classNames';

interface LetterTileProps {
  letter: string;
  digit: number | null;
  isSelected: boolean;
  isPrimary?: boolean;
  feedback: FeedbackColor;
  onClick: () => void;
  disabled?: boolean;
}

export function LetterTile({
  letter,
  digit,
  isSelected,
  isPrimary = false,
  feedback,
  onClick,
  disabled = false
}: LetterTileProps) {
  const classes = cn(
    'letter-tile',
    `feedback-${feedback}`,
    isSelected && !isPrimary && 'selected',
    isSelected && isPrimary && 'selected-primary',
    disabled && 'disabled'
  );

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
