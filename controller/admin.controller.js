const userSevices = require('../services/user');
const Class = require('../models/class.model');
const User = require('../models/users.models');
module.exports = {
    updateUser: (req, res) => {
        if (req.body.role_id === 1) {
            const { data } = req.body;
            const { studentId } = req.params;
            if (userSevices.updateStudent(studentId, data)) {
                res.send({
                    success: true,
                    message: "Update successed!"
                })
            }
            else {
                res.send({
                    success: false,
                    message: 'Update false!'
                })
            }
        }
    },
    getClasses: async (req, res) => {
        try {
            const classes = await Class.find({});
            if (classes)
                res.send({
                    success: true,
                    data: classes
                })
        }
        catch (err) {
            console.log(err);
            res.send({
                success: false,
                message: "error!"
            })
        }

    },

    addClass: async (req, res) => {
        try {
            const classes = await Class.find({});
            const { id, teacher, name, students, place, count_credit } = req.body;
            const isExistClass = await Class.findById(id);
            if (!isExistClass) {
                userSevices.create(teacher, 2, [id]);
                for (let i = 0; i < students.length; i++) {
                    userSevices.create(students[i], 3, [id])
                }
                /* 
                *@todo lam tiep phan xu ly survey khi them
                */
            }
            else {
                res.send({
                    success: false,
                    message: "Class has existed!"
                })
            }
        }
        catch (err) {
            console.log(err);
        }
    }
}