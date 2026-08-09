const express = require("express");

const router = express.Router();

const {
    addBill,
    getBills,
    deleteBill
} = require("../controllers/splitwiseController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addBill);

router.get("/", authMiddleware, getBills);

router.delete("/:id", authMiddleware, deleteBill);

module.exports = router;