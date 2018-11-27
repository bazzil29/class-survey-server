const User = require('../models/users.models');
const bcrypt = require('../services/bcrypt');
module.exports = {
    verify: async (req, res, next) => {
        const user = await User.findById(req.body.username);
        if (user) {
            if (bcrypt.verify(req.body.password, user.password)) {
                next();
            }
            else {
                res.send({
                    success: false,
                    message: "Err username or password!"
                })
            }
        }
        else {
            res.send({
                success: false,
                message: "Err username or password!"
            })
        }
    }
}