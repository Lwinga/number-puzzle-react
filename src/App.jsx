import PuzzleBox from "./PuzzleBox.jsx";

export default function App() {
  const gridSize = 3;
  const totalBoxes = gridSize * gridSize - 1; // Leave one space empty
  const initialBoxes = [];

  // Generate the boxes
  for (let x = 0, box = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize && box < totalBoxes; y++, box++) {
      const label = x + y * gridSize + 1;
      initialBoxes.push({label, x, y});
    }
  }

  // Shuffle the boxes
  let emptySpace = {
    x: gridSize - 1,
    y: gridSize - 1,
    isAtEnd: function () {
      return this.x === gridSize - 1 && this.y === gridSize - 1;
    }
  };
  let ShuffleTimes = 10 * gridSize * gridSize;
  let possibleMovableBoxes = [
    {dx: 0, dy: -1}, // Top box
    {dx: 1, dy: 0}, // Right box
    {dx: 0, dy: 1}, // Bottom box
    {dx: -1, dy: 0}, // Left box
  ]
  // After shuffle the empty space should remain at the end like before
  for (let i = 0; i < ShuffleTimes || !emptySpace.isAtEnd(); i++) {
    let movableBoxes = possibleMovableBoxes.filter(box => {
      // Remove boxes that do not exist
      let nextX = emptySpace.x + box.dx;
      let nextY = emptySpace.y + box.dy;
      return nextX >= 0 && nextX < gridSize && nextY >= 0 && nextY < gridSize;
    });
    // Move a randomly selected box
    let randMovableBox = movableBoxes[Math.floor(Math.random() * movableBoxes.length)];
    let movableBoxPos = {
      x: emptySpace.x + randMovableBox.dx,
      y: emptySpace.y + randMovableBox.dy,
    };
    let movableBox = initialBoxes.find(box => {
      return box.x === movableBoxPos.x && box.y === movableBoxPos.y;
    });
    [movableBox.x, movableBox.y] = [emptySpace.x, emptySpace.y];
    [emptySpace.x, emptySpace.y] = [movableBoxPos.x, movableBoxPos.y];
  }

  return (
    <PuzzleBox
      key={gridSize}
      gridSize={gridSize}
      initialBoxes={initialBoxes}
    />
  )
}