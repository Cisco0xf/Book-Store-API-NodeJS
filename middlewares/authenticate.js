const jwt = require("jsonwebtoken");
require('dotenv').config();

const authenticate = (req, res, next) => {
    let token = req.headers.authorization;
    if (token) {
        token = token.split(' ')[1]
        const { email, id, role } = jwt.verify(token, process.env.JWT_SECRET)
        req.user = { email, id, role }
        next()
    } else {
        res.send({
            message: 'unauthenticated',
            code: 401,
        })
    }
}

module.exports = authenticate