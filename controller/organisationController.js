const { BadRequestError } = require("../middleware/error");
const { v4: uuidv4 } = require("uuid");
const { getPool } = require("../config/database");

const pool = getPool();

const getAllOrganisations = async (req, res) => {
  const { userId } = req.user;
  const client = await pool.connect();

  try {
    console.log("Checking user existence for userId", userId);
    const userQuery = {
      text: `SELECT * FROM users WHERE user_id = $1;`,
      values: [userId],
    };

    const { rows: userData } = await client.query(userQuery);

    if (userData.length === 0) {
      throw new BadRequestError(`User does not exist.`);
    }

    const orgQuery = {
      text: `SELECT org_id, name, description FROM organisations WHERE user_id = $1`,
      values: [userId],
    };

    const { rows } = await client.query(orgQuery);

    const dataObj = {
      status: "success",
      message: "Request successful",
      data: {
        organisations: rows,
      },
    };

    res.status(200).json(dataObj);
  } catch (error) {
    console.error("Error fetching organisations:", error);
    throw error;
  } finally {
    await client.end();
  }
};

const getOrganisation = async (req, res) => {
  const { orgId } = req.params;
  if (!orgId) throw new BadRequestError(`Provide a valid id.`);
  const client = await pool.connect();

  try {
    const orgQuery = {
      text: `SELECT org_id, name, description FROM organisations WHERE org_id = $1;`,
      values: [orgId],
    };

    const { rows } = await client.query(orgQuery);

    const dataObj = {
      status: "success",
      message: "Request successful",
      data: rows[0],
    };

    res.status(200).json(dataObj);
  } catch (error) {
    console.error("Error fetching organisation:", error);
    throw error;
  } finally {
    await client.end();
  }
};

const createOrganisation = async (req, res) => {
  const { name, description } = req.body;
  const { userId } = req.user;

  if (!name) throw new BadRequestError(`Provide name field.`);
  const client = await pool.connect();

  try {
    const orgValues = [uuidv4(), name, description, userId, `{${userId}}`];
    const orgQuery = {
      text: `INSERT INTO organisations (org_id, name, description, user_id, members) VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      values: orgValues,
    };

    const { rows } = await client.query(orgQuery);
    const { org_id, name: orgName, description: orgDescription } = rows[0];

    const dataObj = {
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: org_id,
        name: orgName,
        description: orgDescription,
      },
    };

    res.status(200).json(dataObj);
  } catch (error) {
    console.error("Error creating organisation:", error);
    throw error;
  } finally {
    await client.end();
  }
};

const addUserToOrganisation = async (req, res) => {
  const { orgId } = req.params;
  const { userId } = req.user;
  if (!orgId) throw new BadRequestError(`Provide valid orgId parameter.`);
  const client = await pool.connect();

  try {
    const userQuery = {
      text: `SELECT * FROM users WHERE user_id = $1`,
      values: [userId],
    };
    const { rows: userData } = await client.query(userQuery);
    if (userData.length === 0)
      throw new BadRequestError(`User does not exist.`);

    const orgQuery = {
      text: `SELECT * FROM organisations WHERE org_id = $1;`,
      values: [orgId],
    };

    const { rows: orgData } = await client.query(orgQuery);
    const { members } = orgData[0];
    let updatedMembers = [...members, userId].join(",");

    const updateQuery = {
      text: `UPDATE organisations SET members = $1 WHERE org_id = $2 RETURNING *;`,
      values: [`{${updatedMembers}}`, orgId],
    };

    await client.query(updateQuery);

    const dataObj = {
      status: "success",
      message: "User added to organisation successfully",
    };

    res.status(200).json(dataObj);
  } catch (error) {
    console.error("Error adding user to organisation:", error);
    throw error;
  } finally {
    await client.end();
  }
};

module.exports = {
  getAllOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation,
};
