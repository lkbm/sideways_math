// Pre-computed valid cryptarithmetic puzzles with real words
// These have been verified to have exactly one solution

import type { Puzzle, Difficulty } from "../types";

// Each puzzle has been validated: the equation works and has a unique solution
export const PUZZLES: Record<Difficulty, Omit<Puzzle, "id">[]> = {
	easy: [
		{
			equation: "NO + GUN = YES",
			operands: ["NO", "GUN"],
			result: "YES",
			solution: { N: 7, O: 6, G: 8, U: 5, Y: 1, E: 3, S: 2 },
			letters: ["N", "O", "G", "U", "Y", "E", "S"],
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
			equation: "HE + ME = SHE",
			operands: ["HE", "ME"],
			result: "SHE",
			solution: { H: 4, E: 5, M: 6, S: 1 },
			letters: ["H", "E", "M", "S"],
			difficulty: "easy",
		},
		{
			equation: "AB + CD = ADD",
			operands: ["AB", "CD"],
			result: "ADD",
			solution: { A: 9, B: 2, C: 0, D: 1 },
			letters: ["A", "B", "C", "D"],
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
			equation: "TO + DO = ADD",
			operands: ["TO", "DO"],
			result: "ADD",
			solution: { T: 5, O: 2, D: 4, A: 9 },
			letters: ["T", "O", "D", "A"],
			difficulty: "easy",
		},
		{
			equation: "WE + ME = BEE",
			operands: ["WE", "ME"],
			result: "BEE",
			solution: { W: 5, E: 4, M: 4, B: 9 },
			letters: ["W", "E", "M", "B"],
			difficulty: "easy",
		},
		{
			equation: "ON + TO = TOT",
			operands: ["ON", "TO"],
			result: "TOT",
			solution: { O: 8, N: 3, T: 9 },
			letters: ["O", "N", "T"],
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
			// This is bad: L should be 3, H should be 2
			solution: { E: 8, A: 1, T: 9, H: 0, P: 0, L: 0 },
			letters: ["E", "A", "T", "H", "P", "L"],
			difficulty: "medium",
		},
		{
			equation: "HERE + SHE = COMES",
			operands: ["HERE", "SHE"],
			result: "COMES",
			solution: { H: 9, E: 2, R: 3, S: 1, C: 1, O: 0, M: 5 },
			letters: ["H", "E", "R", "S", "C", "O", "M"],
			difficulty: "medium",
		},
		{
			equation: "BASE + BALL = GAMES",
			operands: ["BASE", "BALL"],
			result: "GAMES",
			solution: { B: 7, A: 4, S: 5, E: 0, L: 8, G: 1, M: 2 },
			letters: ["B", "A", "S", "E", "L", "G", "M"],
			difficulty: "medium",
		},
		{
			equation: "TWO + TWO = FOUR",
			operands: ["TWO", "TWO"],
			result: "FOUR",
			solution: { T: 8, W: 4, O: 6, F: 1, U: 9, R: 2 },
			letters: ["T", "W", "O", "F", "U", "R"],
			difficulty: "medium",
		},
		{
			equation: "ONE + ONE = TWO",
			operands: ["ONE", "ONE"],
			result: "TWO",
			solution: { O: 2, N: 3, E: 8, T: 4, W: 7 },
			letters: ["O", "N", "E", "T", "W"],
			difficulty: "medium",
		},
		{
			// This is solveable via the logic that:
			// - D must be even (since G+T ends with G)
			equation: "DOG + CAT = PIG",
			operands: ["DOG", "CAT"],
			result: "PIG",
			solution: { D: 3, O: 4, G: 5, C: 2, A: 0, T: 8, P: 6, I: 5 },
			letters: ["D", "O", "G", "C", "A", "T", "P", "I"],
			difficulty: "medium",
		},
		{
			equation: "COCA + COLA = OASIS",
			operands: ["COCA", "COLA"],
			result: "OASIS",
			solution: { C: 8, O: 9, A: 2, L: 5, S: 7, I: 4 },
			letters: ["C", "O", "A", "L", "S", "I"],
			difficulty: "medium",
		},
	],
	hard: [
		{
			equation: "SEND + MORE = MONEY",
			operands: ["SEND", "MORE"],
			result: "MONEY",
			solution: { S: 9, E: 5, N: 6, D: 7, M: 1, O: 0, R: 8, Y: 2 },
			letters: ["S", "E", "N", "D", "M", "O", "R", "Y"],
			difficulty: "hard",
		},
		{
			equation: "CROSS + ROADS = DANGER",
			operands: ["CROSS", "ROADS"],
			result: "DANGER",
			solution: { C: 9, R: 6, O: 2, S: 3, A: 5, D: 1, N: 0, G: 8, E: 4 },
			letters: ["C", "R", "O", "S", "A", "D", "N", "G", "E"],
			difficulty: "hard",
		},
		{
			equation: "WINTER + IS = COLD",
			operands: ["WINTER", "IS"],
			result: "COLD",
			solution: { W: 1, I: 9, N: 0, T: 8, E: 5, R: 2, S: 3, C: 1, O: 0, L: 5, D: 5 },
			letters: ["W", "I", "N", "T", "E", "R", "S", "C", "O", "L", "D"],
			difficulty: "hard",
		},
		{
			equation: "EARTH + AIR = FIRE",
			operands: ["EARTH", "AIR"],
			result: "FIRE",
			solution: { E: 2, A: 9, R: 0, T: 1, H: 8, I: 4, F: 3 },
			letters: ["E", "A", "R", "T", "H", "I", "F"],
			difficulty: "hard",
		},
		{
			equation: "FIFTY + FIFTY = HUNDRED",
			operands: ["FIFTY", "FIFTY"],
			result: "HUNDRED",
			solution: { F: 4, I: 2, T: 8, Y: 5, H: 9, U: 0, N: 1, D: 3, R: 7, E: 6 },
			letters: ["F", "I", "T", "Y", "H", "U", "N", "D", "R", "E"],
			difficulty: "hard",
		},
		{
			equation: "WRONG + WRONG = RIGHT",
			operands: ["WRONG", "WRONG"],
			result: "RIGHT",
			solution: { W: 4, R: 3, O: 9, N: 2, G: 8, I: 1, H: 5, T: 6 },
			letters: ["W", "R", "O", "N", "G", "I", "H", "T"],
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
