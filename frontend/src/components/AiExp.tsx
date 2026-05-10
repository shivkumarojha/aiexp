import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { SparklesCore } from "./ui/sparkles";
import { useNavigate } from "react-router";
export function AiExp() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const handleLogout = async () => {
    console.log("Inside handleLogout");
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/");
        },
      },
    });
  };
  return (
    <div className="h-18 z-20 relative w-full bg-black flex flex-col justify-center overflow-hidden rounded-md">
      <div className="w-full absolute inset-0">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={40}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
      <div className="flex pr-4 justify-between">
        <h1 className="md:text-3xl text-2xl items-center w-full font-bold text-center text-white relative z-20">
          AI Exp
        </h1>
        {session && (
          <div className="flex items-center  justify-end ml-auto gap-4">
            <span className="hidden md:block">
              Welcome, {session.user.name}
            </span>
            <Button
              onClick={handleLogout}
              className="z-20 text-red-800 size-10 ml-auto"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-logout"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                <path d="M9 12h12l-3 -3" />
                <path d="M18 15l3 -3" />
              </svg>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
