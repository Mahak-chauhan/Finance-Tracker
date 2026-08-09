const SplitwiseFriend = require("../models/SplitwiseFriend");

const addFriend = async (req, res) => {
    try {

        const { name } = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Friend name is required"
            });
        }

        const existingFriend = await SplitwiseFriend.findOne({
            name,
            user: req.user.id
        });

        if (existingFriend) {
            return res.status(400).json({
                message: "Friend already exists"
            });
        }

        const friend = await SplitwiseFriend.create({
            name,
            user: req.user.id
        });

        res.status(201).json({
            message: "Friend Added Successfully",
            friend
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const getFriends = async (req, res) => {
    try {

        const friends = await SplitwiseFriend.find({
            user: req.user.id
        }).sort({ createdAt: 1 });

        res.json(friends);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const deleteFriend = async (req, res) => {
    try {

        const friend = await SplitwiseFriend.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!friend) {
            return res.status(404).json({
                message: "Friend not found"
            });
        }

        res.json({
            message: "Friend Removed Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

module.exports = {
    addFriend,
    getFriends,
    deleteFriend
};