const router = require('express').Router();
const user = require('../model/user.js');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');

router.post("/register", async (req, res) => {
    const { surname, firstname, username, email, password } = req.body;
    let hash = await bcrypt.hash(password, 10);
    try {
        await user.create({
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
        const userfind = await user.findOne({email});
        if(userfind) {
            if(await bcrypt.compare(password, userfind.password)) {
                const token = jwt.sign({user: userfind}, process.env.SECRET, {expiresIn: '24h'});
                res.status(200).json(token);
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

module.exports=router;