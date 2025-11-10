import './styles.scss';

import rainAudio from './assets/audio/rain.mp3';
import wavesAudio from './assets/audio/waves.mp3';
import forestAudio from './assets/audio/forest.mp3';

import rainBg from './assets/images/rain.jpg';
import wavesBg from './assets/images/waves.jpg';
import forestBg from './assets/images/forest.jpg';

type SoundId = 'rain' | 'waves' | 'forest';

interface SoundItem {
	id: SoundId;
	title: string;
	src: string;
	bg: string;
}

const SOUNDS: SoundItem[] = [
	{ id: 'rain', title: 'Дождь', src: rainAudio, bg: rainBg },
	{ id: 'waves', title: 'Море', src: wavesAudio, bg: wavesBg },
	{ id: 'forest', title: 'Лес', src: forestAudio, bg: forestBg },
];

const buttonsRoot = document.getElementById('buttons') as HTMLDivElement | null;
const volumeInput = document.getElementById('volume') as HTMLInputElement | null;

if (!buttonsRoot) throw new Error('#buttons not found');
if (!volumeInput) throw new Error('#volume not found');

const audio = new Audio();
audio.loop = true;
audio.volume = 0.7;

let currentId: SoundId | null = null;

function setBackground(bg: string | null): void {
	const body = document.body;
	if (!bg) {
		body.style.backgroundImage = '';
		body.style.backgroundColor = '#111';
	} else {
		body.style.backgroundImage = `url(${bg})`;
		body.style.backgroundSize = 'cover';
		body.style.backgroundPosition = 'center';
		body.style.backgroundRepeat = 'no-repeat';
	}
}

function createButton(sound: SoundItem): HTMLButtonElement {
	const btn = document.createElement('button');
	btn.type = 'button';
	btn.className = 'btn';
	btn.textContent = sound.title;
	btn.dataset.id = sound.id;
	btn.setAttribute('aria-pressed', 'false');
	return btn;
}

function renderButtons(): void {
	buttonsRoot!.innerHTML = '';
	const frag = document.createDocumentFragment();
	for (const s of SOUNDS) {
		frag.appendChild(createButton(s));
	}
	buttonsRoot!.appendChild(frag);
}

function updatePressedState(active: HTMLButtonElement | null): void {
	const btns = buttonsRoot!.querySelectorAll('button');
	btns.forEach((el) => {
		el.setAttribute('aria-pressed', el === active ? 'true' : 'false');
	});
}

function handleButtonsClick(e: MouseEvent): void {
	const target = e.target as HTMLElement | null;
	if (!target) return;

	const btn = target.closest('button');
	if (!btn) return;

	const soundId = btn.getAttribute('data-id') as SoundId | null;
	if (!soundId) return;

	const sound = SOUNDS.find((s) => s.id === soundId);
	if (!sound) return;

	if (currentId === soundId && !audio.paused) {
		audio.pause();
		currentId = null;
		setBackground(null);
		updatePressedState(null);
		return;
	}

	if (audio.src !== sound.src) {
		audio.src = sound.src;
	}
	audio.currentTime = 0;
	void audio.play();

	currentId = soundId;
	setBackground(sound.bg);
	updatePressedState(btn);
}

function handleVolumeInput(): void {
	const v = Number(volumeInput!.value);
	if (!Number.isNaN(v)) audio.volume = v;
}

function init(): void {
	renderButtons();
	buttonsRoot!.addEventListener('click', handleButtonsClick);

	volumeInput!.addEventListener('input', handleVolumeInput);
	volumeInput!.value = String(audio.volume);

	setBackground(null);
}

init();
