import { useState } from "react";
import NumberBox from "./NumberBox.jsx";

export default function PuzzleBox({
  rows = 3,
  initialBoxes = [],
}) {
  const boxSize = 60;
  const size = boxSize * rows;
  const [boxes, setBoxes] = useState(initialBoxes);
  
  function handleDrag(label, direction) {
    let box = boxes.find(box => box.label === label);
    let nextPosition = {x: box.x, y: box.y};

    // Generate the next position
    if (direction === 'top') {
      nextPosition.y--;
    } else if (direction === 'right') {
      nextPosition.x++;
    } else if (direction === 'bottom') {
      nextPosition.y++;
    } else if (direction === 'left') {
      nextPosition.x--;
    }

    // Check if the next position is not out of bounds
    if (
      nextPosition.x < 0 ||
      nextPosition.x >= rows ||
      nextPosition.y < 0 ||
      nextPosition.y >= rows
    ) {
      return;
    }

    // Check if no box exists on the next position
    if (boxes.find(box => {
      return nextPosition.x === box.x && nextPosition.y === box.y;
    })) {
      return;
    }

    // Change box position to the next position
    setBoxes(boxes.map(b => {
      if (box.label === b.label) {
        return {
          ...b,
          x: nextPosition.x,
          y: nextPosition.y,
        }
      } else {
        return b;
      }
    }));
  }

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        border: '2px solid black',
        boxSizing: 'content-box',
      }}
    >
      {boxes.map(box => 
        <NumberBox
          key={box.label}
          label={box.label}
          size={boxSize}
          positionX={box.x}
          positionY={box.y}
          onDrag={handleDrag}
        />
      )}
    </div>
  )
}
