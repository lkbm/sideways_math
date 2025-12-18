// Puzzle generator - uses pre-computed puzzles for instant loading

import type { Puzzle, Difficulty } from '../types';
import { getRandomPuzzle } from './precomputedPuzzles';

export function generatePuzzle(difficulty: Difficulty): Puzzle {
  return getRandomPuzzle(difficulty);
}

// Generate multiple unique puzzles
export function generatePuzzles(count: number, difficulty: Difficulty): Puzzle[] {
  const puzzles: Puzzle[] = [];
  const seenEquations = new Set<string>();

  // Keep trying until we have enough unique puzzles
  let attempts = 0;
  while (puzzles.length < count && attempts < count * 10) {
    const puzzle = generatePuzzle(difficulty);
    if (!seenEquations.has(puzzle.equation)) {
      seenEquations.add(puzzle.equation);
      puzzles.push(puzzle);
    }
    attempts++;
  }

  return puzzles;
}
