import mongoose from "mongoose";
import { optional } from "zod";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const userModel = mongoose.model("User", UserSchema);

const contentTypes = [
  "image",
  "video",
  "article",
  "audio",
  "youtube",
  "twitter",
];

const contentSchema = new mongoose.Schema({
  link: { type: String, required: true },
  type: { type: String, enum: contentTypes, required: true },
  title: { type: String, required: true },
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }, optional],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    validate: async function (value: String) {
      const user = await userModel.findById(value);
      if (!user) {
        throw new Error("User does not exist");
      }
    },
  },
});

export const contentModel = mongoose.model("Content", contentSchema);

const tagsSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

export const tagModel = mongoose.model("Tag", tagsSchema);

const linkSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const linkModel = mongoose.model("Link", linkSchema);
