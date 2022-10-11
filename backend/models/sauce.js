const mongoose = require("mongoose");

const sauceSchema = new mongoose.Schema({
    // Need to add basic validation over fields
    // https://mongoosejs.com/docs/validation.html
    name: { type: String, required: true, unique: true },
    manufacturer: { type: String, required: true },
    description: { type: String },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number, required: true },
    likes: { type: Number },
    dilikes: { type: Number },
    userLikes: { type: [String] },
    userDislikes: { type: [String] },
});

module.exports = mongoose.model('Sauce', sauceSchema);