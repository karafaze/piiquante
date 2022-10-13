const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema({
    // Need to add basic validation over fields
    // https://mongoosejs.com/docs/validation.html
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dislikes: { type: Number },
    userLikes: { type: Array },
    userDislikes: { type: Array },
    userId: { type: String, required: true }
});

module.exports = mongoose.model('Sauce', sauceSchema);