const express = require("express");
const controller = require('../controllers/users');

const router = express.Router();

router.post("/user", controller.user);
router.post("/rating/create", controller.create);

module.exports = router;