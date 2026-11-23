import { useEffect, useState } from "react";

function ExamTimer({
  durationMinutes = 60,
  storageKey = "exam-timer",
  onTimeUp,
}) {
  const getEndTime = () => {
    const savedEndTime = localStorage.getItem(storageKey);

    if (savedEndTime) {
      return Number(savedEndTime);
    }

    const endTime = Date.now() + durationMinutes * 60 * 1000;
    localStorage.setItem(storageKey, String(endTime));

    return endTime;
  };

  const calculateRemaining = () => {
    const endTime = getEndTime();
    return Math.max(0, endTime - Date.now());
  };

  const [remaining, setRemaining] = useState(calculateRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      const timeLeft = calculateRemaining();

      setRemaining(timeLeft);

      if (timeLeft <= 0) {
        clearInterval(interval);

        if (onTimeUp) {
          onTimeUp();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const totalSeconds = Math.floor(remaining / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formattedTime =
    `${String(hours).padStart(2, "0")}:` +
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;

  const isLowTime = remaining <= 5 * 60 * 1000;

  return (
    <div className={`exam-timer ${isLowTime ? "timer-warning" : ""}`}>
      <span className="timer-label">Time Left</span>
      <strong>{formattedTime}</strong>
    </div>
  );
}

export default ExamTimer;