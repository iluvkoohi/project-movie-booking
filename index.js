require("dotenv").config();
const port = process.env.PORT || 5000;
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require('cors')
const app = express();
const cookieParser = require('cookie-parser')

const { fileFilter, storage } = require("./services/img-upload/fileFilter");

try {
  mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => console.log("SERVER IS CONNECTED"))
    .catch(() => console.log("SERVER CANNOT CONNECT"));

  app.use(cors());
  app.use(cookieParser())
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(multer({ storage, fileFilter }).array("images"));

  app.use("/api", require("./controllers/userController"));
  app.use("/api", require("./controllers/cinemaController"));


  app.listen(port, () => console.log(`SERVER IS RUNNING ON ${port}`));
} catch (error) {
  console.log(error);
}
