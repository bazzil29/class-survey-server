const express = require('express');
const router = express.Router();

const tokenChecker = require('../middleware/tokenChecker');

//controller
const teacher = require('../controller/teacher.controller');


router.get('/:teacherId/classes', tokenChecker.teacher, teacher.getClasses);
router.get('/:teacherId/classes/:classId/survey', tokenChecker.teacher, teacher.getSurvey)

router.post('/:teacherId/classes', tokenChecker.teacher, teacher.addClass);

router.delete('/:teacherId/classes', tokenChecker.teacher, teacher.deleteClass);

module.exports = router;