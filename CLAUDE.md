# CLAUDE.md

**Sideways Arithmetic** - A daily cryptarithmetic puzzle game where players solve equations (e.g., `SEND + MORE = MONEY`) by assigning digits to letters.

We use Preact + TypeScript + Vite for the frontend, and Hono on Cloudflare Workers for the backend API. Puzzles are generated server-side with a deterministic algorithm and cached in Cloudflare KV for fast retrieval.

Here's additional documentation that can help you understand the codebase and contribute:
* [Common Commands](docs/Common%20Commands.md) (how to run, build, deploy, etc.)
* [Directory Structure](docs/Directory%20Structure.md) (what files contain what code, and key shared utilities)
* [API Endpoints](docs/API%20Endpoints.md) (available API routes and their usage)
* [Puzzle Generation](docs/Puzzle%20Generation%.md) (how puzzles are generated and cached)
* [Specs](docs/Specs.md) (game rules, mechanics, and design decisions)
* [TODO](docs/TODO.md) (upcoming features and improvements)

### Style Conventions

- **Don't add explicit return types to components** - TypeScript inference works great, and components often need to return `null` or other union types
- **Extract constants to module level** - Keep magic values (e.g., `DIGITS`, `DIFFICULTY_OPTIONS`) as top-level constants
- **Prefer custom hooks for complex logic** - If a component has >150 lines, consider extracting state/effects into custom hooks
- **Use `cn()` for conditional classes** - Avoid verbose array filtering patterns
