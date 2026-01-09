// Main game container that orchestrates all components

import { useState, useEffect, useRef } from 'preact/hooks';
import type { Difficulty } from '../types';
import { useGameState } from '../hooks/useGameState';
import { useUnlockState } from '../hooks/useUnlockState';
import { useTileGrid } from '../hooks/useTileGrid';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { EquationDisplay } from './EquationDisplay';
import { MappingPanel } from './MappingPanel';
import { NumberPad } from './NumberPad';
import { GameControls } from './GameControls';
import { GuessHistory } from './GuessHistory';
import { PuzzleHeader } from './PuzzleHeader';
import { DifficultySelector } from './DifficultySelector';
import { GameEndModal } from './GameEndModal';
import { HelpModal } from './HelpModal';
import { ArchiveModal } from './ArchiveModal';

export function Game() {
  const { state, derived, actions } = useGameState();
  const { unlockedDifficulties, recordWin } = useUnlockState();
  const [showHelp, setShowHelp] = useState(false);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showArchive, setShowArchive] = useState(false);

  const tileGrid = useTileGrid(state.puzzle);
  const isGameOver = state.gameStatus === 'won' || state.gameStatus === 'lost';

  // Track previous game status to detect wins
  const prevGameStatus = useRef(state.gameStatus);

  // Record win when game status changes to 'won'
  useEffect(() => {
    if (prevGameStatus.current !== 'won' && state.gameStatus === 'won' && state.puzzle) {
      recordWin(state.puzzle.difficulty, state.puzzleDate);
    }
    prevGameStatus.current = state.gameStatus;
  }, [state.gameStatus, state.puzzle, state.puzzleDate, recordWin]);

  // Keyboard navigation
  useKeyboardNavigation({
    letters: state.puzzle?.letters ?? [],
    selectedLetter: state.selectedLetter,
    primaryTileId: state.primaryTileId,
    tileGrid,
    canSubmit: derived.canSubmit,
    isGameOver,
    onSelectLetter: actions.selectLetter,
    onAssignDigit: actions.assignDigit,
    onClearLetter: actions.clearLetter,
    onSubmit: actions.submitGuess
  });

  function handleClear(): void {
    if (!state.puzzle) return;
    for (const letter of state.puzzle.letters) {
      actions.clearLetter(letter);
    }
  }

  function handleNewGame(difficulty: Difficulty): void {
    actions.startNewGame(difficulty);
    setShowDifficulty(false);
  }

  function handleSelectPuzzle(puzzleNumber: number): void {
    actions.goToPuzzle(puzzleNumber);
  }

  // Shared header for all states
  const header = (
    <PuzzleHeader
      puzzleNumber={state.puzzleNumber}
      puzzleDate={state.puzzleDate}
      onArchiveClick={() => setShowArchive(true)}
      onHelpClick={() => setShowHelp(true)}
    />
  );

  // Shared modals
  const modals = (
    <>
      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
      {showArchive && (
        <ArchiveModal
          currentPuzzleNumber={state.puzzleNumber}
          onSelectPuzzle={handleSelectPuzzle}
          onClose={() => setShowArchive(false)}
        />
      )}
    </>
  );

  // Loading state
  if (state.gameStatus === 'loading' || !state.puzzle) {
    return (
      <div class="game-wrapper">
        <div class="game">
          <div class="game-content">
            {header}
            <div class="loading">Loading puzzle...</div>
          </div>
        </div>
        {modals}
      </div>
    );
  }

  // Difficulty selection
  if (showDifficulty) {
    return (
      <div class="game-wrapper">
        <div class="game">
          <div class="game-content">
            {header}
            <DifficultySelector
              onSelect={handleNewGame}
              unlockedDifficulties={unlockedDifficulties}
            />
          </div>
        </div>
        {modals}
      </div>
    );
  }

  return (
    <div class="game-wrapper">
      <div class="game">
        <div class="game-content">
          {header}

          <EquationDisplay
            puzzle={state.puzzle}
            currentGuess={state.currentGuess}
            selectedLetter={state.selectedLetter}
            primaryTileId={state.primaryTileId}
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
          unlockedDifficulties={unlockedDifficulties}
          onNewGame={handleNewGame}
          onShowDifficulty={() => setShowDifficulty(true)}
          onShowArchive={() => setShowArchive(true)}
        />
      )}

      {modals}
    </div>
  );
}
