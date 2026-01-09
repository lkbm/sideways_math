# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Sideways Arithmetic** - A daily cryptarithmetic puzzle game where players solve equations like `SEND + MORE = MONEY` by assigning digits to letters.

**Tech Stack:**
- **Frontend**: Preact + TypeScript + Vite
- **Backend**: Hono on Cloudflare Workers
- **Storage**: Cloudflare KV (puzzle caching)

## Common Commands

```bash
npm run dev          # Vite dev server (frontend only, no API)
npx wrangler dev     # Full stack with Workers + KV (use this for API testing)
npm run build        # TypeScript + Vite production build
npm run deploy       # Deploy to Cloudflare Workers
npm run lint         # ESLint
```

## Architecture

### Directory Structure

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

### Key Files

| File | Purpose |
|------|---------|
| `src/shared/puzzleGenerator.ts` | **Core puzzle generation** - deterministic from seed, validates uniqueness |
| `src/main.tsx` | **API endpoints** - `/api/puzzle/:difficulty/:number` with KV caching |
| `src/hooks/useGameState.ts` | **Game logic** - state machine, guess validation, API fetching |
| `src/utils/solver.ts` | **Puzzle solver** - `solve()`, `hasUniqueSolution()`, backtracking algorithm |
| `src/utils/dailyPuzzle.ts` | **Daily puzzle** - `LAUNCH_DATE`, puzzle numbering, date formatting |
| `src/types.ts` | **Types** - `Puzzle`, `GameState`, `Difficulty`, `FeedbackColor` |

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/puzzle/:difficulty/:number` | Get puzzle (cached in KV) |
| `GET /api/state/:key` | Generic KV read |
| `PUT /api/state/:key` | Generic KV write |

### Puzzle Generation Flow

1. **Client requests** `/api/puzzle/medium/736`
2. **Server checks** KV cache for `puzzle:medium:736`
3. **If cached**, return immediately
4. **If not**, generate using `generatePuzzleForSeed(736, 'medium')`
5. **Cache result** in KV permanently
6. **Client fallback**: If API fails, client generates locally (same algorithm = same result)

### Key Concepts

**Deterministic Generation**: The puzzle generator uses seeded RNG (mulberry32). Same seed always produces the same puzzle, so:
- Client and server generate identical puzzles
- Cache misses don't cause inconsistency
- Archive puzzles are stable across sessions

**Difficulty Levels**:
- **Easy**: 2-3 letter operands, 3-5 unique letters
- **Medium**: 3-4 letter operands, 5-8 unique letters
- **Hard**: 4-5 letter operands, 8-10 unique letters

**Puzzle Validation**: Each generated puzzle must:
1. Have exactly one solution (bijective mapping)
2. Have no leading zeros
3. Use only words from `WORDS_BY_LENGTH`

**Daily Puzzle Numbering**: `LAUNCH_DATE` (2024-01-01) is puzzle #1. Today's puzzle number = days since launch + 1.

## Game State

The game uses a central state hook (`useGameState`) with:
- `puzzle`: Current puzzle data
- `currentGuess`: In-progress letter-to-digit mapping
- `guessHistory`: Previous attempts with feedback
- `gameStatus`: 'loading' | 'playing' | 'won' | 'lost'

**Feedback Colors**:
- **Green**: Correct digit for this letter
- **Yellow**: Digit exists in solution but wrong letter
- **Gray**: Digit not in solution

## Code Style & Utilities

### Shared Utilities

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

### Style Conventions

- **Don't add explicit return types to components** - TypeScript inference works great, and components often need to return `null` or other union types
- **Extract constants to module level** - Keep magic values (e.g., `DIGITS`, `DIFFICULTY_OPTIONS`) as top-level constants
- **Prefer custom hooks for complex logic** - If a component has >150 lines, consider extracting state/effects into custom hooks
- **Use `cn()` for conditional classes** - Avoid verbose array filtering patterns

## PM Notes
This is a "daily puzzle" type game, but with a playable archive, and multiple difficulty levels/puzzle types.

Some questions:
* Do we want the difficulty levels to unlock sequentially (easy first, then medium, then hard), so you play 3 games per day?
* There are also puzzle types, which may be orthogonal to difficulty (e.g., addition vs subtraction vs multiplication). Do we want to support multiple puzzle types per day, or just one type per day?
* Sharability! (decided, see below)

### Progression
There are multiple levels of difficulty / type.
You have to solve the easy puzzle to unlock the medium puzzle, and solve the medium puzzle to unlock the hard puzzle. However, once you've unlocked them, you can skip around freely.

### Daily Structure
**Every day:** 3 addition puzzles (Easy → Medium → Hard)

**Weekends (Sat-Sun):** Plus one bonus puzzle of a special type:
- Subtraction (ABC - DEF = GH)
- Multiplication (AB × CD = EFGH)
- Multiple equations (3 related problems sharing letter values)
- 3+ addends (ABC + DEF + GHI = JKL)
- Constrained (specific digits excluded, e.g., "no 8")

The bonus puzzle is a single challenge — no difficulty tiers. Types can rotate or be themed.

### Sharing
Simple format showing completion and streak:
```
Sideways Arithmetic #736
🟢 Easy · 🟢 Medium · 🟡 Hard (2 tries)
🔥 14-day streak
```
- Green = solved in one guess
- Yellow = solved in 2+ guesses
- Streak = consecutive days completing at least one puzzle

Future ideas: bonus achievements (e.g., "solved Hard first"), time-based challenges, etc. — defer until core loop is proven.

Maybe a "first solver of the day" leaderboard later on, but not a priority.

## V1 TODOs (Ship It)
* Background music: bouncy, Commander Keen-like, on by default with visible toggle
* Dark mode (3-way: System / Light / Dark)
* Stats tracking (streak, solve counts by difficulty, one-guess rate)
* Sharing (green/yellow dots per difficulty + streak)
* Mobile polish (test and fix touch targets, layout, etc.)
* TEST: One-time difficulty unlock (beat Easy once → Medium unlocks permanently)
* Figure out additional accessibility improvements
* Why six guesses?

## V2 TODOs (Later)
* Weekend bonus puzzle types (subtraction, multiplication, multi-equation, 3+ addends, constrained)
* Sound effects: occasional subtle sounds (laughter? ball bounces?)
* Colorblind mode (symbols + colors)
* Super-streaks and achievements
* "First solver of the day" leaderboard
* Add auth for cross-device stats syncing.