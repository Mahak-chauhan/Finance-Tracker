const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
    {
        amount: {
            type: Number,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        date: {
            type: Date,
            default: Date.now
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Income", incomeSchema);