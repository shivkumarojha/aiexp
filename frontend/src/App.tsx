import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");

  // controlling to show input box when pressing i
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key == "i") {
        setIsVisible(true);
      } else if (event.key == "Enter") {
        solve()
        setIsVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  const solve = async () => {
    const response = await fetch("http://localhost:3000/conversation", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    setResult(JSON.parse(data.result));
  };
  return (
    <div>
      <div className="">
        {isVisible && (
          <div className="bg-white/30 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg">
            <input
              type="text"
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type here..."
              className="w-full bg-white/50 backdrop-blur-sm border border-gray-300 rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
        )}
        {/* <button onClick={() => solve()}>resolve</button> */}
      </div>
      <div>{JSON.stringify(result)}</div>
    </div>
  );
}

export default App;
