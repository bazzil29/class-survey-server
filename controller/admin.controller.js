const userSevices = require('../services/user');
const Class = require('../models/class.model');
const User = require('../models/users.models');
const surveyServices = require('../services/survey');
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
            const { id, teacher, name, students, place, count_credit } = req.body.data;
            const isExistClass = await Class.findById(id);
            if (!isExistClass) {
                userSevices.createTeacher(teacher, [id]);
                for (let i = 0; i < students.length; i++) {
                    userSevices.createStudent(students[i], [id])
                }
                const newClass = new Class({
                    _id: id,
                    name: name,
                    place: place,
                    count_credit: count_credit,
                    teacher: teacher.id,
                    survey_id: id,
                    students: students
                })
                surveyServices.createSurvey(1, id);
                newClass.save(err => {
                    res.send({
                        success: !err
                    })
                });
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