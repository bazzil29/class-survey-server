const User = require("../../models/users.models");
const JWT = require("../../common/jwt");
const bcrypt = require('../../common/bcrypt');
const surveyServices = require('./survey');

module.exports = {
    createTeacher: async (data, _classes = []) => {
        const { id, name, email, password } = data;
        try {
            const isExistUser = await User.findById(id);
            if (!isExistUser) {
                const hashPassword = bcrypt.create(password ? password.toString() : id.toString());
                const newUser = new User({
                    _id: id,
                    name: name,
                    role_id: 2,
                    password: hashPassword,
                    class: _classes,
                    email: email
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

    createStudent: async (data, _classes = []) => {
        const { id, name, base_class, date_of_birth, email, password } = data;
        try {
            const isExistUser = await User.findById(id);
            if (!isExistUser) {
                const hashPassword = bcrypt.create(password ? password.toString() : id.toString());
                let classes = [];
                for (let i = 0; i < _classes.length; i++) {
                    const survey_student = await surveyServices.createStudentSurvey(1, _classes[i].id);
                    classes.push({
                        name: _classes[i].name,
                        id: _classes[i].id,
                        survey_student: survey_student
                    });
                }
                const newUser = new User({
                    _id: id,
                    name: name,
                    role_id: 3,
                    password: hashPassword,
                    class: classes,
                    base_class: base_class,
                    date_of_birth: date_of_birth,
                    email: email
                });
                return newUser.save(err => !err);
            }
            else {
                const classes = isExistUser.class.slice();
                for (let i = 0; i < _classes.length; i++) {
                    const survey_student = await surveyServices.createStudentSurvey(1, _classes[i].id);
                    classes.push({
                        name: _classes[i].name,
                        id: _classes[i].id,
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
            const result = await User.findByIdAndDelete(_id);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    }
}