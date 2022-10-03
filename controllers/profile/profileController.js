const mongoose = require('mongoose');
const cloudinary = require("../../services/img-upload/cloundinary");
const fs = require("fs");
const distanceBetween = require("../../helpers/distanceBetween");
const { Profile } = require("../../models/profile");
const { throwError } = require("../../const/status");
const { validationResult } = require('express-validator');

const createProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return throwError(res, errors.array());

    const accountId = req.user.data;
    const doesExist = await Profile.findOne({ accountId });
    if (doesExist)
      return throwError(res, { message: "Profile already existed" });

    req.body.accountId = accountId;
    return new Profile(req.body)
      .save()
      .then((value) => res.status(200).json(value))
      .catch((err) => throwError(res, err));

  } catch (error) {
    return throwError(res, error);
  }
};

const getAllProfiles = async (req, res) => {
  try {

    const { latitude, longitude, role, sortBy } = req.query;

    if (sortBy == undefined)
      return throwError(res, { message: "sortBy is requried" });

    if (role == undefined)
      return throwError(res, { message: "role is requried" });

    if (latitude == undefined || longitude == undefined)
      return throwError(res, { "message": "Invalid Coordinates" });

    return Profile.find({ 'account.role': role })
      .select({ _id: 0, __v: 0 })
      .then((value) => {
        const result = value
          .map((element, _) => {
            const fromLat = element.address.coordinates.latitude;
            const fromLon = element.address.coordinates.longitude;

            return {
              ...element._doc,
              distanceBetween: distanceBetween(fromLat, fromLon, latitude, longitude, "K").toFixed(1) + "km"
            };
          })
          .sort((a, b) => {
            const value1 = parseFloat(a.distanceBetween.replace(/[^\d.-]/g, ''));
            const value2 = parseFloat(b.distanceBetween.replace(/[^\d.-]/g, ''));
            if (sortBy == "desc") return value2 - value1;
            return value1 - value2;
          });

        return res.status(200).json(result);
      })
      .catch((err) => throwError(res, err));

  } catch (error) {
    return throwError(res, error);
  }
};

const getProfile = async (req, res) => {
  try {

    const { accountId, role, longitude, latitude } = req.query;

    if (!mongoose.Types.ObjectId.isValid(accountId))
      return throwError(res, { message: "accountId pattern is invalid" });

    const profile = await Profile.findOne({ accountId }).select({ _id: 0, __v: 0 });
    if (profile == null)
      return throwError(res, { message: "Profile not found" });

    if (role == "artist") {

      if (latitude == undefined || longitude == undefined)
        return throwError(res, { "message": "Invalid Coordinates" });

      const fromLat = profile.address.coordinates.latitude;
      const fromLon = profile.address.coordinates.longitude;
      return res.status(200).json({
        ...profile._doc,
        distanceBetween: distanceBetween(fromLat, fromLon, latitude, longitude, "K").toFixed(1) + "km"
      });
    }

    return res.status(200).json(profile);
  } catch (error) {
    return throwError(res, error);
  }
};

const getOwnProfile = async (req, res) => {
  try {
    const accountId = req.user.data;
    const profile = await Profile.findOne({ accountId }).select({ _id: 0, __v: 0 });
    if (profile == null)
      return throwError(res, { message: "Profile not found" });

    return res.status(200).json(profile);
  } catch (error) {
    return throwError(res, error);
  }
};

const updateProfile = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return throwError(res, errors.array());

    const { name, contact, birthdate } = req.body;
    const accountId = req.user.data;
    const query = { accountId };
    const update = {
      $set: {
        "name.first": name.first,
        "name.last": name.last,
        birthdate,
        "contact.number": contact.number,
        "contact.email": contact.email,
        "date.updatedAt": Date.now(),
      },
    };
    const options = { new: true };

    Profile.findOneAndUpdate(query, update, options)
      .then((value) => {
        if (!value) return throwError(res, { message: "Update failed" });
        return res.status(200).json(value);
      })
      .catch((err) => throwError(res, err));

  } catch (error) {
    return throwError(res, error);
  }
};

const updateProfileAddress = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return throwError(res, errors.array());

    const { address } = req.body;
    const accountId = req.user.data;
    const query = { accountId };
    const update = {
      $set: {
        "address.name": address.name,
        "address.coordinates.latitude": address.coordinates.latitude,
        "address.coordinates.longitude": address.coordinates.longitude,
        "date.updatedAt": Date.now(),
      },
    };
    const options = { new: true };

    Profile.findOneAndUpdate(query, update, options)
      .then((value) => {
        if (!value) return throwError(res, { message: "Update failed" });
        return res.status(200).json(value);
      })
      .catch((err) => throwError(res, err));
  } catch (error) {
    return throwError(res, error);
  }
};

