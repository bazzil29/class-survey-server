const userSevices = require('../services/user');
const Class = require('../models/class.model');

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
            console.log(err);
            res.send({
                success: false,
                message: "error!"
            })
        }

    }
}