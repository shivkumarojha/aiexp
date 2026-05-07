import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { SparklesCore } from "./ui/sparkles";
import { useNavigate } from "react-router";
export function AiExp() {
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const handleLogout = async () => {
    console.log("Inside handleLogout")
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate("/");
        },
      },
    });
  };
  return (
    <div className="h-[8rem] relative w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
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
      <h1 className="md:text-7xl text-3xl lg:text-6xl font-bold text-center text-white relative z-20">
        AI Exp
      </h1>
      {session && (
        <Button onClick={handleLogout} className="z-20 text-red-800 ml-auto">
          Logout
        </Button>

      )}
    </div>
  );
}
