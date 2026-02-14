import { useState, useEffect, useRef } from 'preact/hooks';

const STORAGE_KEY = 'sideways_music';

function getStoredPreference(): boolean {
	const stored = localStorage.getItem(STORAGE_KEY);
	return stored === null ? true : stored === 'true';
}

export function useMusicPlayer() {
	const [isMusicEnabled, setIsMusicEnabled] = useState(getStoredPreference);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Initialize audio element once
	useEffect(() => {
		const audio = new Audio('/audio/background-music.mp3');
		audio.loop = true;
		audio.volume = 0.5;
		audioRef.current = audio;

		return () => {
			audio.pause();
			audio.src = '';
			audioRef.current = null;
		};
	}, []);

	// Play/pause based on enabled state
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isMusicEnabled) {
			const tryPlay = () => void audio.play().catch(() => {});
			tryPlay();

			// Listen for first user interaction to start playback
			const handleInteraction = () => {
				if (isMusicEnabled) {
					audio.play().catch(() => {});
				}
				document.removeEventListener('click', handleInteraction);
				document.removeEventListener('touchstart', handleInteraction);
				document.removeEventListener('keydown', handleInteraction);
			};

			document.addEventListener('click', handleInteraction);
			document.addEventListener('touchstart', handleInteraction);
			document.addEventListener('keydown', handleInteraction);

			return () => {
				document.removeEventListener('click', handleInteraction);
				document.removeEventListener('touchstart', handleInteraction);
				document.removeEventListener('keydown', handleInteraction);
			};
		} else {
			audio.pause();
		}
	}, [isMusicEnabled]);

	function toggleMusic() {
		setIsMusicEnabled(prev => {
			const next = !prev;
			localStorage.setItem(STORAGE_KEY, String(next));
			return next;
		});
	}

	return { isMusicEnabled, toggleMusic };
}
