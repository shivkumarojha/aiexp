import { authClient } from "./auth-client";
export const googleSignin = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: `${import.meta.env.VITE_FRONTEND_URL}/dashboard`,
  });
};

export const githubSignin = async () => {
  await authClient.signIn.social({
    provider: "github",
    callbackURL: `${import.meta.env.VITE_FRONTEND_URL}/dashboard`,
  });
};
