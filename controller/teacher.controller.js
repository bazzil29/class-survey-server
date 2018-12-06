const User = require('../models/users.models');
const ClassSurvey = require('../models/classSurvey.model');

module.exports = {
    getClasses: async (req, res) => {
        try {
            const { teacherId } = req.params;
            const { _id, role_id } = req.body;
            const teacher = await User.findById(_id);
            if (role_id === 1 || (role_id === 2 && teacherId === _id)) {
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
            const { teacherId, classId } = req.params;
            const { _id, role_id } = req.body;
            const teacher = await User.findById(_id);
            const teacherClasses = teacher.class;
            if (role_id === 1 || (role_id === 2 && teacherId === _id)) {
                const classSurvey = await ClassSurvey.find({ class: classId });
                res.send({
                    success: true,
                    data: classSurvey
                })
            } else {
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
                message: "Class or user not found!"
            })
        }

    }
}