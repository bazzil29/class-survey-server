const mongoose = require('mongoose');

const studentSurveySchema = new mongoose.Schema({
    _id: String,
    create_at: String,
    modify_at: String,
    group_fields: Object
})

const Survey = mongoose.model('Survey', studentSurveySchema, 'student_survey');

module.exports = Survey;