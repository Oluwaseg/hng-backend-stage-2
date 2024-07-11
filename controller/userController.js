const { BadRequestError } = require("../middleware/error");
const { getPool } = require("../config/database");

const pool = getPool();

const getUser = async (req, res) => {
  const { userId } = req.params;

  let client;

  try {
    if (!userId) {
      throw new BadRequestError("Missing user ID.");
    }

    client = await pool.connect();

    const query = {
      text: "SELECT * FROM users WHERE user_id = $1",
      values: [userId],
    };

    const { rows } = await client.query(query);

    if (rows.length === 0) {
      throw new BadRequestError(`No user found with ID: ${userId}`);
    }

    const { user_id, first_name, last_name, email, phone } = rows[0];

    const responseData = {
      status: "success",
      message: "Request successful",
      data: {
        userId: user_id,
        firstName: first_name,
        lastName: last_name,
        email: email,
        phone: phone || null,
      },
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching user:", error);
    if (error instanceof BadRequestError) {
      res.status(400).json({ status: "error", message: error.message });
    } else {
      res
        .status(500)
        .json({ status: "error", message: "Internal server error" });
    }
  } finally {
    if (client) {
      client.release();
    }
  }
};

module.exports = { getUser };
