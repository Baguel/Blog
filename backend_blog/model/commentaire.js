const mongoose = require('mongoose');

const commentaireModel = new mongoose.Schema({
    Auteur: {
        type: String,
        require: true,
    },

    contenu: {
        type: String,
        require: true,
    },    
})

module.exports = mongoose.model("rubrique", rubriqueModel);