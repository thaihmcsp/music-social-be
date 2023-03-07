const express = require("express");
const router = express.Router();
const Favorite = require("../models/favorites");
const User = require("../models/users");
const Post = require("../models/posts");
const multer = require("multer");
const uploadCmt = multer();
const Cmt = require("../models/comments");

// @route POST api/cmts
// @desc POST cmts
// @access Private
router.post("/", uploadCmt.array(), async(req, res) => {
    const { cmtContent } = req.body;

    // Simple validation
    if (!cmtContent)
        return res
            .status(400)
            .json({ success: false, message: "Missing information" });

    try {
        // get data user by id's user at collection users
        const userData = await User.findById(req.body.user);
        // get data music by id's music at collection musics
        const postData = await Post.findById(req.body.post);

        const newCmt = new Cmt({
            user: userData,
            cmtContent,
            post: postData,
        });
        await newCmt.save();

        res.json({
            success: true,
            message: "Comment created successfully",
            newCmt,
        });
    } catch (err) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error !!!!" });
    }
});

// @route GET api/cmts
// @desc Get cmts
// @access Private
router.get("/datacmts", async(req, res) => {
    try {
        const cmts = await Cmt.find(req).populate("post").populate("user");
        res.json({ success: true, cmts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;