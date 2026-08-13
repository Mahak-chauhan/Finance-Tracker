const Expense = require("../models/Expense");
const Income = require("../models/Income");
const Budget = require("../models/Budget");
const Category = require("../models/Category");
const Splitwise = require("../models/Splitwise");
const SplitwiseFriend = require("../models/SplitwiseFriend");

const resetUserData = async (req, res) => {
    try {
        const userId = req.user.id;

        await Promise.all([
            Expense.deleteMany({ user: userId }),
            Income.deleteMany({ user: userId }),
            Budget.deleteMany({ user: userId }),
            Category.deleteMany({ user: userId }),
            Splitwise.deleteMany({ user: userId }),
            SplitwiseFriend.deleteMany({ user: userId })
        ]);

        res.status(200).json({
            message: "All financial data has been reset successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    resetUserData
};