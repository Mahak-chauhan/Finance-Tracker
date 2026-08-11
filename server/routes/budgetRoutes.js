const express = require("express");

const router = express.Router();

const {
    addBudget,
    getBudgets,
    deleteBudget
} = require("../controllers/budgetController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addBudget);

router.get("/", authMiddleware, getBudgets);

router.delete("/:id", authMiddleware, deleteBudget);

module.exports = router;