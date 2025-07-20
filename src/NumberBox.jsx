import { useEffect, useRef, useState } from "react";

export default function NumberBox({
  label,
  size = 60,
  positionX = 0,
  positionY = 0,
  onDrag = () => {},
}) {
  const [holdingAt, setHoldingAt] = useState(null);
  const [direction, setDirection] = useState({value: null, id: 0});
  const throttledRef = useRef(false);

  useEffect(() => {
    if (direction.value) { // Prevents firing the event on the initial render
      onDrag(label, direction.value);
    }
  }, [direction.id]);

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

    let currentDirection = '';
    // Direction with the biggest movement takes precedence
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > minMovement) {
        currentDirection = 'right';
      } else if (deltaX < -minMovement) {
        currentDirection = 'left';
      }
    } else {
      if (deltaY > minMovement) {
        currentDirection = 'bottom';
      } else if (deltaY < -minMovement) {
        currentDirection = 'top'
      }
    }

    if (currentDirection) {
      if (!throttledRef.current) {
        setDirection({
          value: currentDirection,
          id: direction.id + 1, // Re-render even on the same direction
        });
        throttledRef.current = true;
        setTimeout(() => throttledRef.current = false, 500);
      }
    }
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: `${size / 2}px`,
        fontWeight: 'bold',
        border: '2px solid black',
        backgroundColor: 'coral',
        color: 'white',
        position: 'absolute',
        left: `${positionX * size}px`,
        top: `${positionY * size}px`,
        userSelect: 'none',
        transition: 'all 0.2s',
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
