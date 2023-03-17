const express = require("express");
const router = express.Router();
const Post = require("../models/posts");
const User = require("../models/users");
const Music = require("../models/musics");
const multer = require("multer");
const verifyToken = require("../middleware/verifyAuth");
const upload = multer();

// @route POST api/posts
// @desc POST posts
// @access Private
router.post("/", upload.array(), async (req, res) => {
  const { postContent } = req.body;

  // Simple validation
  if (!postContent)
    return res
      .status(400)
      .json({ success: false, message: "Missing information" });

  try {
    // get data user by id's user at collection users
    const userData = await User.findById(req.body.user);
    // get data music by id's music at collection musics
    const musicData = await Music.findById(req.body.music);

    const newPost = new Post({
      user: userData,
      postContent,
      music: musicData,
    });
    await newPost.save();

    res.json({
      success: true,
      message: "Post created successfully",
      newPost,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error !!!!" });
  }
});

// @route GET api/posts
// @desc Get posts
// @access Private
router.get("/datapost", async (req, res) => {
  try {
    const posts = await Post.find(req).populate("music").populate("user");
    res.json({ success: true, posts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route DELETE api/posts
// @desc Delete post
// @access Private
router.delete("/delete/:id", async (req, res) => {
  try {
    const postDeleteCondition = { _id: req.params.id, post: req.postId };
    const deletedPost = await Post.findOneAndDelete(postDeleteCondition);

    // User not authorised or post not found
    if (!deletedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found",
      });

    res.json({ success: true, post: deletedPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// @route PUT api/post
// @desc update post information
// @access private
router.put("/update/:id", upload.array(), async (req, res) => {
  const { postContent } = req.body;

  if (!postContent) {
    return res
      .status(400)
      .json({ success: false, message: "Missing information" });
  }

  try {
    // input new data music
    let updatedPost = {
      postContent,
    };
    // check if this music is in the database or not. If so, it must match id to be updated.
    const musicUpdateCondition = { _id: req.params.id, post: req.postId };

    updatedPost = await Post.findOneAndUpdate(
      musicUpdateCondition,
      updatedPost,
      { new: true }
    );

    //  music not found
    if (!updatedPost)
      return res.status(401).json({
        success: false,
        message: "Post not found",
      });

    res.json({
      success: true,
      message: "Excellent progress!",
      post: updatedPost,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error123!!!!" });
  }
});

// search post

router.get("/search/:content", async (req, res) => {
  try {
    const post = await Post.find({
      postContent: { $regex: req.params.content, $options: "i" },
    }).populate("music");

    const music = await Music.find({
      musicName: { $regex: req.params.content, $options: "i" },
    }).select("_id");

    const musicId = music.map((d) => d._id.toString());
    const postId = post.map((p) => p._id.toString());

    const postFromMusic = await Post.find({
      music: { $in: musicId },
      _id: { $nin: postId },
    }).populate("music");

    res.json({ success: true, data: { ...post, ...postFromMusic } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// like post
router.patch("/like-post/:postId", verifyToken, async (req, res) => {
  try {
    // check is liked
    const post = await Post.findOne({
      _id: req.params.postId,
      like: req.userId,
    });

    let updateParams = {};
    if (post) {
      updateParams = { $pull: { like: { $in: [req.userId] } } };
    } else {
      updateParams = { $push: { like: req.userId } };
    }

    const newPost = await Post.findOneAndUpdate(
      { _id: req.params.postId },
      updateParams,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: { post: newPost, length: newPost.like.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
