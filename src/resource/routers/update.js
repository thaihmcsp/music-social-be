const express = require("express");
const verifyToken = require("../middleware/verifyAuth");
const router = express.Router();
const argon2 = require("argon2");
const User = require("../models/users");
const upload = require("../middleware/upload");
const path = require("path");

// @route GET api/users
// @desc Get users
// @access Private
router.get("/", verifyToken, async(req, res) => {
    try {
        const users = await User.find({ _id: req.userId }).populate("_id", [
            "userName",
        ]);
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// @route PUT api/auth
// @desc update user information
// @access private

router.put(
    "/:id",
    upload.single("userAvatar"),
    verifyToken,
    async(req, res) => {
        const { userName, userAvatar, userPassword } = req.body;

        try {
            const hashedPassword = await argon2.hash(userPassword);
            const avatar = req.file.path;
            let updatedUser = {
                userName,
                userAvatar: avatar.replace("uploadFile\\", ""),
                // : avatar.replace("uploadFile\\", ""),
                userPassword: hashedPassword,
            };
            // check if this user is in the database or not. If so, it must match the login id to be updated.
            const postUpdateCondition = { _id: req.userId };

            updatedUser = await User.findOneAndUpdate(
                postUpdateCondition,
                updatedUser, { new: true }
            );

            // User not authorised to update user not found
            if (!updatedUser)
                return res.status(401).json({
                    success: false,
                    message: "User not found or user not authorised",
                });

            res.json({
                success: true,
                message: "Excellent progress!",
                post: updatedUser,
            });
        } catch (error) {
            console.log(error);
            res
                .status(500)
                .json({ success: false, message: "Internal server error123!!!!" });
        }
    }
);

router.get("/alluser", async(req, res) => {
    try {
        const users = await User.find(req);
        res.json({ success: true, users });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;