const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// user colection in mongoDb atlas
const UserSchema = new Schema({
    userEmail: {
        type: String,
        required: true,
        unique: true,
    },
    userPassword: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },

    userAvatar: {
        // data: Buffer,
        type: String,
        contentType: String,
    },

    roleId: {
        type: Schema.Types.ObjectId,
        ref: "role",
        default: "615aba747b19409446d0128f",
    },
    userCreationDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("users", UserSchema);