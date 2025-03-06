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
Object.defineProperty(exports, "__esModule", { value: true });
exports.shareRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const utils_1 = require("../utils");
const db_1 = require("../db");
exports.shareRouter = (0, express_1.Router)();
exports.shareRouter.post("/share", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const share = req.body.share;
        if (share) {
            const existingLink = yield db_1.linkModel.findOne({
                userId: req.userId,
            });
            if (existingLink) {
                res.json({
                    link: existingLink.hash,
                });
                return;
            }
            let hash = (0, utils_1.random)(10);
            yield db_1.linkModel.create({
                userId: req.userId,
                hash: hash,
            });
            res.json({
                link: hash,
            });
        }
        else {
            yield db_1.linkModel.deleteMany({
                userId: req.userId,
            });
            res.json({
                message: "Removed Link",
            });
        }
    }
    catch (e) {
        res.status(500).json({
            message: "Intenal Server Error",
            error: e,
        });
    }
}));
exports.shareRouter.get("/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = req.params.shareLink;
        const result = yield db_1.linkModel.findOne({
            hash,
        });
        if (!result) {
            res.status(403).json({
                message: "This link is not registered with us.",
            });
            return;
        }
        const contents = yield db_1.contentModel.find({
            userId: result.userId,
        });
        //   .populate("userId", "username");
        const user = yield db_1.userModel.findOne({ _id: result.userId });
        if (!user) {
            res.status(403).json({
                message: "User does not exist",
            });
            return;
        }
        res.json({
            username: user.username,
            contents,
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Intenal Server Error",
            error: e,
        });
    }
}));
