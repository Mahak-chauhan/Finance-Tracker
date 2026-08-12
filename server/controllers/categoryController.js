const Category = require("../models/Category");

const addCategory = async (req, res) => {
    try {
        const { name, type } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                message: "Category name and type are required"
            });
        }

        if (!["expense", "income"].includes(type)) {
            return res.status(400).json({
                message: "Invalid category type"
            });
        }

        const existingCategory = await Category.findOne({
            name,
            type,
            user: req.user.id
        });

        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        const category = await Category.create({
            name,
            type,
            user: req.user.id
        });

        res.status(201).json({
            message: "Category Added Successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getCategories = async (req, res) => {
    try {

        const categories = await Category.find({
            user: req.user.id
        }).sort({ type: 1, name: 1 });

        res.json(categories);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const deleteCategory = async (req, res) => {
    try {

        const category = await Category.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.json({
            message: "Category Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    addCategory,
    getCategories,
    deleteCategory
};