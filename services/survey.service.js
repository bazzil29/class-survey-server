const StudentSurvey = require('../models/studentSurvey.model');
const SurveyTemplate = require('../models/surveyTemplate.model');
const Survey = require('../models/classSurvey.model');

const uuidv4 = require('uuid');
const renderValue = (field) => {
    if (field.fields) {
        const tmp = field.fields.map(element => {
            return renderValue(element);
        });
        return {
            title: field.title,
            fields: tmp
        }
    } else {
        return {
            title: field.title,
            value: {
                M: 0,
                STD: 0,
                M1: 0,
                STD1: 0,
                M2: 0,
                STD2: 0
            }
        }
    }
}


module.exports = {
    createStudentSurvey: async (type = 1, _classId) => {
        let groupFields = [];
        try {
            const template = await SurveyTemplate.findById(type);
            groupFields = template ? template.group_fields : []
        }
        catch (err) {
            console.log(err);
        }
        const date = new Date();
        const uuid = uuidv4();
        const newStudentSurvey = new StudentSurvey({
            _id: uuid,
            class: _classId,
            create_at: date.getTime(),
            modify_at: date.getTime(),
            group_fields: groupFields
        });
        let result = null;
        newStudentSurvey.save(err => err ? !err : err);
        return uuid;

    },

    deleteStudentSurvey: async (id) => {
        const result = await StudentSurvey.findByIdAndDelete(id);
        return true;
    }
    ,

    createSurvey: async (type = 1, id) => {

        let groupFields = [];
        try {
            const template = await SurveyTemplate.findById(type);
            groupFields = template ? template.group_fields : []
        }
        catch (err) {
            console.log(err);
        }
        const d = new Date();
        const deadline = d.setDate(d.getDate() + 15);
        const newSurvey = new Survey({
            _id: id,
            class: id,
            create_at: d.getTime(),
            last_modify: d.getTime(),
            deadline: deadline,
            value: {
                group_fields: groupFields.map(e => renderValue(e))
            },
            survey_template: type
        })

        newSurvey.save(err => err ? !err : err);
        return id;
    }

}