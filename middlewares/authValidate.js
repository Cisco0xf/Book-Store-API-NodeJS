const authValidate = (req, res, next) => {
    const errors = {}
    
    if (!req.body) {
        return res.send({
            message: 'Request body is required',
            code: 400,
            errors: { body: 'Request body missing' }
        });
    }
    
    const { email, password } = req.body;
    
    if (!email) {
        errors.email = 'email is required field'
    }
    if (!password) {
        errors.password = 'password is required field'
    }
    
    if (Object.keys(errors).length === 0) {
        next()
    } else {
        res.send({
            message: 'invalid credentials',
            code: 422,
            errors
        })
    }
}

module.exports = authValidate