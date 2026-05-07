import { createAuthClient } from "better-auth/react";

// Use "satisfies" to keep literal types
const clientConfig = {
  baseURL: import.meta.env.VITE_BACKEND_URL,
  // plugins: [ ... ]
} satisfies Parameters<typeof createAuthClient>[0];

export const authClient = createAuthClient(clientConfig);
