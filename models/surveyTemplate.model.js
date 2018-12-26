const mongoose = require('mongoose');

const surveyTemplate = new mongoose.Schema({
    "_id": String,
    "group_fields": Array,
    "name": String,
    "create_at": String,
    "modify_at": String,
    "isUse": Boolean
})

const SurveyTemplate = mongoose.model('SurveyTemplate', surveyTemplate, 'survey_template')

module.exports = SurveyTemplate;
