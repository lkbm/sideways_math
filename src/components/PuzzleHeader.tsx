// Puzzle header showing puzzle number, date, and archive access

import { formatDate } from '../utils/dailyPuzzle';

interface PuzzleHeaderProps {
	puzzleNumber: number;
	puzzleDate: Date;
	onArchiveClick: () => void;
	onHelpClick: () => void;
	isMusicEnabled: boolean;
	onMusicToggle: () => void;
}

export function PuzzleHeader({
	puzzleNumber,
	puzzleDate,
	onArchiveClick,
	onHelpClick,
	isMusicEnabled,
	onMusicToggle,
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
					class="music-btn"
					onClick={onMusicToggle}
					type="button"
					aria-label={isMusicEnabled ? 'Mute music' : 'Play music'}
					title={isMusicEnabled ? 'Mute music' : 'Play music'}
				>
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
						{isMusicEnabled ? (
							<>
								<path d="M15.54 8.46a5 5 0 010 7.07" />
								<path d="M19.07 4.93a10 10 0 010 14.14" />
							</>
						) : (
							<>
								<line x1="23" y1="9" x2="17" y2="15" />
								<line x1="17" y1="9" x2="23" y2="15" />
							</>
						)}
					</svg>
				</button>
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
						strokeWidth="2"
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
