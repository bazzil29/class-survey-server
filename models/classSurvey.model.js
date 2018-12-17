const mongoose = require('mongoose');
const surveySchema = mongoose.Schema({
    _id: String,
    class: String,
    create_at: String,
    last_modify: String,
    deadline: String,
    group_fields: Array,
    survey_template: String
})

const ClassSurvey = mongoose.model("ClassSurvey", surveySchema, 'surveys');

module.exports = ClassSurvey;