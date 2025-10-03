const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.send({
            message: 'Access denied. Admin only.',
            code: 403
        });
    }
    next();
};

module.exports = authorizeAdmin;