const userSevices = require('./common/user');
const surveyServices = require('./common/survey');

const Class = require('../models/class.model');
const User = require('../models/users.models');
const Teacher = require('../models/teacher.model');
const studentSurvey = require('../models/studentSurvey.model');

const fileHandler = require('../common/xlsxHandler');
const response = require('../common/response');


const fs = require('fs');

module.exports = {

    updateUser: async (req, res) => {
        const { data } = req.body;
        const { userId } = req.params;

        try {
            const user = await User.findById(userId);
            if (user) {
                user.set({
                    name: data.name,
                    base_class: data.base_class,
                    date_of_birth: data.date_of_birth,
                    email: data.email
                })
                user.save(err => {
                    res.send({ success: !err })
                })
            }
        } catch (err) {
            console.log(err);
            response.false(res, err);
        }

    },

    getUser: async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await User.findById(userId);
            if (user) {
                response.success(res, user);
            } else {
                response.false(res, "User not found!");
            }
        } catch (err) {
            console.log(err);
            response.false(res, err);
        }
    },

    addStudent: async (req, res) => {

        const data = req.body.data;
        if (userSevices.createStudent(data)) {
            response.success(res);
        } else {
            response.false(res, "Error!");
        };

    },

    addTeacher: async () => {
        const data = req.body.data;
        if (userSevices.createTeacher(data)) {
            response.success(res);
        } else {
            response.false(res, "err");
        };
    },

    getStudents: async (req, res) => {
        try {
            const students = await User.find({ role_id: 3 }, '_id name class base_class date_of_birth');
            if (students) {
                response.success(res, students);
            }
        }
        catch (err) {
            response.false(res, "Students not found!");
        }
    },

    deleteStudent: async (req, res) => {
        try {
            const { userId } = req.params;
            const student = await User.findById(userId);
            if (student) {
                student.class.forEach(async e => {
                    await studentSurvey.findByIdAndDelete(e.survey_student);
                })
                if (await userSevices.delete(userId)) {
                    response.success(res);
                };
            } else {
                response.false(res, "User not found!");
            }
        } catch (err) {
            console.log(err);
            response.false(res, err);
        }
    },
    deleteTeacher: async (req, res) => {
        try {
            const { userId } = req.params;
            const teacher = await User.findById(userId);
            if (teacher) {
                const classes = teacher.class;
                if (classes.length !== 0) {
                    response.false(res, "User still being teacher of some classes , please make other user becoems before");
                } else {
                    response.success(res);
                }
            }
        } catch (err) {
            console.log(err);
            response.false(res, err);
        }
    },
    getTeachers: async (req, res) => {
        try {
            const teachers = await Teacher.find({ role_id: 2 }, '_id name class email');
            if (teachers) {
                response.success(res, teachers);
            }
        } catch (err) {
            console.log(err);
            response.false(res, err);
        }
    },


    getClasses: async (req, res) => {
        try {
            const classes = await Class.find({});
            if (classes) {
                response.success(res, classes)
            } else {
                response.false(res, "Error!");
            }
        }
        catch (err) {
            response.false(res, err);
        }

    },

    addClass: async (req, res) => {
        try {

            const { id, teacher, name, students, place, count_credit } = fileHandler.classFile(req.files[0].path);
            // fs.unlink(req.files[0].path);
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
                    res.send({ success: !err })
                });
            }
            else {
                response.false(res, "Class has existed!");
            }
        }
        catch (err) {
            console.log(err);
            response.false(res, "nofile!");
        }
    },

    addFileTeacher: async (req, res) => {
        const teachers = fileHandler.teacherFile(req.files[0].path);
        // fs.unlink(req.files[0].path);
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
        // fs.unlink(req.files[0].path);

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