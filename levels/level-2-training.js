import { mascotSVG } from '../mascot.js';
import { markLevelComplete } from '../progress.js';
import { playPop, playDing } from '../sound.js';
import { attachDrag } from '../dragDrop.js';

const TRAINING_EXAMPLES = [
  { emoji: '🍎', color: 'red' },
  { emoji: '🍌', color: 'yellow' },
  { emoji: '🍒', color: 'red' },
  { emoji: '🌽', color: 'yellow' },
];

let taught = 0;

function init() {
  document.getElementById('mascot-slot').innerHTML = mascotSVG('thinking');
  renderMeter();

  const tray = document.getElementById('fruit-tray');
  TRAINING_EXAMPLES.forEach((fruit, index) => {
    const item = document.createElement('div');
    item.className = 'fruit-item';
    item.textContent = fruit.emoji;
    item.dataset.color = fruit.color;
    item.dataset.id = index;
    tray.appendChild(item);
    attachDrag(item, (bin) => handleDrop(item, bin));
  });
}

function renderMeter() {
  const meter = document.getElementById('learning-meter');
  meter.innerHTML = '';
  TRAINING_EXAMPLES.forEach((_, index) => {
    const segment = document.createElement('span');
    segment.className =
      'learning-meter__segment' + (index < taught ? ' learning-meter__segment--filled' : '');
    meter.appendChild(segment);
  });
}

function handleDrop(item, bin) {
  if (item.classList.contains('fruit-item--placed')) return;
  if (bin && bin.dataset.match === item.dataset.color) {
    bin.appendChild(item);
    item.classList.add('fruit-item--placed');
    playPop();
    taught += 1;
    renderMeter();
    if (taught === TRAINING_EXAMPLES.length) onLevelComplete();
  } else {
    item.classList.add('fruit-item--shake');
    setTimeout(() => item.classList.remove('fruit-item--shake'), 300);
  }
}

function onLevelComplete() {
  markLevelComplete(2);
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
