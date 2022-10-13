const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN);
        const userId = decodedToken.userId;
        req.auth = { userId: userId };
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