const updateProfileAvatar = async (req, res) => {
  try {

    const accountId = req.user.data;
    const doesExist = await Profile.findOne({ accountId });
    if (!doesExist)
      return throwError(res, { message: "Profile not found" });

    const urls = [];
    const files = req.files;
    const cloudOptions = {
      folder: process.env.CLOUDINARY_FOLDER + "/user/avatar",
      unique_filename: true,
    };

    for (const file of files) {
      const { path } = file;
      const upload = await cloudinary.uploader.upload(path, cloudOptions);
      urls.push(upload.url);
      fs.unlinkSync(path);
      break;
    }

    const update = {
      $set: {
        avatar: urls[0],
        "date.updatedAt": Date.now(),
      },
    };
    const options = { new: true };
    const query = { accountId };

    Profile.findOneAndUpdate(query, update, options)
      .then((value) => {
        if (!value) return throwError(res, { message: "Update failed" });
        return res.status(200).json(value);
      })
      .catch((err) => throwError(res, err));
  } catch (error) {
    return throwError(res, error);
  }
};

const updateProfileGallery = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return throwError(res, errors.array());

    const { description } = req.body;
    const accountId = req.user.data;

    const filePath = req.file.path;
    const cloudOptions = {
      folder: process.env.CLOUDINARY_FOLDER + "/user/gallery",
      unique_filename: true,
    };

    const doesExist = await Profile.findOne({ accountId });
    if (!doesExist)
      return throwError(res, { message: "Profile not found" });

    const uploadedImg = await cloudinary.uploader.upload(filePath, cloudOptions);
    const content = {
      _id: mongoose.Types.ObjectId(),
      url: uploadedImg.url,
      description,
      date: {
        createdAt: new Date().toISOString(),
        updatedAt: null,
      }
    }
    const update = { $push: { gallery: content } };
    const options = { new: true, upsert: true };
    const query = { accountId };

    Profile.findOneAndUpdate(query, update, options,)
      .then((value) => {
        if (!value) return throwError(res, { message: "Update failed" });
        return res.status(200).json(value);
      })
      .catch((err) => throwError(res, err));
  } catch (error) {
    return throwError(res, error);
  }
};

const deleteInProfileGallery = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return throwError(res, errors.array());

    const { _id } = req.body;
    const accountId = req.user.data;

    const update = {
      $pull: {
        gallery: {
          _id: mongoose.Types.ObjectId(_id)
        }
      }
    };
    const options = { new: true };
    const query = { accountId };

    const doesExist = await Profile.findOne({ accountId });
    if (!doesExist)
      return throwError(res, { message: "Profile not found" });

    return Profile.findOneAndUpdate(query, update, options)
      .then((value) => res.status(200).json(value))
      .catch((err) => throwError(res, err));
  } catch (error) {
    return throwError(res, error);
  }
}

const deleteProfile = async (req, res) => {
  try {
    const accountId = req.user.data;
    return Profile.findOneAndRemove({ accountId })
      .then((value) => {
        if (!value) return throwError(res, { message: "failed" });
        return res.status(200).json({ message: "success" });
      })
      .catch(() => throwError(res, { message: "failed" }));

  } catch (error) {
    return throwError(res, error);
  }
};

const updateProfileVisibility = async (req, res) => {
  try {

    const errors = validationResult(req);
    if (!errors.isEmpty()) return throwError(res, errors.array())

    const { visibility } = req.body;
    const accountId = req.user.data;
    const update = { 'account.visibility': visibility };
    const query = { accountId };
    const options = { new: true };

    Profile.findOneAndUpdate(query, update, options)
      .then((value) => {
        if (!value) return throwError(res, { message: "Update failed" });
        return res.status(200).json(value);
      })
      .catch((err) => throwError(res, err));

  } catch (error) {
    return throwError(res, error);
  }
};


module.exports = {
  createProfile,
  getAllProfiles,
  getProfile,
  updateProfile,
  updateProfileVisibility,
  updateProfileAddress,
  updateProfileAvatar,
  updateProfileGallery,
  deleteProfile,
  deleteInProfileGallery,
  getOwnProfile,
};
