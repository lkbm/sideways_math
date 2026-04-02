# Difficulty Levels:
* **Easy**: 2-3 letter operands, 3-5 unique letters
* **Medium**: 3-4 letter operands, 5-8 unique letters
* **Hard**: 4-5 letter operands, 8-10 unique letters

# Daily Puzzle Numbering
`LAUNCH_DATE` (2024-01-01) is puzzle #1. Today's puzzle number = days since launch + 1.

# Feedback Colors
- **Green**: Correct digit for this letter
- **Yellow**: Digit exists in solution but wrong letter
- **Gray**: Digit not in solution

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

* See also: [TODO](docs/TODO.md) (upcoming features and improvements)