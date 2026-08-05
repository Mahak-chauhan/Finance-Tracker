const Income = require("../models/Income");

// ===========================
// Add Income
// ===========================

const addIncome = async (req, res) => {

    try {

        const { amount, category, description, date } = req.body;

        const income = await Income.create({

            amount,
            category,
            description,
            date,
            user: req.user.id

        });

        res.status(201).json({

            message: "Income Added Successfully",
            income

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===========================
// Get All Income
// ===========================

const getIncome = async (req, res) => {

    try {

        const income = await Income.find({

            user: req.user.id

        }).sort({ date: -1 });

        res.json(income);

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===========================
// Update Income
// ===========================

const updateIncome = async (req, res) => {

    try {

        const income = await Income.findOneAndUpdate(

            {
                _id: req.params.id,
                user: req.user.id
            },

            req.body,

            {
                new: true
            }

        );

        if (!income) {

            return res.status(404).json({

                message: "Income Not Found"

            });

        }

        res.json({

            message: "Income Updated Successfully",

            income

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// ===========================
// Delete Income
// ===========================

const deleteIncome = async (req, res) => {

    try {

        const income = await Income.findOneAndDelete({

            _id: req.params.id,
            user: req.user.id

        });

        if (!income) {

            return res.status(404).json({

                message: "Income Not Found"

            });

        }

        res.json({

            message: "Income Deleted Successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    addIncome,
    getIncome,
    updateIncome,
    deleteIncome

};