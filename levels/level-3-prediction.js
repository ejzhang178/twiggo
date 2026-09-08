import { mascotSVG } from '../mascot.js';
import { markLevelComplete } from '../progress.js';
import { playDing, playOops, primeAudio } from '../sound.js';

const ROUNDS = [
  { emoji: '🍎', color: 'red', guess: 'red' },
  { emoji: '🍌', color: 'yellow', guess: 'yellow' },
  { emoji: '🍇', color: 'red', guess: 'red' },
  { emoji: '🍋', color: 'yellow', guess: 'red' },
  { emoji: '🍉', color: 'red', guess: 'red' },
];

let roundIndex = 0;
let phase = 'intro';

function init() {
  document.getElementById('next-btn').addEventListener('click', onNextClick);
  showIntro();
}

function showIntro() {
  const round = ROUNDS[roundIndex];
  phase = 'intro';
  document.getElementById('prediction-fruit').textContent = round.emoji;
  document.querySelectorAll('.bin').forEach((bin) => bin.classList.remove('bin--guessed'));
  document.getElementById('mascot-slot').innerHTML = mascotSVG('idle');
  document.getElementById('next-btn').textContent = '▶️';
}

function showResult() {
  const round = ROUNDS[roundIndex];
  phase = 'result';
  document.getElementById('mascot-slot').innerHTML = mascotSVG('thinking');
  document.getElementById('next-btn').disabled = true;

  setTimeout(() => {
    const guessedBin = document.getElementById(`bin-${round.guess}`);
    guessedBin.classList.add('bin--guessed');

    const correct = round.guess === round.color;
    document.getElementById('mascot-slot').innerHTML = mascotSVG(correct ? 'happy' : 'oops');
    if (correct) playDing(); else playOops();

    document.getElementById('next-btn').disabled = false;
    document.getElementById('next-btn').textContent =
      roundIndex < ROUNDS.length - 1 ? '➡️' : '🏁';
  }, 900);
}

function onNextClick() {
  primeAudio();
  if (phase === 'intro') {
    showResult();
    return;
  }
  roundIndex += 1;
  if (roundIndex < ROUNDS.length) {
    showIntro();
  } else {
    onLevelComplete();
  }
}

function onLevelComplete() {
  markLevelComplete(3);
  document.getElementById('prediction-fruit').hidden = true;
  document.querySelector('.prediction-bins').hidden = true;
  document.getElementById('next-btn').hidden = true;

  const end = document.getElementById('end-screen');
  end.hidden = false;
  end.innerHTML = `
    <p style="font-size: 3rem;">🌱🎉</p>
    <button class="continue-btn" id="map-btn">🏠</button>
  `;
  document.getElementById('mascot-slot').innerHTML = mascotSVG('happy');
  document.getElementById('map-btn').addEventListener('click', () => {
    window.location.href = '../index.html';
  });
}

init();
