// Win celebration effects that scale by difficulty
// Subtle, school-themed animations - no confetti

import type { Difficulty } from '../types';

interface WinCelebrationProps {
  difficulty: Difficulty;
  guessCount: number;
}

export function WinCelebration({ difficulty, guessCount }: WinCelebrationProps) {
  // Perfect solve (1 guess) gets extra celebration
  const isPerfect = guessCount === 1;

  return (
    <>
      {/* Modal glow/pulse effect */}
      <div class={`win-glow win-glow-${difficulty}`} />

      {/* Shimmer effect - intensity scales with difficulty */}
      <div class={`win-shimmer win-shimmer-${difficulty}`} aria-hidden="true" />

      {/* Perfect solve: subtle sparkles around the modal */}
      {isPerfect && (
        <div class="perfect-sparkles" aria-hidden="true">
          <div class="sparkle sparkle-1" />
          <div class="sparkle sparkle-2" />
          <div class="sparkle sparkle-3" />
          <div class="sparkle sparkle-4" />
        </div>
      )}

      {/* Bouncing ball celebration (hard difficulty only) */}
      {difficulty === 'hard' && (
        <div class="celebration-balls" aria-hidden="true">
          <div class="celebration-ball celebration-ball-1" />
          <div class="celebration-ball celebration-ball-2" />
          <div class="celebration-ball celebration-ball-3" />
        </div>
      )}
    </>
  );
}
