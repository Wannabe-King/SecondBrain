"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const saltRounds = 3;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,20}$/;
const userRequiredInputSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(10, { message: "Username must have at max 10 characters" }),
    password: zod_1.z.string().regex(passwordPattern, {
        message: "Password should be 8 to 20 letters, should have atleast one uppercase, one lowercase, one special character, one number",
    }),
});
exports.userRouter = (0, express_1.Router)();
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = userRequiredInputSchema.safeParse(req.body);
        if (!result.success) {
            res
                .status(400)
                .json({ message: "Error in inputs", errors: result.error.format() });
            return;
        }
        const { username, password } = result.data;
        const existingUser = yield db_1.userModel.findOne({ username: username });
        if (existingUser) {
            res
                .status(403)
                .json({ message: "User already exists with this username" });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
        yield db_1.userModel.create({
            username: username,
            password: hashedPassword,
        });
        res.json({
            message: "User Signed Up.",
        });
    }
    catch (e) {
        res.status(500).json({
            message: `Server Error `,
        });
    }
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const existingUser = yield db_1.userModel.findOne({
            username,
        });
        if (!existingUser) {
            res.status(403).json({
                message: "Wrong username password",
            });
        }
        else {
            const result = yield bcrypt_1.default.compare(password, existingUser.password);
            if (!result) {
                res.status(403).json({
                    message: "Wrong username password",
                });
                return;
            }
            const jwtSecret = process.env.JWT_SECRET;
            const token = jsonwebtoken_1.default.sign({ userId: existingUser._id }, jwtSecret);
            res.json({
                token: token,
            });
        }
    }
    catch (e) {
        res.status(500).json({
            message: "Internal Server Error.",
            error: e,
        });
    }
}));
