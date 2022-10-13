const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./public/uploads");
    },
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname);
        const fileName = getFormattedName(file.originalname, extension)
        callback(null, fileName);
    },
});

function getFormattedName(fileName, extension){
    // gets rid of spaces and '-' and replaces it with '_'
    // then adds date and extension to the filename and returns it
    let formattedName = fileName.replace(`${extension}`, '').trim();
    formattedName = formattedName.replace(/\s|-/gi, '_');
    return `${formattedName}_${Date.now()}${extension}`;
}

module.exports = multer({ storage: storage }).single("image");

