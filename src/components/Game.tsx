// Main game container that orchestrates all components

import { useState, useEffect, useMemo, useRef } from 'preact/hooks';
import type { Difficulty } from '../types';
import { useGameState } from '../hooks/useGameState';
import { useUnlockState } from '../hooks/useUnlockState';
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

  // Track previous game status to detect wins
  const prevGameStatus = useRef(state.gameStatus);

  // Record win when game status changes to 'won'
  useEffect(() => {
    if (prevGameStatus.current !== 'won' && state.gameStatus === 'won' && state.puzzle) {
      recordWin(state.puzzle.difficulty, state.puzzleDate);
    }
    prevGameStatus.current = state.gameStatus;
  }, [state.gameStatus, state.puzzle, state.puzzleDate, recordWin]);

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

  // Handle archive selection
  const handleSelectPuzzle = (puzzleNumber: number) => {
    actions.goToPuzzle(puzzleNumber);
  };

  // Loading state
  if (state.gameStatus === 'loading' || !state.puzzle) {
    return (
      <div class="game-wrapper">
        <div class="game">
          <div class="game-content">
            <PuzzleHeader
              puzzleNumber={state.puzzleNumber}
              puzzleDate={state.puzzleDate}
              onArchiveClick={() => setShowArchive(true)}
              onHelpClick={() => setShowHelp(true)}
            />
            <div class="loading">Loading puzzle...</div>
          </div>
        </div>
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        {showArchive && (
          <ArchiveModal
            currentPuzzleNumber={state.puzzleNumber}
            onSelectPuzzle={handleSelectPuzzle}
            onClose={() => setShowArchive(false)}
          />
        )}
      </div>
    );
  }

  // Difficulty selection
  if (showDifficulty) {
    return (
      <div class="game-wrapper">
        <div class="game">
          <div class="game-content">
            <PuzzleHeader
              puzzleNumber={state.puzzleNumber}
              puzzleDate={state.puzzleDate}
              onArchiveClick={() => setShowArchive(true)}
              onHelpClick={() => setShowHelp(true)}
            />
            <DifficultySelector
              onSelect={handleNewGame}
              unlockedDifficulties={unlockedDifficulties}
            />
          </div>
        </div>
        {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
        {showArchive && (
          <ArchiveModal
            currentPuzzleNumber={state.puzzleNumber}
            onSelectPuzzle={handleSelectPuzzle}
            onClose={() => setShowArchive(false)}
          />
        )}
      </div>
    );
  }

  const isGameOver = state.gameStatus === 'won' || state.gameStatus === 'lost';

  // Build a grid of tiles for spatial navigation
  // Each tile has { letter, tileId, row, col } where col is right-aligned
  const tileGrid = useMemo(() => {
    if (!state.puzzle) return { tiles: [], maxLength: 0, rowCount: 0 };

    const allWords = [...state.puzzle.operands, state.puzzle.result];
    const maxLength = Math.max(...allWords.map(w => w.length));
    const tiles: Array<{ letter: string; tileId: string; row: number; col: number }> = [];

    allWords.forEach((word, wordIndex) => {
      const padding = maxLength - word.length;
      word.split('').forEach((letter, charIndex) => {
        tiles.push({
          letter,
          tileId: `${wordIndex}-${charIndex}`,
          row: wordIndex,
          col: padding + charIndex // Right-aligned
        });
      });
    });

    return { tiles, maxLength, rowCount: allWords.length };
  }, [state.puzzle]);

  // Handle keyboard input for navigation and digit assignment
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;

      const letters = state.puzzle?.letters ?? [];

      // Enter to submit guess
      if (e.key === 'Enter' && derived.canSubmit) {
        e.preventDefault();
        actions.submitGuess();
        return;
      }

      // Tab / Shift+Tab to navigate between unique letters
      if (e.key === 'Tab' && letters.length > 0) {
        e.preventDefault();
        const currentIndex = state.selectedLetter
          ? letters.indexOf(state.selectedLetter)
          : -1;

        let nextIndex: number;
        if (e.shiftKey) {
          nextIndex = currentIndex <= 0 ? letters.length - 1 : currentIndex - 1;
        } else {
          nextIndex = currentIndex >= letters.length - 1 ? 0 : currentIndex + 1;
        }
        actions.selectLetter(letters[nextIndex]);
        return;
      }

      // Arrow keys for spatial navigation within the equation grid
      if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') && tileGrid.tiles.length > 0) {
        e.preventDefault();

        // Find current tile position
        let currentTile = tileGrid.tiles.find(t => t.tileId === state.primaryTileId);

        // If no primary tile but we have a selected letter, find first tile with that letter
        if (!currentTile && state.selectedLetter) {
          currentTile = tileGrid.tiles.find(t => t.letter === state.selectedLetter);
        }

        // If still nothing, start at first tile
        if (!currentTile) {
          const firstTile = tileGrid.tiles[0];
          actions.selectLetter(firstTile.letter, firstTile.tileId);
          return;
        }

        let targetRow = currentTile.row;
        let targetCol = currentTile.col;

        if (e.key === 'ArrowLeft') {
          targetCol--;
        } else if (e.key === 'ArrowRight') {
          targetCol++;
        } else if (e.key === 'ArrowUp') {
          targetRow--;
        } else if (e.key === 'ArrowDown') {
          targetRow++;
        }

        // Wrap rows
        if (targetRow < 0) targetRow = tileGrid.rowCount - 1;
        if (targetRow >= tileGrid.rowCount) targetRow = 0;

        // Find tile at target position, or nearest tile in that row
        let targetTile = tileGrid.tiles.find(t => t.row === targetRow && t.col === targetCol);

        if (!targetTile) {
          // Find tiles in target row and pick the closest column
          const rowTiles = tileGrid.tiles.filter(t => t.row === targetRow);
          if (rowTiles.length > 0) {
            targetTile = rowTiles.reduce((closest, t) =>
              Math.abs(t.col - targetCol) < Math.abs(closest.col - targetCol) ? t : closest
            );
          }
        }

        if (targetTile) {
          actions.selectLetter(targetTile.letter, targetTile.tileId);
        }
        return;
      }

      // The following require a selected letter
      if (!state.selectedLetter) return;

      // Check if it's a digit key (0-9)
      if (e.key >= '0' && e.key <= '9') {
        actions.assignDigit(parseInt(e.key, 10));
      }

      // Backspace to clear the selected letter's value
      if (e.key === 'Backspace') {
        actions.clearLetter(state.selectedLetter);
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        actions.selectLetter(state.selectedLetter); // Toggle off
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedLetter, state.primaryTileId, state.puzzle?.letters, tileGrid, isGameOver, derived.canSubmit, actions]);

  return (
    <div class="game-wrapper">
      <div class="game">
        <div class="game-content">
          <PuzzleHeader
            puzzleNumber={state.puzzleNumber}
            puzzleDate={state.puzzleDate}
            onArchiveClick={() => setShowArchive(true)}
            onHelpClick={() => setShowHelp(true)}
          />

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
          onNewGame={handleNewGame}
          onClose={handleShowDifficulty}
        />
      )}

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      {showArchive && (
        <ArchiveModal
          currentPuzzleNumber={state.puzzleNumber}
          onSelectPuzzle={handleSelectPuzzle}
          onClose={() => setShowArchive(false)}
        />
      )}
    </div>
  );
}
