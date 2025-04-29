import type { Request, Response } from "express";
import User from "../models/user.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Wrong password" });
    }

    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY is not defined in environment variables.");
    }

    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: "10d" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        _id: user.id,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error occurred";
    return res.status(500).json({ success: false, error: message });
  }
};

const verify = (req: Request, res: Response) => {
  return res.status(200).json({success: true, user: req.user})
}

export { login, verify };
