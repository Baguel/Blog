const router = require('express').Router();
const admin = require('../model/admin.js');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) => {
    const {surname, firstname, username, email, password} = req.body;
    let hash = await bcrypt.hash(password, 10);
    try {
        await admin.create({
            surname,
            firstname,
            username,
            email,
            password : hash,
        })
        res.status(200).send('Utilisateur crée avec succès.');
    } catch (error) {
        console.log(error);
        res.status(400).send("Un utilsateur possède deja cette addresse email ou cet Username.");
    }
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const userfind = await admin.findOne({email});
        if(userfind) {
            if(await bcrypt.compare(password, userfind.password)) {
                const token = jwt.sign({user: userfind}, process.env.SECRET, {expiresIn: '24h'});
                res.status(200).json("utilisateur connecté");
            } else {
                res.status(404).send("mot de passe invalide");
            }
        } else {
            res.status(404).send("Aucun utilisateur avec cet email");
        }
    } catch(err) {
        console.log(err);
    }
})

router.get('/admin', async(req, res) => {
    try {
        const data = admin.find({});
        res.status(200).send(data);
    } catch(error) {
        res.status(400).send("il y a rien");
    }
})

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(401).send("id est requis");
        } else {
            const password = req.body.password;
            let hash = await bcrypt.hash(password, 10);
            const update = await admin.findByIdAndUpdate(id, {password: hash}).then(data => {
                res.status(200).send('mot de passe changé avec success');
            })
            .catch(error => {
                console.log(error);
            });
        }
    } catch(error) {
        console.log(error);
    }
})

module.exports=router;