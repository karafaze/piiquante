const Sauce = require("../models/sauce");

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

exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((err) => {
            res.status(404).json({
                errorMessage: err,
            });
        });
};

exports.addSauce = (req, res) => {
    req.body.sauce = JSON.parse(req.body.sauce);
    const url = `${req.protocol}://${req.get("host")}`;
    const sauce = new Sauce({
        name: req.body.sauce.name,
        manufacturer: req.body.sauce.manufacturer,
        description: req.body.sauce.description,
        mainPepper: req.body.sauce.mainPepper,
        imageUrl: `${url}/uploads/${req.file.filename}`,
        heat: req.body.sauce.heat,
        likes: 0,
        dislikes: 0,
        usersLikes: [],
        usersDislikes: [],
        userId: req.auth.userId,
    });
    sauce
        .save()
        .then((data) => {
            res.status(201).json({
                saudeAdded: data,
            });
        })
        .catch((err) =>
            res.status(500).json({
                err: err.message,
            })
        );
};

// exports.updateSauce = (req, res) => {
//     let sauce = new Sauce({
//         _id: req.params.id,
//     });
//     if (req.file) {
//         req.body.sauce = JSON.parse(req.body.sauce);
//         const url = `${req.protocol}://${req.get("host")}`;
//         sauce = {
//             name: req.body.sauce.name,
//             manufacturer: req.body.sauce.manufacturer,
//             description: req.body.sauce.description,
//             mainPepper: req.body.sauce.mainPepper,
//             imageUrl: `${url}/public/${req.file.filename}`,
//             heat: req.body.sauce.heat,
//             likes: req.body.sauce.likes,
//             dislikes: req.body.sauce.dislikes,
//             userLikes: req.body.sauce.userLikes,
//             userDislikes: req.body.sauce.userDislikes,
//         };
//     } else {
//         sauce = {
//             ...req.body,
//         };
//     }
//     res.status(200).json({
//         sauce: sauce,
//     });
// };
