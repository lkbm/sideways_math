// Puzzle header showing puzzle number, date, and archive access

import { formatDate } from "../utils/dailyPuzzle";

interface PuzzleHeaderProps {
	puzzleNumber: number;
	puzzleDate: Date;
	onArchiveClick: () => void;
	onHelpClick: () => void;
}

export function PuzzleHeader({
	puzzleNumber,
	puzzleDate,
	onArchiveClick,
	onHelpClick,
}: PuzzleHeaderProps) {
	return (
		<header class="header">
			<div class="header-left">
				<h1>Sideways Arithmetic</h1>
				<div class="puzzle-info">
					<span class="puzzle-number">Puzzle #{puzzleNumber}</span>
					<span class="puzzle-date">
						{formatDate(puzzleDate)}
					</span>
				</div>
			</div>
			<div class="header-buttons">
				<button
					class="archive-btn"
					onClick={onArchiveClick}
					type="button"
					aria-label="Archive"
					title="Browse past puzzles"
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<rect x="3" y="4" width="18" height="4" rx="1" />
						<path d="M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8" />
						<path d="M10 12h4" />
					</svg>
				</button>
				<button
					class="help-btn"
					onClick={onHelpClick}
					type="button"
					aria-label="Help"
				>
					?
				</button>
			</div>
		</header>
	);
}
