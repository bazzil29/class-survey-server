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

    getStudents: async (req, res) => {
        const { role_id, _id } = req.body;
        try {
            const students = await User.find({ role_id: 3 }, '_id name class base_class');
            if (students && role_id === 1) {
                res.send({
                    success: true,
                    data: students
                })
            }
            else {
                res.send({
                    success: false,
                    message: "User can't access this!"
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
        const { role_id, _id } = req.body;
        try {
            const teachers = await Teacher.find({ role_id: 2 }, '_id name class');
            if (teachers && role_id === 1) {
                res.send({
                    success: true,
                    data: teachers
                })
            } else {
                res.send({
                    success: false,
                    message: "User can't access this!"
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
            if (classes && req.body.role_id === 1)
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
            const { id, teacher, name, students, place, count_credit } = fileHandler.classFile(req.file.path);
            fs.unlink(req.file.path);
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