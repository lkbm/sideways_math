// Main game container that orchestrates all components

import { useState } from 'preact/hooks';
import type { Difficulty } from '../types';
import { useGameState } from '../hooks/useGameState';
import { EquationDisplay } from './EquationDisplay';
import { MappingPanel } from './MappingPanel';
import { NumberPad } from './NumberPad';
import { GameControls } from './GameControls';
import { GuessHistory } from './GuessHistory';
import { Header } from './Header';
import { DifficultySelector } from './DifficultySelector';
import { GameEndModal } from './GameEndModal';
import { HelpModal } from './HelpModal';

export function Game() {
  const { state, derived, actions } = useGameState();
  const [showHelp, setShowHelp] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);

  // Handle clearing the current guess
  const handleClear = () => {
    if (!state.puzzle) return;
    for (const letter of state.puzzle.letters) {
      actions.clearLetter(letter);
    }
  };

  // Handle game end modal actions
  const handleNewGame = (difficulty: Difficulty) => {
    actions.startNewGame(difficulty);
    setShowDifficulty(false);
  };

  const handleShowDifficulty = () => {
    setShowDifficulty(true);
  };

  // Loading state
  if (state.gameStatus === 'loading' || !state.puzzle) {
    return (
      <div class="game-wrapper">
        <div class="game">
          <div class="game-content">
            <Header onHelpClick={() => setShowHelp(true)} />
            <div class="loading">Generating puzzle...</div>
          </div>
        </div>
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      </div>
    );
  }

  // Difficulty selection
  if (showDifficulty) {
    return (
      <div class="game-wrapper">
        <div class="game">
          <div class="game-content">
            <Header onHelpClick={() => setShowHelp(true)} />
            <DifficultySelector onSelect={handleNewGame} />
          </div>
        </div>
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      </div>
    );
  }

  const isGameOver = state.gameStatus === 'won' || state.gameStatus === 'lost';

  return (
    <div class="game-wrapper">
      <div class="game">
        <div class="game-content">
          <Header onHelpClick={() => setShowHelp(true)} />

          <EquationDisplay
            puzzle={state.puzzle}
            currentGuess={state.currentGuess}
            selectedLetter={state.selectedLetter}
            feedback={derived.cumulativeFeedback}
            onLetterClick={actions.selectLetter}
            disabled={isGameOver}
          />

          <MappingPanel
            letters={state.puzzle.letters}
            currentGuess={state.currentGuess}
            feedback={derived.cumulativeFeedback}
            selectedLetter={state.selectedLetter}
            onLetterClick={actions.selectLetter}
            disabled={isGameOver}
          />

          <NumberPad
            selectedLetter={state.selectedLetter}
            usedDigits={derived.usedDigits}
            eliminatedDigits={derived.eliminatedDigits}
            onDigitClick={actions.assignDigit}
          />

          <GameControls
            canSubmit={derived.canSubmit}
            guessCount={state.guessHistory.length}
            maxGuesses={state.maxGuesses}
            onSubmit={actions.submitGuess}
            onClear={handleClear}
          />

          <GuessHistory
            history={state.guessHistory}
            letters={state.puzzle.letters}
          />
        </div>
      </div>

      {isGameOver && (
        <GameEndModal
          isWin={state.gameStatus === 'won'}
          puzzle={state.puzzle}
          guessCount={state.guessHistory.length}
          onNewGame={handleNewGame}
          onClose={handleShowDifficulty}
        />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </div>
  );
}
