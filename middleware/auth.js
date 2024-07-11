const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../middleware/error");
const { decodeToken } = require("../utils/token");

const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw new UnauthenticatedError("Authentication failed.");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthenticatedError("Authentication token missing.");
    }

    const userId = await decodeToken(token);

    req.user = { userId };
    next();
  } catch (error) {
    next(new UnauthenticatedError("Authentication failed."));
  }
};

module.exports = verifyAuth;
