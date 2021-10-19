const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();


    exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
        .then(() => res.status(200).json({message : 'utilisateur cree' }))
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
};

    exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
    .then(user => {
        if(!user) {
            return res.status(401).json({error: 'utilisateur non trouve'})
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) {
                return res.status(401).json({error: 'mot de passe incorrect'})
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    { userID: user._id },
                    process.env.RANDOM_TOKEN_SECRET,
                    // "RANDOM_TOKEN_SECRET",
                    { expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({ error }))
    })
    .catch(error => res.status(500).json({error}))
};