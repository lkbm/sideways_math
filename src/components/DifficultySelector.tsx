// Difficulty selection for new games

import type { Difficulty } from '../types';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
  unlockedDifficulties: Difficulty[];
}

export function DifficultySelector({ onSelect, unlockedDifficulties }: DifficultySelectorProps) {
  const difficulties: { value: Difficulty; label: string; description: string; unlockHint: string }[] = [
    { value: 'easy', label: 'Easy', description: '4-6 letters', unlockHint: '' },
    { value: 'medium', label: 'Medium', description: '5-8 letters', unlockHint: 'Beat Easy to unlock' },
    { value: 'hard', label: 'Hard', description: '7-10 letters', unlockHint: 'Beat Medium to unlock' }
  ];

  return (
    <div class="difficulty-selector">
      <h3>Select Difficulty</h3>
      <div class="difficulty-buttons">
        {difficulties.map(d => {
          const isLocked = !unlockedDifficulties.includes(d.value);
          return (
            <button
              key={d.value}
              class={`difficulty-btn difficulty-${d.value}${isLocked ? ' locked' : ''}`}
              onClick={() => !isLocked && onSelect(d.value)}
              disabled={isLocked}
              type="button"
              title={isLocked ? d.unlockHint : undefined}
            >
              <span class="difficulty-label">
                {isLocked && <span class="lock-icon">🔒 </span>}
                {d.label}
              </span>
              <span class="difficulty-desc">
                {isLocked ? d.unlockHint : d.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
