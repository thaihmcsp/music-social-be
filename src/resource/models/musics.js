const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MusicSchema = new Schema({
    musicName: {
        type: String,
        required: true,
    },
    musicAuthor: {
        type: String,
    },
    musicImg: {
        type: String,
        contentType: String,
    },
    musicFile: {
        type: String,
        contentType: String,
    },
    musicCategory: {
        type: Schema.Types.String,
        ref: "categories",
    },
    musicLike: {
        type: Number,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        default: "61600aa78b331c8efe5a3d84",
    },
    musicCreationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("musics", MusicSchema);