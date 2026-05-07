import { createAuthClient } from "better-auth/react";

// Use "satisfies" to keep literal types
const clientConfig = {
    baseURL: "http://localhost:3000",
    // plugins: [ ... ]
} satisfies Parameters<typeof createAuthClient>[0];

export const authClient = createAuthClient(clientConfig);

