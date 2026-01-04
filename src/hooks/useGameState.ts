// Central game state management hook

import { useState, useCallback, useMemo, useEffect } from 'preact/hooks';
import type { GameState, GuessAttempt, Difficulty, FeedbackColor } from '../types';
import { calculateFeedback, mergeFeedback, getEliminatedDigits, getConfirmedDigits } from '../utils/feedback';
import { getDailyPuzzle, getTodaysPuzzleNumber, getDateForPuzzle } from '../utils/dailyPuzzle';

const MAX_GUESSES = 6;

export function useGameState() {
  const todayNumber = getTodaysPuzzleNumber();

  const [state, setState] = useState<GameState>({
    puzzle: null,
    currentGuess: {},
    guessHistory: [],
    selectedLetter: null,
    gameStatus: 'loading',
    maxGuesses: MAX_GUESSES,
    puzzleNumber: todayNumber,
    puzzleDate: getDateForPuzzle(todayNumber)
  });

  // Start with today's puzzle on mount
  useEffect(() => {
    loadPuzzle('medium', todayNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on mount
  }, []);

  // Select a letter for digit assignment
  const selectLetter = useCallback((letter: string) => {
    setState(s => {
      if (s.gameStatus !== 'playing') return s;
      // Toggle selection if clicking same letter
      const newSelected = s.selectedLetter === letter ? null : letter;
      return { ...s, selectedLetter: newSelected };
    });
  }, []);

  // Assign a digit to the currently selected letter
  const assignDigit = useCallback((digit: number) => {
    setState(s => {
      if (s.gameStatus !== 'playing' || !s.selectedLetter || !s.puzzle) return s;

      const letter = s.selectedLetter;
      const newGuess = { ...s.currentGuess };

      // If this digit is already assigned to another letter, clear it there first
      for (const [l, d] of Object.entries(newGuess)) {
        if (d === digit && l !== letter) {
          newGuess[l] = null;
        }
      }

      // Check leading zero constraint
      const leadingLetters = new Set([
        ...s.puzzle.operands.map(op => op[0]),
        s.puzzle.result[0]
      ]);
      if (digit === 0 && leadingLetters.has(letter)) {
        // Can't assign 0 to a leading letter - show feedback somehow
        return s;
      }

      newGuess[letter] = digit;

      return {
        ...s,
        currentGuess: newGuess
        // Keep selectedLetter so user can backspace to correct
      };
    });
  }, []);

  // Clear the digit from a letter
  const clearLetter = useCallback((letter: string) => {
    setState(s => ({
      ...s,
      currentGuess: { ...s.currentGuess, [letter]: null }
    }));
  }, []);

  // Submit the current guess
  const submitGuess = useCallback(() => {
    setState(s => {
      if (!s.puzzle || s.gameStatus !== 'playing') return s;

      // Check all letters have a digit
      const hasAllDigits = s.puzzle.letters.every(
        l => s.currentGuess[l] !== null && s.currentGuess[l] !== undefined
      );
      if (!hasAllDigits) return s;

      // Cast to complete mapping (we verified it's complete)
      const mapping = s.currentGuess as Record<string, number>;

      // Calculate feedback
      const feedback = calculateFeedback(mapping, s.puzzle.solution);

      // Check for win
      const isCorrect = Object.values(feedback).every(f => f === 'green');

      const newAttempt: GuessAttempt = {
        mapping: { ...mapping },
        feedback,
        timestamp: Date.now()
      };

      const newHistory = [...s.guessHistory, newAttempt];
      const newStatus = isCorrect
        ? 'won'
        : newHistory.length >= s.maxGuesses
          ? 'lost'
          : 'playing';

      // Reset current guess for next attempt (unless won)
      const newGuess = isCorrect ? mapping : {};

      // Pre-fill confirmed letters for next guess
      if (!isCorrect) {
        const confirmed = getConfirmedDigits(newHistory);
        confirmed.forEach((digit, letter) => {
          newGuess[letter] = digit;
        });
      }

      return {
        ...s,
        guessHistory: newHistory,
        gameStatus: newStatus,
        currentGuess: newGuess,
        selectedLetter: null
      };
    });
  }, []);

  // Load a puzzle for a specific difficulty and puzzle number
  const loadPuzzle = useCallback((difficulty: Difficulty, puzzleNumber: number) => {
    const puzzle = getDailyPuzzle(difficulty, puzzleNumber);
    setState({
      puzzle,
      currentGuess: {},
      guessHistory: [],
      selectedLetter: null,
      gameStatus: 'playing',
      maxGuesses: MAX_GUESSES,
      puzzleNumber,
      puzzleDate: getDateForPuzzle(puzzleNumber)
    });
  }, []);

  // Start a new game with the current puzzle number (for difficulty change)
  const startNewGame = useCallback((difficulty: Difficulty) => {
    loadPuzzle(difficulty, state.puzzleNumber);
  }, [loadPuzzle, state.puzzleNumber]);

  // Switch to a different puzzle number (from archive)
  const goToPuzzle = useCallback((puzzleNumber: number, difficulty: Difficulty = 'medium') => {
    loadPuzzle(difficulty, puzzleNumber);
  }, [loadPuzzle]);

  // Go to today's puzzle
  const goToToday = useCallback((difficulty: Difficulty = 'medium') => {
    loadPuzzle(difficulty, getTodaysPuzzleNumber());
  }, [loadPuzzle]);

  // Derived state
  const derived = useMemo(() => {
    if (!state.puzzle) {
      return {
        cumulativeFeedback: {} as Record<string, FeedbackColor>,
        eliminatedDigits: new Set<number>(),
        usedDigits: new Set<number>(),
        isGuessComplete: false,
        canSubmit: false
      };
    }

    const cumulativeFeedback = mergeFeedback(state.guessHistory);
    const eliminatedDigits = getEliminatedDigits(state.guessHistory);
    const usedDigits = new Set(
      Object.values(state.currentGuess).filter((d): d is number => d !== null)
    );
    const isGuessComplete = state.puzzle.letters.every(
      l => state.currentGuess[l] !== null && state.currentGuess[l] !== undefined
    );
    const canSubmit = isGuessComplete && state.gameStatus === 'playing';

    return {
      cumulativeFeedback,
      eliminatedDigits,
      usedDigits,
      isGuessComplete,
      canSubmit
    };
  }, [state]);

  return {
    state,
    derived,
    actions: {
      selectLetter,
      assignDigit,
      clearLetter,
      submitGuess,
      startNewGame,
      goToPuzzle,
      goToToday
    }
  };
}
