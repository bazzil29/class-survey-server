const User = require('../models/users.models');
const ClassSurvey = require('../models/classSurvey.model');
const Class = require('../models/class.model');
module.exports = {
    getClasses: async (req, res) => {
        try {
            const { userId } = req.params;
            const { _id, role_id } = req.body;
            const teacher = await User.findById(_id);
            if (role_id === 1 || (role_id === 2 && userId === _id)) {
                const classes = teacher.class;
                res.send({
                    success: true,
                    data: {
                        class: classes
                    }
                })
            }
            else {
                res.send({
                    success: false,
                    message: "User not found!"
                })
            }
        }
        catch (err) {
            res.send({
                success: false,
                message: "User can't access this!"
            })
        }

    },

    getSurvey: async (req, res) => {
        try {
            const { userId, classId } = req.params;
            const teacher = await User.findById(userId);
            const teacherClasses = teacher.class;
            const isHaveClass = teacherClasses.find(e => e.id === classId);
            if (isHaveClass) {
                const classSurvey = await ClassSurvey.findById(classId);
                console.log(classSurvey);
                res.send({
                    success: true,
                    data: classSurvey
                })
            }
        }
        catch (err) {
            console.log(err);
            res.send({
                success: false,
                message: "Class or user not found!"
            })
        }

    },
    addClass: async (req, res) => {
        try {
            const { userId } = req.params;
            const { _class } = req.body;
            const teacher = await User.findById(userId);
            const classes = teacher.class;
            const isExistClassTeacher = classes.find(e => e.id === _class);
            const isExistClass = await Class.findById(_class);
            if (isExistClass && !isExistClassTeacher) {
                classes.push({
                    id: _class,
                    name: isExistClass.name
                })
                teacher.set({
                    class: classes
                })
                teacher.save();
                res.send({
                    success: true
                })
            } else {
                res.send({
                    success: false,
                    message: 'Class hasnt existed!'
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
    deleteClass: async (req, res) => {
        try {
            const { userId } = req.params;
            const { _class } = req.body;
            const teacher = await User.findById(userId);
            const classes = teacher.class;
            for (let i = 0; i < classes.length; i++) {
                if (classes[i].id === _class) {
                    classes.splice(i, 1);
                    break;
                }
            }
            teacher.set({
                class: classes
            })
            teacher.save(err => {
                res.send({
                    success: !err
                })
            })
        } catch (err) {
            console.log(err);
        }
    }
}