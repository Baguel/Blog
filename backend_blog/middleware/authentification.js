require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const header = req.headers.authorization;
    try {
        const token = header.split(' ')[1];
        jwt.verify(token, process.env.SECRET, (err, user) => {
            if (err) {
                console.log(err);
                res.status(500).send("impossible to connect");
            }
            req.user = user.user;
            next();
        });
        }catch(error) {
            res.status(401).send("impossible");
        }
}


module.exports=auth;