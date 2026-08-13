const express = require("express");

const router = express.Router();

const {
    resetUserData
} = require("../controllers/settingsController");

const authMiddleware = require("../middleware/authMiddleware");

router.delete("/reset", authMiddleware, resetUserData);

module.exports = router;