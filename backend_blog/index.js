const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('../backend_blog/routes/auth');
const userRoutes = require('../backend_blog/routes/user');
const adminRoutes = require('../backend_blog/routes/admin');
const postRoutes = require('../backend_blog/routes/post');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/post", postRoutes);

mongoose.connect(process.env.MONGO_PATH,
    {useNewUrlParser: true,
        useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie!'))
.catch((error) => console.log(error))

app.listen(process.env.PORT, () =>{
    console.log(`Server is running on port ${process.env.PORT}`);
})