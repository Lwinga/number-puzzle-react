import { useState } from "react";
import PuzzleBox from "./PuzzleBox.jsx";
import Stopwatch from "./Stopwatch.jsx";

export default function App() {
  const [refresh, setRefresh] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState({value: true, id: 0});
  const [isStopwatchPaused, setIsStopwatchPaused] = useState(false);

  const gridSize = 3;
  const totalBoxes = gridSize * gridSize - 1; // Leave one space empty
  const initialBoxes = [];

  // Generate the boxes
  for (let y = 0, box = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize && box < totalBoxes; x++, box++) {
      initialBoxes.push({label: box + 1, x, y});
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

  function handleRefreshClick() {
    setRefresh(refresh + 1);
    setIsStopwatchRunning({value: true, id: isStopwatchRunning.id + 1});
  }

  function handleStop(timeTaken) {
    setTimeout(() => {
      window.alert('You won!\nTime taken: ' + timeTaken);
      setRefresh(refresh + 1);
      setIsStopwatchRunning({value: true, id: isStopwatchRunning.id + 1});
    }, 250); // The delay to wait for the transition
  }

  function handleWin() {
    setIsStopwatchRunning({value: false, id: isStopwatchRunning.id + 1});
  }

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <Stopwatch
          isRunning={isStopwatchRunning}
          isPaused={isStopwatchPaused}
          onStop={handleStop}
        />
        <button onClick={handleRefreshClick}>Refresh</button>
        <button onClick={() => setIsStopwatchPaused(true)}>Pause</button>
      </div>
      <PuzzleBox
        key={gridSize + refresh}
        gridSize={gridSize}
        initialBoxes={initialBoxes}
        onWin={handleWin}
      />
      {isStopwatchPaused && <div style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        left: '0',
        top: '0',
        background: 'white',
        zIndex: '999',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <button onClick={() => setIsStopwatchPaused(false)}>Resume</button>
      </div>}
    </>
  )
}