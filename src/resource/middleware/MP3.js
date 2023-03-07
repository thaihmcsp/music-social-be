const multer = require("multer");
const fs = require("fs-extra");
const mm = require("music-metadata");

const storage = multer.diskStorage({
    destination: function(req, fileMP3, cb) {
        // cb(null, "./uploadFile/Mp3/");
        if (fileMP3.mimetype === "audio/mpeg") {
            cb(null, "./uploadFile/Mp3/");
        }
        if (fileMP3.mimetype === "image/jpeg" || fileMP3.mimetype === "image/png") {
            cb(null, "./uploadFile/ImgMp3/");
        }
    },
    filename: function(req, fileMP3, cb) {
        cb(
            null,
            new Date().toISOString().replace(/:/g, "-") + fileMP3.originalname
        );
    },
});

const fileFilter = (req, fileMP3, cb) => {
    // reject a file
    // if () {
    //     cb(null, true);
    // }
    if (
        fileMP3.mimetype === "image/jpeg" ||
        fileMP3.mimetype === "image/png" ||
        fileMP3.mimetype === "audio/mpeg"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const uploadMP3Test = multer({
    storage: storage,
    // limits: {
    //     fileSize: 1024 * 1024 * 5,
    // },
    fileFilter: fileFilter,
});

module.exports = uploadMP3Test;