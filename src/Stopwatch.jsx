import { useEffect, useRef, useState } from "react";

export default function Stopwatch({
  running = false,
  onStop = () => {},
}) {
  const [now, setNow] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      setStartTime(Date.now());
      setNow(Date.now());
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setNow(Date.now());
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      onStop(formatTime(elapsedSeconds));
    }
  }, [running]);

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
