const router = require('express').Router();
const user = require('../model/user.js');
const post = require('../model/post.js');
const express = require('express');
const auth = require('../middleware/authentification.js');
const { ObjectId } = require('bson');
const mongoose = require('mongoose');


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

router.get('/post', auth, async(req, res) => {
    try {
        const data = await post.find({});
        res.status(200).send(data);
    } catch(error) {
        res.status(400).send("il y a rien");
    }
})

router.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(401).send("id est requis");
        } else {
            const postId = id.toString();
            const postfind = await post.findById({_id : new ObjectId(postId)});
            if (req.user.locked === "false") {
            const update = await post.findByIdAndUpdate({_id : new ObjectId(postId)}, {status: req.params.status}).then(data => {
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
})


/*router.get('/user', auth, async(req, res) => {
    try {
        const data = await user.find({});
        res.status(200).send(data);
    } catch(error) {
        res.status(400).send("il y a rien");
    }
})

router.get('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(401).send("id est requis");
        } else {
            const userId = id.toString();
            const userfind = await user.findOne({_id: new ObjectId(userId)});
            if (!userfind) {
                res.status(404).send("L'utilisateur n'a pas été trouvé.");
            } else {
                res.status(200).json(userfind);
            }
        }
    } catch (error) {
        console.log(error);
    }
})*/

/*router.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(401).send("id est requis");
    } else {
        const userId = id.toString();
        const userfind = await user.findById({_id : new ObjectId(userId)});
        if (userfind.id !== req.user._id) {
            res.status(200).send("cet compte ne vous appartient pas!!");
        } else {
            if (req.user.id === "true") {
                res.status(401).send("Utilisateur bloqué");
            } else {
                await user.findByIdAndDelete({_id : new ObjectId(userId)});
                    try {
                        res.status(200).send("utilisateur supprimé avec sucess");
                    } catch(err) {
                        res.status(401).send("probleme de suppression");
                    }
            }
        } 
    }
})*/

/*router.post('/:id', async (req, res) => {
    const id = req.params.id;
})*/

module.exports=router;