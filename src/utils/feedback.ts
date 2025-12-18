// Wordle-style feedback calculation for cryptarithmetic puzzles

import type { FeedbackColor } from '../types';

/**
 * Calculate feedback for a guess against the solution.
 *
 * GREEN:  The guessed digit is correct for this letter
 * YELLOW: The guessed digit exists in the solution but belongs to a different letter
 * GRAY:   The guessed digit is not used anywhere in the solution
 */
export function calculateFeedback(
  guess: Record<string, number>,
  solution: Record<string, number>
): Record<string, FeedbackColor> {
  const feedback: Record<string, FeedbackColor> = {};
  const solutionDigits = new Set(Object.values(solution));

  for (const [letter, guessedDigit] of Object.entries(guess)) {
    const correctDigit = solution[letter];

    if (guessedDigit === correctDigit) {
      // Exact match - this letter maps to this digit
      feedback[letter] = 'green';
    } else if (solutionDigits.has(guessedDigit)) {
      // Digit exists but belongs to a different letter
      feedback[letter] = 'yellow';
    } else {
      // Digit not used in solution at all
      feedback[letter] = 'gray';
    }
  }

  return feedback;
}

/**
 * Merge feedback from multiple guesses to get cumulative "best" feedback.
 * Once a letter is green, it stays green. Gray knowledge accumulates.
 */
export function mergeFeedback(
  history: Array<{ feedback: Record<string, FeedbackColor> }>
): Record<string, FeedbackColor> {
  const merged: Record<string, FeedbackColor> = {};

  for (const attempt of history) {
    for (const [letter, color] of Object.entries(attempt.feedback)) {
      const current = merged[letter];

      // Green is best, then yellow, then gray
      if (color === 'green') {
        merged[letter] = 'green';
      } else if (color === 'yellow' && current !== 'green') {
        merged[letter] = 'yellow';
      } else if (current === undefined) {
        merged[letter] = color;
      }
    }
  }

  return merged;
}

/**
 * Get set of digits known to be "gray" (not in solution) from guess history.
 * Useful for disabling those digits in the number pad.
 */
export function getEliminatedDigits(
  history: Array<{ mapping: Record<string, number>; feedback: Record<string, FeedbackColor> }>
): Set<number> {
  const eliminated = new Set<number>();

  for (const attempt of history) {
    for (const [letter, color] of Object.entries(attempt.feedback)) {
      if (color === 'gray') {
        eliminated.add(attempt.mapping[letter]);
      }
    }
  }

  return eliminated;
}

/**
 * Get digits that are confirmed correct (green) and their letters.
 */
export function getConfirmedDigits(
  history: Array<{ mapping: Record<string, number>; feedback: Record<string, FeedbackColor> }>
): Map<string, number> {
  const confirmed = new Map<string, number>();

  for (const attempt of history) {
    for (const [letter, color] of Object.entries(attempt.feedback)) {
      if (color === 'green') {
        confirmed.set(letter, attempt.mapping[letter]);
      }
    }
  }

  return confirmed;
}
