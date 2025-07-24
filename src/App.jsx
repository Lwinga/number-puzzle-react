import { useState } from "react";
import PuzzleBox from "./PuzzleBox.jsx";
import Stopwatch from "./Stopwatch.jsx";

const gridSizes = [
  {size: 3, label: '3 x 3'},
  {size: 4, label: '4 x 4'},
  {size: 5, label: '5 x 5'},
  {size: 6, label: '6 x 6'},
  {size: 7, label: '7 x 7'},
  {size: 8, label: '8 x 8'},
  {size: 9, label: '9 x 9'},
  {size: 10, label: '10 x 10'},
];

export default function App() {
  const [gridSize, setGridSize] = useState(gridSizes[0].size);
  const [refreshId, setRefreshId] = useState(0);
  const [stopwatchStatus, setStopwatchStatus] = useState('running');

  function handleGridSizeSelect(e) {
    setGridSize(e.target.value);
    setStopwatchStatus('running');
    setRefreshId(refreshId + 1);
  }

  function handleRefreshClick() {
    setStopwatchStatus('running');
    setRefreshId(refreshId + 1);
  }

  function handleStop(timeTaken) {
    setTimeout(() => {
      window.alert('You won!\nTime taken: ' + timeTaken);
      setStopwatchStatus('running');
      setRefreshId(refreshId + 1);
    }, 250); // The delay to wait for the transition
  }

  function handleWin() {
    setStopwatchStatus('stopped');
  }

  return (
    <>
      <select
        value={gridSize}
        onChange={handleGridSizeSelect}
        style={{
          width: '100%',
          marginBottom: '16px',
        }}
      >
        {gridSizes.map(gdSize => <option
          key={gdSize.size}
          value={gdSize.size}
        >
          {gdSize.label}
        </option>)}
      </select>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <Stopwatch
          key={refreshId}
          status={stopwatchStatus}
          onStop={handleStop}
        />
        <button onClick={handleRefreshClick}>Refresh</button>
        <button onClick={() => setStopwatchStatus('paused')}>Pause</button>
      </div>
      <PuzzleBox
        key={refreshId}
        gridSize={gridSize}
        onWin={handleWin}
      />
      {stopwatchStatus === 'paused' && <div style={{
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
        <button onClick={() => setStopwatchStatus('running')}>Resume</button>
      </div>}
    </>
  )
}
