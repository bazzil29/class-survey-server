const User = require('../models/users.models');
const StudentSurvey = require('../models/studentSurvey.model');
const Survey = require('../models/classSurvey.model');
const surveyChecker = require('../services/validateSurvey');
const Class = require('../models/class.model');
const surveyServices = require('../services/survey.service');
module.exports = {
    getClasses: async (req, res) => {
        const { userId } = req.params;
        const student = await User.findById(userId);
        if (student) {
            const classes = student.class;
            res.send({
                success: true,
                data: {
                    class: classes
                }
            })
        } else {
            res.send({
                success: false,
                message: "Student not found!"
            })
        }

    },

    getSurvey: async (req, res) => {
        const { userId, classId } = req.params;
        const student = await User.findById(userId);
        try {
            if (student) {
                const isExistClass = student.class.find(e => {
                    return e.id === classId;
                });
                const survey = await StudentSurvey.findById(isExistClass.survey_student);
                if (survey) {
                    res.send({
                        success: true,
                        data: {
                            survey: survey
                        }
                    })
                }
                else {
                    res.send({
                        success: false,
                        message: "Class is not exist!"
                    })
                }
            } else {
                res.send({
                    success: false,
                    message: "User not found! "
                })
            }
        }
        catch (err) {
            res.send({
                success: false,
                message: "Err!"
            })
        }
    },

    updateSurvey: async (req, res) => {
        try {
            const { userId, classId } = req.params;
            const { survey: surveyReq } = req.body;
            const student = await User.findById(userId);
            const classTmp = student.class.find(e => {
                return e.id === classId;
            });
            const surveyStudent = await StudentSurvey.findById(classTmp.survey_student);
            const Survey = await Survey.find({ class: classId });
            surveyStudent.set({
                group_fields: surveyReq,
                modify_at: new Date()
            })

            if (surveyChecker.verify(surveyStudent)) {
                if (!err) {
                    surveyStudent.save(err => {
                        res.send({
                            success: true
                        })
                    })
                }

            }

        } catch (err) {
            console.log(err);
            res.send({
                success: false,
                message: "Err"
            })
        }


    },
    addClass: async (req, res) => {
        const { _class } = req.body;
        const { userId } = req.params;
        try {
            const student = await User.findById(userId);
            if (student) {
                const classes = student.class;
                const isExist = classes.find((e) => {
                    return e.id === _class;
                });

                if (isExist) {
                    res.send({
                        success: false,
                        message: "Class had existed!"
                    })
                }
                const classTmp = await Class.findById(_class);
                const survey = await Survey.findById(_class);
                if (survey && classTmp) {
                    const survey_student = await surveyServices.createStudentSurvey(parseInt(survey.survey_template, 10), _class);
                    const classes = student.class;
                    classes.push({
                        name: classTmp.name,
                        id: _class,
                        survey_student: survey_student
                    })
                    student.set({ class: classes });
                    student.save(err => {
                        res.send({
                            success: !err
                        })
                    });
                } else {
                    res.send({
                        success: false,
                        message: "Class not found!"
                    })
                }
            }
        } catch (err) {
            console.log(err);
            res.send({
                success: false,
                message: "Err!"
            })
        }
    },

    deleteClass: async (req, res) => {
        const { _class } = req.body;
        const { userId } = req.params;
        try {
            const student = await User.findById(userId);
            if (student) {
                const classes = student.class;
                const isExist = classes.find((e) => {
                    return e.id === _class;
                });

                if (isExist) {
                    classes.splice(classes.indexOf(isExist, 1));
                    student.set({
                        class: classes
                    })
                    student.save();
                    res.send({
                        success: !!surveyServices.deleteStudentSurvey(isExist.survey_student)
                    })
                } else {
                    res.send({
                        success: false,
                        message: "Class hadn't existed"
                    })
                }
            } else {
                res.send({
                    success: false,
                    message: "Student not found!"
                })
            }
        } catch (err) {
            console.log(err);
            res.send({
                success: false,
                message: "Err!"
            })
        }
    }
}
