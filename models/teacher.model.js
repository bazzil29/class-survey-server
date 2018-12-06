const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    _id: String,
    class: Array,
    name: String,
    role_id: Number,
})

const Teacher = mongoose.model('Teacher', teacherSchema, 'users');

module.exports = Teacher;