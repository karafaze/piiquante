const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        console.log(req.headers.authorization)
    } catch(err){
        console.error(err)
    }
    next()
}