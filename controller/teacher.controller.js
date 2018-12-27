const User = require('../models/users.models');
const ClassSurvey = require('../models/classSurvey.model');
const Class = require('../models/class.model');
const StudentSurvey = require('../models/studentSurvey.model');

const surveyChecker = require('../common/validateSurvey');
const response = require('../common/response');

module.exports = {
    getTeachers: async (req, res) => {
        const teachers = await User.find({ role_id: 2 }, '_id name class email');
        if (teachers) {
            response.success(res, teachers);
        } else {
            response.false(res, "Users not found!");
        }
    },
    getClasses: async (req, res) => {
        try {
            const { userId } = req.params;
            const { _id, role_id } = req.body;
            const teacher = await User.findById(_id);
            if (role_id === 1 || (role_id === 2 && userId === _id)) {
                const classes = teacher.class;
                response.success(res, classes)
            }
            else {
                response.false(res, "User not found!");
            }
        }
        catch (err) {
            response.false(res, "User can't access this!");
        }

    },

    getSurvey: async (req, res) => {
        try {
            const { userId, classId } = req.params;
            const teacher = await User.findById(userId);
            const teacherClasses = teacher.class;
            const isHaveClass = teacherClasses.find(e => e.id === classId);
            const studentSurveys = await StudentSurvey.find({ class: classId });
            const comments = [];
            let count = 0;

            if (studentSurveys) {
                studentSurveys.forEach(e => {
                    if (surveyChecker.verify(e)) {
                        count++;
                    }

                    if (!!e.comment) {
                        comments.push(e.comment);
                    }
                })
            }


            if (isHaveClass) {
                const classSurvey = await ClassSurvey.findById(classId);
                console.log(classSurvey);
                const classSurveyTmp = {
                    _id: classSurvey._id,
                    group_fields: classSurvey.group_fields,
                    class: classSurvey.class,
                    create_at: classSurvey.create_at,
                    last_modify: classSurvey.last_modify,
                    deadline: classSurvey.deadline,
                    comments: comments,
                    count_of_students: count
                }
                response.success(res, classSurveyTmp);
            }
        }
        catch (err) {
            console.log(err);
            response.false(res, "Class or user not found!");
        }

    },
    addClass: async (req, res) => {
        try {
            const { userId } = req.params;
            const { classId } = req.body;
            const teacher = await User.findById(userId);
            const classes = teacher.class;
            const isExistClassTeacher = classes.find(e => e.id === classId);
            const isExistClass = await Class.findById(classId);
            const teachers = await User.find({ role_id: 2 });
            if (isExistClass && !isExistClassTeacher && teachers) {
                classes.push({
                    id: classId,
                    name: isExistClass.name
                });
                teachers.forEach(e => {
                    if (e.id !== userId) {
                        for (let i = 0; i < e.class.length; i++) {
                            if (e.class[i].id === classId) {
                                e.class.splice(i, 1);
                                break;
                            }
                        }
                        e.save();
                    }
                })
                teacher.set({ class: classes });
                teacher.save();
                isExistClass.set({ teacher: userId });
                isExistClass.save();
                response.success(res);
            } else {
                response.false(res, 'Class hasnt existed!');
            }
        } catch (err) {
            console.log(err);
            response.false(res, err);
        }
    },
    deleteClass: async (req, res) => {
        try {
            const { userId, classId } = req.params;
            const teacher = await User.findById(userId);
            const classes = teacher.class;
            const isExistClass = await Class.findById(classId);
            if (isExistClass && isExistClass.teacher !== userId) {
                for (let i = 0; i < classes.length; i++) {
                    if (classes[i].id === classId) {
                        classes.splice(i, 1);
                        break;
                    }
                }
                teacher.set({ class: classes });
                teacher.save(err => {
                    res.send({ success: !err });
                })
            } else {
                response.false(res, "User still being a teacher of this class , please make orther teacher becomes before!");
            }

        } catch (err) {
            console.log(err);
            response.false(res, err);
        }
    },
    getStudentOfClass: async (req, res) => {
        try {
            const { userId, classId } = req.params;
            const teacher = await User.findById(userId);
            const teacherClasses = teacher.class;
            const isHaveClass = teacherClasses.find(e => e.id === classId);
            if (isHaveClass) {
                const users = await User.find({ role_id: 3 }, "_id name class date_of_birth base_class email");
                const students = [];
                users.forEach(e => {
                    let isTrue = false;
                    e.class.forEach(element => {
                        if (element.id === classId) {
                            isTrue = true;
                        }
                    });
                    if (isTrue) {
                        students.push(e);
                    }
                })
                response.success(res, students);
            }
        } catch (err) {
            console.log(err);
            response.false(res, err);
        }
    }
}