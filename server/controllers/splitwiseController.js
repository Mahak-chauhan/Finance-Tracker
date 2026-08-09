const Splitwise = require("../models/Splitwise");

const addBill = async (req, res) => {
    try {
        const {
            description,
            amount,
            payer,
            participants
        } = req.body;

        if (!description || !amount || !payer || !participants) {
            return res.status(400).json({
                message: "Please provide all bill details"
            });
        }

        const bill = await Splitwise.create({
            description,
            amount,
            payer,
            participants,
            user: req.user.id
        });

        res.status(201).json({
            message: "Bill Added Successfully",
            bill
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getBills = async (req, res) => {
    try {

        const bills = await Splitwise.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.json(bills);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const deleteBill = async (req, res) => {
    try {

        const bill = await Splitwise.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!bill) {
            return res.status(404).json({
                message: "Bill not found"
            });
        }

        res.json({
            message: "Bill Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    addBill,
    getBills,
    deleteBill
};