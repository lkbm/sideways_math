// Number pad for digit input (0-9)

interface NumberPadProps {
  selectedLetter: string | null;
  usedDigits: Set<number>;
  eliminatedDigits: Set<number>;
  onDigitClick: (digit: number) => void;
}

export function NumberPad({
  selectedLetter,
  usedDigits,
  eliminatedDigits,
  onDigitClick
}: NumberPadProps) {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

  return (
    <div class="number-pad">
      {digits.map(digit => {
        const isUsed = usedDigits.has(digit);
        const isEliminated = eliminatedDigits.has(digit);
        const isDisabled = !selectedLetter || isEliminated;

        const classes = [
          'digit-btn',
          isUsed && 'used',
          isEliminated && 'eliminated'
        ].filter(Boolean).join(' ');

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
