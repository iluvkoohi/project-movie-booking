const multer = require("multer");

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === 'video/mp4' ||
    file.mimetype === 'video/m4a'
  ) {
    callback(null, true);
  } else callback(null, false);
};

const storage = multer.diskStorage({});

module.exports = {
  fileFilter,
  storage,
};
