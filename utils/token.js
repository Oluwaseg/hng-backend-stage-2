const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const payload = { userId };
  const options = { expiresIn: "1h" };
  const secret = process.env.JWT_SECRET;

  try {
    const token = jwt.sign(payload, secret, options);
    return token;
  } catch (err) {
    throw new Error("Token generation failed");
  }
};

const decodeToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded; // Directly access userId here
    return userId;
  } catch (err) {
    console.error("Error decoding token:", err.message);
    throw new Error("Token verification failed");
  }
};

module.exports = { generateToken, decodeToken };
