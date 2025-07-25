import { useMemo, useState } from "react";
import NumberBox from "./NumberBox.jsx";

export default function PuzzleBox({
  gridSize,
  moves,
  onWin,
  onMovesChange,
}) {
  const initialBoxes = useMemo(() => {
    // Generate the boxes
    const totalBoxes = gridSize * gridSize - 1; // Leave one space empty
    const initialBoxes = [];
    for (let y = 0, box = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize && box < totalBoxes; x++, box++) {
        initialBoxes.push({ label: box + 1, x, y });
      }
    }

    // Shuffle the boxes
    const emptySpace = {
      x: gridSize - 1,
      y: gridSize - 1,
      isAtEnd: function () {
        return this.x === gridSize - 1 && this.x === this.y;
      }
    };
    const ShuffleTimes = 10 * gridSize * gridSize;
    const movements = [
      {dx: 0, dy: -1}, // Top
      {dx: 1, dy: 0}, // Right
      {dx: 0, dy: 1}, // Bottom
      {dx: -1, dy: 0}, // Left
    ]
    // After shuffle the empty space should remain at the end like before
    for (let i = 0; i < ShuffleTimes || !emptySpace.isAtEnd(); i++) {
      const possibleMovements = movements.filter(box => {
        // Remove boxes that do not exist
        let nextX = emptySpace.x + box.dx;
        let nextY = emptySpace.y + box.dy;
        return nextX >= 0 && nextX < gridSize && nextY >= 0 && nextY < gridSize;
      });
      // Move a randomly selected box
      const randPossibleMovement = possibleMovements[
        Math.floor(Math.random() *possibleMovements.length)
      ];
      const movableBoxPos = {
        x: emptySpace.x + randPossibleMovement.dx,
        y: emptySpace.y + randPossibleMovement.dy,
      };
      const movableBox = initialBoxes.find(box => {
        return box.x === movableBoxPos.x && box.y === movableBoxPos.y;
      });
      [movableBox.x, movableBox.y] = [emptySpace.x, emptySpace.y];
      [emptySpace.x, emptySpace.y] = [movableBoxPos.x, movableBoxPos.y];
    }
    return initialBoxes;
  }, [gridSize]);

  const [boxes, setBoxes] = useState(initialBoxes);

  const boxSize = 60;
  const size = boxSize * gridSize;

  function checkForWin(latestBoxes) {
    const totalBoxes = gridSize * gridSize - 1;
    for (let y = 0, label = 1; y < gridSize; y++) {
      for (let x = 0; x < gridSize && label <= totalBoxes; x++, label++) {
        let box = latestBoxes.find(box => {
          return box.label === label;
        });
        if (box.x !== x || box.y !== y) {
          return false;
        }
      }
    }
    return true;
  }
  
  function handleDrag(label, direction) {
    let box = boxes.find(box => box.label === label);
    let nextPosition = { x: box.x, y: box.y };

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
      nextPosition.x >= gridSize ||
      nextPosition.y < 0 ||
      nextPosition.y >= gridSize
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
    let shouldCheckForWin = false;
    const nextBoxes = boxes.map(b => {
      if (box.label === b.label) {
        // Set to true if the empty space left is at the end
        shouldCheckForWin = b.x === gridSize - 1 && b.x === b.y;
        return {
          ...b,
          x: nextPosition.x,
          y: nextPosition.y,
        }
      } else {
        return b;
      }
    });
    setBoxes(nextBoxes);
    onMovesChange(moves + 1);
    if (shouldCheckForWin && checkForWin(nextBoxes)) {
      onWin();
    }
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
