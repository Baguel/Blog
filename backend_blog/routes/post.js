const router = require('express').Router();
const user = require('../model/user.js');
const post = require('../model/post.js');
const express = require('express');
const auth = require('../middleware/authentification.js');
const { ObjectId } = require('bson');
const mongoose = require('mongoose');

//Créer un post
router.post("/post", auth, async (req, res) => {
    const {rubrique, title, description} = req.body;
    try {
        await post.create({
            rubrique,
            title,
            description,
            id : req.user._id,
        })
        res.status(200).send('Posts crée avec succès.');
    } catch (error) {
        console.log(error);
        res.status(400).send("impossible de créer le post");
    }
})

//Voir tout les posts
router.get('/post', auth, async(req, res) => {
    try {
        const data = await post.find({});
        res.status(200).send(data);
    } catch(error) {
        res.status(400).send("il y a rien");
    }
})

//Voir les posts propres a l'utilisateur connecter
router.get('/post/user', auth, async(req, res) => {
    try {
        if (req.user.locked === "false") {
            const data = await post.find({id: req.user._id});
            res.status(200).send(data);
        } else {
            res.status(404).send("impo");
        }
    } catch(error) {
        console.log("error");
    }
})

//Pour mettre a jour le status du poste
/*router.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(401).send("id est requis");
        } else {
            const postId = id.toString();
            const postfind = await post.findById({_id : new ObjectId(postId)});
            if (!postfind && req.user.locked === "false") {
                const status = req.body.status;
                console.log(status);
                const update = await post.findByIdAndUpdate({_id : new ObjectId(postId)}, {status: status}, {new: true}).then(data => {
                    res.status(200).send('status changé avec success');
            })
            .catch(error => {
                console.log(error);
            });
        } else {
            res.status(404).send("utilisateur bloqué");
            }
        }
    } catch(error) {
        console.log(error);
    }
})*/

//Pour supprimer un post mais je me demande si cela est vraiment utile
router.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(401).send("id est requis");
    } else {
        const postId = id.toString();
        const postfind = await post.findById({_id : new ObjectId(postId)});
        if (postfind.id !== req.user._id) {
            res.status(200).send("cet post ne vous appartient pas!!");
        } else {
            if (req.user.locked === "true") {
                res.status(401).send("Utilisateur bloqué");
            } else {
                await post.findByIdAndDelete({_id : new ObjectId(postId)});
                    try {
                        res.status(200).send("post supprimé avec sucess");
                    } catch(err) {
                        res.status(401).send("probleme de suppression");
                    }
            }
        } 
    }
})

module.exports=router;