const STORAGE_KEY = 'twiggo-progress';

export function getCompletedLevels() {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function markLevelComplete(levelId) {
  const completed = getCompletedLevels();
  if (!completed.includes(levelId)) {
    completed.push(levelId);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
  }
}

export function isLevelUnlocked(levelId, levels) {
  const index = levels.findIndex((level) => level.id === levelId);
  if (index <= 0) return true; // first level is always unlocked
  const completed = getCompletedLevels();
  const previousLevel = levels[index - 1];
  return completed.includes(previousLevel.id);
}
