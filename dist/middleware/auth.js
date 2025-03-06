"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authentication = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (!token) {
            res.status(400).json({
                message: "User not authenticated.",
            });
            return;
        }
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (payload) {
            if (typeof payload === "string") {
                res.status(403).json({
                    message: "auth token should be an object",
                });
                return;
            }
        }
        req.userId = payload.userId;
        next();
    }
    catch (e) {
        res.status(500).json({ message: "Internal Server Error", error: e });
    }
};
exports.authentication = authentication;
