const userSevices = require('../services/user.service');
const Class = require('../models/class.model');
const User = require('../models/users.models');
const surveyServices = require('../services/survey.service');
const Teacher = require('../models/teacher.model');

const fileHandler = require('../services/xlsxHandler');

const fs = require('fs');

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

    getUser: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await User.findById(userId);
            if (user) {
                res.send({
                    success: true,
                    data: user
                })
            } else {
                res.send({
                    success: false,
                    message: "User not found!"
                })
            }
        } catch (err) {
            console.log(err);
            res.send({
                success: false,
                message: "Err!"
            })
        }
    },
    getStudents: async (req, res) => {
        try {
            const students = await User.find({ role_id: 3 }, '_id name class base_class date_of_birth');
            if (students) {
                res.send({
                    success: true,
                    data: students
                })
            }
        }
        catch (err) {
            console.log(err);
            res.send({
                success: false,
                message: "Students not found!"
            })
        }
    },

    getTeachers: async (req, res) => {
        try {
            const teachers = await Teacher.find({ role_id: 2 }, '_id name class');
            if (teachers) {
                res.send({
                    success: true,
                    data: teachers
                })
            }
        } catch (err) {
            console.log(err);
            res.send({
                success: false,
                message: 'Teachers not found!'
            })
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
            res.send({
                success: false,
                message: "error!"
            })
        }

    },

    addClass: async (req, res) => {
        try {

            const { id, teacher, name, students, place, count_credit } = fileHandler.classFile(req.files[0].path);
            fs.unlink(req.files[0].path);
            const isExistClass = await Class.findById(id);
            if (!isExistClass) {
                userSevices.createTeacher(teacher, [{ id, name }]);
                for (let i = 0; i < students.length; i++) {
                    userSevices.createStudent(students[i], [{ id, name }])
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
            res.send({
                success: false,
                message: "nofile!"
            })
        }
    },

    addFileTeacher: async (req, res) => {
        const teachers = fileHandler.teacherFile(req.files[0].path);
        fs.unlink(req.files[0].path);
        if (teachers) {
            teachers.forEach(e => {
                userSevices.createTeacher(e)
            });
            res.send({
                success: true
            })
        } else {
            res.send({
                success: false,
                message: "no file"
            })
        }
    },

    addFileStudent: async (req, res) => {
        const students = fileHandler.studentFile(req.files[0].path);
        fs.unlink(req.files[0].path);

        if (students) {
            students.forEach(e => {
                userSevices.createStudent(e)
            });
            res.send({
                success: true
            })
        } else {
            res.send({
                success: false,
                message: "No file"
            })
        }
    },
}