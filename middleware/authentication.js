require("dotenv").config();
const jwt = require("jsonwebtoken");
const { throwAuthError } = require("../const/status");

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token == undefined || token == null || token === "") return throwAuthError(res, { message: "Not Authenticated" });
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, value) => {
      if (err) throwAuthError(res, { message: "Auhtentication Token is invalid or expired" });
      req.user = value;
      next();
    });

  } catch (error) {
    return throwAuthError(res, { message: "Authentication Error" });
  }
};

module.exports = {
  isAuthenticated
};
