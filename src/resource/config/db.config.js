// connect mongoDB
// connect to mongodb
const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWD}@cluster0.dovdnyu.mongodb.net/test`, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );
        console.log("MongoDB Connected");
    } catch (e) {
        console.log(e.message);
    }
};

module.exports = connectDB;