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
exports.contentRouter = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const db_1 = require("../db");
exports.contentRouter = (0, express_1.Router)();
exports.contentRouter.post("/", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { link, type, title } = req.body;
        yield db_1.contentModel.create({
            link,
            title,
            type,
            tags: [],
            userId,
        });
        res.json({
            message: "content created successfully",
        });
    }
    catch (e) {
        res.json({
            message: "internal error from content",
            error: e,
        });
    }
}));
exports.contentRouter.get("/", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contents = yield db_1.contentModel
            .find({ userId: req.userId })
            .populate("userId", "username _id");
        res.json({
            content: contents,
        });
    }
    catch (e) {
        res.status(500).json({
            message: "Error while getting contents",
            error: e,
        });
    }
}));
exports.contentRouter.delete("/:id", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.params.id;
    const userId = req.userId;
    yield db_1.contentModel.deleteMany({
        _id: contentId,
        userId: userId,
    });
    res.json({
        message: "Content Deleted Successfully.",
    });
}));
