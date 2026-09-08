export function attachDrag(item, onDrop) {
  item.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    item.setPointerCapture(e.pointerId);
    item.classList.add('fruit-item--dragging');

    const onMove = (moveEvent) => {
      item.style.position = 'fixed';
      item.style.left = `${moveEvent.clientX - 30}px`;
      item.style.top = `${moveEvent.clientY - 30}px`;
    };

    const onUp = (upEvent) => {
      item.removeEventListener('pointermove', onMove);
      item.removeEventListener('pointerup', onUp);
      item.removeEventListener('pointercancel', onUp);
      item.classList.remove('fruit-item--dragging');

      item.style.pointerEvents = 'none';
      const dropTarget = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
      item.style.pointerEvents = '';

      const bin = dropTarget ? dropTarget.closest('.bin') : null;

      item.style.position = '';
      item.style.left = '';
      item.style.top = '';

      onDrop(bin);
    };

    item.addEventListener('pointermove', onMove);
    item.addEventListener('pointerup', onUp);
    item.addEventListener('pointercancel', onUp);
  });
}
