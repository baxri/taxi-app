const express = require("express");
const User = require("../models/User");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("You fetched user");
});

router.post("/", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.json(user);
    } catch (err) {
        res.json(err);
    }
});

module.exports = router;