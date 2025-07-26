import { useRef, useState } from "react";

export default function NumberBox({
  label,
  size,
  positionX,
  positionY,
  containerPadding,
  gap,
  onDrag,
}) {
  const [holdingAt, setHoldingAt] = useState(null);

  const isThrottledRef = useRef(false);

  const left = positionX * size + positionX * gap + containerPadding;
  const top = positionY * size + positionY * gap + containerPadding;

  function handleHold(e) {
    if (e.nativeEvent instanceof MouseEvent) {
      setHoldingAt({
        x: e.clientX,
        y: e.clientY,
      });
    } else if (e.nativeEvent instanceof TouchEvent) {
      setHoldingAt({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  }

  function handleDrag(e) {
    e.preventDefault();
    if (!holdingAt) return;

    const minMovement = size / 8;
    let deltaX = 0, deltaY = 0;

    if (e.nativeEvent instanceof MouseEvent) {
      deltaX = e.clientX - holdingAt.x;
      deltaY = e.clientY - holdingAt.y;
    } else if (e.nativeEvent instanceof TouchEvent) {
      deltaX = e.touches[0].clientX - holdingAt.x;
      deltaY = e.touches[0].clientY - holdingAt.y;
    } else {
      return;
    }

    let direction = '';
    // Direction with the biggest movement takes precedence
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > minMovement) {
        direction = 'right';
      } else if (deltaX < -minMovement) {
        direction = 'left';
      }
    } else {
      if (deltaY > minMovement) {
        direction = 'bottom';
      } else if (deltaY < -minMovement) {
        direction = 'top'
      }
    }

    if (direction) {
      if (!isThrottledRef.current) {
        onDrag(label, direction);
        isThrottledRef.current = true;
        setTimeout(() => isThrottledRef.current = false, 500);
      }
    }
  }

  return (
    <div
      className="tile"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: `${size / 2}px`,
        transform: `translate(${left}px, ${top}px)`,
      }}
      onMouseDown={handleHold}
      onTouchStart={handleHold}
      onMouseMove={handleDrag}
      onTouchMove={handleDrag}
      onMouseUp={() => setHoldingAt(null)}
      onTouchEnd={() => setHoldingAt(null)}
      onMouseOut={() => setHoldingAt(null)} // Workaround when onMouseUp is skipped after dragging outside
    >
      {label}
    </div>
  )
}
