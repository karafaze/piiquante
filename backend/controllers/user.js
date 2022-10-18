const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// signup up logic
exports.signup = (req, res) => {
    // we first retrieve user from database to make use the email is not taken
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (user) {
                // if user is true, it means email is taken
                return res.status(403).json({
                    errorMessage: "Sorry this email is already being used.",
                });
            } else {
                // if not taken, we can encrypt the password with bcrypt and save user to database
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
                                    message: "You account has been created. Welcome on board.",
                                })
                            )
                            .catch((err) => res.status(400).json({ err }));
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
            });
        });
};

// login logic
exports.login = (req, res) => {
    // retrieve user from database from email
    User.findOne({ email: req.body.email })
        .then((userData) => {
            // if not data is retrieved, user doesn't exists yet
            if (!userData) {
                return res.status(404).json({
                    errorMessage: "Sorry, this user is not registered to our website.",
                });
            }
            // if he is, we check the password with bcrypt.compare
            bcrypt
                .compare(req.body.password, userData.password)
                .then((validData) => {
                    if (!validData) {
                        return res.status(400).json({
                            errorMessage: "Wrong password.",
                        });
                    }
                    // once password validation is complete
                    // we generate a jsonwebtoken for that specific user with its userId
                    const accessToken = jwt.sign(
                        { userId: userData._id },
                        process.env.ACCESS_TOKEN,
                        { expiresIn: "24h" }
                    );
                    res.status(200).json({
                        token: accessToken,
                        userId: userData.id,
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
