// Persistent unlock state management
// Tracks which difficulties have been unlocked (persists in localStorage)

import { useState, useCallback, useEffect } from 'preact/hooks';
import type { Difficulty } from '../types';

const STORAGE_KEY = 'sideways_unlocks';

interface UnlockData {
  // Difficulties that are permanently unlocked
  unlockedDifficulties: Difficulty[];
  // Track completion per day to avoid re-unlocking
  completions: Record<string, Difficulty[]>; // { "2024-01-15": ["easy", "medium"] }
}

const DEFAULT_UNLOCKS: UnlockData = {
  unlockedDifficulties: ['easy'], // Easy is always unlocked
  completions: {}
};

// Difficulty progression order
const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'medium', 'hard'];

function getNextDifficulty(current: Difficulty): Difficulty | null {
  const index = DIFFICULTY_ORDER.indexOf(current);
  return index < DIFFICULTY_ORDER.length - 1 ? DIFFICULTY_ORDER[index + 1] : null;
}

function loadFromStorage(): UnlockData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as UnlockData;
      // Ensure easy is always included
      if (!parsed.unlockedDifficulties.includes('easy')) {
        parsed.unlockedDifficulties.unshift('easy');
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to load unlock state:', e);
  }
  return DEFAULT_UNLOCKS;
}

function saveToStorage(data: UnlockData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save unlock state:', e);
  }
}

export function useUnlockState() {
  const [unlockData, setUnlockData] = useState<UnlockData>(loadFromStorage);

  // Persist changes to localStorage
  useEffect(() => {
    saveToStorage(unlockData);
  }, [unlockData]);

  // Check if a difficulty is unlocked
  const isUnlocked = useCallback((difficulty: Difficulty): boolean => {
    return unlockData.unlockedDifficulties.includes(difficulty);
  }, [unlockData.unlockedDifficulties]);

  // Record a win and potentially unlock the next difficulty
  const recordWin = useCallback((difficulty: Difficulty, puzzleDate: Date): void => {
    setUnlockData(prev => {
      const dateKey = puzzleDate.toISOString().split('T')[0];
      const dayCompletions = prev.completions[dateKey] || [];

      // Check if already completed this difficulty today
      if (dayCompletions.includes(difficulty)) {
        return prev; // No change needed
      }

      const newCompletions = {
        ...prev.completions,
        [dateKey]: [...dayCompletions, difficulty]
      };

      // Check if we should unlock the next difficulty
      const nextDifficulty = getNextDifficulty(difficulty);
      let newUnlocked = [...prev.unlockedDifficulties];

      if (nextDifficulty && !newUnlocked.includes(nextDifficulty)) {
        newUnlocked.push(nextDifficulty);
      }

      return {
        unlockedDifficulties: newUnlocked,
        completions: newCompletions
      };
    });
  }, []);

  // Get list of unlocked difficulties
  const unlockedDifficulties = unlockData.unlockedDifficulties;

  // Check if a puzzle was completed on a given date
  const wasCompletedOnDate = useCallback((difficulty: Difficulty, date: Date): boolean => {
    const dateKey = date.toISOString().split('T')[0];
    return unlockData.completions[dateKey]?.includes(difficulty) ?? false;
  }, [unlockData.completions]);

  return {
    isUnlocked,
    unlockedDifficulties,
    recordWin,
    wasCompletedOnDate
  };
}
