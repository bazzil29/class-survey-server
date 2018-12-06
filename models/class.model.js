const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    _id: String,
    name: String,
    place: String,
    count_credit: Number,
    teacher: String,
    survey_id: String,
    students: Array
})

const Class = mongoose.model('Class', classSchema, 'classes');

module.exports = Class;