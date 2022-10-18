const jwt = require("jsonwebtoken");

// auth middleware to limit content to authenticated users
module.exports = (req, res, next) => {
    try {
        // retrieve token from Authorization header
        const token = req.headers.authorization.split(" ")[1];
        // decode the token to make sure user is not fake
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
        const userId = decodedToken.userId;
        // once check is complete, we add .auth property to request object
        req.auth = { userId: userId };
        // condition to always verify user is authenticated
        if (req.body.userId && req.body.userId !== userId) {
            return res.status(401).json({
                errorMessage: "Unauthorized request",
            });
        }
        next()
    } catch (err) {
        res.status(401).json({
            errorMessage: "Unauthorized request",
        });
    }
};
