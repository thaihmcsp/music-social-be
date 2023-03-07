const express = require("express");
const router = express.Router();
const Favorite = require("../models/favorites");
const User = require("../models/users");
const Music = require("../models/musics");
const multer = require("multer");
const uploadFavorite = multer();

// @route POST api/favorites
// @desc POST favorites
// @access Private
router.post("/", uploadFavorite.array(), async(req, res) => {
    try {
        // get data user by id's user at collection users
        const userData = await User.findById(req.body.user);
        // get data music by id's music at collection musics
        const musicData = await Music.findById(req.body.music);

        const newFavorite = new Favorite({
            user: userData,
            music: musicData,
        });
        await newFavorite.save();

        res.json({
            success: true,
            message: "Favorite created successfully",
            newFavorite,
        });
    } catch (err) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error !!!!" });
    }
});

// @route GET api/favorites
// @desc Get favorites
// @access Private
router.get("/datafavorites", async(req, res) => {
    try {
        const favorites = await Favorite.find(req)
            .populate("music")
            .populate("user");
        res.json({ success: true, favorites });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// @route DELETE api/favorite
// @desc Delete favorite
// @access Private
router.delete("/delete/:id", async(req, res) => {
    try {
        const favoriteDeleteCondition = {
            _id: req.params.id,
            favorite: req.favoriteId,
        };
        const deletedFavorite = await Favorite.findOneAndDelete(
            favoriteDeleteCondition
        );

        // favorite not found
        if (!deletedFavorite)
            return res.status(401).json({
                success: false,
                message: "Favorite not found",
            });

        res.json({ success: true, post: deletedFavorite });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

module.exports = router;