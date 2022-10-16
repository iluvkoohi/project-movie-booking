const express = require("express");
const router = express.Router();

const cloudinary = require("../../services/img-upload/cloundinary");
const fs = require("fs");

router.post("/upload", async (req, res) => {
    try {
        const urls = [];
        const files = req.files;
        const cloudOptions = {
            folder: "Public/user/uploads/Movie Booking",
            unique_filename: true,
        };

        if (files.length > 1) {
            for (const file of files) {
                const { path } = file;
                const upload = await cloudinary.uploader.upload(path, cloudOptions);
                urls.push(upload.url);
                fs.unlinkSync(path);
            }
            return res.status(200).send(urls);
        }
        for (const file of files) {
            const { path } = file;
            const upload = await cloudinary.uploader.upload(path, cloudOptions);
            urls.push(upload.url);
            fs.unlinkSync(path);
            break;
        }
        return res.status(200).json(urls[0]);
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;

