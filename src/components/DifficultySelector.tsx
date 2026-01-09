// Difficulty selection for new games

import type { Difficulty } from '../types';

interface DifficultyOption {
  value: Difficulty;
  label: string;
  description: string;
  unlockHint: string;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { value: 'easy', label: 'Easy', description: '4-6 letters', unlockHint: '' },
  { value: 'medium', label: 'Medium', description: '5-8 letters', unlockHint: 'Beat Easy to unlock' },
  { value: 'hard', label: 'Hard', description: '7-10 letters', unlockHint: 'Beat Medium to unlock' }
];

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
  unlockedDifficulties: Difficulty[];
}

export function DifficultySelector({ onSelect, unlockedDifficulties }: DifficultySelectorProps) {
  return (
    <div class="difficulty-selector">
      <h3>Select Difficulty</h3>
      <div class="difficulty-buttons">
        {DIFFICULTY_OPTIONS.map(option => {
          const isLocked = !unlockedDifficulties.includes(option.value);
          const buttonClass = `difficulty-btn difficulty-${option.value}${isLocked ? ' locked' : ''}`;

          return (
            <button
              key={option.value}
              class={buttonClass}
              onClick={() => onSelect(option.value)}
              disabled={isLocked}
              type="button"
              title={isLocked ? option.unlockHint : undefined}
            >
              <span class="difficulty-label">
                {isLocked && <span class="lock-icon">🔒 </span>}
                {option.label}
              </span>
              <span class="difficulty-desc">
                {isLocked ? option.unlockHint : option.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
