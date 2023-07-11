const router = require('express').Router();
const commentaire = require('../model/commentaire.js');
const express = require('express');
const auth = require('../middleware/authentification.js');

//Pour créer un commentaire ou réponse aux postes
router.post("/commentaire", auth, async (req, res) => {
    const {contenu} = req.body;
    try {
        await commentaire.create({
            Auteur: req.user.username,
            contenu,
            id : req.user._id,
        })
        res.status(200).send('Posts crée avec succès.');
    } catch (error) {
        console.log(error);
        res.status(400).send("impossible de créer le post");
    }
}) 