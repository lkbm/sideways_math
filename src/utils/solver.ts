// Backtracking solver for cryptarithmetic puzzles
// Used to verify puzzles have exactly one solution

import type { ParsedEquation } from '../types';

export function parseEquation(equation: string): ParsedEquation {
  // Parse "ABC + DEF = GHI" format
  const [left, right] = equation.split('=').map(s => s.trim());
  const operands = left.split('+').map(s => s.trim());
  const result = right;

  // Get unique letters in order of appearance
  const allText = operands.join('') + result;
  const letters = [...new Set(allText.split(''))];

  // Leading letters (first letter of each word) can't be 0
  const leadingLetters = new Set([
    ...operands.map(op => op[0]),
    result[0]
  ]);

  return { operands, result, letters, leadingLetters };
}

function wordToNumber(word: string, assignment: Record<string, number>): number {
  let num = 0;
  for (const letter of word) {
    num = num * 10 + assignment[letter];
  }
  return num;
}

function evaluateEquation(parsed: ParsedEquation, assignment: Record<string, number>): boolean {
  const operandValues = parsed.operands.map(op => wordToNumber(op, assignment));
  const resultValue = wordToNumber(parsed.result, assignment);
  const sum = operandValues.reduce((a, b) => a + b, 0);
  return sum === resultValue;
}

// Count solutions using backtracking (stops early if > 1 found)
function countSolutions(
  parsed: ParsedEquation,
  assignment: Record<string, number>,
  usedDigits: Set<number>,
  letterIndex: number
): number {
  // Base case: all letters assigned
  if (letterIndex === parsed.letters.length) {
    return evaluateEquation(parsed, assignment) ? 1 : 0;
  }

  const letter = parsed.letters[letterIndex];
  const isLeading = parsed.leadingLetters.has(letter);
  let count = 0;

  // Try each digit 0-9
  for (let digit = isLeading ? 1 : 0; digit <= 9; digit++) {
    if (usedDigits.has(digit)) continue;

    assignment[letter] = digit;
    usedDigits.add(digit);

    count += countSolutions(parsed, assignment, usedDigits, letterIndex + 1);

    // Early termination if multiple solutions found
    if (count > 1) return count;

    delete assignment[letter];
    usedDigits.delete(digit);
  }

  return count;
}

// Check if a puzzle has exactly one solution
export function hasUniqueSolution(equation: string): boolean {
  const parsed = parseEquation(equation);

  // Can't have more than 10 unique letters (only digits 0-9)
  if (parsed.letters.length > 10) return false;

  const count = countSolutions(parsed, {}, new Set(), 0);
  return count === 1;
}

// Solve and return the solution (or null if unsolvable/multiple solutions)
export function solve(equation: string): Record<string, number> | null {
  const parsed = parseEquation(equation);

  if (parsed.letters.length > 10) return null;

  function findSolution(
    assignment: Record<string, number>,
    usedDigits: Set<number>,
    letterIndex: number
  ): Record<string, number> | null {
    if (letterIndex === parsed.letters.length) {
      return evaluateEquation(parsed, assignment) ? { ...assignment } : null;
    }

    const letter = parsed.letters[letterIndex];
    const isLeading = parsed.leadingLetters.has(letter);

    for (let digit = isLeading ? 1 : 0; digit <= 9; digit++) {
      if (usedDigits.has(digit)) continue;

      assignment[letter] = digit;
      usedDigits.add(digit);

      const result = findSolution(assignment, usedDigits, letterIndex + 1);
      if (result) return result;

      delete assignment[letter];
      usedDigits.delete(digit);
    }

    return null;
  }

  return findSolution({}, new Set(), 0);
}
