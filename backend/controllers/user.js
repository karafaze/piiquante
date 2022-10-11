const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.all = (req, res) => {
    User.find()
        .then(users => {
            res.status(200).json({
                users: users
            })
        })
        .catch(err => {
            res.status(500).json({
                err: err
            })
        })

}

exports.signup = (req, res) => {
    User.findOne({ email : req.body.email })
        .then((user) => {
            if (user) {
                return res.status(403).json({
                    errorMessage: "Sorry this email is already being used.",
                });
            } else {
                bcrypt
                    .hash(req.body.password, 10)
                    .then((hash) => {
                        const user = new User({
                            email: req.body.email,
                            password: hash,
                        });
                        user.save()
                            .then(() =>
                                res.status(201).json({
                                    message:
                                        "You account has been created. Welcome on board.",
                    })
                            )
                            .catch(err => 
                                res.status(400).json({ err})
                            )
                    })
                    .catch((err) => {
                        res.status(500).json({
                            errorMessage: `The following error occured: ${err}`,
                        });
                    });
            }
        })
        .catch((err) => {
            res.status(500).json({
                errorMessage: `The following error occured: ${err}`,
            })
        })
};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({
                    errorMessage:
                        "Sorry, this user is not registered to our website.",
                });
            }
            bcrypt
                .compare(req.body.password, userData.password)
                .then((validData) => {
                    if (!validData) {
                        return res.status(400).json({
                            errorMessage: "Wrong password.",
                        });
                    }
                    const accessToken = jwt.sign(
                        { userId: userData._id },
                        process.env.ACCESS_TOKEN,
                        { expiresIn: "24h" }
                    );
                    res.status(200).json({
                        token: accessToken,
                        email: userData.email,
                        password: userData.password,
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        errorMessage: `The following error occured: ${err}`,
                    });
                });
        })
        .catch((err) => {
            res.status(500).json({
                errorMessage: `The following error occured: ${err}`,
            });
        });
};
