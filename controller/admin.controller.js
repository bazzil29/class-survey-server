const userSevices = require('./common/user');
const surveyServices = require('./common/survey');

const Class = require('../models/class.model');
const User = require('../models/users.models');
const Teacher = require('../models/teacher.model');
const StudentSurvey = require('../models/studentSurvey.model');
const ClassSurvey = require('../models/classSurvey.model');
const SurveyTemplate = require('../models/surveyTemplate.model');
const fileHandler = require('../common/xlsxHandler');
const response = require('../common/response');


const uuidv4 = require('uuid');


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
        if (await userSevices.createStudent(data)) {
            response.success(res);
        } else {
            response.false(res, "Error!");
        };

    },

    addTeacher: async (req, res) => {
        const data = req.body.data;
        if (await userSevices.createTeacher(data)) {
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
                    await StudentSurvey.findByIdAndDelete(e.survey_student);
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
                    let isTeacher = false;
                    for (let i = 0; i < classes.length; i++) {
                        const classTmp = await Class.findById(classes[i].id)
                        if (classTmp.teacher === userId) {
                            isTeacher = true;
                        }
                    }
                    if (isTeacher) {
                        response.false(res, "User still being teacher of some classes , please make other user becomes before");
                    } else {
                        await User.findByIdAndDelete(userId);
                        response.success(res);
                    }
                } else {
                    await User.findByIdAndDelete(userId);
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
            const classes = await Class.find({}, "_id name place survey_id teacher");
            if (classes) {
                let classesTmp = [];
                for (let i = 0; i < classes.length; i++) {
                    const classSurvey = await ClassSurvey.findById(classes[i]._id);
                    classesTmp[i] = {
                        create_at: classSurvey.create_at,
                        last_modify: classSurvey.last_modify,
                        deadline: classSurvey.deadline,
                        _id: classes[i]._id,
                        name: classes[i].name,
                        place: classes[i].place,
                        survey_id: classes[i].survey_id
                    };
                }
                response.success(res, classesTmp)
            } else {
                response.false(res, "Error!");
            }
        }
        catch (err) {
            console.log(err);
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
            teachers.forEach(e => { userSevices.createTeacher(e) });
            response.success(res);
        } else {
            response.false(res, "NO file!");
        }
    },

    addFileStudent: async (req, res) => {
        const students = fileHandler.studentFile(req.files[0].path);
        // fs.unlink(req.files[0].path);
        if (students) {
            students.forEach(e => { userSevices.createStudent(e) });
            response.success(res);
        } else {
            response.false(res, "No file");
        }
    },

    getSurveyTemplates: async (req, res) => {
        const templates = await surveyServices.getTemplates();
        if (templates) {
            response.success(res, templates);
        } else {
            response.false(res, "Error!");
        }
    },

    addTemplate: async (req, res) => {
        try {
            const { create_at, name, modify_at, group_fields } = req.body;
            const uuid = uuidv4();
            const newTemplate = new SurveyTemplate({ _id: uuid, create_at, name, modify_at, group_fields, isUse: false });
            await newTemplate.save();
            response.success(res);
        } catch (err) {
            console.log(err);
            response.false(res, err);
        }
    },

    updateTemplate: async (req, res) => {
        try {
            const { templateId } = req.params;
            const { name, modify_at, group_fields } = req.body;
            const template = await SurveyTemplate.findById(templateId);
            if (!template.isUse) {
                template.set({ name, modify_at, group_fields });
                template.save();
                response.success(res);
            } else {
                await template.set({ name, modify_at, group_fields });
                await template.save();
                surveyServices.resetSurvey();
                surveyServices.resetStudentSurvey();
                response.success(res);
            }
        } catch (err) {
            console.log(err);
            response.false(res, "Template is not existed!");
        }
    },

    makeUseTemplate: async (req, res) => {
        const { templateId } = req.params;
        const templates = await SurveyTemplate.find({});

        if (templates) {
            for (let i = 0; i < templates.length; i++) {
                if (templates[i].isUse) {
                    templates[i].set({
                        isUse: false
                    });
                    templates[i].save();
                    break;
                }
            }
        }

        const template = await SurveyTemplate.findById(templateId);
        if (!template.isUse) {
            await template.set({ isUse: true });
            await template.save();
            surveyServices.resetSurvey();
            surveyServices.resetStudentSurvey();
            response.success(res);
        } else {
            response.false(res, "This template is current template!")
        }
    },

    getSurveyTemplate: async (req, res) => {
        const { templateId } = req.params;
        const templates = await surveyServices.getTemplate(templateId);
        if (templates) {
            response.success(res, templates);
        } else {
            response.false(res, "Error!");
        }
    },



    getSurvey: async (req, res) => {
        try {
            const { classId } = req.params;
            const classSurvey = await ClassSurvey.findById(classId);
            response.success(res, classSurvey)
        }
        catch (err) {
            console.log(err);
            response.false(res, "Error!");
        }
    },

    reset: async (req, res) => {
        try {
            const users = await User.find({});
            if (users) {
                users.forEach(async e => {
                    if (e._id !== "admin") {
                        await User.findByIdAndDelete(e._id);
                    }
                })
            } else {
                response.false(res);
            }

            const classes = await Class.find({});
            if (classes) {
                classes.forEach(async e => await Class.findByIdAndDelete(e._id));
            } else {
                response.false(res);
            }

            const classSurveys = await ClassSurvey.find({});
            if (classSurveys) {
                classSurveys.forEach(async e => await ClassSurvey.findByIdAndDelete(e._id));
            } else {
                response.false(res);
            }

            const studentsSurvers = await StudentSurvey.find({});
            if (studentsSurvers) {
                studentsSurvers.forEach(async e => await StudentSurvey.findByIdAndDelete(e._id));
            } else {
                response.false(res);
            }

            response.success(res);
        } catch (err) {
            console.log(err);
        }
    }
}