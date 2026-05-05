import { useEffect, useState } from "react";
import "./App.css";
import { BackgroundRippleEffect } from "./components/ui/background-ripple-effect";
import { FollowUpArrow } from "./components/icons";
import { AiExp } from "./components/AiExp";
import QueryInput from "./components/QueryInput";
import { LoaderOne } from "./components/ui/loader";

interface Result {
  answer: string;
  followUps: [string];
}
function App() {
  const [result, setResult] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  // controlling to show input box when pressing i
  const [isVisible, setIsVisible] = useState(true);

  const [lastSubmittedQuery, setLastSubmittedQuery] = useState("");
  // useEffect(() => {
  //   const handleKeyDown = (event) => {
  //     if (event.key == "i") {
  //       setIsVisible(true);
  //     }
  //   };
  //
  //   window.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [isVisible]);
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isTypingTarget) return;
      if (event.key.toLowerCase() === "i") {
        setIsVisible(true);
      }
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);
  const solve = async (query: string) => {
    const response = await fetch("http://localhost:3000/conversation", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    // 1. Get the reader from the response body
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    setResult("")
    
    // 2. Read the stream in a loop
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      // 3. Decode the chunk and update state
      const chunk = decoder.decode(value, { stream: true });
      setResult((prev) => prev + chunk);
    }
    // const data = await response.json();
    // console.log(data.result);
    // setResult(JSON.parse(data.result));
    setIsLoading(false);
  };

  const handleSubmit = (query: string) => {
    setLastSubmittedQuery(query);
    setIsLoading(true);
    setIsVisible(false);
    solve(query);
  };
  return (
    <div className="h-screen relative">
      <BackgroundRippleEffect />
      <AiExp />
      <div className="flex justify-center items-center w-full">
        <div className="flex items-center">
          {isVisible && (
            <QueryInput
              onSubmit={handleSubmit}
              onClose={() => setIsVisible(false)}
            />
          )}
          {/* <button onClick={() => solve()}>resolve</button> */}
        </div>
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <LoaderOne />
          </div>
        )}
        <div className="w-full max-w-5xl mt-8">
          <div className="text-2xl tracking-wide">
            {result}
          </div>
          {/* <div className="flex ml-12 mt-12"> */}
          {/*   {result && ( */}
          {/*     <div className="list-none text-lg"> */}
          {/*       {result.followUps.map((question, index) => ( */}
          {/*         <div className="flex text-xl text-gray-400 gap-4 p-2"> */}
          {/*           <FollowUpArrow /> <li key={index + 1}>{question}</li> */}
          {/*         </div> */}
          {/*       ))} */}
          {/*     </div> */}
          {/*   )} */}
          {/* </div> */}
        </div>
      </div>
      {lastSubmittedQuery && (
        <div className="p-3 bottom-0 absolute w-full border-t border-white-10 bg-black/30 backdrop-blur-sm">
          <div className="mx-auto max-w-5xl px-4 py-3 text-sm text-gray-300">
            <span className="text-xl text-white">{lastSubmittedQuery}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
