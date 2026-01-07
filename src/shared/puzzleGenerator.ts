// Dynamic puzzle generator for cryptarithmetic puzzles
// Generates valid puzzles deterministically from a seed

import type { Puzzle, Difficulty } from '../types';
import { WORDS_BY_LENGTH } from '../utils/wordList';
import { solve, hasUniqueSolution, parseEquation } from '../utils/solver';

// Difficulty configuration
interface DifficultyConfig {
  operandLengths: number[];
  resultLengths: number[];
  minUniqueLetters: number;
  maxUniqueLetters: number;
  difficulty: Difficulty;
}

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  easy: {
    operandLengths: [2, 3],
    resultLengths: [3, 4],
    minUniqueLetters: 3,
    maxUniqueLetters: 5,
    difficulty: 'easy',
  },
  medium: {
    operandLengths: [3, 4],
    resultLengths: [4, 5],
    minUniqueLetters: 5,
    maxUniqueLetters: 8,
    difficulty: 'medium',
  },
  hard: {
    operandLengths: [4, 5],
    resultLengths: [5, 6],
    minUniqueLetters: 8,
    maxUniqueLetters: 10,
    difficulty: 'hard',
  },
};

// Fallback puzzles in case generation fails (should be rare)
const FALLBACK_PUZZLES: Record<Difficulty, Omit<Puzzle, 'id'>> = {
  easy: {
    equation: 'SO + SO = TOO',
    operands: ['SO', 'SO'],
    result: 'TOO',
    solution: { S: 5, O: 0, T: 1 },
    letters: ['S', 'O', 'T'],
    difficulty: 'easy',
  },
  medium: {
    equation: 'SEND + MORE = MONEY',
    operands: ['SEND', 'MORE'],
    result: 'MONEY',
    solution: { S: 9, E: 5, N: 6, D: 7, M: 1, O: 0, R: 8, Y: 2 },
    letters: ['S', 'E', 'N', 'D', 'M', 'O', 'R', 'Y'],
    difficulty: 'medium',
  },
  hard: {
    equation: 'CROSS + ROADS = DANGER',
    operands: ['CROSS', 'ROADS'],
    result: 'DANGER',
    solution: { C: 9, R: 6, O: 2, S: 3, A: 5, D: 1, N: 8, G: 7, E: 4 },
    letters: ['C', 'R', 'O', 'S', 'A', 'D', 'N', 'G', 'E'],
    difficulty: 'hard',
  },
};

// Mulberry32 seeded random number generator
function seededRandom(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Pick a random element from an array using the seeded RNG
function pickRandom<T>(random: () => number, array: T[]): T {
  return array[Math.floor(random() * array.length)];
}

// Try to generate a single puzzle with the given RNG and config
function tryGeneratePuzzle(
  random: () => number,
  config: DifficultyConfig
): Omit<Puzzle, 'id'> | null {
  // 1. Pick word lengths
  const len1 = pickRandom(random, config.operandLengths);
  const len2 = pickRandom(random, config.operandLengths);
  const lenResult = pickRandom(random, config.resultLengths);

  // 2. Get word arrays for those lengths
  const words1 = WORDS_BY_LENGTH[len1];
  const words2 = WORDS_BY_LENGTH[len2];
  const wordsResult = WORDS_BY_LENGTH[lenResult];

  // Guard against missing word lists
  if (!words1?.length || !words2?.length || !wordsResult?.length) {
    return null;
  }

  // 3. Pick random words of those lengths
  const word1 = pickRandom(random, words1);
  const word2 = pickRandom(random, words2);
  const result = pickRandom(random, wordsResult);

  // 4. Form equation
  const equation = `${word1} + ${word2} = ${result}`;

  // 5. Quick validation: count unique letters
  const letters = [...new Set((word1 + word2 + result).split(''))];
  if (letters.length < config.minUniqueLetters) return null;
  if (letters.length > config.maxUniqueLetters) return null;
  if (letters.length > 10) return null; // Can't have more than 10 digits

  // 6. Solve: find if there's a valid solution
  const solution = solve(equation);
  if (!solution) return null;

  // 7. Verify uniqueness: must have exactly one solution
  if (!hasUniqueSolution(equation)) return null;

  // 8. Success! Build puzzle object
  const parsed = parseEquation(equation);

  return {
    equation,
    operands: parsed.operands,
    result: parsed.result,
    solution,
    letters: parsed.letters,
    difficulty: config.difficulty,
  };
}

// Difficulty offset for creating distinct seeds per difficulty
function difficultyOffset(difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy': return 0;
    case 'medium': return 100000;
    case 'hard': return 200000;
  }
}

/**
 * Generate a puzzle deterministically from a seed and difficulty.
 * The same seed + difficulty will always produce the same puzzle.
 */
export function generatePuzzleForSeed(seed: number, difficulty: Difficulty): Puzzle {
  const config = DIFFICULTY_CONFIG[difficulty];
  const random = seededRandom(seed + difficultyOffset(difficulty));

  // Try up to 1000 combinations (should find one in <50 typically)
  for (let attempt = 0; attempt < 1000; attempt++) {
    const puzzle = tryGeneratePuzzle(random, config);
    if (puzzle) {
      return {
        ...puzzle,
        id: `generated-${difficulty}-${seed}`,
      };
    }
  }

  // Fallback: return a known good puzzle for this difficulty
  // (should never happen with good config)
  console.warn(`Failed to generate puzzle for seed ${seed}, using fallback`);
  return {
    ...FALLBACK_PUZZLES[difficulty],
    id: `fallback-${difficulty}-${seed}`,
  };
}

/**
 * Get the daily puzzle for a specific difficulty and puzzle number.
 * This is the main entry point for daily puzzles.
 */
export function getDailyPuzzleFromGenerator(
  difficulty: Difficulty,
  puzzleNumber: number
): Puzzle {
  return generatePuzzleForSeed(puzzleNumber, difficulty);
}
