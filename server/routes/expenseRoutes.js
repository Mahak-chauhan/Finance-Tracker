const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    addExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getDashboard
} = require("../controllers/expenseController");
router.post("/", protect, addExpense);

router.get("/", protect, getExpenses);

router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);
router.get("/dashboard", protect, getDashboard);
module.exports = router;