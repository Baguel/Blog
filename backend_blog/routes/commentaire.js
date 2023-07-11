const router = require('express').Router();
const commentaire = require('../model/commentaire.js');
const express = require('express');
const auth = require('../middleware/authentification.js');

//Pour créer un commentaire ou une réponse aux postes
router.post("/:id", auth, async (req, res) => {
    const id = req.params.id;
    const {contenu} = req.body;
    try {
        await commentaire.create({
            Auteur: req.user.username,
            contenu,
            id : id,
        })
        res.status(200).send('commentaire crée avec succès.');
    } catch (error) {
        console.log(error);
        res.status(400).send("impossible de créer le commentaire");
    }
})

//Pour voir les commentaires(inutile pour le blog)
router.get('/commentaire', auth, async(req, res) => {
    try {
        const data = await commentaire.find({});
        res.status(200).send(data);
    } catch(error) {
        res.status(400).send("il y a rien");
    }
})

module.exports=router;