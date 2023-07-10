    const mongoose = require('mongoose');

const userModel = new mongoose.Schema({
    surname: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    locked: {
        type: String,
        default: false,
    },
})

module.exports=mongoose.model("users", userModel);