import { mascotSVG } from '../mascot.js';
import { markLevelComplete } from '../progress.js';
import { playPop, playDing } from '../sound.js';
import { attachDrag } from '../dragDrop.js';

const FRUITS = [
  { emoji: '🍎', color: 'red' },
  { emoji: '🍓', color: 'red' },
  { emoji: '🍒', color: 'red' },
  { emoji: '🍌', color: 'yellow' },
  { emoji: '🍋', color: 'yellow' },
  { emoji: '🌽', color: 'yellow' },
];

let remaining = FRUITS.length;

function init() {
  document.getElementById('mascot-slot').innerHTML = mascotSVG('idle');
  const tray = document.getElementById('fruit-tray');

  FRUITS.forEach((fruit, index) => {
    const item = document.createElement('div');
    item.className = 'fruit-item';
    item.textContent = fruit.emoji;
    item.dataset.color = fruit.color;
    item.dataset.id = index;
    tray.appendChild(item);
    attachDrag(item, (bin) => handleDrop(item, bin));
  });
}

function handleDrop(item, bin) {
  if (item.classList.contains('fruit-item--placed')) return;
  if (bin && bin.dataset.match === item.dataset.color) {
    bin.appendChild(item);
    item.classList.add('fruit-item--placed');
    playPop();
    remaining -= 1;
    if (remaining === 0) onLevelComplete();
  } else {
    item.classList.add('fruit-item--shake');
    setTimeout(() => item.classList.remove('fruit-item--shake'), 300);
  }
}

function onLevelComplete() {
  markLevelComplete(1);
  playDing();
  document.getElementById('mascot-slot').innerHTML = mascotSVG('happy');
  const continueBtn = document.createElement('button');
  continueBtn.className = 'continue-btn';
  continueBtn.textContent = '➡️';
  continueBtn.setAttribute('aria-label', 'Continue');
  continueBtn.addEventListener('click', () => {
    window.location.href = '../index.html';
  });
  document.querySelector('.level').appendChild(continueBtn);
}

init();
