const { hash, compare } = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { generateToken } = require("../utils/token");
const {
  BadRequestError,
  UnauthenticatedError,
} = require("../middleware/error");
const { getPool } = require("../config/database");

const pool = getPool();

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  const client = await pool.connect();

  try {
    // Check if user already exists
    const userExistsQuery = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    const userExistsResult = await client.query(userExistsQuery);
    if (userExistsResult.rows.length > 0) {
      throw new BadRequestError("User already exists.");
    }

    // Hash password
    const salt = 12;
    const passwordHash = await hash(password, salt);

    // Insert user into users table
    const userId = uuidv4();
    let createUserQuery = "";
    const userValues = [userId, firstName, lastName, email, passwordHash];
    if (phone) {
      createUserQuery = `INSERT INTO users (user_id, first_name, last_name, email, password, phone) VALUES ($1, $2, $3, $4, $5, $6)`;
      userValues.push(phone);
    } else {
      createUserQuery = `INSERT INTO users (user_id, first_name, last_name, email, password) VALUES ($1, $2, $3, $4, $5)`;
    }

    await client.query(createUserQuery, userValues);

    // Insert user into organisations table
    const orgId = uuidv4();
    const createOrganisationQuery = `INSERT INTO organisations (org_id, name, user_id, members) VALUES ($1, $2, $3, $4)`;
    const orgValues = [
      orgId,
      `${firstName}'s Organisation`,
      userId,
      `{${userId}}`,
    ];
    await client.query(createOrganisationQuery, orgValues);

    // Retrieve user details
    const getUserQuery = {
      text: "SELECT * FROM users WHERE user_id = $1",
      values: [userId],
    };

    const { rows } = await client.query(getUserQuery);
    const {
      user_id,
      first_name,
      last_name,
      email: userEmail,
      phone: userContact,
    } = rows[0];

    // Create access token
    const accessToken = await generateToken({ payload: { userId: user_id } });

    // Prepare response
    const dataObj = {
      status: "success",
      message: "Registration successful",
      data: {
        accessToken,
        user: {
          userId: user_id,
          firstName: first_name,
          lastName: last_name,
          email: userEmail,
        },
      },
    };

    if (userContact) {
      dataObj.data.user.phone = userContact;
    }

    res.status(201).json(dataObj);
  } catch (error) {
    // console.error("Register error:", error);
    throw error;
  } finally {
    await client.end();
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!password || !email) {
    throw new UnauthenticatedError("Authentication failed");
  }

  const client = await pool();
  try {
    const findUserQuery = {
      text: "SELECT * FROM users WHERE email = $1",
      values: [email],
    };

    const { rows } = await client.query(findUserQuery);
    if (rows.length === 0) {
      throw new UnauthenticatedError("Incorrect email or password.");
    }

    const {
      password: hashedPassword,
      user_id,
      first_name,
      last_name,
      email: userEmail,
      phone,
    } = rows[0];
    const isPasswordValid = await compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthenticatedError("Authentication failed");
    }

    const accessToken = await generateToken({ payload: { userId: user_id } });

    const dataObj = {
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
        user: {
          userId: user_id,
          firstName: first_name,
          lastName: last_name,
          email: userEmail,
        },
      },
    };

    if (phone) {
      dataObj.data.user.phone = phone;
    }

    res.status(200).json(dataObj);
  } catch (error) {
    console.error("Login error:", error);

    throw error;
  } finally {
    await client.end();
  }
};

module.exports = {
  registerUser,
  loginUser,
};
