const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../middleware/error");
const { decodeToken } = require("../utils/token");

const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      console.error("Authorization header missing");
      throw new UnauthenticatedError("Authentication failed.");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      console.error("Token missing from authorization header");
      throw new UnauthenticatedError("Authentication token missing.");
    }

    console.log("Token extracted:", token);

    const userId = await decodeToken(token);
    console.log("Decoded userId:", userId);

    req.user = { userId };
    next();
  } catch (error) {
    console.error("Error decoding token:", error.message);
    next(new UnauthenticatedError("Authentication failed."));
  }
};

module.exports = verifyAuth;
