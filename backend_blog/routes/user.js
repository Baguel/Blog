const router = require('express').Router();
const user = require('../model/user.js');
const post = require('../model/post.js');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/authentification.js');
const { ObjectId } = require('bson');
const mongoose = require('mongoose');

router.get('/user', auth, async(req, res) => {
    try {
        const data = await user.find({});
        res.status(200).send(data);
    } catch(error) {
        res.status(400).send("il y a rien");
    }
})

/*router.get('/post', auth, async(req, res) => {
    try {
        if (req.user)
    } catch(error) {

    }
})*/

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
})

router.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(401).send("id est requis");
        } else {
            const userId = id.toString();
            const userfind = await user.findById({_id : new ObjectId(userId)});
            if (userfind.locked === "false") { 
            const password = req.body.password;
            let hash = await bcrypt.hash(password, 10);
            const update = await user.findByIdAndUpdate({_id : new ObjectId(userId)}, {password: hash}).then(data => {
                res.status(200).send('mot de passe changé avec success');
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

router.delete('/:id', auth, async (req, res) => {
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
})

module.exports=router;