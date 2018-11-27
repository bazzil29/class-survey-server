const jwt = require('../services/jwt');
const User = require('../models/users.models');

module.exports = {
    verify: async (req, res, next) => {
        const { access_token } = req.headers;

        if (access_token) {
            try {
                const value = jwt.verify(access_token).body.value;
                req.body.role_id = value.role_id;
                req.body._id = value._id;
                next();
            } catch (err) {
                res.status(401).send({
                    success: false,
                    message: "Invalid token or expried!"
                })
            }
        }
        else {
            res.send({
                success: false,
                message: "Please send a token!"
            })
        }
    }
}