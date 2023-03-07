const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RoleSchema = new Schema({
    roleType: String,
    required: true,
});

module.exports = mongoose.model("role", RoleSchema);