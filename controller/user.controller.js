const User = require('../models/users.models');
const jwt = require('../services/jwt');
const bcrypt = require('../services/bcrypt');

module.exports = {
    test: (req, res) => {
        const response = {
            message: 'Hello World!'
        }
        const tmp = User.find({ name: "Ngo Minh Phuong" })
            .then(res => {
                console.log(res);
            })
        console.log(tmp);
        res.end(JSON.stringify(response));
    },


    login: async (req, res) => {
        try {
            const user = await User.findById(req.body.username);
            const token = jwt.create({ _id: user._id, role_id: user.role_id })
            res.send({
                success: true,
                message: "Login success!",
                data: {
                    token: token
                }
            })
        } catch (err) {
            console.log(err);
            res.send({
                success: false,
                message: "Err username or password",
            })
        }
    },

    changePassword: async (req, res) => {
        try {
            const { _id, oldPassword, newPassword } = req.body;
            const user = await User.findById(_id);
            if (user) {

                if (bcrypt.verify(oldPassword, user.password)) {
                    user.set({
                        password: bcrypt.create(newPassword)
                    });
                    user.save();
                    res.status(200).send({
                        success: true,
                        message: "Change password completely!"
                    })
                }
            } {
                res.status(401).send({
                    success: false,
                    message: "Not found user!"
                })
            }
        }
        catch (err) {
            res.status(401).send({
                success: false,
                message: "Not found user!"
            })
        }
    },

    getProfile: async (req, res) => {
        try {
            const { _id } = req.body;
            const user = await User.findById(_id);
            if (user) {
                res.send({
                    success: true,
                    data: {
                        profileDetails: {
                            name: user.name,
                            _id: user._id
                        }
                    }
                })
            }
            else {
                res.send({
                    success: false,
                    message: "User not found!"
                })
            }

        } catch (err) {
            console.log(err);
            res.send({
                success: false,
                message: err
            })
        }
    }


}