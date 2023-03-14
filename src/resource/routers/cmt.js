const express = require("express");
const router = express.Router();
const Favorite = require("../models/favorites");
const User = require("../models/users");
const Post = require("../models/posts");
const multer = require("multer");
const uploadCmt = multer();
const Cmt = require("../models/comments");
const verifyToken = require("../middleware/verifyAuth");

// @route POST api/cmts
// @desc POST cmts
// @access Private
router.post(
  "/post/:postId",
  verifyToken,
  uploadCmt.array(),
  async (req, res) => {
    const { cmtContent } = req.body;

    // Simple validation
    if (!cmtContent)
      return res
        .status(400)
        .json({ success: false, message: "Missing information" });

    try {
      // get data user by id's user at collection users
      // const userData = await User.findById(req.body.user);
      // // get data music by id's music at collection musics
      // const postData = await Post.findById(req.body.post);
      const newCmt = new Cmt({
        user: req.userId,
        cmtContent,
        post: req.params.postId,
      });
      await newCmt.save();

      res.json({
        success: true,
        message: "Comment created successfully",
        newCmt,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Internal server error !!!!",
      });
    }
  }
);

// @route GET api/cmts
// @desc Get cmts
// @access Private
router.get("/datacmts", async (req, res) => {
  try {
    const cmts = await Cmt.find(req).populate("post").populate("user");
    res.json({ success: true, cmts });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.delete("/delete-comment/:commentId", verifyToken, async (req, res) => {
  try {
    // check owner
    const comment = await Cmt.findOne({
      _id: req.params.commentId,
      user: req.userId,
    });
    if (!comment) {
      return res
        .status(400)
        .json({ success: false, message: "only owner can delete" });
    }

    // delete comment
    await Cmt.deleteOne({ _id: req.params.commentId });
    res.status(200).json({
      success: true,
      message: "delete comment success",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.get("/get-comment-for-post/:postId", async (req, res) => {
  try {
    const comments = await Cmt.find({ post: req.params.postId }).populate(
      "user"
    );
    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

router.patch("/update-comment/:commentId", verifyToken, async (req, res) => {
  try {
    // check owner
    const comment = await Cmt.findOne({
      _id: req.params.commentId,
      user: req.userId,
    });
    if (!comment) {
      return res
        .status(400)
        .json({ success: false, message: "only owner can update" });
    }

    // check content
    const { cmtContent } = req.body;
    if (!req.body.cmtContent) {
      return res
        .status(400)
        .json({ success: false, message: "Missing information" });
    }

    // update
    const newCmt = await Cmt.findOneAndUpdate(
      { _id: req.params.commentId },
      { cmtContent },
      { new: true, runValidators: true }
    );
    res.status(200).json({ message: "update success", newCmt });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});
module.exports = router;
