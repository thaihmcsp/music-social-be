const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Comments collection in mongodb atlas
const CommentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "posts",
    },
    cmtContent: {
        type: String,
        required: true,
    },
    cmtCreationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("comments", CommentSchema);