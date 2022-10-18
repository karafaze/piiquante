const {body} = require('express-validator');

const schema = [
    body('email')
        .isEmail()
        .withMessage('You must insert a valid email.'),
    body('password')
        .isStrongPassword({ 
            minLength: 8, 
            minLowercase: 1, 
            minUppercase: 1, 
            minNumbers: 1, 
            minSymbols: 1, 
            returnScore: false, 
            pointsPerUnique: 1, 
            pointsPerRepeat: 0.5, 
            pointsForContainingLower: 10, 
            pointsForContainingUpper: 10, 
            pointsForContainingNumber: 10, 
            pointsForContainingSymbol: 10 })
        .withMessage('Password weak. It must respect a combination of upper case, lower case, number and symbols.')
]

module.exports = ('registerSchema', schema);