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
exports.linkModel = exports.tagModel = exports.contentModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const UserSchema = new mongoose_1.default.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
exports.userModel = mongoose_1.default.model("User", UserSchema);
const contentTypes = [
    "image",
    "video",
    "article",
    "audio",
    "youtube",
    "twitter",
];
const contentSchema = new mongoose_1.default.Schema({
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: mongoose_1.default.Types.ObjectId, ref: "Tag" }, zod_1.optional],
    userId: {
        type: mongoose_1.default.Types.ObjectId,
        ref: "User",
        required: true,
        validate: function (value) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield exports.userModel.findById(value);
                if (!user) {
                    throw new Error("User does not exist");
                }
            });
        },
    },
});
exports.contentModel = mongoose_1.default.model("Content", contentSchema);
const tagsSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true, unique: true },
});
exports.tagModel = mongoose_1.default.model("Tag", tagsSchema);
const linkSchema = new mongoose_1.default.Schema({
    hash: { type: String, required: true, unique: true },
    userId: { type: mongoose_1.default.Types.ObjectId, ref: "User", required: true },
});
exports.linkModel = mongoose_1.default.model("Link", linkSchema);
