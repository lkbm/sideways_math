# Puzzle Generation Flow

1. **Client requests** `/api/puzzle/medium/736`
2. **Server checks** KV cache for `puzzle:medium:736`
3. **If cached**, return immediately
4. **If not**, generate using `generatePuzzleForSeed(736, 'medium')`
5. **Cache result** in KV permanently
6. **Client fallback**: If API fails, client generates locally (same algorithm = same result)

# Deterministic Generation
The puzzle generator uses seeded RNG (mulberry32). Same seed always produces the same puzzle, so:
- Client and server generate identical puzzles
- Cache misses don't cause inconsistency
- Archive puzzles are stable across sessions

# Puzzle Validation
Each generated puzzle must:
1. Have exactly one solution (bijective mapping)
2. Have no leading zeros
3. Use only words from `WORDS_BY_LENGTH`
