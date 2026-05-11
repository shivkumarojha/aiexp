import { useEffect, useState } from "react";
import "./App.css";
import { BackgroundRippleEffect } from "./components/ui/background-ripple-effect";
import { EditSvg } from "./components/icons";
import { AiExp } from "./components/AiExp";
import QueryInput from "./components/QueryInput";
import { LoaderOne } from "./components/ui/loader";
import { Button } from "./components/ui/button";
import Markdown from "react-markdown";
import { authClient } from "./lib/auth-client";
import { useNavigate } from "react-router";

function App() {
  const [result, setResult] = useState("");
  // @ts-ignore
  const [followUps, setFollowUps] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  // controlling to show input box when pressing i
  const [isVisible, setIsVisible] = useState(true);

  const [lastSubmittedQuery, setLastSubmittedQuery] = useState("");

  const navigate = useNavigate();
  // session and only redirect if user is logged in
  const { data: session, isPending } = authClient.useSession();
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isTypingTarget) return;
      if (event.key.toLowerCase() === "i") {
        setLastSubmittedQuery("");
        setIsVisible(true);
      }
    };
    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);
  const solve = async (query: string) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/conversation`,
      {
        method: "post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      },
    );

    if (!response.body) {
      throw Error("no response body");
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    setResult("");
    setFollowUps([]);

    setIsLoading(false);
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      accumulated += chunk;

      if (accumulated.includes("|||FOLLOWUPS|||")) {
        const [textPart, jsonPart] = accumulated.split("|||FOLLOWUPS|||");
        setResult(textPart);
        try {
          setFollowUps(JSON.parse(jsonPart));
        } catch {
          setFollowUps([]);
        }
      } else {
        setResult(accumulated);
      }
    }
  };

  const handleSubmit = (query: string) => {
    setLastSubmittedQuery(query);
    setIsLoading(true);
    setIsVisible(false);
    solve(query);
  };
  const handleEdit = () => {
    setIsVisible(true);
  };

  if (isPending)
    return (
      <div className="flex h-screen justify-center items-center">
        <LoaderOne />
      </div>
    );
  if (!session) navigate("/");
  return (
    <div className="h-screen relative">
      <div className="fixed w-full p-4">
        <BackgroundRippleEffect />
        <AiExp />
      </div>
      <div className="flex justify-center items-center w-full">
        <div className="flex items-center">
          {isVisible && (
            <QueryInput
              onSubmit={handleSubmit}
              onClose={() => setIsVisible(false)}
              initialValue={lastSubmittedQuery}
            />
          )}
          {/* <button onClick={() => solve()}>resolve</button> */}
        </div>
        {isLoading && (
          <div className="absolute inset-0 z-20 pb-8 flex items-end justify-center pointer-events-none">
            <LoaderOne />
          </div>
        )}
        <div className="w-full max-w-5xl mt-32 z-2 p-4 overflow-y-auto h-[calc(100vh-5rem)] scroll-smooth">
          <div className="text-xl md:text-2xl tracking-wide">
            <Markdown>{result}</Markdown>
          </div>
        </div>
      </div>
      {lastSubmittedQuery && (
        <div className="p-3 z-20 py-4 flex bottom-0 items-center justify-around fixed w-full border-t border-white-10 bg-black/30 backdrop-blur-sm">
          <div className="flex overflow-y-auto h-20 max-w-8xl px-4 py-3 text-sm text-gray-300">
            <span className="text-xl text-white">
              <span className="text-gray-500 pr-4 truncate md:whitespace-normal">
                Query:
              </span>{" "}
              {lastSubmittedQuery}
            </span>
          </div>
          <div className="flex gap-4">
            <Button onClick={() => handleEdit()}>
              {" "}
              <EditSvg />
            </Button>
            {!isVisible && (
              <div className="hidden md:block text-xl pr-4 text-white/50">
                press i to ask
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
