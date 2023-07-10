const mongoose = require('mongoose');

const rubriqueModel = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true,
    }
})

module.exports = mongoose.model("rubrique", rubriqueModel);