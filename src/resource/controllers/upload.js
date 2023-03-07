// // handles upload & store images with middleware function.
// const upload = require("../middleware/upload");

// const uploadFile = async(req, res) => {
//     try {
//         await upload(req, res);

//         console.log(req.file);
//         if (req.file == undefined) {
//             return res
//                 .status(400)
//                 .json({ success: false, message: "You must select a file." });
//         }

//         return res.json({
//             success: true,
//             message: "The file has been uploaded",
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Error when trying upload image",
//         });
//     }
// };

// module.exports = {
//     uploadFile,
// };