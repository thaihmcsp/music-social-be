const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// post collection in mongodb atlas
const PostSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  postContent: {
    type: String,
    required: true,
  },
  music: { type: Schema.Types.ObjectId, ref: "musics" },
  postCreationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("posts", PostSchema);
