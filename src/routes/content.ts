import { Router } from "express";
import { authentication } from "../middleware/auth";
import { contentModel } from "../db";

export const contentRouter = Router();

contentRouter.post("/", authentication, async (req, res) => {
  try {
    const userId = req.userId;
    const { link, type, title } = req.body;
    await contentModel.create({
      link,
      title,
      type,
      tags: [],
      userId,
    });
    res.json({
      message: "content created successfully",
    });
  } catch (e) {
    res.json({
      message: "internal error from content",
      error: e,
    });
  }
});

contentRouter.get("/", authentication, async (req, res) => {
  try {
    const contents = await contentModel
      .find({ userId: req.userId })
      .populate("userId", "username _id");
    res.json({
      content: contents,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error while getting contents",
      error: e,
    });
  }
});

contentRouter.delete("/:id", authentication, async (req, res) => {
  const contentId = req.params.id;
  const userId = req.userId;
  await contentModel.deleteMany({
    _id: contentId,
    userId: userId,
  });
  res.json({
    message: "Content Deleted Successfully.",
  });
});
