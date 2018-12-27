const StudentSurvey = require('../../models/studentSurvey.model');
const SurveyTemplate = require('../../models/surveyTemplate.model');
const Survey = require('../../models/classSurvey.model');

const surveyChecker = require('../../common/validateSurvey');
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
        const templates = await SurveyTemplate.find({});
        if (templates) {
            templates.forEach(e => {
                if (e.isUse) {
                    groupFields = e.group_fields
                }
            })
        } else {
            return false;
        }
        // try {
        //     const template = await SurveyTemplate.findById(type);
        //     groupFields = template ? template.group_fields : []
        // }
        // catch (err) {
        //     console.log(err);
        // }
        const date = new Date();
        const uuid = uuidv4();
        const newStudentSurvey = new StudentSurvey({
            _id: uuid,
            class: _classId,
            create_at: date.getTime(),
            modify_at: date.getTime(),
            group_fields: groupFields,
            comment: null
        });
        let result = null;
        newStudentSurvey.save(err => err ? !err : err);
        return uuid;
    },

    deleteStudentSurvey: async (id) => {
        const result = await StudentSurvey.findByIdAndDelete(id);
        return true;
    },

    createSurvey: async (type = 1, id) => {

        let groupFields = [];

        const templates = await SurveyTemplate.find({});
        if (templates) {
            templates.forEach(e => {
                if (e.isUse) {
                    groupFields = e.group_fields
                }
            })
        } else {
            return false;
        }

        // try {
        //     const template = await SurveyTemplate.findById(type);
        //     groupFields = template ? template.group_fields : []
        // }

        // catch (err) {
        //     console.log(err);
        // }

        const d = new Date();
        const date = d.getTime();
        const deadline = d.setTime(d.getTime() + 60 * 60 * 1000 * 24 * 15);
        const newSurvey = new Survey({
            _id: id,
            class: id,
            create_at: date,
            last_modify: date,
            deadline: deadline,
            group_fields: groupFields.map(e => renderValue(e)),
            survey_template: type
        })

        newSurvey.save(err => err ? !err : err);
        return id;
    },

    resetSurvey: async () => {
        let groupFields = [];
        const templates = await SurveyTemplate.find({});
        if (templates) {
            templates.forEach(e => {
                if (e.isUse) {
                    groupFields = e.group_fields
                }
            })
        } else {
            return false;
        }

        const surveys = await Survey.find({});

        if (surveys) {
            surveys.forEach(e => {
                const d = new Date();
                const date = d.getTime();
                const deadline = d.setTime(d.getTime() + 60 * 60 * 1000 * 24 * 15);
                e.set({
                    create_at: date,
                    last_modify: date,
                    deadline: deadline,
                    group_fields: groupFields.map(e => renderValue(e)),
                    survey_template: "1"
                });
                e.save();
                return true;
            })
        } else {
            return false;
        }

    },

    resetStudentSurvey: async () => {
        let groupFields = [];
        const templates = await SurveyTemplate.find({});
        if (templates) {
            templates.forEach(e => {
                if (e.isUse) {
                    groupFields = e.group_fields
                }
            })
        } else {
            return false;
        }
        const studentSurveys = await StudentSurvey.find({});
        if (studentSurveys) {
            studentSurveys.forEach(e => {
                const date = new Date();
                e.set({
                    create_at: date.getTime(),
                    modify_at: date.getTime(),
                    group_fields: groupFields,
                    comment: null
                });
                e.save();
                return true;
            })
        } else {
            return false;
        }
    },

    getTemplates: async () => {
        try {
            const templates = await SurveyTemplate.find({}, "_id name create_at modify_at isUse");
            return !!templates ? templates : null;
        } catch (err) {
            console.log(err);
            return null;
        }
    },

    getTemplate: async (id) => {
        try {
            const templates = await SurveyTemplate.findById(id);
            return !!templates ? templates : null;
        } catch (err) {
            console.log(err);
            return null;
        }
    },

    assume: async (_class) => {
        const regex = new RegExp(_class);
        const studentSurveys = await StudentSurvey.find({ class: { $regex: regex } });
        const result = [];

        let count = 0;

        studentSurveys.forEach(e => {
            if (surveyChecker.verify(e)) {
                count++;
            }
        })

        count = count === 0 ? 1 : count;


        for (let j = 0; j < studentSurveys[0].group_fields.length; j++) {
            result[j] = [];
            for (let k = 0; k < studentSurveys[0].group_fields[j].fields.length; k++) {
                result[j][k] = {
                    total: 0,
                    total_s: 0,
                    count: count,
                    M: 0,
                    STD: 0,
                    count_x: studentSurveys.length
                }
            }
        }

        for (let i = 0; i < studentSurveys.length; i++) {
            if (surveyChecker.verify(studentSurveys[i])) {
                for (let j = 0; j < studentSurveys[i].group_fields.length; j++) {
                    for (let k = 0; k < studentSurveys[i].group_fields[j].fields.length; k++) {
                        result[j][k].total += studentSurveys[i].group_fields[j].fields[k].value;
                    }
                }
            }
        }



        for (let j = 0; j < result.length; j++) {
            for (let k = 0; k < result[j].length; k++) {
                result[j][k].M = result[j][k].total / result[j][k].count;
            }
        }



        for (let i = 0; i < studentSurveys.length; i++) {
            if (surveyChecker.verify(studentSurveys[i])) {
                for (let j = 0; j < studentSurveys[i].group_fields.length; j++) {
                    for (let k = 0; k < studentSurveys[i].group_fields[j].fields.length; k++) {
                        if (studentSurveys[i].group_fields[j].fields[k].value >= result[j][k].M) {
                            result[j][k].total_s += Math.pow(Math.abs(studentSurveys[i].group_fields[j].fields[k].value - result[j][k].M), 2);

                        } else {
                            result[j][k].total_s += Math.pow(result[j][k].M - studentSurveys[i].group_fields[j].fields[k].value, 2);
                        }
                    }
                }
            }
        }


        for (let j = 0; j < result.length; j++) {
            for (let k = 0; k < result[j].length; k++) {
                result[j][k].STD = Math.sqrt(result[j][k].total_s / result[j][k].count);
            }
        }

        return result;

    },
    assumeAll: async (_classes) => {
        const studentSurveys = [];
        for (let i = 0; i < _classes.length; i++) {
            const regex = new RegExp(_classes[i].id);
            const studentSurveysTmp = await StudentSurvey.find({ class: { $regex: regex } });
            studentSurveys.push(...studentSurveysTmp);
        }
        const result = [];
        let count = 0;

        studentSurveys.forEach(e => {
            if (surveyChecker.verify(e)) {
                count++;
            }
        })

        count = count === 0 ? 1 : count;

        for (let j = 0; j < studentSurveys[0].group_fields.length; j++) {
            result[j] = [];
            for (let k = 0; k < studentSurveys[0].group_fields[j].fields.length; k++) {
                result[j][k] = {
                    total: 0,
                    total_s: 0,
                    count: count,
                    M: 0,
                    STD: 0,
                }
            }
        }

        for (let i = 0; i < studentSurveys.length; i++) {
            if (surveyChecker.verify(studentSurveys[i])) {
                for (let j = 0; j < studentSurveys[i].group_fields.length; j++) {
                    for (let k = 0; k < studentSurveys[i].group_fields[j].fields.length; k++) {
                        result[j][k].total += studentSurveys[i].group_fields[j].fields[k].value;
                    }
                }
            }
        }



        for (let j = 0; j < result.length; j++) {
            for (let k = 0; k < result[j].length; k++) {
                result[j][k].M = result[j][k].total / result[j][k].count;
            }
        }



        for (let i = 0; i < studentSurveys.length; i++) {
            if (surveyChecker.verify(studentSurveys[i])) {
                for (let j = 0; j < studentSurveys[i].group_fields.length; j++) {
                    for (let k = 0; k < studentSurveys[i].group_fields[j].fields.length; k++) {
                        if (studentSurveys[i].group_fields[j].fields[k].value >= result[j][k].M) {
                            result[j][k].total_s += Math.pow(Math.abs(studentSurveys[i].group_fields[j].fields[k].value - result[j][k].M), 2);

                        } else {
                            result[j][k].total_s += Math.pow(result[j][k].M - studentSurveys[i].group_fields[j].fields[k].value, 2);
                        }
                    }
                }
            }
        }


        for (let j = 0; j < result.length; j++) {
            for (let k = 0; k < result[j].length; k++) {
                result[j][k].STD = Math.sqrt(result[j][k].total_s / result[j][k].count);
            }
        }

        return result;

    }

}