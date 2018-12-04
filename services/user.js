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
    },
    updateStudent: async (_id, _student) => {
        try {
            const Student = await User.findById(_id);
            const { name } = _student;
            const classes = _student.class;
            if (classes) {
                let hadClass = [];
                for (let i = 0; i < classes.length; i++) {
                    for (let j = 0; j < Student.class.length; j++) {
                        if (classes[i].id === Student.class[j].id) {
                            hadClass.push(classes[j]);
                        }
                    }
                }

                hadClass.forEach(e => {
                    console.log(e);
                })

                const notHaveClass = _student.class.filter(e => !hadClass.includes(e));

                console.log(notHaveClass);
            }
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}