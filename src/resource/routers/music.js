const express = require("express");
const router = express.Router();
const Music = require("../models/musics");
const uploadMp3Test = require("../middleware/MP3");

// @route GET api/musics
// @desc Get musics
// @access Private
router.get("/", async(req, res) => {
    try {
        const musics = await Music.find(req);
        res.json({ success: true, musics });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

const middlewareMp3 = uploadMp3Test.fields([{
        name: "musicFile",
        maxCount: 10,
    },
    {
        name: "musicImg",
        maxCount: 10,
    },
]);

// @route POST api/musics
// @desc POST input new music
// @access Private
router.post("/upload", middlewareMp3, async(req, res) => {
    const { musicName, musicAuthor, musicImg, musicFile, musicCategory } =
    req.body;

    // Simple validation
    if (!musicName || !musicAuthor || !musicCategory)
        return res
            .status(400)
            .json({ success: false, message: "Missing information" });

    try {
        // get data file
        const imgMp3 = req.files.musicImg.map((element) => element.path);
        console.log(imgMp3);
        const fileMp3 = req.files.musicFile.map((element) => {
            return element.path;
        });

        // Save this user to the database if everything ok
        const newMusic = new Music({
            musicName,
            musicAuthor,
            musicImg: imgMp3.toString().replace("uploadFile\\ImgMp3\\", ""),
            musicFile: fileMp3.toString().replace("uploadFile\\Mp3\\", ""),
            musicCategory,
        });

        await newMusic.save();

        res.json({
            success: true,
            message: "Music created successfully",
        });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error !!!!" });
    }
});

// @route DELETE api/musics
// @desc Delete music
// @access Private
router.delete("/delete/:id", async(req, res) => {
    try {
        const musicDeleteCondition = {
            _id: req.params.id,
            music: req.musicId,
        };

        const deletedMusic = await Music.findOneAndDelete(musicDeleteCondition);

        // User not authorised or music not found
        if (!deletedMusic)
            return res.status(401).json({
                success: false,
                message: "music not found",
            });

        res.json({ success: true, post: deletedMusic });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// @route PUT api/music
// @desc update music information
// @access private
router.put("/update/:id", middlewareMp3, async(req, res) => {
    const { musicName, musicAuthor, musicCategory } = req.body;

    if (!musicName || !musicCategory || !musicAuthor) {
        return res
            .status(400)
            .json({ success: false, message: "Missing information" });
    }

    try {
        // get data file
        const imgMp3 = req.files.musicImg.map((element) => element.path);
        const fileMp3 = req.files.musicFile.map((element) => {
            return element.path;
        });

        // input new data music
        let updatedMusic = {
            musicName,
            musicAuthor,
            musicImg: imgMp3.toString().replace("uploadFile\\ImgMp3\\", ""),
            musicFile: fileMp3.toString().replace("uploadFile\\Mp3\\", ""),
            musicCategory,
        };
        // check if this music is in the database or not. If so, it must match id to be updated.
        const musicUpdateCondition = { _id: req.params.id, music: req.musicId };

        updatedMusic = await Music.findOneAndUpdate(
            musicUpdateCondition,
            updatedMusic, { new: true }
        );

        //  music not found
        if (!updatedMusic)
            return res.status(401).json({
                success: false,
                message: "Music not found",
            });

        res.json({
            success: true,
            message: "Excellent progress!",
            post: updatedMusic,
        });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Internal server error!!!!" });
    }
});
module.exports = router;