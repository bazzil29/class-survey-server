const mongoose = require('mongoose');

const surveyTemplate = new mongoose.Schema({
    "_id": String,
    "group_fields": Array
})

const SurveyTemplate = mongoose.model('SurveyTemplate', surveyTemplate, 'survey_template')

module.exports = SurveyTemplate;