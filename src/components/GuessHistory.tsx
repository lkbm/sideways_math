// Display previous guess attempts with feedback

import type { GuessAttempt, FeedbackColor } from '../types';

interface GuessHistoryProps {
  history: GuessAttempt[];
  letters: string[];
}

export function GuessHistory({ history, letters }: GuessHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div class="guess-history">
      <h3>Previous Guesses</h3>
      {history.map((attempt, index) => (
        <GuessRow
          key={attempt.timestamp}
          attempt={attempt}
          letters={letters}
          guessNumber={index + 1}
        />
      ))}
    </div>
  );
}

interface GuessRowProps {
  attempt: GuessAttempt;
  letters: string[];
  guessNumber: number;
}

function GuessRow({ attempt, letters, guessNumber }: GuessRowProps) {
  return (
    <div class="guess-row">
      <span class="guess-number">#{guessNumber}</span>
      <div class="guess-tiles">
        {letters.map(letter => {
          const digit = attempt.mapping[letter];
          const feedback = attempt.feedback[letter];
          return (
            <HistoryTile
              key={letter}
              letter={letter}
              digit={digit}
              feedback={feedback}
            />
          );
        })}
      </div>
    </div>
  );
}

interface HistoryTileProps {
  letter: string;
  digit: number;
  feedback: FeedbackColor;
}

function HistoryTile({ letter, digit, feedback }: HistoryTileProps) {
  return (
    <div class={`history-tile feedback-${feedback}`}>
      <span class="history-letter">{letter}</span>
      <span class="history-digit">{digit}</span>
    </div>
  );
}
