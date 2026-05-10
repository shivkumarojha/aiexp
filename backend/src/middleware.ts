import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth"; // Your auth instance
import { Request, Response, NextFunction } from "express";

export const authMiddleware= async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Convert Node.js headers to the format Better Auth expects
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
