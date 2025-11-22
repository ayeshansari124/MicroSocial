const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

// Correct absolute path to /public/uploads
const uploadPath = path.join(__dirname, "..", "public", "uploads");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        crypto.randomBytes(12, (err, bytes) => {
            if (err) return cb(err);

            const filename = bytes.toString("hex") + path.extname(file.originalname);
            cb(null, filename);
        });
    }
});

const upload = multer({ storage });

module.exports = upload;
