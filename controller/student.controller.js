const User = require('../models/users.models');
const StudentSurvey = require('../models/studentSurvey.model');
const Survey = require('../models/classSurvey.model');
const surveyChecker = require('../common/validateSurvey');
const Class = require('../models/class.model');
const surveyServices = require('./common/survey');
const response = require("../common/response");
module.exports = {
    getStudents: async (req, res) => {
        const students = await User.find({ role_id: 3 }, '_id name class base_class date_of_birth');
        if (students) {
            response.success(res, students);
        } else {
            response.false(res, "Users not found!");
        }
    },
    getClasses: async (req, res) => {
        const { userId } = req.params;
        const student = await User.findById(userId);
        if (student) {
            const classes = student.class;
            response.success(res, classes);
        } else {
            response.false(res, "Student not found!");
        }
    },

    getSurvey: async (req, res) => {
        const { userId, classId } = req.params;
        const student = await User.findById(userId);
        try {
            if (student) {
                const isExistClass = student.class.find(e => e.id === classId);
                const survey = await StudentSurvey.findById(isExistClass.survey_student);
                if (survey) {
                    response.success(res, { survey: survey })
                }
                else {
                    response.false(res, "Class is not exist!");
                }
            } else {
                response.false(res, "User not found!");
            }
        }
        catch (err) {
            response.success(res, err);
        }
    },

    updateSurvey: async (req, res) => {
        try {
            const { userId, classId } = req.params;
            const { survey: surveyReq, comment } = req.body;
            const classSameType = classId.split(' ')[0];
            const student = await User.findById(userId);
            const classTmp = student.class.find(e => e.id === classId);
            const surveyStudent = await StudentSurvey.findById(classTmp.survey_student);
            const classSurvey = await Survey.findById(classId);
            const d = new Date();
            surveyStudent.set({
                group_fields: surveyReq,
                modify_at: d.getTime(),
                comment: comment
            })

            if (surveyChecker.verify(surveyStudent)) {
                surveyStudent.save(async err => {
                    const class_temp = await Class.findById(classId);
                    const teacher = await User.findById(class_temp.teacher);
                    const result_1 = await surveyServices.assume(classSameType);
                    const result = await surveyServices.assume(classId);
                    const result_2 = await surveyServices.assumeAll(teacher.class)
                    var group_fields = [];
                    for (let i = 0; i < classSurvey.group_fields.length; i++) {
                        group_fields[i] = {
                            fields: [],
                            title: classSurvey.group_fields[i].title
                        };
                        for (let j = 0; j < classSurvey.group_fields[i].fields.length; j++) {
                            group_fields[i].fields[j] = {
                                value: {},
                                title: classSurvey.group_fields[i].fields[j].title
                            }
                            group_fields[i].fields[j].value.M = result[i][j].M;
                            group_fields[i].fields[j].value.STD = result[i][j].STD;
                            group_fields[i].fields[j].value.M1 = result_1[i][j].M;
                            group_fields[i].fields[j].value.STD1 = result_1[i][j].STD;
                            group_fields[i].fields[j].value.M2 = result_2[i][j].M;
                            group_fields[i].fields[j].value.STD2 = result_2[i][j].STD;
                        }
                    }
                    classSurvey.set({ group_fields: group_fields })
                    await classSurvey.save();
                    // console.log(classSurvey.group_fields[0].fields[0])
                    response.success(res);
                })
            }

        } catch (err) {
            console.log(err);
            response.false(res, err);
        }


    },
    addClass: async (req, res) => {
        const { classId } = req.body;
        const { userId } = req.params;
        try {
            const student = await User.findById(userId);
            if (student) {
                const classes = student.class;
                const isExist = classes.find((e) => e.id === classId);

                if (isExist) {
                    response.false(res, "Class had existed!");
                }
                const classTmp = await Class.findById(classId);
                const survey = await Survey.findById(classId);
                if (survey && classTmp) {
                    const survey_student = await surveyServices.createStudentSurvey(parseInt(survey.survey_template, 10), classId);
                    const classes = student.class;
                    classes.push({
                        name: classTmp.name,
                        id: classId,
                        survey_student: survey_student
                    })
                    student.set({ class: classes });
                    student.save(err => {
                        res.send({ success: !err })
                    });
                } else {
                    response.false(res, "Class not found!");
                }
            }
        } catch (err) {
            console.log(err);
            response.false(res, err);
        }
    },

    deleteClass: async (req, res) => {

        const { userId, classId } = req.params;
        try {
            const student = await User.findById(userId);
            if (student) {
                const classes = student.class;
                const isExist = classes.find((e) => e.id === classId);

                if (isExist) {
                    classes.splice(classes.indexOf(isExist), 1);
                    student.set({ class: classes })
                    student.save();
                    res.send({ success: !!surveyServices.deleteStudentSurvey(isExist.survey_student) })
                } else {
                    response.false(res, "Class hadn't existed");
                }
            } else {
                response.false(res, "Student not found!");
            }
        } catch (err) {
            console.log(err);
            response.false(res, err);
        }
    }
}
