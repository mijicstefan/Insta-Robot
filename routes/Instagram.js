const express = require("express");
const { loginToInstagram } = require("../controllers/Instagram");
// const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.route("/loginAndCheckFollowing").post(loginToInstagram);
module.exports = router;
