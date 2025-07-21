import { useEffect, useRef, useState } from "react";

export default function Stopwatch({
  isRunning = {value: true, id: 0}, // For start and stop
  isPaused = false, // For pause and resume
  onStop = () => {},
}) {
  const [now, setNow] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const intervalRef = useRef(null);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    if (isRunning.value) {
      setStartTime(Date.now());
      setNow(Date.now());
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        if (!isPausedRef.current) {
          setNow(Date.now());
        }
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      onStop(formatTime(elapsedSeconds));
    }
  }, [isRunning.id]);

  useEffect(() => {
    isPausedRef.current = isPaused;
    if (!isPaused && now > 0) {
      setStartTime(startTime + (Date.now() - now));
      setNow(Date.now());
    }
  }, [isPaused]);

  const elapsedSeconds = (now - startTime) / 1000;

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    const pad = (num) => num < 10 ? '0' + num : num;

    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  return (
    <div>{formatTime(elapsedSeconds)}</div>
  );
}
