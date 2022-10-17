const express = require("express");
const router = express.Router();

const cloudinary = require("../services/img-upload/cloundinary");
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
});


router.post("/upload/video", async (req, res) => {
    try {
        const filePath = req.files[0].path;
        const cloudOptions = {
            folder: "Public/user/uploads/Movie Booking/Videos",
            public_id: `${Date.now()}`,
            resource_type: "auto",
            chunk_size: 6000000,
            eager: [
                { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }
            ],
            eager_async: true,
        };
        const video = await cloudinary.uploader.upload(filePath, cloudOptions);
        return res.status(200).json(video.url);
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;

