require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const authRoute = require("./src/resource/routers/auth");
const cors = require("cors");
const connectDb = require("./src/resource/config/db.config");
const updateUser = require("./src/resource/routers/update");
const music = require("./src/resource/routers/music");
const posts = require("./src/resource/routers/post");
const favorites = require("./src/resource/routers/favorite");
const comments = require("./src/resource/routers/cmt");

// HTTP loggers
app.use(morgan("combined"));

connectDb();

// for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// for parsing multipart/form-data
app.use(express.static("public"));

app.use(express.json());
app.use(cors());

// load img and music file with browser
app.use("/uploadFile", express.static("uploadFile"));

// api auth
app.use("/api/auth", authRoute);
// api update user
app.use("/api/update/user", updateUser);
// api music
app.use("/api/music", music);
// api posts
app.use("/api/posts", posts);
// api favorites
app.use("/api/favorites", favorites);
// api cmt
app.use("/api/comments", comments);

// address
const PORT = 5000;

app.listen(PORT, () => console.log(`Sever started on port ${PORT}`));