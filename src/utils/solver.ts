// Backtracking solver for cryptarithmetic puzzles
// Uses column-based constraint propagation for efficiency

import type { ParsedEquation } from '../types';

export function parseEquation(equation: string): ParsedEquation {
  // Parse "ABC + DEF = GHI" format
  const [left, right] = equation.split('=').map(s => s.trim());
  const operands = left.split('+').map(s => s.trim());
  const result = right;

  // Get unique letters in order of appearance (for display)
  const allText = operands.join('') + result;
  const letters = [...new Set(allText.split(''))];

  // Leading letters (first letter of each word) can't be 0
  const leadingLetters = new Set([
    ...operands.map(op => op[0]),
    result[0]
  ]);

  return { operands, result, letters, leadingLetters };
}

/**
 * Get letters ordered by column position (rightmost first) for better constraint propagation.
 * This is used internally by the solver for efficiency.
 */
function getColumnOrderedLetters(parsed: ParsedEquation): string[] {
  const maxLen = Math.max(...parsed.operands.map(op => op.length), parsed.result.length);
  const letterSet = new Set<string>();
  const orderedLetters: string[] = [];

  // Process columns from right to left (ones place first)
  for (let col = 0; col < maxLen; col++) {
    const pos = (word: string) => word.length - 1 - col;

    // Add result letter first (if any), then operand letters
    const resultPos = pos(parsed.result);
    if (resultPos >= 0 && !letterSet.has(parsed.result[resultPos])) {
      letterSet.add(parsed.result[resultPos]);
      orderedLetters.push(parsed.result[resultPos]);
    }

    for (const op of parsed.operands) {
      const p = pos(op);
      if (p >= 0 && !letterSet.has(op[p])) {
        letterSet.add(op[p]);
        orderedLetters.push(op[p]);
      }
    }
  }

  return orderedLetters;
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

/**
 * Check if partial assignment is consistent with column constraints.
 * This prunes branches early by checking if assigned columns can work.
 */
function isPartiallyConsistent(
  parsed: ParsedEquation,
  assignment: Record<string, number>
): boolean {
  const maxLen = Math.max(...parsed.operands.map(op => op.length), parsed.result.length);

  // Check columns from right to left (ones place first)
  let carry = 0;
  for (let col = 0; col < maxLen; col++) {
    const pos = (word: string) => word.length - 1 - col;

    // Get operand digits for this column
    let sum = carry;
    let allAssigned = true;

    for (const op of parsed.operands) {
      const p = pos(op);
      if (p >= 0) {
        const letter = op[p];
        if (letter in assignment) {
          sum += assignment[letter];
        } else {
          allAssigned = false;
        }
      }
    }

    // Get result digit for this column
    const resultPos = pos(parsed.result);
    const resultLetter = resultPos >= 0 ? parsed.result[resultPos] : null;
    const resultAssigned = resultLetter !== null && resultLetter in assignment;

    // If both operand column and result are fully assigned, check consistency
    if (allAssigned && resultAssigned) {
      const expectedDigit = sum % 10;
      if (assignment[resultLetter] !== expectedDigit) {
        return false;
      }
      carry = Math.floor(sum / 10);
    } else if (allAssigned && !resultAssigned) {
      // We know what the result digit should be, carry is determined
      carry = Math.floor(sum / 10);
    } else {
      // Not enough info to check this column yet
      // But we can bound the carry for future columns
      break;
    }
  }

  return true;
}

// Count solutions using backtracking with constraint propagation
function countSolutionsWithOrder(
  parsed: ParsedEquation,
  orderedLetters: string[],
  assignment: Record<string, number>,
  usedDigits: Set<number>,
  letterIndex: number
): number {
  // Base case: all letters assigned
  if (letterIndex === orderedLetters.length) {
    return evaluateEquation(parsed, assignment) ? 1 : 0;
  }

  const letter = orderedLetters[letterIndex];
  const isLeading = parsed.leadingLetters.has(letter);
  let count = 0;

  // Try each digit 0-9
  for (let digit = isLeading ? 1 : 0; digit <= 9; digit++) {
    if (usedDigits.has(digit)) continue;

    assignment[letter] = digit;

    // Prune: check if partial assignment is consistent
    if (!isPartiallyConsistent(parsed, assignment)) {
      delete assignment[letter];
      continue;
    }

    usedDigits.add(digit);
    count += countSolutionsWithOrder(parsed, orderedLetters, assignment, usedDigits, letterIndex + 1);

    // Early termination if multiple solutions found
    if (count > 1) {
      delete assignment[letter];
      usedDigits.delete(digit);
      return count;
    }

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

  // Use column-ordered letters for efficient constraint propagation
  const orderedLetters = getColumnOrderedLetters(parsed);
  const count = countSolutionsWithOrder(parsed, orderedLetters, {}, new Set(), 0);
  return count === 1;
}

// Solve and return the solution (or null if unsolvable)
export function solve(equation: string): Record<string, number> | null {
  const parsed = parseEquation(equation);

  if (parsed.letters.length > 10) return null;

  // Use column-ordered letters for efficient constraint propagation
  const orderedLetters = getColumnOrderedLetters(parsed);

  function findSolution(
    assignment: Record<string, number>,
    usedDigits: Set<number>,
    letterIndex: number
  ): Record<string, number> | null {
    if (letterIndex === orderedLetters.length) {
      return evaluateEquation(parsed, assignment) ? { ...assignment } : null;
    }

    const letter = orderedLetters[letterIndex];
    const isLeading = parsed.leadingLetters.has(letter);

    for (let digit = isLeading ? 1 : 0; digit <= 9; digit++) {
      if (usedDigits.has(digit)) continue;

      assignment[letter] = digit;

      // Prune: check if partial assignment is consistent
      if (!isPartiallyConsistent(parsed, assignment)) {
        delete assignment[letter];
        continue;
      }

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
