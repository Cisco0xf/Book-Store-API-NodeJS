const authorizeAuthor = (req, res, next) => {
    if (req.user.role !== 'author' && req.user.role !== 'admin') {
        return res.send({
            message: 'Access denied. Author or Admin only.',
            code: 403
        });
    }
    next();
};

module.exports = authorizeAuthor;