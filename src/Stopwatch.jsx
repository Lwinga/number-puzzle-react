import { useEffect, useState } from "react";

export default function Stopwatch({
  status, // running, paused or stopped
  onStop,
}) {
  const [startTime, setStartTime] = useState(0);
  const [now, setNow] = useState(0);

  const elapsedMillis = now - startTime;
  const elapsedSeconds = elapsedMillis / 1000;

  useEffect(() => {
    if (status === 'running') {
      let intervalId = null;
       // If it was paused it will continue where it was
      setStartTime(Date.now() - elapsedMillis);
      setNow(Date.now());
      intervalId = setInterval(() => {
        setNow(Date.now());
      }, 1000);
      return () => {
        clearInterval(intervalId);
      }
    }  else if (status === 'stopped') {
      setStartTime(0);
      setNow(0);
      onStop(formatTime(elapsedSeconds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const pad = (num) => num < 10 ? '0' + num : num;

    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }

  return (
    <div>{formatTime(elapsedSeconds)}</div>
  );
}
