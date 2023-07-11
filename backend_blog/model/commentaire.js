const mongoose = require('mongoose');

const commentaireModel = new mongoose.Schema({
    Auteur: {
        type: String,
    },
    contenu: {
        type: String,
    },
    id: {
        type: String,
    }   
})

module.exports = mongoose.model("rubrique", rubriqueModel);