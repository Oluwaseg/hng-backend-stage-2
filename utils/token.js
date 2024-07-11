const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const payload = { userId };
  const options = { expiresIn: "1h" };
  const secret = process.env.JWT_SECRET;

  try {
    const token = jwt.sign(payload, secret, options);
    console.log("Generated token:", token);
    return token;
  } catch (err) {
    console.error("Error generating token:", err.message);
    throw new Error("Token generation failed");
  }
};

const decodeToken = async (token) => {
  try {
    console.log("Decoding token:", token);
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("Error decoding token:", err.message);
    throw new Error("Token verification failed");
  }
};

module.exports = { generateToken, decodeToken };
