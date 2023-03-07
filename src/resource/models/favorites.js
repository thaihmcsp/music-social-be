const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Favorites collection in mongodb atlas
const FavoriteSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
    },
    music: {
        type: Schema.Types.ObjectId,
        ref: "musics",
    },
    favoriteCreationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("favorites", FavoriteSchema);