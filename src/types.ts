// Core game types for Sideways Arithmetic

export type FeedbackColor = "green" | "yellow" | "gray" | "none";

export type Difficulty = "easy" | "medium" | "hard";

export interface Puzzle {
	id: string;
	equation: string; // "ELF + ELF = FOOL"
	operands: string[]; // ["ELF", "ELF"]
	result: string; // "FOOL"
	solution: Record<string, number>; // { E: 7, L: 4, F: 1, O: 8 }
	letters: string[]; // Unique letters in order: ["E", "L", "F", "O"]
	difficulty: Difficulty;
}

export interface GuessAttempt {
	mapping: Record<string, number>; // What the player guessed
	feedback: Record<string, FeedbackColor>; // Feedback per letter
	timestamp: number;
}

export interface GameState {
	puzzle: Puzzle | null;
	currentGuess: Record<string, number | null>; // Partial mapping in progress
	guessHistory: GuessAttempt[];
	selectedLetter: string | null;
	gameStatus: "loading" | "playing" | "won" | "lost";
	maxGuesses: number;
}

// For the solver
export interface ParsedEquation {
	operands: string[];
	result: string;
	letters: string[];
	leadingLetters: Set<string>;
}
