const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    cateName: {
        type: "string",
    },
});

module.exports = mongoose.model("categories", CategorySchema);