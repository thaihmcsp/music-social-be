const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const verifyToken = require("../middleware/verifyAuth");
const upload = require("../middleware/upload");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const uploadlogin = multer();

// @route GET api/auth
// @desc Check if user is logged in
// @access Public
router.get("/", verifyToken, async(req, res) => {

    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user)
            return res
                .status(400)
                .json({ success: false, message: "User not found" });
        res.json({ success: true, user });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error!!!!" });
    }
});

// @route POST api/auth/register
// Register user
// @access public
router.post("/register", upload.single("userAvatar"), async(req, res) => {
    const { userEmail, userPassword, userName, userAvatar, roleId } = req.body;

    // Simple validation
    if (!userEmail || !userPassword || !userName)
        return res
            .status(400)
            .json({ success: false, message: "Missing userEmail and/or password" });

    try {
        // Check for existing user
        const user = await User.findOne({ userEmail });

        if (user)
            return res
                .status(400)
                .json({ success: false, message: "Username already taken" });

        // Hash password with argon2
        const hashedPassword = await argon2.hash(userPassword);

        const avatar = req.file.path;

        // Save this user to the database if everything ok
        const newUser = new User({
            userEmail,
            userPassword: hashedPassword,
            userName,
            userAvatar: avatar.replace("uploadFile\\", ""),
            roleId,
        });
        await newUser.save();

        // Return token
        const accessToken = jwt.sign({ userId: newUser._id },
            process.env.ACCESS_TOKEN_SECRET
        );

        const file = req.file;

        res.json({
            success: true,
            message: "User created successfully",
            accessToken,
            file,
        });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error !!!!" });
    }
});
// @route POST api/auth/login
// Login user
// @access public

router.post("/login", uploadlogin.array(), async(req, res) => {
    const { userEmail, userPassword } = req.body;

    // Simple validation
    if (!userEmail || !userPassword)
        return res
            .status(400)
            .json({ success: false, message: "Missing userEmail and/or password" });

    try {
        // All good
        // check role

        // check if this user is registered in the database
        const user = await User.findOne({ userEmail: userEmail });
        if (user.roleId == "6381d54aea35ad76a26aa9e7") {
            if (!user)
                return res
                    .status(400)
                    .json({ success: false, message: "Incorrect username or password" });

            // Check user's password
            const passwordValid = await argon2.verify(
                user.userPassword,
                userPassword
            );
            if (!passwordValid)
                return res
                    .status(400)
                    .json({ success: false, message: "Incorrect username or password" });

            // Return token
            const accessToken = jwt.sign({ userId: user._id },
                process.env.ACCESS_TOKEN_SECRET
            );

            res.json({
                success: true,
                message: "Admin logged in successfully",
                accessToken,
            });
        } 
        else if (user.roleId !== "615aba567b19409446d0128e"){
            if (!user)
                return res
                    .status(400)
                    .json({ success: false, message: "Incorrect username or password" });

            // Check user's password
            const passwordValid = await argon2.verify(user.userPassword, userPassword);
            if (!passwordValid)
                return res
                    .status(400)
                    .json({ success: false, message: "Incorrect  username or password" });

            // Return token
            const accessToken = jwt.sign({ userId: user._id },
                process.env.ACCESS_TOKEN_SECRET
            );

            res.json({
                success: true,
                message: "User logged in successfully",
                accessToken,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "You do not have an account, please register an account to log in!",
        });
    }
});

module.exports = router;