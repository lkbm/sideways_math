import { Hono } from 'hono';
import type { Difficulty } from './types';
import { generatePuzzleForSeed } from './shared/puzzleGenerator';

export interface Env {
	SIDEWAYSARITHMETIC: KVNamespace;
}

const app = new Hono<{ Bindings: Env }>();

// Valid difficulties for validation
const VALID_DIFFICULTIES = new Set<Difficulty>(['easy', 'medium', 'hard']);

// API routes

// Get a puzzle by difficulty and number (with KV caching)
app.get('/api/puzzle/:difficulty/:number', async (c) => {
	const difficulty = c.req.param('difficulty') as Difficulty;
	const numberStr = c.req.param('number');

	// Validate difficulty
	if (!VALID_DIFFICULTIES.has(difficulty)) {
		return c.json({ error: 'Invalid difficulty. Must be easy, medium, or hard.' }, 400);
	}

	// Validate puzzle number
	const puzzleNumber = parseInt(numberStr, 10);
	if (isNaN(puzzleNumber) || puzzleNumber < 1) {
		return c.json({ error: 'Invalid puzzle number. Must be a positive integer.' }, 400);
	}

	const key = `puzzle:${difficulty}:${puzzleNumber}`;

	// Check KV cache first
	const cached = await c.env.SIDEWAYSARITHMETIC.get(key, 'json');
	if (cached) {
		return c.json(cached);
	}

	// Generate puzzle (deterministic, so safe to regenerate)
	const puzzle = generatePuzzleForSeed(puzzleNumber, difficulty);

	// Cache in KV (no expiration - puzzles are permanent)
	await c.env.SIDEWAYSARITHMETIC.put(key, JSON.stringify(puzzle));

	return c.json(puzzle);
});

app.get('/api/state/:key', async (c) => {
	const key = c.req.param('key');
	const value = await c.env.SIDEWAYSARITHMETIC.get(key);
	return c.json({ value });
});

app.put('/api/state/:key', async (c) => {
	const key = c.req.param('key');
	const { value } = await c.req.json<{ value: string }>();
	await c.env.SIDEWAYSARITHMETIC.put(key, value);
	return c.json({ success: true });
});

export default app;
