import { Router } from "express";
import { userModel } from "../db";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 3;
const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,20}$/;

const userRequiredInputSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(10, { message: "Username must have at max 10 characters" }),
  password: z.string().regex(passwordPattern, {
    message:
      "Password should be 8 to 20 letters, should have atleast one uppercase, one lowercase, one special character, one number",
  }),
});

export type User = z.input<typeof userRequiredInputSchema>;

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  try {
    const result = userRequiredInputSchema.safeParse(req.body);
    if (!result.success) {
      res
        .status(400)
        .json({ message: "Error in inputs", errors: result.error.format() });
      return;
    }
    const { username, password } = result.data;
    const existingUser = await userModel.findOne({ username: username });
    if (existingUser) {
      res
        .status(403)
        .json({ message: "User already exists with this username" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await userModel.create({
      username: username,
      password: hashedPassword,
    });

    res.json({
      message: "User Signed Up.",
    });
  } catch (e) {
    res.status(500).json({
      message: `Server Error `,
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await userModel.findOne({
      username,
    });
    if (!existingUser) {
      res.status(403).json({
        message: "Wrong username password",
      });
    } else {
      const result = await bcrypt.compare(password, existingUser.password);
      if (!result) {
        res.status(403).json({
          message: "Wrong username password",
        });
        return;
      }
      const jwtSecret: string = process.env.JWT_SECRET!;
      const token = jwt.sign({ userId: existingUser._id }, jwtSecret);
      res.json({
        token: token,
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "Internal Server Error.",
      error: e,
    });
  }
});
