// Pre-computed valid cryptarithmetic puzzles with real words
// These have been verified to have exactly one bijective solution
// (each letter maps to a unique digit, no two letters share the same digit)

import type { Puzzle, Difficulty } from "../types";

// Each puzzle has been validated: the equation works, has a unique solution,
// and each letter maps to a different digit (bijective mapping)
export const PUZZLES: Record<Difficulty, Omit<Puzzle, "id">[]> = {
	easy: [
		{
			equation: "AS + IS = ADD",
			operands: ["AS", "IS"],
			result: "ADD",
			solution: { A: 1, S: 5, I: 8, D: 0 },
			letters: ["A", "S", "I", "D"],
			difficulty: "easy",
		},
		{
			equation: "AS + A = MOM",
			operands: ["AS", "A"],
			result: "MOM",
			solution: { A: 9, S: 2, M: 1, O: 0 },
			letters: ["A", "S", "M", "O"],
			difficulty: "easy",
		},
		{
			equation: "BE + HE = BEE",
			operands: ["BE", "HE"],
			result: "BEE",
			solution: { B: 1, E: 0, H: 9 },
			letters: ["B", "E", "H"],
			difficulty: "easy",
		},
		{
			equation: "BE + ME = BEE",
			operands: ["BE", "ME"],
			result: "BEE",
			solution: { B: 1, E: 0, M: 9 },
			letters: ["B", "E", "M"],
			difficulty: "easy",
		},
		{
			equation: "SO + SO = TOO",
			operands: ["SO", "SO"],
			result: "TOO",
			solution: { S: 5, O: 0, T: 1 },
			letters: ["S", "O", "T"],
			difficulty: "easy",
		},
		{
			equation: "I + DID = TOO",
			operands: ["I", "DID"],
			result: "TOO",
			solution: { I: 9, D: 1, T: 2, O: 0 },
			letters: ["I", "D", "T", "O"],
			difficulty: "easy",
		},
		{
			equation: "BY + MY = BEE",
			operands: ["BY", "MY"],
			result: "BEE",
			solution: { B: 1, Y: 5, M: 8, E: 0 },
			letters: ["B", "Y", "M", "E"],
			difficulty: "easy",
		},
		{
			equation: "DO + GO = DIG",
			operands: ["DO", "GO"],
			result: "DIG",
			solution: { D: 1, O: 9, G: 8, I: 0 },
			letters: ["D", "O", "G", "I"],
			difficulty: "easy",
		},
		{
			equation: "DO + NO = DEN",
			operands: ["DO", "NO"],
			result: "DEN",
			solution: { D: 1, O: 9, N: 8, E: 0 },
			letters: ["D", "O", "N", "E"],
			difficulty: "easy",
		},
		{
			equation: "AD + A = MOM",
			operands: ["AD", "A"],
			result: "MOM",
			solution: { A: 9, D: 2, M: 1, O: 0 },
			letters: ["A", "D", "M", "O"],
			difficulty: "easy",
		},
	],
	medium: [
		{
			equation: "SEND + MORE = MONEY",
			operands: ["SEND", "MORE"],
			result: "MONEY",
			solution: { S: 9, E: 5, N: 6, D: 7, M: 1, O: 0, R: 8, Y: 2 },
			letters: ["S", "E", "N", "D", "M", "O", "R", "Y"],
			difficulty: "medium",
		},
		{
			equation: "EAT + THAT = APPLE",
			operands: ["EAT", "THAT"],
			result: "APPLE",
			solution: { E: 8, A: 1, T: 9, H: 2, P: 0, L: 3 },
			letters: ["E", "A", "T", "H", "P", "L"],
			difficulty: "medium",
		},
		{
			equation: "BASE + BALL = GAMES",
			operands: ["BASE", "BALL"],
			result: "GAMES",
			solution: { B: 7, A: 4, S: 8, E: 3, L: 5, G: 1, M: 9 },
			letters: ["B", "A", "S", "E", "L", "G", "M"],
			difficulty: "medium",
		},
		{
			equation: "COCA + COLA = OASIS",
			operands: ["COCA", "COLA"],
			result: "OASIS",
			solution: { C: 8, O: 1, A: 6, L: 0, S: 2, I: 9 },
			letters: ["C", "O", "A", "L", "S", "I"],
			difficulty: "medium",
		},
		{
			equation: "ADD + BEAR = AREA",
			operands: ["ADD", "BEAR"],
			result: "AREA",
			solution: { A: 6, D: 2, B: 5, E: 8, R: 4 },
			letters: ["A", "D", "B", "E", "R"],
			difficulty: "medium",
		},
		{
			equation: "AIR + BEAR = AREA",
			operands: ["AIR", "BEAR"],
			result: "AREA",
			solution: { A: 6, I: 1, R: 3, B: 5, E: 7 },
			letters: ["A", "I", "R", "B", "E"],
			difficulty: "medium",
		},
		{
			equation: "BAT + BEAT = ACUTE",
			operands: ["BAT", "BEAT"],
			result: "ACUTE",
			solution: { B: 9, A: 1, T: 2, E: 4, C: 0, U: 3 },
			letters: ["B", "A", "T", "E", "C", "U"],
			difficulty: "medium",
		},
		{
			equation: "BEE + BEAR = ALARM",
			operands: ["BEE", "BEAR"],
			result: "ALARM",
			solution: { B: 9, E: 2, A: 1, R: 3, L: 0, M: 5 },
			letters: ["B", "E", "A", "R", "L", "M"],
			difficulty: "medium",
		},
	],
	hard: [
		{
			equation: "CROSS + ROADS = DANGER",
			operands: ["CROSS", "ROADS"],
			result: "DANGER",
			solution: { C: 9, R: 6, O: 2, S: 3, A: 5, D: 1, N: 8, G: 7, E: 4 },
			letters: ["C", "R", "O", "S", "A", "D", "N", "G", "E"],
			difficulty: "hard",
		},
		{
			equation: "ABOUT + AFTER = BECAME",
			operands: ["ABOUT", "AFTER"],
			result: "BECAME",
			solution: { A: 8, B: 1, O: 0, U: 5, T: 7, F: 3, E: 6, R: 9, C: 4, M: 2 },
			letters: ["A", "B", "O", "U", "T", "F", "E", "R", "C", "M"],
			difficulty: "hard",
		},
		{
			equation: "ABOUT + AFTER = BURDEN",
			operands: ["ABOUT", "AFTER"],
			result: "BURDEN",
			solution: { A: 5, B: 1, O: 7, U: 0, T: 2, F: 3, E: 8, R: 4, D: 9, N: 6 },
			letters: ["A", "B", "O", "U", "T", "F", "E", "R", "D", "N"],
			difficulty: "hard",
		},
		{
			equation: "ABOUT + AGAIN = BUDGET",
			operands: ["ABOUT", "AGAIN"],
			result: "BUDGET",
			solution: { A: 8, B: 1, O: 3, U: 6, T: 7, G: 2, I: 9, N: 0, D: 4, E: 5 },
			letters: ["A", "B", "O", "U", "T", "G", "I", "N", "D", "E"],
			difficulty: "hard",
		},
		{
			equation: "ABOUT + ALONG = BUDGET",
			operands: ["ABOUT", "ALONG"],
			result: "BUDGET",
			solution: { A: 8, B: 1, O: 5, U: 6, T: 7, L: 2, N: 3, G: 0, D: 4, E: 9 },
			letters: ["A", "B", "O", "U", "T", "L", "N", "G", "D", "E"],
			difficulty: "hard",
		},
	],
};

// Get a random puzzle for a difficulty
export function getRandomPuzzle(difficulty: Difficulty): Puzzle {
	const puzzles = PUZZLES[difficulty];
	const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
	return {
		...puzzle,
		id: Math.random().toString(36).substring(2, 9),
	};
}
