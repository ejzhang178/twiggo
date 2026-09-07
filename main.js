import { levels } from './levels.js';
import { getCompletedLevels, isLevelUnlocked } from './progress.js';
import { mascotSVG } from './mascot.js';

function renderMap() {
  const mapEl = document.getElementById('map');
  const completed = getCompletedLevels();

  const trail = document.createElement('div');
  trail.className = 'trail';

  levels.forEach((level) => {
    const unlocked = isLevelUnlocked(level.id, levels);
    const isComplete = completed.includes(level.id);

    const node = document.createElement(unlocked ? 'a' : 'div');
    node.className =
      'map-node' +
      (isComplete ? ' map-node--complete' : '') +
      (!unlocked ? ' map-node--locked' : '');
    if (unlocked) node.href = level.path;

    const icon = isComplete ? '⭐' : unlocked ? '▶️' : '🔒';
    node.innerHTML = `
      <span class="map-node__icon">${icon}</span>
      <span class="map-node__title">${level.title}</span>
    `;
    trail.appendChild(node);

    if (unlocked && !isComplete) {
      const mascotWrap = document.createElement('div');
      mascotWrap.className = 'map-mascot';
      mascotWrap.innerHTML = mascotSVG('idle');
      trail.appendChild(mascotWrap);
    }
  });

  mapEl.appendChild(trail);
}

renderMap();
