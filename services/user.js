const User = require("../models/users.models");
const JWT = require("./jwt");
const bcrypt = require('../services/bcrypt');

module.exports = {
    create: async (data, role_id) => {
        const users = await User.find();
        if (users !== null) {
            console.log(users);
            const testUsers = users.filter(element => {
                return element._id === data._id;
            });
            const hashPassword = bcrypt.create(data.password);
            if (testUsers.length === 0) {
                const newUser = new User({
                    _id: data._id,
                    role_id: role_id,
                    password: hashPassword
                })
                newUser.save((err, user) => {
                    if (err) return console.log(err);

                    console.log(`Create user ${user._id} completely!`);
                    return {
                        success: true
                    }

                })
            }
            else {
                return {
                    success: false
                }
            }
        }
    },
    delete: async (_id) => {
        try {
            const result = await User.deleteOne({ _id: _id });
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}