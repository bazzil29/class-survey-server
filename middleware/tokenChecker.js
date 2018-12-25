const jwt = require('../common/jwt');
const User = require('../models/users.models');

module.exports = {
    admin: async (req, res, next) => {
        console.log(req.body);
        const { access_token } = req.headers;
        if (access_token) {
            try {
                const value = jwt.verify(access_token).body.value;
                if (value.role_id === 1) {
                    req.body.role_id = value.role_id;
                    req.body._id = value._id;
                    next();
                } else {
                    res.send({
                        success: false,
                        message: "User can't access!"
                    })
                }
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
    },
    teacher: async (req, res, next) => {
        console.log(req.body);
        const { access_token } = req.headers;
        if (access_token) {
            try {
                const value = jwt.verify(access_token).body.value;
                if (value.role_id === 2) {
                    req.body.role_id = value.role_id;
                    req.body._id = value._id;
                    next();
                } else {
                    res.send({
                        success: false,
                        message: "User can't access!"
                    })
                }
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
    },
    student: async (req, res, next) => {
        const { access_token } = req.headers;
        if (access_token) {
            try {
                const value = jwt.verify(access_token).body.value;
                if (value.role_id === 3) {
                    req.body.role_id = value.role_id;
                    req.body._id = value._id;
                    next();
                } else {
                    res.send({
                        success: false,
                        message: "User can't access!"
                    })
                }
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
    },
    user: async (req, res, next) => {
        console.log(req.body);
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
    },
}