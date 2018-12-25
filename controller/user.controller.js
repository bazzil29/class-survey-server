const User = require('../models/users.models');
const jwt = require('../common/jwt');
const bcrypt = require('../common/bcrypt');
const response = require('../common/response');

module.exports = {
    test: (req, res) => {
        const response = {
            message: 'Hello World!'
        }
        const tmp = User.find({ name: "Ngo Minh Phuong" })
            .then(res => {
                console.log(res);
            })
        res.end(JSON.stringify(response));
    },


    login: async (req, res) => {
        try {
            const user = await User.findById(req.body.username);
            const token = jwt.create({ _id: user._id, role_id: user.role_id })
            const data = {
                token: token,
                role_id: user.role_id
            }
            response.success(res, data, "Login success!")
        } catch (err) {
            console.log(err);
            response.false(res, "Wrong  password or username")
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
                    response.success(res, null, "Change password completely!");
                } else {
                    response.false(res, "Old password is wrong!")
                }
            } else {
                response.false(res, "User not found !");
            }
        }
        catch (err) {
            response.false(res, "User not found !");
        }
    },

    getProfile: async (req, res) => {
        try {
            const { _id } = req.body;
            const user = await User.findById(_id);
            if (user) {
                response.success(res, { ...user })
            }
            else {
                response.false(res, "User not found!");
            }

        } catch (err) {
            console.log(err);
            response.false(res, err);
        }
    }


}