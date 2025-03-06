import { Router } from "express";
import { authentication } from "../middleware/auth";
import { random } from "../utils";
import { contentModel, linkModel, userModel } from "../db";

export const shareRouter = Router();

shareRouter.post("/share", authentication, async (req, res) => {
  try {
    const share = req.body.share;
    if (share) {
      const existingLink = await linkModel.findOne({
        userId: req.userId,
      });
      if (existingLink) {
        res.json({
          link: existingLink.hash,
        });
        return;
      }
      let hash: string = random(10);
      await linkModel.create({
        userId: req.userId,
        hash: hash,
      });
      res.json({
        link: hash,
      });
    } else {
      await linkModel.deleteMany({
        userId: req.userId,
      });
      res.json({
        message: "Removed Link",
      });
    }
  } catch (e) {
    res.status(500).json({
      message: "Intenal Server Error",
      error: e,
    });
  }
});

shareRouter.get("/:shareLink", async (req, res) => {
  try {
    const hash = req.params.shareLink;
    const result = await linkModel.findOne({
      hash,
    });
    if (!result) {
      res.status(403).json({
        message: "This link is not registered with us.",
      });
      return;
    }
    const contents = await contentModel.find({
      userId: result.userId,
    });
    //   .populate("userId", "username");

    const user = await userModel.findOne({ _id: result.userId });

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
  } catch (e) {
    res.status(500).json({
      message: "Intenal Server Error",
      error: e,
    });
  }
});
