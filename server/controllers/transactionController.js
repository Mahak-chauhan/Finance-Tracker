const Income = require("../models/Income");
const Expense = require("../models/Expense");

const getTransactions = async (req, res) => {
    try {
        const incomes = await Income.find({
            user: req.user.id
        });

        const expenses = await Expense.find({
            user: req.user.id
        });

        const incomeTransactions = incomes.map(income => ({
            _id: income._id,
            title: income.description,
            category: income.category,
            type: "income",
            date: income.date,
            amount: income.amount
        }));

        const expenseTransactions = expenses.map(expense => ({
            _id: expense._id,
            title: expense.description,
            category: expense.category,
            type: "expense",
            date: expense.date,
            amount: expense.amount
        }));

        const transactions = [
            ...incomeTransactions,
            ...expenseTransactions
        ];

        transactions.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );

        res.json(transactions);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getTransactions
};