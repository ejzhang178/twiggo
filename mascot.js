const POSES = {
  idle: { mouth: 'M 30 60 Q 50 68 70 60', eyeY: 42, eyeRadius: 5 },
  thinking: { mouth: 'M 35 62 Q 50 58 65 62', eyeY: 38, eyeRadius: 5 },
  happy: { mouth: 'M 25 55 Q 50 80 75 55', eyeY: 42, eyeRadius: 5 },
  oops: { mouth: 'M 30 65 Q 50 55 70 65', eyeY: 42, eyeRadius: 7 },
};

export function mascotSVG(pose = 'idle') {
  const p = POSES[pose] || POSES.idle;
  return `
    <svg viewBox="0 0 100 100" class="mascot mascot--${pose}" width="120" height="120" role="img" aria-label="Twiggo the guide, ${pose}">
      <circle cx="50" cy="50" r="45" fill="#8bc98b" stroke="#4f8f4f" stroke-width="3"/>
      <circle cx="35" cy="${p.eyeY}" r="${p.eyeRadius}" fill="#2b2b2b"/>
      <circle cx="65" cy="${p.eyeY}" r="${p.eyeRadius}" fill="#2b2b2b"/>
      <path d="${p.mouth}" stroke="#2b2b2b" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>
  `;
}
