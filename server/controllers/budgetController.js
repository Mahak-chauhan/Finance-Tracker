const Budget = require("../models/Budget");

const addBudget = async (req, res) => {
    try {
        const { category, amount } = req.body;

        if (!category || !amount || amount <= 0) {
            return res.status(400).json({
                message: "Please provide a valid category and amount"
            });
        }

        const existingBudget = await Budget.findOne({
            category,
            user: req.user.id
        });

        if (existingBudget) {
            existingBudget.amount = amount;
            await existingBudget.save();

            return res.json({
                message: "Budget Updated Successfully",
                budget: existingBudget
            });
        }

        const budget = await Budget.create({
            category,
            amount,
            user: req.user.id
        });

        res.status(201).json({
            message: "Budget Added Successfully",
            budget
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getBudgets = async (req, res) => {
    try {

        const budgets = await Budget.find({
            user: req.user.id
        }).sort({ category: 1 });

        res.json(budgets);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const deleteBudget = async (req, res) => {
    try {

        const budget = await Budget.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!budget) {
            return res.status(404).json({
                message: "Budget not found"
            });
        }

        res.json({
            message: "Budget Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    addBudget,
    getBudgets,
    deleteBudget
};