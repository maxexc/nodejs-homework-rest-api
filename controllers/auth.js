const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const { SECRET_KEY } = process.env;

const register = async (req, res) => { 
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    
    if (user) {
        throw HttpError(409, "Email already in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({
        email: newUser.email,
        name: newUser.name,
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email })
    if (!user) {
        throw HttpError(401, "Email or password invalid")
    }
    const passwordCompare = await bcrypt.compare(password, user.password)
    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid")
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
    });
};

const getCurrent = async (req, res) => {
    const { email, subscription } = req.user;

    res.json({
        email: email,
        subscription: subscription
    });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.json({ message: "Logout success" });
};

const subscriptionUpdate = async (req, res) => {
    const { subscription } = req.body
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { subscription: subscription });

    res.status(202).json(
        { subscription: subscription }
    );
};
  
module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    subscriptionUpdate:  ctrlWrapper(subscriptionUpdate),
}