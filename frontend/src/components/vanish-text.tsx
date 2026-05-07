import { useState, useEffect } from "react";

export const VanishText = ({ error, setError, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setError("");
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <div
      className={`text-center text-red-400 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {error}
    </div>
  );
};
