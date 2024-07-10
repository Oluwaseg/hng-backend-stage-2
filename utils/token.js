const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = { id: user.id, email: user.email };
  const options = { expiresIn: "1h" };
  const secret = process.env.JWT_SECRET;

  try {
    const token = jwt.sign(payload, secret, options);
    return token;
  } catch (err) {
    console.error("Error generating token:", err.message);
    throw new Error("Token generation failed");
  }
};

const decodeToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    console.error("Error decoding token:", err.message);
    throw new Error("Token verification failed");
  }
};

module.exports = { generateToken, decodeToken };
