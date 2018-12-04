const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    _id: String,
    name: String,
    teacher: String,
    survey_id: Number,
    students: Array
})

const Class = mongoose.model('Class', classSchema, 'classes');

module.exports = Class;