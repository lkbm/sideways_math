// Daily puzzle utilities - deterministic puzzle selection based on date

import type { Difficulty, Puzzle } from '../types';
import { generatePuzzleForSeed } from '../shared/puzzleGenerator';

// Launch date - Puzzle #1 starts here
// Using a date in the past so we have an archive from day 1
export const LAUNCH_DATE = new Date('2024-01-01'); // LKBM TODO

// Get puzzle number for a given date (1-indexed)
export function getPuzzleNumber(date: Date = new Date()): number {
	const msPerDay = 24 * 60 * 60 * 1000;
	const launch = new Date(LAUNCH_DATE);
	launch.setHours(0, 0, 0, 0);

	const target = new Date(date);
	target.setHours(0, 0, 0, 0);

	const daysDiff = Math.floor((target.getTime() - launch.getTime()) / msPerDay);
	return Math.max(1, daysDiff + 1);
}

// Get date for a given puzzle number
export function getDateForPuzzle(puzzleNumber: number): Date {
	const msPerDay = 24 * 60 * 60 * 1000;
	const launch = new Date(LAUNCH_DATE);
	launch.setHours(0, 0, 0, 0);

	return new Date(launch.getTime() + (puzzleNumber - 1) * msPerDay);
}

// Format date for display (e.g., "January 3, 2026")
export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

// Format date short (e.g., "Jan 3")
export function formatDateShort(date: Date): string {
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
	});
}

// Get today's puzzle number
export function getTodaysPuzzleNumber(): number {
	return getPuzzleNumber(new Date());
}

// Get the daily puzzle for a specific difficulty and puzzle number
export function getDailyPuzzle(difficulty: Difficulty, puzzleNumber: number): Puzzle {
	// Use the dynamic puzzle generator - deterministically generates puzzles from seed
	return generatePuzzleForSeed(puzzleNumber, difficulty);
}

// Check if a puzzle number is in the future
export function isFuturePuzzle(puzzleNumber: number): boolean {
	return puzzleNumber > getTodaysPuzzleNumber();
}

// Check if a puzzle number is today's puzzle
export function isTodaysPuzzle(puzzleNumber: number): boolean {
	return puzzleNumber === getTodaysPuzzleNumber();
}
