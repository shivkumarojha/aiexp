import { useState, useEffect } from "react";
interface VanishTextProps {
  error: string;
  setError: (value: string) => void
  duration: number
}
export const VanishText = ({ error, setError, duration = 3000 }: VanishTextProps) => {
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
      className={`text-red-400 transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      {error}
    </div>
  );
};
