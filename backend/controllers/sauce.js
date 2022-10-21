const Sauce = require("../models/sauce");
const fs = require("fs");
const path = require("path");

// retrieve all sauces from DB
exports.getSauces = (req, res) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((err) => {
            res.status(404).json({
                errorMessage: err,
            });
        });
};

// retrieve specific sauces with _id
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch(() => {
            res.status(404).json({
                errorMessage: "That sauce does not exists yet",
            });
        });
};

// add new sauce to database
exports.addSauce = (req, res) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    // create base url for imageUrl
    const url = `${req.protocol}://${req.get("host")}`;
    // create new sauce with req.body
    const sauce = new Sauce({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: `${url}/uploads/${req.file.filename}`,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        userId: req.auth.userId,
    });
    sauce
        .save()
        .then(() => {
            res.status(201).json({
                message: "Your sauce has been created !",
            });
        })
        .catch(() =>
            res.status(500).json({
                err: "Sorry an error occured during the creation of your sauce",
            })
        );
};

// update sauce from database
exports.updateSauce = (req, res) => {
    Sauce.findById({ _id: req.params.id})
        .then(sauceObject => {
            // create imageUrl path of the sauce in case it gets updated
            let saucePath = path.join(__dirname, "../public/uploads/");
            saucePath += sauceObject.imageUrl.split('uploads/')[1];
            // instantiate new sauce object with _id
            let sauce = new Sauce({ _id: req.params.id });
            if (req.file) {
                // a image file was updated
                // parse req.body.sauce to populate sauce object
                req.body.sauce = JSON.parse(req.body.sauce);
                const url = `${req.protocol}://${req.get("host")}`;
                sauce = {
                    name: req.body.sauce.name,
                    manufacturer: req.body.sauce.manufacturer,
                    description: req.body.sauce.description,
                    mainPepper: req.body.sauce.mainPepper,
                    imageUrl: `${url}/uploads/${req.file.filename}`,
                    heat: req.body.sauce.heat,
                    likes: req.body.sauce.likes,
                    dislikes: req.body.sauce.dislikes,
                    userLiked: req.body.sauce.userLikes,
                    userDisliked: req.body.sauce.userDislikes,
                    userId: req.body.sauce.userId
                };
                // since we changed the image, we can unlink old one with above path
                fs.unlink(saucePath, (err) => {
                    if(err){
                        console.log(err)
                    }
                });
            } else {
                // no new image was uploaded
                // populate with req.body
                sauce = {
                    ...req.body,
                };
            }
            // auth check to verify sauce creator and actual user are the same person
            if (sauce.userId !== req.auth.userId) {
                return res.status(403).json({
                    errorMessage: "Sorry, only the creator of that sauce can update it",
                });
            } else {
                // check complete, we update the sauce
                Sauce.updateOne({ _id: req.params.id }, sauce)
                    .then(() => {
                        res.status(200).json({
                            message: "Sauce updated successfully",
                        });
                    })
                    .catch((err) => {
                        res.status(500).json({
                            errorMessage: err,
                        });
                    });
            }
        })
        .catch(err => {
            res.status(500).json({
                err: err
            })
        })
};

// delete sauce from database
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id }).then((sauce) => {
        // we first check if sauce exists
        if (!sauce) {
            return res.status(404).json({
                errorMessage: "Sauce does not exists",
            });
        }
        // then we check if creator and current user are the same persone
        if (sauce.userId !== req.auth.userId) {
            return res.status(403).json({
                errorMessage: "Sorry you can only delete the sauces YOU added",
            });
        } else {
            // check complete
            // we first retrieve the path of the file before deleting the sauce
            const sauceName = sauce.imageUrl.split("uploads/")[1];
            let saucePath = path.join(
                __dirname,
                "../public/uploads/",
                sauceName
            );
            // we erase the file from uploads folder
            fs.unlink(saucePath, (err) => {
                if (err) {
                    return res.status(500).json({
                        errorMessage: "We could not delete the file",
                    });
                }
            });
            // and finally we delete the sauce from database
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => {
                    res.status(200).json({
                        message: "The sauce has been deleted from the database",
                    });
                })
                .catch(() => {
                    res.status(500).json({
                        errorMessage: "An error occured during deletion",
                    });
                });
        }
    });
};

