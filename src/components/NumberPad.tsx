// Number pad for digit input (0-9)

import { cn } from '../utils/classNames';

interface NumberPadProps {
  selectedLetter: string | null;
  usedDigits: Set<number>;
  eliminatedDigits: Set<number>;
  onDigitClick: (digit: number) => void;
}

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0] as const;

export function NumberPad({
  selectedLetter,
  usedDigits,
  eliminatedDigits,
  onDigitClick
}: NumberPadProps) {
  return (
    <div class="number-pad">
      {DIGITS.map(digit => {
        const isUsed = usedDigits.has(digit);
        const isEliminated = eliminatedDigits.has(digit);
        const isDisabled = !selectedLetter || isEliminated;

        const classes = cn(
          'digit-btn',
          isUsed && 'used',
          isEliminated && 'eliminated'
        );

        return (
          <button
            key={digit}
            class={classes}
            onClick={() => onDigitClick(digit)}
            disabled={isDisabled}
            type="button"
          >
            {digit}
          </button>
        );
      })}
    </div>
  );
}
