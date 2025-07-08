"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccessToken = exports.login = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
dotenv_1.default.config();
// const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
// const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "1h";
const REFRESH_EXPIRE = process.env.REFERSH_EXPIRE || "7d";
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";
// ------------------------
// Register New User
// ------------------------
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await user_model_1.default.findOne({ email });
        if (existingUser)
            return res.status(400).json({ msg: "Email already exists" });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = new user_model_1.default({
            name,
            email,
            password: hashedPassword,
            role,
        });
        await newUser.save();
        return res.status(201).json({ msg: "You have registered successfully" });
    }
    catch (err) {
        console.error(err.message);
        return res
            .status(500)
            .send("Something went wrong. Please try again later.");
    }
};
exports.createUser = createUser;
// ------------------------
// Login
// ------------------------
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const clientType = req.header("x-client-type"); // 'web' or 'app'
        if (!["web", "app"].includes(clientType || "")) {
            return res
                .status(400)
                .json({ msg: 'Client type must be "web" or "app"' });
        }
        const user = (await user_model_1.default.findOne({ email }).populate("role"));
        if (!user)
            return res.status(400).json({ msg: "Invalid credentials" });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ msg: "Invalid credentials" });
        let roleCode = undefined;
        let roleName = undefined;
        if (typeof user.role !== "string") {
            roleCode = user.role.roleCode; // ✅ Safe access
            roleName = user.role.roleName; // Assuming roleName is also needed
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id, name: user.name, role_code: roleCode }, JWT_SECRET, { expiresIn: '1h' });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, JWT_REFRESH_SECRET, {
            expiresIn: '10d',
        });
        const tokenData = {
            accessToken,
            refreshToken,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // Example: 2 hours from now
            isActive: true,
        };
        if (clientType === "web")
            user.webTokens = [tokenData];
        else
            user.appTokens = [tokenData];
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
    }
    catch (err) {
        console.error("Login error:", err.message);
        return res.status(500).send("Something went wrong. Please try again.");
    }
};
exports.login = login;
// ------------------------
// Refresh Access Token
// ------------------------
const getAccessToken = async (req, res) => {
    try {
        let { accessToken } = req.body;
        const clientType = req.header("x-client-type");
        if (!["web", "app"].includes(clientType || "")) {
            return res
                .status(400)
                .json({ msg: 'Client type must be "web" or "app"' });
        }
        const currentUserDetails = jsonwebtoken_1.default.verify(accessToken, JWT_SECRET);
        const user = await user_model_1.default.findOne({ _id: currentUserDetails.id }).populate("role");
        if (!user)
            return res.status(400).json({ msg: "User does not exist" });
        // Get stored refresh token
        const refreshToken = clientType === "web"
            ? user.webTokens?.[0]?.refreshToken
            : user.appTokens?.[0]?.refreshToken;
        if (!refreshToken)
            return res.status(401).json({ msg: "No refresh token found" });
        jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_SECRET);
        let roleCode = undefined;
        let roleName = undefined;
        if (typeof user.role !== "string") {
            roleCode = user.role.roleCode; // ✅ Safe access
            roleName = user.role.roleName; // Assuming roleName is also needed
        }
        accessToken = jsonwebtoken_1.default.sign({ id: user._id, name: user.name, role_code: roleCode }, JWT_SECRET, { expiresIn: "1h" });
        const tokenData = {
            accessToken,
            refreshToken,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 2), // Example: 2 hours from now
            isActive: true,
        };
        if (clientType === "web")
            user.webTokens = [tokenData];
        else
            user.appTokens = [tokenData];
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
    }
    catch (err) {
        console.error("Token refresh error:", err.message);
        return res
            .status(401)
            .json({ msg: "Refresh token expired or invalid. Please log in again." });
    }
};
exports.getAccessToken = getAccessToken;
