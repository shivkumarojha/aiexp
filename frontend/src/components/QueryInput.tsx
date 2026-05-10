import { useState } from "react";

interface QueryInputProps {
  initialValue?: string;
  onSubmit: (query: string) => void;
  onClose: () => void;
}

export default function QueryInput({
  initialValue,
  onSubmit,
  onClose,
}: QueryInputProps) {
  const [query, setQuery] = useState(initialValue);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && query!.trim().length > 0) {
      onSubmit(query!.trim());
      setQuery("");
    } else if (event.key === "Escape") {
      onClose();
    }
  };
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
      <div className="bg-blue-400/30 text-red-700 w-full max-w-5xl backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg pointer-events-auto">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type here..."
          className="w-full bg-black text-white text-2xl backdrop-blur-sm border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      </div>
    </div>
  );
}
