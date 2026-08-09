const express = require("express");

const router = express.Router();

const {
    addFriend,
    getFriends,
    deleteFriend
} = require("../controllers/splitwiseFriendController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, addFriend);

router.get("/", authMiddleware, getFriends);

router.delete("/:id", authMiddleware, deleteFriend);

module.exports = router;