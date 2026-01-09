// Keyboard navigation for game interactions

import { useEffect } from 'preact/hooks';
import type { TileGrid } from './useTileGrid';

interface KeyboardNavigationOptions {
  letters: string[];
  selectedLetter: string | null;
  primaryTileId: string | null;
  tileGrid: TileGrid;
  canSubmit: boolean;
  isGameOver: boolean;
  onSelectLetter: (letter: string, tileId?: string) => void;
  onAssignDigit: (digit: number) => void;
  onClearLetter: (letter: string) => void;
  onSubmit: () => void;
}

export function useKeyboardNavigation({
  letters,
  selectedLetter,
  primaryTileId,
  tileGrid,
  canSubmit,
  isGameOver,
  onSelectLetter,
  onAssignDigit,
  onClearLetter,
  onSubmit
}: KeyboardNavigationOptions): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (isGameOver) return;

      // Enter to submit guess
      if (e.key === 'Enter' && canSubmit) {
        e.preventDefault();
        onSubmit();
        return;
      }

      // Tab / Shift+Tab to navigate between unique letters
      if (e.key === 'Tab' && letters.length > 0) {
        e.preventDefault();
        const currentIndex = selectedLetter
          ? letters.indexOf(selectedLetter)
          : -1;

        const nextIndex = e.shiftKey
          ? (currentIndex <= 0 ? letters.length - 1 : currentIndex - 1)
          : (currentIndex >= letters.length - 1 ? 0 : currentIndex + 1);

        onSelectLetter(letters[nextIndex]);
        return;
      }

      // Arrow keys for spatial navigation within the equation grid
      if (isArrowKey(e.key) && tileGrid.tiles.length > 0) {
        e.preventDefault();
        handleArrowNavigation(e.key, tileGrid, selectedLetter, primaryTileId, onSelectLetter);
        return;
      }

      // The following require a selected letter
      if (!selectedLetter) return;

      // Check if it's a digit key (0-9)
      if (e.key >= '0' && e.key <= '9') {
        onAssignDigit(parseInt(e.key, 10));
        return;
      }

      // Backspace to clear the selected letter's value
      if (e.key === 'Backspace') {
        onClearLetter(selectedLetter);
        return;
      }

      // Escape to deselect
      if (e.key === 'Escape') {
        onSelectLetter(selectedLetter); // Toggle off
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    letters,
    selectedLetter,
    primaryTileId,
    tileGrid,
    canSubmit,
    isGameOver,
    onSelectLetter,
    onAssignDigit,
    onClearLetter,
    onSubmit
  ]);
}

function isArrowKey(key: string): boolean {
  return key === 'ArrowLeft' || key === 'ArrowRight' || key === 'ArrowUp' || key === 'ArrowDown';
}

function handleArrowNavigation(
  key: string,
  tileGrid: TileGrid,
  selectedLetter: string | null,
  primaryTileId: string | null,
  onSelectLetter: (letter: string, tileId?: string) => void
): void {
  // Find current tile position
  let currentTile = tileGrid.tiles.find(t => t.tileId === primaryTileId);

  // If no primary tile but we have a selected letter, find first tile with that letter
  if (!currentTile && selectedLetter) {
    currentTile = tileGrid.tiles.find(t => t.letter === selectedLetter);
  }

  // If still nothing, start at first tile
  if (!currentTile) {
    const firstTile = tileGrid.tiles[0];
    onSelectLetter(firstTile.letter, firstTile.tileId);
    return;
  }

  let targetRow = currentTile.row;
  let targetCol = currentTile.col;

  switch (key) {
    case 'ArrowLeft':
      targetCol--;
      break;
    case 'ArrowRight':
      targetCol++;
      break;
    case 'ArrowUp':
      targetRow--;
      break;
    case 'ArrowDown':
      targetRow++;
      break;
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
    onSelectLetter(targetTile.letter, targetTile.tileId);
  }
}
