const express = require("express");

const router = express.Router();

const {
    addIncome,
    getIncome,
    updateIncome,
    deleteIncome
} = require("../controllers/incomeController");

const authMiddleware = require("../middleware/authMiddleware");

// Add Income
router.post("/", authMiddleware, addIncome);

// Get All Income
router.get("/", authMiddleware, getIncome);

// Update Income
router.put("/:id", authMiddleware, updateIncome);

// Delete Income
router.delete("/:id", authMiddleware, deleteIncome);

module.exports = router;