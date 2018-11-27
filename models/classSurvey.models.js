const mongoose = require('mongoose');
const surveySchema = mongoose.Schema({
    _id: String,
    class: String,
    create_at: String,
    last_modify: String,
    value: Object,
    survey_template: String
})

const ClassSurvey = mongoose.model("ClassSurvey", surveySchema, surveys);

module.exports = ClassSurvey;