// manage the like/dislike options for the sauce 
exports.handleLike = (req, res) => {
    // begin we instantiating constants to be used frequently
    const sauceId = req.params.id;
    const userId = req.body.userId;
    const userChoice = req.body.like;
    // first we retrieve the sauce from the database to get access to its properties
    Sauce.findOne({ _id: sauceId })
        .then((sauceObject) => {
            // make use of switch to check the 3 options the user has
            switch (userChoice) {
                // user likes the sauce
                case 1:
                    // first we check if user is not already in usersLiked list
                    // OR if user is in usersDisliked list
                    if (!checkRequestValidity(userId, sauceObject)) {
                        // if he's in one of the 2 list, we return error and message
                        return res.status(403).json({
                            errorMessage:
                                "Sorry, only one vote per sauce per user",
                        });
                    } else {
                        // if he's not, we update the likes/usersLiked properties of the sauce 
                        addUserLike(res, req, userChoice, userId)
                            .then(() => {
                                console.log('Done')
                            })
                            .catch(() => {
                                res.status(500).json({
                                    errorMessage: 'An error occured.'
                                })
                            })
                    }
                    break;
                // user dislikes the sauce
                case -1:
                    // first we check if user is not already in usersDisliked list
                    // OR if user is in usersLiked list
                    if (!checkRequestValidity(req.body.userId, sauceObject)) {
                        // if he's in one of the 2 list, we return error and message
                        return res.status(403).json({
                            errorMessage:
                                "Sorry, only one vote per sauce per user",
                        });
                    } else {
                        // if he's not, we update the dislikes/usersDisliked properties of the sauce 
                        addUserDislike(res, req, userChoice, userId)
                            .then(() => {
                                console.log('Done')
                            })
                            .catch(() => {
                                res.status(500).json({
                                    errorMessage: 'An error occured.'
                                })
                            })
                    }
                    break;
                // user cancels in like/dislike
                case 0:
                    // first we check if user is in usersLiked list
                    if (checkLikeList(req.body.userId, sauceObject)) {
                        // if he is we remove him from the list and decrement likes by 1
                        removeUserLike(res, req, userChoice, userId)
                            .then(() => {
                                console.log('Done')
                            })
                            .catch(() => {
                                res.status(500).json({
                                    errorMessage: 'An error occured.'
                                })
                            })
                    } else if (checkDislikeList(req.body.userId, sauceObject)) {
                        // now we check if he's in usersDisliked list
                        // if he is we remove him from the list and decrement dislikes by 1
                        removeUserDislike(res, req, userChoice, userId)
                            .then(() => {
                                console.log('Done')
                            })
                            .catch(() => {
                                res.status(500).json({
                                    errorMessage: 'An error occured.'
                                })
                            })
                    } else {
                        // if he's in either of the list (e.g if users uses POSTMAN)
                        // we respond with bad request
                        res.status(400).json({
                            errorMessage: "Sorry you need to like a sauce before",
                        });
                    }
                    break;
                // in case users sends another data
                default: 
                    return res.status(400).json({
                        errorMessage: 'Bad request.'
                    })
            }
        })
        .catch((err) => {
            res.status(500).json({
                errorMessage: err,
            });
        });
};

function checkRequestValidity(userId, sauce) {
    // returns false if user in liked/disliked list
    if (checkLikeList(userId, sauce) || checkDislikeList(userId, sauce)) {
        return false
    }
    return true;
}

function checkLikeList(userId, sauce) {
    // returns false if users not in Liked list
    return sauce.usersLiked.includes(userId);
}

function checkDislikeList(userId, sauce) {
    // returns false if user not in Disliked list
    return sauce.usersDisliked.includes(userId);
}

function addUserLike(resObject, reqObject, incValue, userId){
    return new Promise((resolve, reject) => {
        Sauce.updateOne(
            { _id: reqObject.params.id },
            {
                $inc: { likes: incValue},
                $push: { usersLiked: userId},
            })
            .then(
                () => {
                    resolve(resObject.status(200).json({
                        message: 'Your preferences have been saved'
                }))},
                () => {
                    reject (new Error('Something happened'))
                })
    })
}

function removeUserLike(resObject, reqObject, incValue, userId){
    return new Promise((resolve, reject) => {
        Sauce.updateOne(
            { _id: reqObject.params.id },
            {
                $inc: { likes: incValue - 1 },
                $pull: { usersLiked: userId },
            }
        )
        .then(
            () => {
                resolve(resObject.status(200).json({
                    message: 'Your preferences have been saved'
            }))},
            () => {
                reject (new Error('Something happened'))
            })
    })
}

function addUserDislike(resObject, reqObject, incValue, userId){
    return new Promise((resolve, reject) => {
        Sauce.updateOne(
            { _id: reqObject.params.id },
            {
                $inc: { dislikes: incValue * -1},
                $push: { usersDisliked: userId},
            })
            .then(
                () => {
                    resolve(resObject.status(200).json({
                        message: 'Your preferences have been saved'
                }))},
                () => {
                    reject (new Error('Something happened'))
                })
    })
}

function removeUserDislike(resObject, reqObject, incValue, userId){
    return new Promise((resolve, reject) => {
        Sauce.updateOne(
            { _id: reqObject.params.id },
            {
                $inc: { dislikes: incValue - 1 },
                $pull: { usersDisliked: userId },
            }
        )
        .then(
            () => {
                resolve(resObject.status(200).json({
                    message: 'Your preferences have been saved'
            }))},
            () => {
                reject (new Error('Something happened'))
            })
    })
}