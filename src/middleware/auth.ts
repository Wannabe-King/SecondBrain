import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      res.status(400).json({
        message: "User not authenticated.",
      });
      return;
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    if (payload) {
      if (typeof payload === "string") {
        res.status(403).json({
          message: "auth token should be an object",
        });
        return;
      }
    }

    req.userId = (payload as JwtPayload).userId;
    next();
  } catch (e) {
    res.status(500).json({ message: "Internal Server Error", error: e });
  }
};
