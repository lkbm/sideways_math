// Archive modal for browsing and playing past puzzles

import {
	getTodaysPuzzleNumber,
	getDateForPuzzle,
	formatDateShort,
} from '../utils/dailyPuzzle';
import { cn } from '../utils/classNames';
import { Modal } from './Modal';

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

	// Show puzzles in reverse order (newest first)
	// Show the last 30 puzzles or all available, whichever is smaller
	const maxToShow = Math.min(todayNumber, 30);
	const puzzleNumbers = Array.from(
		{ length: maxToShow },
		(_, i) => todayNumber - i
	);

	return (
		<Modal onOverlayClick={onClose} className="archive-modal">
			<h2>Puzzle Archive</h2>
			<p class="archive-subtitle">Play any past puzzle</p>

			<div class="archive-grid">
				{puzzleNumbers.map((num) => {
					const date = getDateForPuzzle(num);
					const isToday = num === todayNumber;
					const isCurrent = num === currentPuzzleNumber;

					function handleSelect(): void {
						onSelectPuzzle(num);
						onClose();
					}

					return (
						<button
							key={num}
							class={cn('archive-puzzle', isToday && 'today', isCurrent && 'current')}
							onClick={handleSelect}
							type="button"
						>
							<span class="archive-puzzle-number">#{num}</span>
							<span class="archive-puzzle-date">
								{isToday ? 'Today' : formatDateShort(date)}
							</span>
						</button>
					);
				})}
			</div>

			<button class="btn btn-secondary" onClick={onClose} type="button">
				Close
			</button>
		</Modal>
	);
}
