const User = require("../models/users.models");
const JWT = require("./jwt");
const bcrypt = require('./bcrypt');
const surveyServices = require('./survey.service');

module.exports = {
    createTeacher: async (data, _classes = []) => {
        const { id, name } = data;
        try {
            const isExistUser = await User.findById(id);
            if (!isExistUser) {
                const hashPassword = bcrypt.create(id.toString());
                const newUser = new User({
                    _id: id,
                    name: name,
                    role_id: 2,
                    password: hashPassword,
                    class: _classes
                });

                return newUser.save(err => !err);

            }
            else {
                const classes = isExistUser.class.slice();
                classes.push(..._classes)
                isExistUser.set({
                    class: classes
                });
                return isExistUser.save(err => !err)
            }
        }
        catch (err) {
            console.log(err);
            return false;
        }
    },


    createStudent: async (data, _classes) => {
        const { id, name } = data;
        try {
            const isExistUser = await User.findById(id);
            if (!isExistUser) {
                const hashPassword = bcrypt.create(id.toString());
                let classes = [];
                for (let i = 0; i < _classes.length; i++) {
                    const survey_student = await surveyServices.createStudentSurvey();
                    classes.push({
                        id: _classes[i],
                        survey_student: survey_student
                    });
                }
                const newUser = new User({
                    _id: id,
                    name: name,
                    role_id: 3,
                    password: hashPassword,
                    class: classes
                });
                return newUser.save(err => !err);
            }
            else {
                const classes = isExistUser.class.slice();
                for (let i = 0; i < _classes.length; i++) {
                    const survey_student = await surveyServices.createStudentSurvey();
                    classes.push({
                        id: _classes[i],
                        survey_student: survey_student
                    });
                }
                isExistUser.set({
                    class: classes
                });
                return isExistUser.save(err => err)
            }
        }
        catch (err) {
            console.log(err);
            return false;
        }
    },


    delete: async (_id) => {
        try {
            const result = await User.deleteOne({ _id: _id });
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    },

    updateStudent: async (_id, _student) => {
        try {
            const Student = await User.findById(_id);
            const { name } = _student;
            const classes = _student.class;
            if (classes) {
                let hadClass = [];
                for (let i = 0; i < classes.length; i++) {
                    for (let j = 0; j < Student.class.length; j++) {
                        if (classes[i].id === Student.class[j].id) {
                            hadClass.push(classes[j]);
                        }
                    }
                }

                hadClass.forEach(e => {
                    console.log(e);
                })

                const notHaveClass = _student.class.filter(e => !hadClass.includes(e));

                console.log(notHaveClass);
            }
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}