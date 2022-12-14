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
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
    userId: { type: String, required: true },
});

module.exports = mongoose.model("Sauce", sauceSchema);
