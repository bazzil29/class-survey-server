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
            const classSameType = classId.split(' ')[0];
            const student = await User.findById(userId);
            const classTmp = student.class.find(e => {
                return e.id === classId;
            });
            const surveyStudent = await StudentSurvey.findById(classTmp.survey_student);
            const classSurvey = await Survey.findById(classId);
            const d = new Date();
            surveyStudent.set({
                group_fields: surveyReq,
                modify_at: d.getTime()
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
                    res.send({
                        success: true
                    })
                })


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
