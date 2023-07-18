const router = require('express').Router();
const commentaire = require('../model/commentaire.js');
const express = require('express');
const auth = require('../middleware/authentification.js');
const { ObjectId } = require('bson');
const mongoose = require('mongoose');

//Pour créer un commentaire ou une réponse aux posts
router.post("/:id", auth, async (req, res) => {
    const id = req.params.id;
    const {contenu} = req.body;
    try {
        const postId = id.toString();
        const postfind = await post.findById({_id : new ObjectId(postId)});
        if (postfind.status === "En cours") {
        await commentaire.create({
            Auteur: req.user.username,
            contenu,
            id : id,
        })
        res.status(200).send('commentaire crée avec succès.');
    } else {
        res.status(401).send('cet poste est deja fermé ou terminé');
    }
    } catch (error) {
        console.log(error);
        res.status(401).send("impossible de commenter");
    }
})

//Pour voir les commentaires(es ce que c'est nécéssaire pour la continuation des choses)
router.get('/commentaire', auth, async(req, res) => {
    try {
        const data = await commentaire.find({});
        res.status(200).send(data);
    } catch(error) {
        res.status(400).send("il y a rien");
    }
})


module.exports=router;