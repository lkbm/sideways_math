// Archive modal for browsing and playing past puzzles

import {
	getTodaysPuzzleNumber,
	getDateForPuzzle,
	formatDateShort,
} from "../utils/dailyPuzzle";

interface ArchiveModalProps {
	currentPuzzleNumber: number;
	onSelectPuzzle: (puzzleNumber: number) => void;
	onClose: () => void;
}

export function ArchiveModal({
	currentPuzzleNumber,
	onSelectPuzzle,
	onClose,
}: ArchiveModalProps) {
	const todayNumber = getTodaysPuzzleNumber();

	// Show puzzles in reverse order (newest first), grouped by weeks
	// For now, show the last 30 puzzles or all available, whichever is smaller
	const maxToShow = Math.min(todayNumber, 30);
	const puzzleNumbers = Array.from(
		{ length: maxToShow },
		(_, i) => todayNumber - i
	);

	return (
		<div class="modal-overlay" onClick={onClose}>
			<div
				class="modal archive-modal"
				onClick={(e) => e.stopPropagation()}
			>
				<h2>Puzzle Archive</h2>
				<p class="archive-subtitle">Play any past puzzle</p>

				<div class="archive-grid">
					{puzzleNumbers.map((num) => {
						const date = getDateForPuzzle(num);
						const isToday = num === todayNumber;
						const isCurrent = num === currentPuzzleNumber;

						return (
							<button
								key={num}
								class={`archive-puzzle ${isToday ? "today" : ""} ${isCurrent ? "current" : ""}`}
								onClick={() => {
									onSelectPuzzle(num);
									onClose();
								}}
								type="button"
							>
								<span class="archive-puzzle-number">
									#{num}
								</span>
								<span class="archive-puzzle-date">
									{isToday ? "Today" : formatDateShort(date)}
								</span>
							</button>
						);
					})}
				</div>

				<button class="btn btn-secondary" onClick={onClose}>
					Close
				</button>
			</div>
		</div>
	);
}
