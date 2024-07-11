const express = require("express");
const {
  getAllOrganisations,
  getOrganisation,
  createOrganisation,
  addUserToOrganisation,
} = require("../controller/organisationController");
const verifyAuth = require("../middleware/auth");

const router = express.Router();

router.get("/organisations", verifyAuth, getAllOrganisations);
router.get("/organisations/:orgId", verifyAuth, getOrganisation);
router.post("/organisations", verifyAuth, createOrganisation);
router.put("/organisations/:orgId/addUser", verifyAuth, addUserToOrganisation);

module.exports = router;
