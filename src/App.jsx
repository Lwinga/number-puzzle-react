import { useEffect, useRef, useState } from "react";
import PuzzleBox from "./PuzzleBox.jsx";
import Stopwatch from "./Stopwatch.jsx";
import { dragSound, formatTime } from "./utils.js";
import { useLocalStorage } from "./hooks.js";

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

const initialBestScore = (() => {
  const initialBestScore = {};
  gridSizes.forEach(gridSize => {
    initialBestScore[gridSize.size] = 0;
  });
  return initialBestScore;
})();

const mainPadding = 8;

export default function App() {
  const [refreshId, setRefreshId] = useState(0);
  const [stopwatchStatus, setStopwatchStatus] = useState('running');
  const [moves, setMoves] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [maxSize, setMaxSize] = useState(0);
  const [isMuted, setIsMuted] = useState(dragSound.isMuted);

  const mainRef = useRef(null);
  
  const [gridSize, setGridSize] = useLocalStorage(
    'gridSize',
    gridSizes[0].size,
  );
  const [bestScore, setBestScore] = useLocalStorage(
    Object.keys(initialBestScore),
    initialBestScore,
  );

  useEffect(() => {
    function updateMaxSize() {
      const width = mainRef.current.clientWidth - mainPadding * 2;
      const height = mainRef.current.clientHeight - mainPadding * 2;
      setMaxSize(Math.min(width, height));
    }
    updateMaxSize();
    window.addEventListener('resize', updateMaxSize);
    return () => window.removeEventListener('resize', updateMaxSize);
  }, []);

  const currentBestScore = Number(bestScore !== null ? bestScore[gridSize] : 0);
  const bestScoreText = currentBestScore === 0 ? '--:--' : formatTime(currentBestScore);

  function refresh() {
    setStopwatchStatus('running');
    setMoves(0);
    setRefreshId(refreshId + 1);
  }

  function handleContinueClick() {
    setIsWon(false);
    refresh();
  }

  function handleGridSizeSelect(e) {
    setGridSize(e.target.value);
    refresh();
  }

  function handleRefreshClick() {
    refresh();
  }

  function handleMuteClick() {
    const nextIsMuted = !isMuted;
    setIsMuted(nextIsMuted);
    dragSound.setIsMuted(nextIsMuted);
    dragSound.play();
  }

  function handlePause(seconds) {
    setElapsedSeconds(seconds);
  }

  function handleStop(seconds) {
    let nextBestScore = currentBestScore;
    if (currentBestScore === 0 || seconds < currentBestScore) {
      nextBestScore = seconds;
      const record = {};
      record[gridSize] = nextBestScore;
      setBestScore(record);
    }
    setElapsedSeconds(seconds);
  }

  function handleWin() {
    setTimeout(() => {
      setStopwatchStatus('stopped');
      setIsWon(true);
    }, 250); // The delay to wait for the transition
  }

  return (
    <>
      <header>
        <div>
          <label htmlFor="gridSize">Grid Size:</label>
          {gridSize && <select
            id="gridSize"
            value={gridSize}
            onChange={handleGridSizeSelect}
          >
            {gridSizes.map(gdSize => <option
              key={gdSize.size}
              value={gdSize.size}
            >
              {gdSize.label}
            </option>)}
          </select>}
        </div>
        <Stopwatch
          key={refreshId}
          status={stopwatchStatus}
          onPause={handlePause}
          onStop={handleStop}
        />
        <div>
          <button className="icon-btn" onClick={handleRefreshClick}>
            <i className="fas fa-refresh"></i> Restart
          </button>
          <button className="icon-btn" onClick={() => setStopwatchStatus('paused')}>
            <i className="fas fa-pause"></i> Pause
          </button>
        </div>
      </header>

      <main ref={mainRef} style={{ padding: `${mainPadding}px` }}>
        {gridSize && <PuzzleBox
          key={`${refreshId}${gridSize}`}
          gridSize={gridSize}
          moves={moves}
          maxSize={maxSize}
          onWin={handleWin}
          onMovesChange={(m) => setMoves(m)}
        />}
        {stopwatchStatus === 'paused' && <div className="overlay pause">
          <h2>Game Paused</h2>
          <p><strong>Time:</strong> {formatTime(elapsedSeconds)}</p>
          <p><strong>Moves:</strong> {moves}</p>
          <p><strong>Best Score:</strong> {bestScoreText}</p>
          <button onClick={() => setStopwatchStatus('running')}>
            <i className="fas fa-play"></i> Resume
          </button>
        </div>}
        {isWon && <div className="overlay win">
          <h2>🎉 You Won!</h2>
          <p><strong>Time Taken:</strong> {formatTime(elapsedSeconds)}</p>
          <p><strong>Moves:</strong> {moves}</p>
          <p><strong>Best Score:</strong> {bestScoreText}</p>
          <button onClick={handleContinueClick}><i className="fas fa-forward"></i> Continue</button>
        </div>}
      </main>

      <footer>
        <div className="stats">
          <span><strong>Best Score:</strong> {bestScoreText}</span>
          <span><strong>Moves:</strong> {moves}</span>
        </div>
        <button className="icon-btn" title="Toggle Sound" onClick={handleMuteClick}>
          <i className={isMuted ? "fas fa-volume-mute" : "fas fa-volume-up"}></i>
        </button>
      </footer>
    </>
  )
}
