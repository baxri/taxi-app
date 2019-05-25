const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getUser = (req, res) => {
    res.send("You fetched user");
};

exports.loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email});

        if (!user) {
            throw new Error("User not exists!");
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new Error("Invalid password!");
        }

        const token = jwt.sign({
            // firstname: user.firstname,
            // lastname: user.lastname,
            email: user.email,
        }, 'secretKey');

        res.json({
            token
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.createUser = async (req, res) => {
    try {

        const {firstname, lastname, email, password} = req.body;

        const userinDatabase = await User.findOne({email});

        if (userinDatabase) {
            return res.json(userinDatabase);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = new User({
            firstname, lastname, email, password: hashedPassword
        });
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};
