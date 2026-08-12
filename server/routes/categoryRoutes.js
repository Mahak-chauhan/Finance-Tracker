const express = require("express");

const router = express.Router();

const {
    addCategory,
    getCategories,
    deleteCategory
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addCategory);

router.get("/", authMiddleware, getCategories);

router.delete("/:id", authMiddleware, deleteCategory);

module.exports = router;