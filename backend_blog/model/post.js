const mongoose = require('mongoose');

const postModel = new mongoose.Schema({
    rubrique: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        requuire: true,
    },
    status: {
        type: String,
        default: 'En cours',
    },
    id: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    end: {
        type: Date,
    }
})

module.exports=mongoose.model("post", postModel);