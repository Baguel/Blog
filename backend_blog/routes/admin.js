const router = require('express').Router();
const admin = require('../model/admin.js');
const user = require('../model/user.js');
const post = require('../model/post.js');
const auth = require('../middleware/adminauth.js');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('bson');
const mongoose = require('mongoose');

//Pour enregistrer un admin
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

//Connecter un admin
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

//Voir tout les admins
router.get('/admin', auth, async(req, res) => {
    try {
        const data = await admin.find({});
        res.status(200).send(data);
    } catch(error) {
        res.status(400).send("il y a rien");
    }
})

//voir tout les utilisateurs
router.get('/admin/users', auth, async(req, res) => {
    try {
        const data = await user.find({});
        res.status(200).send(data);
    } catch(error) {
        res.status(400).send("il y a aucun utilisateur");
    }
})

//Mettre a jour les infos du compte connecter plus précisement le mot de passe
router.put('/:id', auth, async (req, res) => {
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

//Pour suprimer un utilisateur lambda
router.delete('/:id', auth, async (req, res) => {
    const id = req.params.id;
    if (!id) {
        res.status(401).send("id est requis");
    } else {
        const userId = id.toString();
        const userfind = await user.findById({_id : new ObjectId(userId)});
        if (!userfind) {
            res.status(200).send("cet utilisateur n'existe pas");
        } else {
                await user.findByIdAndDelete({_id : new ObjectId(userId)});
                try {
                    res.status(200).send("utilisateur supprimé avec sucess");
                } catch(err) {
                    res.status(401).send("probleme de suppression");
            }
        } 
    }
})

//pour bloquer un utilisateur
router.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(401).send("id est requis");
        } else {
            const update = await user.findByIdAndUpdate(id, {locked: "true"}).then(data => {
                res.status(200).send('utilisateur bloqué avec success');
            })
            .catch(error => {
                console.log(error);
            });
        }
    } catch(error) {
        console.log(error);
    }
})

//Pour afficher tout les posts
router.get('/admin/post', auth, async(req, res) => {
    try {
        const data = await post.find({});
        res.status(200).send(data);
    } catch(error) {
        res.status(400).send("il y a aucun post");
    }
})

// Route pour supprimer un post
router.delete('/post/:id', async (req, res) => {
    const id = req.params.id;
    if (!id) {
      res.status(401).send("id est requis");
    } else {
      const postId = id.toString();
      const postfind = await post.findById({_id : new ObjectId(postId)});
      if (!postfind) {
        res.status(404).send("cet post n'existe pas");
      } else {
        try {
          await post.deleteOne({_id: new ObjectId(postId)});
          res.status(200).send("post supprimé avec succès");
        } catch(err) {
          console.log(err);
          res.status(401).send("problème de suppression du post");
        }
      } 
    }
  });

//pour mettre a jour le status d'un post
router.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            res.status(401).send("id est requis");
        } else {
            const update = await post.findByIdAndUpdate(id, {status: "terminé"}).then(data => {
                res.status(200).send('status du post changé avec success');
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