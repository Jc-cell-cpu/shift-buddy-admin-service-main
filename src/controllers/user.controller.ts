import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import User, { IUser } from "../models/user.model";

dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "1h";
const REFRESH_EXPIRE = process.env.REFERSH_EXPIRE || "7d";

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || "default_secret";
const JWT_REFRESH_SECRET: jwt.Secret = process.env.JWT_REFRESH_SECRET || "refresh_secret";


// ------------------------
// Register New User
// ------------------------
export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    return res.status(201).json({ msg: "You have registered successfully" });
  } catch (err: any) {
    console.error(err.message);
    return res
      .status(500)
      .send("Something went wrong. Please try again later.");
  }
};

// ------------------------
// Login
// ------------------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const clientType = req.header("x-client-type"); // 'web' or 'app'

    if (!["web", "app"].includes(clientType || "")) {
      return res
        .status(400)
        .json({ msg: 'Client type must be "web" or "app"' });
    }

    const user = (await User.findOne({ email }).populate("role")) as IUser;

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    let roleCode: string | undefined = undefined;
    let roleName: string | undefined = undefined;

    if (typeof user.role !== "string") {
      roleCode = user.role.roleCode; // ✅ Safe access
      roleName = user.role.roleName; // Assuming roleName is also needed
    }

    const accessToken = jwt.sign(
      { id: user._id, name: user.name, role_code: roleCode },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: '10d',
    });

    const tokenData = {
      accessToken,
      refreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // Example: 2 hours from now
      isActive: true,
    };

    if (clientType === "web") user.webTokens = [tokenData];
    else user.appTokens = [tokenData];

    await user.save();

    // For web clients – store in cookies
    if (clientType === "web") {
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 1, // 2 hours
      });
      res.cookie("role", roleName, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 1, // 2 hours
      });
      res.cookie("roleCode", roleCode, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 1, // 2 hours
      });
    }

    return res.status(200).json({
      msg: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: roleName,
      },
      client: clientType,
      accessToken,
     
    });
  } catch (err: any) {
    console.error("Login error:", err.message);
    return res.status(500).send("Something went wrong. Please try again.");
  }
};

// ------------------------
// Refresh Access Token
// ------------------------
export const getAccessToken = async (req: Request, res: Response) => {
  try {
    let { accessToken } = req.body;
    const clientType = req.header("x-client-type");

    if (!["web", "app"].includes(clientType || "")) {
      return res
        .status(400)
        .json({ msg: 'Client type must be "web" or "app"' });
    }

    const currentUserDetails = jwt.verify(accessToken, JWT_SECRET) as {
      id: string;
    };

    const user = await User.findOne({ _id: currentUserDetails.id }).populate(
      "role"
    );
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    // Get stored refresh token
    const refreshToken =
      clientType === "web"
        ? user.webTokens?.[0]?.refreshToken
        : user.appTokens?.[0]?.refreshToken;

    if (!refreshToken)
      return res.status(401).json({ msg: "No refresh token found" });

    jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    let roleCode: string | undefined = undefined;
    let roleName: string | undefined = undefined;
    if (typeof user.role !== "string") {
      roleCode = user.role.roleCode; // ✅ Safe access
      roleName = user.role.roleName; // Assuming roleName is also needed
    }
    accessToken = jwt.sign(
      { id: user._id, name: user.name, role_code: roleCode },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const tokenData = {
      accessToken,
      refreshToken,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // Example: 2 hours from now
      isActive: true,
    };

    if (clientType === "web") user.webTokens = [tokenData];
    else user.appTokens = [tokenData];

    await user.save();

    // Web: update cookie
    if (clientType === "web") {
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 2,
      });
    }

    return res.status(200).json({
      msg: "Access token refreshed successfully",
      user: {
        name: user.name,
        email: user.email,
        role: roleName,
      },
      accessToken,
    });
  } catch (err: any) {
    console.error("Token refresh error:", err.message);
    return res
      .status(401)
      .json({ msg: "Refresh token expired or invalid. Please log in again." });
  }
};
