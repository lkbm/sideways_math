// Difficulty selection for new games

import type { Difficulty } from '../types';

interface DifficultySelectorProps {
  onSelect: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  const difficulties: { value: Difficulty; label: string; description: string }[] = [
    { value: 'easy', label: 'Easy', description: '4-6 letters' },
    { value: 'medium', label: 'Medium', description: '5-8 letters' },
    { value: 'hard', label: 'Hard', description: '7-10 letters' }
  ];

  return (
    <div class="difficulty-selector">
      <h3>Select Difficulty</h3>
      <div class="difficulty-buttons">
        {difficulties.map(d => (
          <button
            key={d.value}
            class={`difficulty-btn difficulty-${d.value}`}
            onClick={() => onSelect(d.value)}
            type="button"
          >
            <span class="difficulty-label">{d.label}</span>
            <span class="difficulty-desc">{d.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
