const mongoose = require("mongoose");

const splitwiseSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: true
        },

        amount: {
            type: Number,
            required: true
        },

        payer: {
            type: String,
            required: true
        },

        participants: [
            {
                type: String,
                required: true
            }
        ],

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

module.exports = mongoose.model("Splitwise", splitwiseSchema);