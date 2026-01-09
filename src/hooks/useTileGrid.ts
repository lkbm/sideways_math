// Computes a grid of tiles for spatial navigation in the equation display

import { useMemo } from 'preact/hooks';
import type { Puzzle } from '../types';

export interface TilePosition {
  letter: string;
  tileId: string;
  row: number;
  col: number;
}

export interface TileGrid {
  tiles: TilePosition[];
  maxLength: number;
  rowCount: number;
}

export function useTileGrid(puzzle: Puzzle | null): TileGrid {
  return useMemo(() => {
    if (!puzzle) {
      return { tiles: [], maxLength: 0, rowCount: 0 };
    }

    const allWords = [...puzzle.operands, puzzle.result];
    const maxLength = Math.max(...allWords.map(w => w.length));
    const tiles: TilePosition[] = [];

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
  }, [puzzle]);
}
