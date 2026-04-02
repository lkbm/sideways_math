# Directory Structure

```
src/
├── main.tsx                 # Hono backend (Cloudflare Worker entry point)
├── index.tsx                # Preact frontend entry point
├── App.tsx                  # Main app component
├── types.ts                 # Shared TypeScript types
├── shared/
│   └── puzzleGenerator.ts   # Deterministic puzzle generation (used by both client & server)
├── hooks/
│   ├── useGameState.ts      # Central game state management
│   ├── useTileGrid.ts       # Tile grid computation for spatial navigation
│   └── useKeyboardNavigation.ts # Keyboard event handling (arrows, Tab, Enter, digits)
├── components/
│   ├── Game.tsx             # Main game layout
│   ├── Modal.tsx            # Reusable modal wrapper with overlay
│   ├── EquationDisplay.tsx  # Shows the puzzle equation
│   ├── MappingPanel.tsx     # Letter-to-digit mapping UI
│   ├── NumberPad.tsx        # Digit input buttons
│   ├── GuessHistory.tsx     # Previous guesses with feedback
│   ├── LetterTile.tsx       # Individual letter display
│   ├── PuzzleHeader.tsx     # Puzzle number, date, archive button
│   ├── ArchiveModal.tsx     # Browse past puzzles
│   ├── HelpModal.tsx        # How to play instructions
│   ├── GameEndModal.tsx     # Win/lose screen
│   ├── DifficultySelector.tsx
│   ├── GameControls.tsx
│   └── BouncingBalls.tsx    # Background animation
└── utils/
    ├── dailyPuzzle.ts       # Date/puzzle number utilities, LAUNCH_DATE
    ├── solver.ts            # Cryptarithmetic solver (backtracking)
    ├── feedback.ts          # Guess feedback calculation (green/yellow/gray)
    ├── wordList.ts          # WORDS_BY_LENGTH dictionary
    └── classNames.ts        # cn() utility for conditional class names
```

# Key Files

| File | Purpose |
|------|---------|
| `src/shared/puzzleGenerator.ts` | **Core puzzle generation** - deterministic from seed, validates uniqueness |
| `src/main.tsx` | **API endpoints** - `/api/puzzle/:difficulty/:number` with KV caching |
| `src/hooks/useGameState.ts` | **Game logic** - state machine, guess validation, API fetching |
| `src/utils/solver.ts` | **Puzzle solver** - `solve()`, `hasUniqueSolution()`, backtracking algorithm |
| `src/utils/dailyPuzzle.ts` | **Daily puzzle** - `LAUNCH_DATE`, puzzle numbering, date formatting |
| `src/types.ts` | **Types** - `Puzzle`, `GameState`, `Difficulty`, `FeedbackColor` |

# Game State

The game uses a central state hook (`useGameState`) with:
- `puzzle`: Current puzzle data
- `currentGuess`: In-progress letter-to-digit mapping
- `guessHistory`: Previous attempts with feedback
- `gameStatus`: 'loading' | 'playing' | 'won' | 'lost'

# Shared Utilities

**`cn()` - Conditional Class Names** (`src/utils/classNames.ts`)
- Simple utility for building conditional class names
- Usage: `cn('base-class', condition && 'conditional-class', anotherCondition && 'another-class')`
- Replaces verbose `.filter(Boolean).join(' ')` pattern
- Use this for all conditional class name logic

**`Modal` Component** (`src/components/Modal.tsx`)
- Reusable modal wrapper with overlay and click-outside-to-close behavior
- Used by all modals (HelpModal, ArchiveModal, GameEndModal)
- Props: `isOpen`, `onClose`, `children`
- Handles overlay click, escape key, and accessibility

### Custom Hooks

**`useTileGrid()`** (`src/hooks/useTileGrid.ts`)
- Computes tile positions for spatial keyboard navigation
- Returns `TileGrid` with `getNeighbor()` method for arrow key movement
- Used by Game.tsx for arrow key navigation between letter tiles

**`useKeyboardNavigation()`** (`src/hooks/useKeyboardNavigation.ts`)
- Centralized keyboard event handling for the game
- Handles: arrow keys, Tab, Enter, Escape, digit input, Backspace
- Integrates with tile grid for spatial navigation
- Used by Game.tsx
