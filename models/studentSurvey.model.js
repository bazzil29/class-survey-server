const mongoose = require('mongoose');

const studentSurveySchema = new mongoose.Schema({
    _id: String,
    class: String,
    create_at: String,
    modify_at: String,
    group_fields: Object
})

const StudentSurvey = mongoose.model('Survey', studentSurveySchema, 'student_survey');

module.exports = StudentSurvey;