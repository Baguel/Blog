const mongoose = require('mongoose');

const adminModel = new mongoose.Schema({
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
})

module.exports=mongoose.model("admins", adminModel);